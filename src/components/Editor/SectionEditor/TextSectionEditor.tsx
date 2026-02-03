// src/components/Editor/SectionEditor/TextSectionEditor.tsx
import { Trash2 } from 'lucide-react';
import styles from './SectionEditor.module.css';
import { RichEditor } from '../../Common/TiptapEditor/RichEditor';

interface TextSectionEditorProps {
    title: string;
    content: string;
    onTitleChange: (newTitle: string) => void;
    onContentChange: (newHtml: string) => void;
    onDelete: () => void;
}

export const TextSectionEditor = ({
    title,
    content,
    onTitleChange,
    onContentChange,
    onDelete
}: TextSectionEditorProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <label className={styles.label}>板块标题</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={styles.titleInput}
                        placeholder="请输入标题"
                    />
                </div>
                <button
                    type="button"
                    onClick={onDelete}
                    className={styles.deleteActionBtn}
                    title="删除该模块"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <hr className={styles.divider} />

            {/* 内容：富文本编辑器 */}
            <div className={styles.inputGroup}>
                <RichEditor
                    content={content || ''}
                    onChange={onContentChange}
                    // AI 功能暂时保留接口，后续开发
                    onAiPolish={() => console.log('AI Polish triggered')} 
                />
            </div>
        </div>
    );
};