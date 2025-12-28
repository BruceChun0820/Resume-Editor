import { useState } from 'react';
import type { Resume, ResumeSection } from '../../types/resume';
import { initialResume } from '../../data/initialResume';

export const useResumeState = () => {
    // 初始化时先只读 LocalStorage，因为这是同步操作，不涉及异步文件
    const [resume, setResume] = useState<Resume>(() => {
        const saved = localStorage.getItem('resume-data');
        return saved ? JSON.parse(saved) : initialResume;
    });
    
    const updateBasics = (updatedBasics: Resume['basics']) => {
        setResume(prev => ({ ...prev, basics: updatedBasics }));
    };

    const updateSection = (updatedSection: ResumeSection) => {
        setResume(prev => ({
            ...prev,
            sections: prev.sections.map(sec =>
                sec.id === updatedSection.id ? updatedSection : sec
            )
        }));
    };

    const addSection = () => {
        const newSection: ResumeSection = {
            id: `section-${Date.now()}`,
            title: "新板块",
            type: "list",
            items: [{ id: `item-${Date.now()}`, title: "", description: "" }]
        };
        setResume(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    };

    const deleteSection = (sectionId: string) => {
        if (window.confirm("确定删除吗？")) {
            setResume(prev => ({
                ...prev,
                sections: prev.sections.filter(sec => sec.id !== sectionId)
            }));
        }
    };

    const updateImage = (imageBase64: string | undefined) => {
        setResume(prev => ({
            ...prev,
            basics: { ...prev.basics, image: imageBase64 }
        }));
    };

    const resetResume = () => {
        if (window.confirm('确定重置吗？')) setResume(initialResume);
    };

    // 导出 state 和 setResume (供 Sync Hook 使用)，以及封装好的方法
    return {
        resume,
        setResume, // 暴露给 Sync Hook 用来覆盖数据
        actions: { // 把操作方法包在一个对象里，更整洁
            updateBasics,
            updateSection,
            addSection,
            deleteSection,
            updateImage,
            resetResume
        }
    };
};