// src/components/Editor/SectionEditor/TextSectionEditor.tsx
import { Trash2 } from 'lucide-react';
import styles from './SectionEditor.module.css'; // 复用 SectionEditor 的样式
import { RichEditor } from '../../Common/TiptapEditor/RichEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={styles.titleInput}
                    />
                </div>
                <Button
                    variant="ghost"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                >
                    <Trash2 size={18} />
                </Button>
            </div>

            <hr className={styles.divider} />

            {/* 内容：只有一个富文本编辑器 */}
            <div className={styles.inputGroup}>
                <RichEditor
                    content={content || ''}
                    onChange={onContentChange}
                    // 这里可以接入 AI 润色
                    onAiPolish={() => alert('AI 润色功能开发中...')} 
                />
            </div>
        </div>
    );
};