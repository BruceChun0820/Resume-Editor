// src/components/Editor/SectionEditor/SectionEditor.tsx
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeItem } from '@/types/resume';
import styles from './SectionEditor.module.css';
import { RichEditor } from '../../Common/TiptapEditor/RichEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
                    <Input
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="请输入板块名称"
                        className={styles.titleInput}
                    />
                </div>
                <Button variant="ghost" onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0">
                    <Trash2 size={18} />
                </Button>
            </div>

            <hr className={styles.divider} />

            {/* 列表区域 */}
            <div className={styles.listContainer}>
                {items.map((item, index) => (
                    <div key={item.id} className={styles.listItemCard}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>#{index + 1}</span>
                            <Button variant="ghost" size="sm" onClick={() => deleteItem(index)} className="text-red-400 hover:text-red-600 hover:bg-red-50 h-6 px-2 text-xs gap-1">
                                <Trash2 size={12} />
                                删除
                            </Button>
                        </div>

                        <div className={styles.inputGrid}>
                            {inputConfig.map((cfg) => (
                                <div key={cfg.key} className={styles.inputGroup}>
                                    <label className={styles.fieldLabel}>{cfg.label}</label>
                                    <Input
                                        value={(item[cfg.key] as string) || ''}
                                        placeholder={cfg.placeholder}
                                        onChange={(e) => updateItem(index, cfg.key, e.target.value)}
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

                <button className={styles.addButton} onClick={addItem}>
                    <Plus size={16} />
                    添加新条目
                </button>
            </div>
        </div>
    );
};