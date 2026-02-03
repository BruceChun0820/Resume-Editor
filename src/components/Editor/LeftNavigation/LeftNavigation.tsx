import { 
    User, Briefcase, GraduationCap, Code, 
    FolderGit2, LayoutList, FileText, Plus 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; 
import type { Resume } from "@/types/resume";
import styles from "./LeftNavigation.module.css";

// 图标映射逻辑保持不变
const getIcon = (type: string, id: string) => {
    if (id === 'basic') return <User size={16} />;
    switch (type) {
        case 'work': return <Briefcase size={16} />;
        case 'education': return <GraduationCap size={16} />;
        case 'project': return <FolderGit2 size={16} />;
        case 'skills': return <Code size={16} />;
        case 'custom-text': return <FileText size={16} />;
        default: return <LayoutList size={16} />;
    }
};

interface LeftNavigationProps {
    resume: Resume;
    activeSectionId: string;
    onSelect: (id: string) => void;
    onAddSection: (title: string, type: any) => void;
}

export const LeftNavigation = ({ 
    resume, 
    activeSectionId, 
    onSelect,
    onAddSection
}: LeftNavigationProps) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <span className={styles.headerTitle}>内容大纲</span>
            </div>

            <ScrollArea className="flex-1">
                <div className={styles.listArea}>
                    {resume.sectionOrder.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => onSelect(section.id)}
                            className={cn(
                                styles.navItem,
                                activeSectionId === section.id && styles.navItemActive
                            )}
                            type="button"
                        >
                            <span className={styles.navIcon}>
                                {getIcon(section.type, section.id)}
                            </span>
                            <span className="truncate">{section.title}</span>
                        </button>
                    ))}
                </div>
            </ScrollArea>

            <div className={styles.footer}>
                <p className={styles.footerLabel}>添加新模块</p>
                <div className={styles.buttonGrid}>
                    {/* 规范：使用 btn-secondary 配合 module.css 中的 dashedBtn 
                        替代了原本的 <Button> 组件和 Tailwind 堆砌
                    */}
                    <button 
                        className={`btn-secondary ${styles.dashedBtn}`}
                        onClick={() => onAddSection('自定义列表', 'custom-list')}
                        type="button"
                    >
                        <Plus size={14} /> 列表模块
                    </button>
                    <button 
                        className={`btn-secondary ${styles.dashedBtn}`}
                        onClick={() => onAddSection('自定义文本', 'custom-text')}
                        type="button"
                    >
                        <Plus size={14} /> 文本模块
                    </button>
                </div>
            </div>
        </aside>
    );
};