import { useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
    RotateCcw, 
    Download, 
    ChevronDown, 
    FileText, 
    FileJson 
} from "lucide-react";

import type { Resume, BasicsSection, ResumeItem } from "@/types/resume";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { TextSectionEditor } from "../SectionEditor/TextSectionEditor";

import styles from "./FormArea.module.css";

interface FormAreaProps {
    resume: Resume;
    activeSectionId: string;
    actions: {
        updateBasicData: (data: any) => void;
        updateBasicItems: (items: any) => void;
        renameSection?: (id: string, title: string) => void;
        updateSectionData: (id: string, data: any) => void;
        removeSection: (id: string) => void;
        resetResume: () => void;
        printResume: () => void;
        exportJson: () => void;
        renameResume: (name: string) => void;
    };
}

export const FormArea = ({ resume, activeSectionId, actions }: FormAreaProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const config = resume.sectionOrder.find(s => s.id === activeSectionId);

    const renderContent = () => {
        if (!config) {
            return <div className={styles.emptyState}>请选择左侧模块进行编辑</div>;
        }

        if (config.id === 'basic') {
            const basicSection = resume.sections.basic as BasicsSection;
            return (
                <BasicsEditor
                    data={basicSection.data}
                    items={basicSection.items}
                    onDataChange={actions.updateBasicData}
                    onItemsChange={actions.updateBasicItems}
                />
            );
        }

        if (config.type === 'skills' || config.type === 'custom-text') {
            return (
                <TextSectionEditor
                    title={config.title}
                    content={resume.sections[config.id] as string}
                    onTitleChange={(val) => actions.renameSection?.(config.id, val)}
                    onContentChange={(val) => actions.updateSectionData(config.id, val)}
                    onDelete={() => actions.removeSection(config.id)}
                />
            );
        }

        return (
            <SectionEditor
                sectionId={config.id}
                title={config.title}
                items={resume.sections[config.id] as ResumeItem[]}
                onTitleChange={(val) => actions.renameSection?.(config.id, val)}
                onItemsChange={(val) => actions.updateSectionData(config.id, val)}
                onDelete={() => actions.removeSection(config.id)}
            />
        );
    };

    return (
        <div className={styles.container}>
            {/* Header: 包含返回按钮和右侧操作区 */}
            <div className={styles.header}>
                {/* 1. 简历名称修改区 */}
                <input
                    type="text"
                    className={styles.titleInput}
                    value={resume.name || ''}
                    onChange={(e) => actions.renameResume(e.target.value)}
                    placeholder="请输入简历名称..."
                    title="点击修改简历名称"
                />

                <div className={styles.actions}>
                    <button 
                        className="btn-secondary"
                        onClick={actions.resetResume}
                        title="重置当前数据"
                    >
                        <RotateCcw size={14} />
                        重置
                    </button>

                    {/* 导出菜单 - Radix UI */}
                    <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenu.Trigger asChild>
                            {/* 导出按钮 - 使用全局类名 btn-primary */}
                            <button className="btn-primary">
                                <Download size={14} />
                                导出
                                <ChevronDown size={12} className={styles.iconMuted} />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                                className={styles.dropdownContent} 
                                align="end" 
                                sideOffset={5}
                            >
                                <DropdownMenu.Item 
                                    className={styles.dropdownItem}
                                    onSelect={actions.printResume}
                                >
                                    <FileText size={14} />
                                    <span>导出 PDF</span>
                                </DropdownMenu.Item>
                                
                                <DropdownMenu.Item 
                                    className={styles.dropdownItem}
                                    onSelect={actions.exportJson}
                                >
                                    <FileJson size={14} />
                                    <span>导出 JSON</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

            {/* 编辑区滚动容器 */}
            <ScrollArea.Root className={styles.scrollRoot}>
                <ScrollArea.Viewport className={styles.scrollViewport}>
                    <div className={styles.scrollContent}>
                        {renderContent()}
                    </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className={styles.scrollbar}>
                    <ScrollArea.Thumb className={styles.thumb} />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>
    );
};