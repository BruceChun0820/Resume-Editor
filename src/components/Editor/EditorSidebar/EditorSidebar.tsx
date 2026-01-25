// src/components/Dashboard/EditorSidebar/EditorSidebar.tsx
import { useState } from 'react';
import { RotateCcw, FolderPlus, Download, ChevronDown, FileText, FileJson, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import type { Resume, ResumeItem, BasicsSection } from "@/types/resume";
import { SectionEditor } from "../../Editor/SectionEditor/SectionEditor";
import { TextSectionEditor } from "../../Editor/SectionEditor/TextSectionEditor";
import { BasicsEditor } from "../../Editor/BasicsEditor/BasicsEditor";
import styles from "./EditorSidebar.module.css";

interface EditorSidebarProps {
    resume: Resume;
    actions: any;
    onBack: () => void;
}

export const EditorSidebar = ({ resume, actions, onBack }: EditorSidebarProps) => {
    const [open, setOpen] = useState(false);

    // 辅助函数：修改板块标题 (需要更新 sectionOrder)
    const handleRenameSection = (id: string, newTitle: string) => {
        const newOrder = resume.sectionOrder.map(sec =>
            sec.id === id ? { ...sec, title: newTitle } : sec
        );
        actions.reorderSections(newOrder);
    };

    return (
        <aside className={styles.sidebar}>
            {/* --- Header 区域 --- */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <Button onClick={onBack} className={styles.backButton} variant="ghost">
                        <ArrowLeft size={18} className={styles.backIcon} />
                        <span className="ml-2">返回仪表盘</span>
                    </Button>
                </div>

                <div className={styles.toolbar}>
                    {/* 简历名称修改 - 保持使用 module.css 的特殊样式 */}
                    <Input
                        value={resume.name || ""}
                        onChange={(e) => actions.renameResume(e.target.value)}
                        placeholder="未命名简历"
                        className={styles.resumeTitleInput}
                    />

                    <div className={styles.actions}>
                        {/* 重置按钮：应用全局 btn-secondary */}
                        <Button
                            onClick={actions.resetResume}
                            className="btn-secondary h-8 px-3"
                        >
                            <RotateCcw size={14} className="mr-1" /> 重置
                        </Button>

                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                                <DropdownMenuTrigger asChild>
                                    {/* 导出按钮：应用全局 btn-primary */}
                                    <Button className="btn-primary h-8 px-3 gap-1">
                                        <Download size={14} /> 导出 <ChevronDown size={12} className="opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={styles.dropdownContent}>
                                    <DropdownMenuItem
                                        onClick={actions.printResume}
                                        className={styles.dropdownItem} // 引用样式
                                    >
                                        <FileText size={14} />
                                        <span>导出 PDF</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={actions.exportJson}
                                        className={styles.dropdownItem} // 引用样式
                                    >
                                        <FileJson size={14} />
                                        <span>导出 JSON</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </div>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* --- 编辑器列表区域 --- */}
            <div className={styles.scrollArea}>

                {/* 遍历 sectionOrder */}
                {resume.sectionOrder
                    .filter(section => section.visible)
                    .map((sectionConfig) => {

                        // A. 基础信息板块
                        if (sectionConfig.id === 'basic') {
                            const basicSection = resume.sections.basic as BasicsSection;
                            return (
                                <BasicsEditor
                                    key="basic"
                                    data={basicSection.data}
                                    items={basicSection.items}
                                    onDataChange={actions.updateBasicData}
                                    onItemsChange={actions.updateBasicItems}
                                />
                            );
                        }

                        // 获取当前板块的数据
                        const sectionData = resume.sections[sectionConfig.id];

                        // B. 文本类板块 (skills, custom-text)
                        if (sectionConfig.type === 'skills' || sectionConfig.type === 'custom-text') {
                            return (
                                <TextSectionEditor
                                    key={sectionConfig.id}
                                    title={sectionConfig.title}
                                    content={sectionData as string}
                                    onTitleChange={(val) => handleRenameSection(sectionConfig.id, val)}
                                    onContentChange={(val) => actions.updateSectionData(sectionConfig.id, val)}
                                    onDelete={() => actions.removeSection(sectionConfig.id)}
                                />
                            );
                        }

                        // C. 列表类板块 (work, project, education, custom-list)
                        return (
                            <SectionEditor
                                key={sectionConfig.id}
                                sectionId={sectionConfig.id}
                                title={sectionConfig.title}
                                items={sectionData as ResumeItem[]}
                                onTitleChange={(val) => handleRenameSection(sectionConfig.id, val)}
                                onItemsChange={(val) => actions.updateSectionData(sectionConfig.id, val)}
                                onDelete={() => actions.removeSection(sectionConfig.id)}
                            />
                        );
                    })}

                {/* --- 底部添加按钮 --- */}
                <div className={styles.addSectionWrapper}>
                    <p className={styles.addLabel}>添加更多模块</p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* 添加按钮：使用全局 btn-secondary (等同于 outline 风格) 并保持虚线 */}
                        <Button
                            className="btn-secondary border-dashed"
                            onClick={() => actions.addCustomSection("自定义列表", "custom-list")}
                        >
                            <FolderPlus size={16} className="mr-2" /> 列表模块
                        </Button>
                        <Button
                            className="btn-secondary border-dashed"
                            onClick={() => actions.addCustomSection("自定义文本", "custom-text")}
                        >
                            <FileText size={16} className="mr-2" /> 文本模块
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}