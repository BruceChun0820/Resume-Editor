// src/components/Editor/FormArea/FormArea.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Resume, BasicsSection, ResumeItem } from "@/types/resume";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { TextSectionEditor } from "../SectionEditor/TextSectionEditor";
import styles from "./FormArea.module.css";
import { Button } from "@/components/ui/button";
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
        if (!config) return <div className="text-gray-400 p-8 text-center mt-10">请选择模块</div>;

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
                <Button
                    variant="ghost"
                    size="sm"
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={16} className={styles.backIcon}/>
                    <span className="font-medium">返回仪表盘</span>
                </Button>
            </div>


            <div className="flex-1 min-h-0 w-full">
                <ScrollArea className="h-full w-full">
                    <div className={styles.scrollContent}>
                        {renderContent()}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};