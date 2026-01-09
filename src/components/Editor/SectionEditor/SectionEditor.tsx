import { Plus, Trash2 } from 'lucide-react';
import type { ResumeSection, ListItem } from '@/types/resume'; // 确保路径正确
import styles from './SectionEditor.module.css';
import { RichEditor } from '../../Common/TiptapEditor/RichEditor';
import { Input } from '@/components/ui/input'; // 引入 Shadcn Input
import { Button } from '@/components/ui/button'; // 引入 Shadcn Button

interface SectionEditorProps {
    section: ResumeSection;
    onUpdate: (updatedSection: ResumeSection) => void;
    onDelete: () => void;
}

export const SectionEditor = ({ section, onUpdate, onDelete }: SectionEditorProps) => {

    const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...section, title: e.target.value });
    };

    const updateItem = (index: number, field: keyof ListItem, value: string) => {
        const newItems = [...section.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        onUpdate({ ...section, items: newItems });
    };

    const deleteItem = (index: number) => {
        const newItems = section.items.filter((_, i) => i !== index);
        onUpdate({ ...section, items: newItems });
    };

    const addItem = () => {
        const newItem: ListItem = {
            id: Date.now().toString(),
            title: '',
            description: ''
        };
        onUpdate({ ...section, items: [...section.items, newItem] });
    };

    const inputConfig: { key: keyof ListItem; label: string; placeholder: string }[] = [
        { key: 'title', label: '名称', placeholder: '如：Google' },
        { key: 'subtitle', label: '详情', placeholder: '如：高级工程师' },
        { key: 'dateRange', label: '时间', placeholder: '如：2023 - 至今' },
    ];

    return (
        <div className={styles.container}>
            {/* 1. 板块头部：标题 + 删除板块按钮 */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <label className={styles.label}>板块标题</label>
                    <Input
                        value={section.title}
                        onChange={handleSectionTitleChange}
                        placeholder="如：工作经历"
                        className={styles.titleInput}
                    />
                </div>

                {/* 删除整个板块的按钮 */}
                <Button
                    onClick={onDelete}
                    title="删除整个板块"
                    // 使用我们在 index.css 定义的全局 .btn-danger
                    className="btn-danger mt-3 h-8 px-3" 
                >
                    <Trash2 size={16} />
                </Button>
            </div>

            <hr className={styles.divider} />

            {/* 2. 列表内容区域 */}
            <div className={styles.listContainer}>
                {(section.items || []).map((item, index) => (
                    <div key={item.id} className={styles.listItemCard}>
                        {/* Item 头部：序号 + 删除条目按钮 */}
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>#{index + 1}</span>
                            <Button
                                onClick={() => deleteItem(index)}
                                // 这是一个小号的删除按钮，我们复用 btn-danger 但微调尺寸
                                className="btn-danger h-7 px-2 text-xs gap-1"
                            >
                                <Trash2 size={12} />
                                删除条目
                            </Button>
                        </div>

                        {/* 三个基础输入框 */}
                        <div className={styles.inputGrid}>
                            {inputConfig.map((cfg) => (
                                <div key={cfg.key} className={styles.inputGroup}>
                                    <label className={styles.fieldLabel}>{cfg.label}</label>
                                    <Input
                                        value={item[cfg.key] || ''}
                                        placeholder={cfg.placeholder}
                                        onChange={(e) => updateItem(index, cfg.key, e.target.value)}
                                        className="input-base bg-white"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 描述文本框 (RichEditor 暂时保持不动，它是独立的复杂组件) */}
                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>项目描述 / 工作职责</label>
                            <RichEditor
                                content={item.description || ''}
                                onChange={(html) => updateItem(index, 'description', html)}
                            />
                        </div>
                    </div>
                ))}

                {/* 添加新条目按钮：复用原生 button 结构以保持虚线样式，或者用 Shadcn Button + 自定义类 */}
                {/* 推荐：使用原生 button，因为虚线框不是标准的 Button 变体 */}
                <button className={styles.addButton} onClick={addItem}>
                    <Plus size={16} />
                    添加新条目
                </button>
            </div>
        </div>
    );
};