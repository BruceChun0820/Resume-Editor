import { useState, useEffect } from 'react'; // 记得引入 useEffect
import type { Resume, ResumeItem, SectionType, BasicInfoData, BasicInfoItem, BasicsSection } from '@/types/resume';
import { initialResume } from '@/data/initialResume';

// 引入我们刚才准备好的两个工具
import { isValidResume } from '@/utils/validator';
import { migrateResume } from '@/utils/migrator';

export const useResumeState = (resumeId: string) => {
    // 1. 初始化数据 (核心修改部分)
    const [resume, setResume] = useState<Resume>(() => {
        // SSR 环境保护
        if (typeof window === 'undefined') return initialResume;

        const saved = localStorage.getItem(`resume-${resumeId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // --- 检查是否是完美的新格式 ---
                if (isValidResume(parsed)) {
                    // 如果数据没问题，直接使用
                    // 这里的 ...initialResume 只是为了防守缺失的顶级字段，关键是 parsed 结构要是对的
                    return { ...initialResume, ...parsed, id: resumeId };
                }

                // --- 数据清洗/迁移 ---
                console.warn(`[ResumeHook] 检测到旧版或损坏数据 (${resumeId})，正在自动修复...`);
                const migrated = migrateResume(parsed);

                // --- 检查修复后的结果 ---
                if (isValidResume(migrated)) {
                    // 修复成功！立即把修复后的正确数据写回 LocalStorage
                    // 这样下次刷新就不用再修了
                    localStorage.setItem(`resume-${resumeId}`, JSON.stringify(migrated));
                    return { ...migrated, id: resumeId };
                }

            } catch (e) {
                console.error("[ResumeHook] 初始化失败，加载默认模版", e);
            }
        }

        return { ...initialResume, id: resumeId };
    });

    // 2. 自动保存 (这一步不能少，否则修改了不会存)
    // 你的原代码里似乎没贴这个，但我强烈建议加上，确保状态变更自动写入 LS
    useEffect(() => {
        if (resume && resume.id) {
            localStorage.setItem(`resume-${resume.id}`, JSON.stringify(resume));
        }
    }, [resume]);


    // --- 辅助函数：更新状态的同时，自动更新 updatedAt ---
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

    const renameSection = (sectionId: string, newTitle: string) => {
        setResumeWithTime(prev => ({
            ...prev,
            // 遍历 sectionOrder，找到对应 ID 的模块并更新 title
            sectionOrder: prev.sectionOrder.map(sec => 
                sec.id === sectionId ? { ...sec, title: newTitle } : sec
            )
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
            },
            renameSection
        }
    };
};