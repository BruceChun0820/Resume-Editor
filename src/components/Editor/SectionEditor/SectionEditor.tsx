// src/components/Editor/SectionEditor/SectionEditor.tsx
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeItem } from '@/types/resume';
import styles from './SectionEditor.module.css';
import { RichEditor } from '../../Common/TiptapEditor/RichEditor';
import { useSectionEditor } from './useSectionEditor';

interface SectionEditorProps {
    sectionId: string;
    title: string;
    items: ResumeItem[];
    onTitleChange: (newTitle: string) => void;
    onItemsChange: (newItems: ResumeItem[]) => void;
    onDelete: () => void;
}

export const SectionEditor = ({ 
    title, 
    items = [], 
    onTitleChange, 
    onItemsChange, 
    onDelete 
}: SectionEditorProps) => {

    const { 
        handleTitleChange, 
        updateItem, 
        deleteItem, 
        addItem 
    } = useSectionEditor(items, onItemsChange, onTitleChange);

    const inputConfig: { key: keyof ResumeItem; label: string; placeholder: string }[] = [
        { key: 'title', label: '主标题', placeholder: '如：Google / 浙江大学' },
        { key: 'subtitle', label: '副标题', placeholder: '如：高级工程师 / 软件工程' },
        { key: 'dateRange', label: '时间段', placeholder: '如：2023.01 - 至今' },
    ];

    return (
        <div className={styles.container}>
            {/* 头部区域 */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <label className={styles.label}>板块标题</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="请输入板块名称"
                        className={styles.titleInput}
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

            {/* 列表区域 */}
            <div className={styles.listContainer}>
                {items.map((item, index) => (
                    <div key={item.id} className={styles.listItemCard}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>#{index + 1}</span>
                            <button 
                                type="button" 
                                onClick={() => deleteItem(index)} 
                                className={styles.itemDeleteBtn}
                            >
                                <Trash2 size={12} />
                                删除
                            </button>
                        </div>

                        <div className={styles.inputGrid}>
                            {inputConfig.map((cfg) => (
                                <div key={cfg.key} className={styles.inputGroup}>
                                    <label className={styles.fieldLabel}>{cfg.label}</label>
                                    <input
                                        type="text"
                                        value={(item[cfg.key] as string) || ''}
                                        placeholder={cfg.placeholder}
                                        onChange={(e) => updateItem(index, cfg.key, e.target.value)}
                                        /* 使用全局定义的 input-base */
                                        className="input-base" 
                                    />
                                </div>
                            ))}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>详细描述</label>
                            <RichEditor
                                content={item.description || ''}
                                onChange={(html) => updateItem(index, 'description', html)}
                            />
                        </div>
                    </div>
                ))}

                <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={addItem}
                >
                    <Plus size={16} />
                    添加新条目
                </button>
            </div>
        </div>
    );
};