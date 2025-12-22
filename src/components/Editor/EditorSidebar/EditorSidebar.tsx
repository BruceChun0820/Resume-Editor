import { LayoutGrid, RotateCcw, FolderPlus, Download, ChevronDown, FileText, ImageIcon } from 'lucide-react';
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

    const handlePrint = () => {
        window.print();
    };

    // 未来功能的占位函数
    const handleExportImage = (format: 'png' | 'jpg') => {
        alert(`即将推出：导出为 ${format.toUpperCase()} 图片`);
        // 这里未来会接入 html-to-image 库
    };

    return (
        <aside className={styles.sidebar}>
            {/* 头部区域 */}
            <header className={styles.header}>
                {/* 第一行：大标题 */}
                <div className={styles.titleSection}>
                    <div className={styles.titleWithIcon}>
                        <LayoutGrid size={24} className={styles.iconPrimary} /> {/* 图标稍微改大一点点 */}
                        <h1 className={styles.mainTitle}>简历编辑器</h1>
                    </div>
                </div>
                
                {/* 第二行：工具栏（状态 + 按钮） */}
                <div className={styles.toolbar}>
                    <span className={styles.statusTag}>
                        {/* 加个小圆点，让状态更生动 */}
                        <span className={styles.statusDot}></span>
                        已自动保存
                    </span>
                    
                    <div className={styles.actions}>
                        {/* 重置按钮：只留图标，或者用文字，这里推荐弱化它 */}
                        <button className="btn-secondary" onClick={onResumeReset} title="重置数据">
                            <RotateCcw size={14} />
                            <span style={{ marginLeft: 4 }}>重置</span>
                        </button>

                        <div className={styles.dropdownWrapper}>
                            {/* 主触发按钮 */}
                            <button className={`btn-primary ${styles.dropdownTrigger}`}>
                                <Download size={14} />
                                <span style={{ marginLeft: 4 }}>导出简历</span>
                                <ChevronDown size={12} style={{ marginLeft: 4, opacity: 0.8 }} />
                            </button>

                            {/* 悬浮显示的菜单 */}
                            <div className={styles.dropdownMenu}>
                                <button className={styles.dropdownItem} onClick={handlePrint}>
                                    <FileText size={14} />
                                    <span>导出 PDF</span>
                                </button>
                                <button className={styles.dropdownItem} onClick={() => handleExportImage('png')}>
                                    <ImageIcon size={14} />
                                    <span>导出 PNG 图片</span>
                                </button>
                                <button className={styles.dropdownItem} onClick={() => handleExportImage('jpg')}>
                                    <ImageIcon size={14} />
                                    <span>导出 JPG 图片</span>
                                </button>
                            </div>
                        </div>
                    </div>
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