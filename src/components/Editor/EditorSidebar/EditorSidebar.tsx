import type { Resume, ResumeSection } from "../../../types/resume";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import styles from "./EditorSidebar.module.css";
interface EditorSidebarProps {
    resume: Resume;
    onSectionUpdate: (updatedSection: ResumeSection) => void;
}

export const EditorSidebar = ({ resume, onSectionUpdate }: EditorSidebarProps) => {
    return (
        <div className={styles.sidebar}>

            <h2 className={styles.title}>简历编辑器</h2>

            <div className={styles.sectionList}>
                {/* 如果箭头函数后面直接跟 ( 或直接写内容，它会自动把结果 return 出来 */}
                {/* 一旦有了 {}，你就必须显式地写下 return 关键字，{}可以有一些复杂的逻辑处理 */}
                {resume.sections.map((section) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={onSectionUpdate}
                    />
                ))}
            </div>

            <div className={styles.footer}>
                已自动保存到本地内存
            </div>
        </div>
    );
}