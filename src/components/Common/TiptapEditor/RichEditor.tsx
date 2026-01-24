import { useEffect } from 'react'; // 🔥 新增
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
    Bold, Italic, List, ListOrdered, Underline, 
    AlignCenter, AlignJustify, AlignLeft, AlignRight,
    Sparkles // 🔥 新增 AI 图标
} from 'lucide-react';
import styles from './RichEditor.module.css';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
    onAiPolish?: () => void; // 🔥 新增：AI 润色回调
    placeholder?: string;
}

export const RichEditor = ({ content, onChange, onAiPolish }: RichEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
                defaultAlignment: 'left',
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose-content focus:outline-none', 
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // 如果没有这个，当父组件(比如AI)修改了数据，编辑器里显示的内容不会变
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    // 工具栏配置
    const toolbarConfig = [
        {
            group: 'marks',
            actions: [
                { icon: Bold, title: '加粗', active: 'bold', onClick: () => editor.chain().focus().toggleBold().run() },
                { icon: Italic, title: '斜体', active: 'italic', onClick: () => editor.chain().focus().toggleItalic().run() },
                { icon: Underline, title: '下划线', active: 'underline', onClick: () => editor.chain().focus().toggleUnderline().run() },
            ]
        },
        {
            group: 'lists',
            actions: [
                { icon: List, title: '无序列表', active: 'bulletList', onClick: () => editor.chain().focus().toggleBulletList().run() },
                { icon: ListOrdered, title: '有序列表', active: 'orderedList', onClick: () => editor.chain().focus().toggleOrderedList().run() },
            ]
        },
        {
            group: 'align',
            actions: [
                { icon: AlignLeft, title: '左对齐', active: { textAlign: 'left' }, onClick: () => editor.chain().focus().setTextAlign('left').run() },
                { icon: AlignCenter, title: '居中', active: { textAlign: 'center' }, onClick: () => editor.chain().focus().setTextAlign('center').run() },
                { icon: AlignRight, title: '右对齐', active: { textAlign: 'right' }, onClick: () => editor.chain().focus().setTextAlign('right').run() },
                { icon: AlignJustify, title: '两端对齐', active: { textAlign: 'justify' }, onClick: () => editor.chain().focus().setTextAlign('justify').run() },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            {/* 工具栏 */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    {toolbarConfig.map((group, index) => (
                        <div key={group.group} className={styles.btnGroup}>
                            {group.actions.map((action, actionIndex) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={actionIndex}
                                        type="button"
                                        title={action.title}
                                        onClick={action.onClick}
                                        className={editor.isActive(action.active) ? styles.active : ''}
                                    >
                                        <Icon size={16} />
                                    </button>
                                );
                            })}
                            {/* 只有不是最后一组时才显示分割线 */}
                            {index < toolbarConfig.length - 1 && <div className={styles.divider} />}
                        </div>
                    ))}
                </div>

                {/* 🔥 AI 按钮区域 */}
                {onAiPolish && (
                    <div className={styles.toolbarRight}>
                        <div className={styles.divider} />
                        <button 
                            className={styles.aiButton} 
                            onClick={onAiPolish}
                            type="button"
                        >
                            <Sparkles size={14} />
                            <span>AI 润色</span>
                        </button>
                    </div>
                )}
            </div>

            {/* 编辑区域 */}
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};