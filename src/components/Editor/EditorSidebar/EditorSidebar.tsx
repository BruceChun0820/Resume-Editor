import {
    LayoutGrid,
    RotateCcw,
    FolderPlus,
    Download,
    ChevronDown,
    FileText,
    FileJson,
    ArrowLeft // 🔥 1. 引入返回图标
} from 'lucide-react';
import type { Resume, ResumeSection } from "@/types/resume"; 
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import styles from "./EditorSidebar.module.css";

interface EditorSidebarProps {
    // --- 数据状态 ---
    resume: Resume;

    // --- 基础编辑动作 ---
    onBasicsUpdate: (updatedBasics: Resume['basics']) => void;
    onSectionUpdate: (updatedSection: ResumeSection) => void;
    onAddSection: () => void;
    onDeleteSection: (sectionId: string) => void;
    onResumeReset: () => void;
    onRename: (newName: string) => void;
    onBack: () => void; 

    // --- 功能性动作 ---
    onExportJson: () => void;
    onPrint: () => void;
    onUploadAvatar: (file: File) => void;
    onRemoveAvatar: () => void;
}

export const EditorSidebar = ({
    resume,
    onSectionUpdate,
    onBasicsUpdate,
    onResumeReset,
    onAddSection,
    onDeleteSection,
    onRename,
    onBack,
    onExportJson,
    onPrint,
    onUploadAvatar,
    onRemoveAvatar
}: EditorSidebarProps) => {

    return (
        <aside className={styles.sidebar}>
            {/* 头部区域 */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    {/* 🔥 3. 修改：将原来的纯图标改为可点击的返回按钮 */}
                    <button 
                        onClick={onBack} 
                        className={styles.backBtn}
                        title="返回仪表盘"
                    >
                        <ArrowLeft size={18} />
                        <span>返回仪表盘</span>
                    </button>
                    
                    
                </div>

                <div className={styles.toolbar}>
                    {/* 标题输入框 */}
                    <input 
                        type="text"
                        className={styles.resumeTitleInput}
                        value={resume.name || ""} 
                        onChange={(e) => onRename(e.target.value)}
                        placeholder="未命名简历"
                    />
                    <div className={styles.actions}>
                        <button className="btn-secondary" onClick={onResumeReset}>
                            <RotateCcw size={14} />
                            <span>重置</span>
                        </button>

                        <div className={styles.dropdownWrapper}>
                            <button className={`btn-primary ${styles.dropdownTrigger}`}>
                                <Download size={14} />
                                <span>导出</span>
                                <ChevronDown size={12} style={{ marginLeft: 4, opacity: 0.8 }} />
                            </button>

                            <div className={styles.dropdownMenu}>
                                <button className={styles.dropdownItem} onClick={onPrint}>
                                    <FileText size={14} />
                                    <span>导出 PDF</span>
                                </button>
                                <button className={styles.dropdownItem} onClick={onExportJson}>
                                    <FileJson size={14} />
                                    <span>导出 JSON 配置</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <BasicsEditor
                basics={resume.basics}
                onUpdate={onBasicsUpdate}
                onImageUpload={onUploadAvatar}
                onImageRemove={onRemoveAvatar}
            />

            <div className={styles.sectionList}>
                {resume.sections.map((section) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={onSectionUpdate}
                        onDelete={() => onDeleteSection(section.id)}
                    />
                ))}
            </div>

            <button className={styles.addNewSectionBtn} onClick={onAddSection}>
                <FolderPlus size={18} />
                添加自定义板块
            </button>
        </aside>
    );
}