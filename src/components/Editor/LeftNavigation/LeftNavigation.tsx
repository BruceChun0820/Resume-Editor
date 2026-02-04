import { 
    User, Briefcase, GraduationCap, Code, 
    FolderGit2, LayoutList, FileText, Plus, 
    ArrowLeft
} from 'lucide-react';
import * as ScrollArea from '@radix-ui/react-scroll-area'; // 直接使用 Radix
import type { Resume } from "@/types/resume";
import styles from "./LeftNavigation.module.css";
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    return (
        <aside className={styles.sidebar}>
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
                    <div className={styles.listArea}>
                        {resume.sectionOrder.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => onSelect(section.id)}
                                className={`
                                    ${styles.navItem} 
                                    ${activeSectionId === section.id ? styles.navItemActive : ''}
                                `}
                                type="button"
                            >
                                <span className={styles.navIcon}>
                                    {getIcon(section.type, section.id)}
                                </span>
                                {/* 这里的 truncate 已被 CSS 类替代 */}
                                <span className={styles.textTruncate}>{section.title}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className={styles.scrollbar}>
                    <ScrollArea.Thumb className={styles.thumb} />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <div className={styles.footer}>
                <p className={styles.footerLabel}>添加新模块</p>
                <div className={styles.buttonGrid}>
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