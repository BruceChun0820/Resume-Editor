import type { Resume, ResumeSection } from "../../../types/resume";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import style from './EditorSidebar.module.css';
interface EditorSidebarProps {
    resume: Resume;
    onSectionUpdate: (updatedSection: ResumeSection) => void;
}

export const EditorSidebar = ({ resume, onSectionUpdate }: EditorSidebarProps) => {
    return (
        <div style={{
            width: '40%',
            height: '100vh',
            overflowY: 'auto',
            padding: '20px',
            borderRight: '1px solid #ddd',
            backgroundColor: '#f8f9fa',
            boxSizing: 'border-box'
        }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>简历编辑器</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {resume.sections.map((section) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={onSectionUpdate}
                    />
                ))}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                已自动保存到本地内存
            </div>
        </div>

    );
}