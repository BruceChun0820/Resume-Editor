import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

// 🔥 1. 显式引入基础扩展，替代 StarterKit
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import History from '@tiptap/extension-history';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

// 原有的扩展
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import {
    Bold as BoldIcon, Italic as ItalicIcon, List, ListOrdered, Underline,
    AlignCenter, AlignJustify, AlignLeft, AlignRight,
    Sparkles
} from 'lucide-react';
import styles from './RichEditor.module.css';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
    onAiPolish?: () => void;
}

export const RichEditor = ({ content, onChange, onAiPolish }: RichEditorProps) => {

    // 🔥 2. 在这里显式定义扩展列表
    // 这样我们 100% 确定里面有什么，绝对不会有重复的 'underline'
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            History, // 撤销/重做功能
            Bold,
            Italic,
            UnderlineExtension, // 你的下划线扩展
            BulletList,
            OrderedList,
            ListItem,
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
        // 关键配置：解决 React StrictMode 下的双重渲染警告
        immediatelyRender: false, 
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (html !== content) {
                onChange(html);
            }
        },
    });

    // 监听外部 content 变化同步到编辑器
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
                { icon: BoldIcon, title: '加粗', active: 'bold', onClick: () => editor.chain().focus().toggleBold().run() },
                { icon: ItalicIcon, title: '斜体', active: 'italic', onClick: () => editor.chain().focus().toggleItalic().run() },
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
                            {index < toolbarConfig.length - 1 && <div className={styles.divider} />}
                        </div>
                    ))}
                </div>

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
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};