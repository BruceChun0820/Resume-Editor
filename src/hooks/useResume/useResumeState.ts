import { useEffect, useState } from 'react';
import type { Resume, ResumeItem, SectionType, BasicInfoData, BasicInfoItem, BasicsSection } from '@/types/resume';
import { initialResume } from '@/data/initialResume';

export const useResumeState = (resumeId: string) => {
    // 1. 初始化数据
    const [resume, setResume] = useState<Resume>(() => {
        if (typeof window === 'undefined') return initialResume; // SSR 防护
        const saved = localStorage.getItem(`resume-${resumeId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // 简单的合并策略：确保新定义的字段（如 globalSettings）存在
                // 如果是旧数据结构，可能需要做迁移逻辑，这里暂且假设是新项目
                return { ...initialResume, ...parsed, id: resumeId };
            } catch (e) {
                console.error("Failed to parse resume data", e);
                return { ...initialResume, id: resumeId };
            }
        }
        return { ...initialResume, id: resumeId };
    });

    // 2. 自动保存
    useEffect(() => {
        localStorage.setItem(`resume-${resumeId}`, JSON.stringify(resume));
        // 更新最后修改时间
        setResume(prev => ({ ...prev, updatedAt: new Date().toISOString() }));
    }, [resume.sections, resume.sectionOrder, resume.globalSettings, resumeId]);

    // --- Actions (操作方法) ---

    // A. 基础信息操作
    const updateBasicData = (data: Partial<BasicInfoData>) => {
        setResume(prev => ({
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
        setResume(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                basic: { ...prev.sections.basic, items }
            }
        }));
    };

    // B. 通用模块数据更新 (工作、项目、教育)
    // 泛型 T 允许传入 ResumeItem[] 或 string (富文本)
    // <T extends ...> (强制约束 T 必须是这些类型之一)
    
    const updateSectionData = <T extends ResumeItem[] | string | BasicsSection>(sectionId: string, data: T) => {
        setResume(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionId]: data
            }
        }));
    };

    // C. 侧边栏/模块管理
    
    // 添加自定义模块
    const addCustomSection = (title: string = "自定义模块", type: SectionType = 'custom-list') => {
        const newId = `custom-${Date.now()}`;
        const initialData = type === 'custom-text' ? "" : [];
        setResume(prev => ({
            ...prev,
            // 1. 在侧边栏目录中添加
            sectionOrder: [
                ...prev.sectionOrder,
                { 
                    id: newId, 
                    title, 
                    type, 
                    icon: 'Star', // 默认图标
                    visible: true, 
                    isDeletable: true 
                }
            ],
            // 2. 在数据字典中初始化为空数组
            sections: {
                ...prev.sections,
                [newId]: initialData
            }
        }));
    };

    // 删除模块
    const removeSection = (sectionId: string) => {
        if (!window.confirm("确定删除该模块吗？数据将无法恢复。")) return;

        setResume(prev => {
            const newSections = { ...prev.sections };
            delete newSections[sectionId]; // 清理数据

            return {
                ...prev,
                sectionOrder: prev.sectionOrder.filter(s => s.id !== sectionId),
                sections: newSections
            };
        });
    };

    // 调整模块顺序 (用于侧边栏拖拽)
    const reorderSections = (newOrder: typeof resume.sectionOrder) => {
        setResume(prev => ({ ...prev, sectionOrder: newOrder }));
    };

    // 切换模块显隐
    const toggleSectionVisibility = (sectionId: string) => {
        setResume(prev => ({
            ...prev,
            sectionOrder: prev.sectionOrder.map(sec => 
                sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
            )
        }));
    };

    // D. 全局设置
    const updateGlobalSettings = (settings: Partial<typeof resume.globalSettings>) => {
        setResume(prev => ({
            ...prev,
            globalSettings: { ...prev.globalSettings, ...settings }
        }));
    };

    return {
        resume,
        setResume,
        actions: {
            updateBasicData,
            updateBasicItems,
            updateSectionData,
            addCustomSection,
            removeSection,
            reorderSections,
            toggleSectionVisibility,
            updateGlobalSettings,
            renameResume: (name: string) => setResume(prev => ({ ...prev, name })),
            resetResume: () => {
                if(window.confirm("确定重置？")) setResume({ ...initialResume, id: resumeId });
            }
        }
    };
};