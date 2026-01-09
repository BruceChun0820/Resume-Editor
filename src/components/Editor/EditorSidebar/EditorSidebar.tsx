import {
    RotateCcw,
    FolderPlus,
    Download,
    ChevronDown,
    FileText,
    FileJson,
    ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useState } from 'react';

import type { Resume, ResumeSection } from "@/types/resume"; 
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import styles from "./EditorSidebar.module.css";

interface EditorSidebarProps {
    resume: Resume;
    onBasicsUpdate: (updatedBasics: Resume['basics']) => void;
    onSectionUpdate: (updatedSection: ResumeSection) => void;
    onAddSection: () => void;
    onDeleteSection: (sectionId: string) => void;
    onResumeReset: () => void;
    onRename: (newName: string) => void;
    onBack: () => void; 
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
    const [open, setOpen] = useState(false);

    return (
        <aside className={styles.sidebar}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    {/* 1. 返回按钮：样式已移入 .backButton */}
                    <Button 
                        onClick={onBack} 
                        className={styles.backButton} // 引用 module.css
                        title="返回仪表盘"
                    >
                        {/* 图标样式移入 .backIcon */}
                        <ArrowLeft size={18} className={styles.backIcon} />
                        <span className="ml-2">返回仪表盘</span>
                    </Button>
                </div>

                <div className={styles.toolbar}>
                    {/* 2. 标题输入框：复刻原版 hover/focus 效果 */}
                    <Input 
                        value={resume.name || ""} 
                        onChange={(e) => onRename(e.target.value)}
                        placeholder="未命名简历"
                        className={styles.resumeTitleInput} 
                    />

                    <div className={styles.actions}>
                        {/* 3. 重置按钮：引用全局 index.css 的 btn-secondary */}
                        <Button 
                            onClick={onResumeReset} 
                            className="btn-secondary" 
                        >
                            <RotateCcw size={14} />
                            <span>重置</span>
                        </Button>

                        {/* 4. 导出按钮：引用全局 btn-primary */}
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                                <DropdownMenuTrigger asChild>
                                    <Button className="btn-primary gap-1">
                                        <Download size={14} />
                                        <span>导出</span>
                                        <ChevronDown size={12} className={styles.exportIcon} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={onPrint} className="cursor-pointer gap-2">
                                        <FileText size={14} />
                                        <span>导出 PDF</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={onExportJson} className="cursor-pointer gap-2">
                                        <FileJson size={14} />
                                        <span>导出 JSON 配置</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </div>
                        </DropdownMenu>
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

            {/* 5. 添加板块按钮：样式移入 .addSectionButton，同时保留 btn-primary 基础色 */}
            <Button 
                onClick={onAddSection} 
                className={cn("btn-primary", styles.addSectionButton)}
            >
                <FolderPlus size={18} />
                添加自定义板块
            </Button>
        </aside>
    );
}