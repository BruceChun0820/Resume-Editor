// src/components/Common/TiptapEditor/RichEditor.tsx
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

// 基础扩展
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import History from '@tiptap/extension-history';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import {
    Bold as BoldIcon, Italic as ItalicIcon, List, ListOrdered, Underline,
    AlignCenter, AlignJustify, AlignLeft, AlignRight
} from 'lucide-react';

import { AIPolishButton } from '@/components/AI/AIPolish/AIPolishButton/AIPolishButton';

import styles from './RichEditor.module.css';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export const RichEditor = ({ content, onChange }: RichEditorProps) => {

    const editor = useEditor({
        extensions: [
            Document, Paragraph, Text, History, Bold, Italic, UnderlineExtension,
            BulletList, OrderedList, ListItem,
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
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (html !== content) {
                onChange(html);
            }
        },
    });

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
                {/* 左侧：常规格式化工具 */}
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

                {/* 右侧：AI 润色按钮 */}
                <div className={styles.toolbarRight}>
                    <div className={styles.divider} />
                    <AIPolishButton 
                        className={styles.aiButton}
                        text={editor.getHTML()}
                        onPolished={(newContent) => {
                            // 使用 setContent 更新内容，parseOptions 确保 HTML 被正确解析
                            editor.commands.setContent(newContent);
                            // 触发 onChange 通知父组件
                            onChange(editor.getHTML()); 
                        }}
                    />
                </div>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};