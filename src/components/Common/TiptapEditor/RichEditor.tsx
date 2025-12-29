import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Underline, AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';
import styles from './RichEditor.module.css';
import TextAlign from '@tiptap/extension-text-align';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export const RichEditor = ({ content, onChange }: RichEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'], // 允许对标题和段落进行对齐
                alignments: ['left', 'center', 'right', 'justify'], // 启用的对齐方式
                defaultAlignment: 'left',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            // 当内容变化时，将 HTML 传回给父组件
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

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
            {/* 1. 工具栏 - 100% 还原你截图的风格 */}
            <div className={styles.toolbar}>
                {toolbarConfig.map((group, index) => (
                    <div key={group.group} className={styles.btnGroup}>
                        {group.actions.map((action, actionIndex) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={actionIndex}
                                    type="button"
                                    onClick={action.onClick}
                                    className={editor.isActive(action.active) ? styles.active : ''}
                                >
                                    <Icon size={16} />
                                </button>
                            );
                        })
                        }
                        {index < toolbarConfig.length - 1 && <div className={styles.divider} />}
                    </div>
                ))}
            </div>

            {/* 2. 编辑区域 */}
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};