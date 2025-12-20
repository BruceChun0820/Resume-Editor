import { LayoutGrid, RotateCcw, FolderPlus } from 'lucide-react';
import type { Resume, ResumeSection } from "../../../types/resume";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import styles from "./EditorSidebar.module.css";

interface EditorSidebarProps {
    resume: Resume;
    onSectionUpdate: (updatedSection: ResumeSection) => void;
    onBasicsUpdate: (updatedBasics: Resume['basics']) => void;
    onResumeReset?: () => void;
    // 🚀 新增：添加和删除板块的能力
    onAddSection: () => void;
    onDeleteSection: (sectionId: string) => void;
}

export const EditorSidebar = ({ 
    resume, 
    onSectionUpdate, 
    onBasicsUpdate, 
    onResumeReset,
    onAddSection,
    onDeleteSection
}: EditorSidebarProps) => {
    return (
        <aside className={styles.sidebar}>
            {/* 头部区域 */}
            <header className={styles.header}>
                <div className={styles.titleWithIcon}>
                    <LayoutGrid size={20} className={styles.iconPrimary} />
                    <h1 className={styles.mainTitle}>简历编辑器</h1>
                </div>
                
                <div className={styles.toolbar}>
                    <span className={styles.statusTag}>已自动保存</span>
                    <button className="btn-secondary" onClick={onResumeReset}>
                        <RotateCcw size={14} />
                        重置
                    </button>
                </div>
            </header>

            {/* 基础信息编辑 */}
            <BasicsEditor
                basics={resume.basics}
                onUpdate={onBasicsUpdate}
            />

            {/* 动态板块列表 */}
            <div className={styles.sectionList}>
                {resume.sections.map((section) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        // 1. 更新当前板块
                        onUpdate={(updated) => onSectionUpdate(updated)}
                        // 2. 删除当前板块 (将 ID 传回给父组件)
                        onDelete={() => onDeleteSection(section.id)}
                    />
                ))}
            </div>

            {/* 底部：添加新板块按钮 */}
            <button className={styles.addNewSectionBtn} onClick={onAddSection}>
                <FolderPlus size={18} />
                添加自定义板块
            </button>
        </aside>
    );
}