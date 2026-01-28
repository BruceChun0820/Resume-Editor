import { useState } from 'react';
import type { Resume, ResumeItem, SectionType, BasicInfoData, BasicInfoItem, BasicsSection } from '@/types/resume';
import { initialResume } from '@/data/initialResume';

export const useResumeState = (resumeId: string) => {
    // 1. 初始化数据 (读取 LocalStorage 仅用于初始状态，后续不再写入)
    const [resume, setResume] = useState<Resume>(() => {
        if (typeof window === 'undefined') return initialResume;
        const saved = localStorage.getItem(`resume-${resumeId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...initialResume, ...parsed, id: resumeId };
            } catch (e) {
                console.error("Failed to parse resume data", e);
            }
        }
        return { ...initialResume, id: resumeId };
    });

    // --- 辅助函数：更新状态的同时，自动更新 updatedAt ---
    // 这样避免了在 useEffect 中 setState 导致的死循环
    const setResumeWithTime = (updater: (prev: Resume) => Resume) => {
        setResume(prev => {
            const newState = updater(prev);
            return { ...newState, updatedAt: new Date().toISOString() };
        });
    };

    // --- Actions (操作方法) ---

    // A. 基础信息操作
    const updateBasicData = (data: Partial<BasicInfoData>) => {
        setResumeWithTime(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                basic: {
                    ...prev.sections.basic,
                    data: { ...prev.sections.basic.data, ...data }
                }
            }
        }));
    };

    const updateBasicItems = (items: BasicInfoItem[]) => {
        setResumeWithTime(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                basic: { ...prev.sections.basic, items }
            }
        }));
    };

    // B. 通用模块数据更新
    const updateSectionData = <T extends ResumeItem[] | string | BasicsSection>(sectionId: string, data: T) => {
        setResumeWithTime(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionId]: data
            }
        }));
    };

    // C. 侧边栏/模块管理
    const addCustomSection = (title: string = "自定义模块", type: SectionType = 'custom-list') => {
        const newId = `custom-${Date.now()}`;
        const initialData = type === 'custom-text' ? "" : [];
        setResumeWithTime(prev => ({
            ...prev,
            sectionOrder: [
                ...prev.sectionOrder,
                { id: newId, title, type, icon: 'Star', visible: true, isDeletable: true }
            ],
            sections: { ...prev.sections, [newId]: initialData }
        }));
    };

    const removeSection = (sectionId: string) => {
        if (!window.confirm("确定删除该模块吗？数据将无法恢复。")) return;
        setResumeWithTime(prev => {
            const newSections = { ...prev.sections };
            delete newSections[sectionId];
            return {
                ...prev,
                sectionOrder: prev.sectionOrder.filter(s => s.id !== sectionId),
                sections: newSections
            };
        });
    };

    const reorderSections = (newOrder: typeof resume.sectionOrder) => {
        setResumeWithTime(prev => ({ ...prev, sectionOrder: newOrder }));
    };

    const toggleSectionVisibility = (sectionId: string) => {
        setResumeWithTime(prev => ({
            ...prev,
            sectionOrder: prev.sectionOrder.map(sec => 
                sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
            )
        }));
    };

    // D. 全局设置
    const updateGlobalSettings = (settings: Partial<typeof resume.globalSettings>) => {
        setResumeWithTime(prev => ({
            ...prev,
            globalSettings: { ...prev.globalSettings, ...settings }
        }));
    };

    return {
        resume,
        actions: {
            updateBasicData,
            updateBasicItems,
            updateSectionData,
            addCustomSection,
            removeSection,
            reorderSections,
            toggleSectionVisibility,
            updateGlobalSettings,
            renameResume: (name: string) => setResumeWithTime(prev => ({ ...prev, name })),
            resetResume: () => {
                if(window.confirm("确定重置？")) setResume({ ...initialResume, id: resumeId, updatedAt: new Date().toISOString() });
            }
        }
    };
};