import { useState, useEffect } from 'react';
import { initialResume } from '../data/initialResume';
import type { Resume, ResumeSection } from '../types/resume';

export const useResume = () => {
  // 1. 初始化状态 (带 LocalStorage 读取逻辑)
  const [resume, setResume] = useState<Resume>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : initialResume;
  });

  // 2. 自动保存副作用
  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(resume));
  }, [resume]);

  // --- 下面是各种操作动作 (Actions) ---

  // 更新基础信息
  // 函数式更新保证更新的是最新的值
  const updateBasics = (updatedBasics: Resume['basics']) => {
    setResume(prev => ({ ...prev, basics: updatedBasics }));
  };

  // 更新某个板块 (Section)
  const updateSection = (updatedSection: ResumeSection) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(sec => 
        sec.id === updatedSection.id ? updatedSection : sec
      )
    }));
  };

  // 新增：添加一个新板块
  const addSection = () => {
    const newSection: ResumeSection = {
      id: `section-${Date.now()}`,
      title: "新板块 (未命名)",
      type: "list", // 我们现在统一使用 list 结构
      items: [
        {
          id: `item-${Date.now()}`,
          title: "",
          description: "" // 留空，默认作为段落展示
        }
      ]
    };
    setResume(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  // 新增：删除某个板块
  const deleteSection = (sectionId: string) => {
    if (window.confirm("确定要删除这个板块吗？删除后无法恢复。")) {
      setResume(prev => ({
        ...prev,
        sections: prev.sections.filter(sec => sec.id !== sectionId)
      }));
    }
  };

  // 重置简历
  const resetResume = () => {
    if (window.confirm('确定要重置简历吗？这将清除所有已编辑内容。')) {
      setResume(initialResume);
    }
  };

  // 更新照片的方法
  const updateImage = (imageBase64: string | undefined) => {
    setResume(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        image: imageBase64 // 如果传入 undefined 则相当于删除照片
      }
    }));
  };

  // 返回状态和操作方法
  return {
    resume,
    updateBasics,
    updateSection,
    addSection,
    deleteSection,
    resetResume,
    updateImage
  };
};