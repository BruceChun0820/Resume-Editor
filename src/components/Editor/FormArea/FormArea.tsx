import * as ScrollArea from '@radix-ui/react-scroll-area'; // 直接使用 Radix
import type { Resume, BasicsSection, ResumeItem } from "@/types/resume";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { TextSectionEditor } from "../SectionEditor/TextSectionEditor";
import styles from "./FormArea.module.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormAreaProps {
    resume: Resume;
    activeSectionId: string;
    actions: any;
}

export const FormArea = ({ resume, activeSectionId, actions }: FormAreaProps) => {
    const navigate = useNavigate();
    const config = resume.sectionOrder.find(s => s.id === activeSectionId);

    const renderContent = () => {
        if (!config) {
            return <div className={styles.emptyState}>请选择模块</div>;
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
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                    type="button"
                >
                    <ArrowLeft size={16} className={styles.backIcon}/>
                    <span>返回仪表盘</span>
                </button>
            </div>

            {/* Radix ScrollArea */}
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