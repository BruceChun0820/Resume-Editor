import { Plus, Trash2 } from 'lucide-react';
import type { ResumeSection, ListItem } from '../../../types/resume';
import styles from './SectionEditor.module.css';
import { RichEditor } from '../../Common/TiptapEditor/RichEditor';

interface SectionEditorProps {
    section: ResumeSection;
    onUpdate: (updatedSection: ResumeSection) => void;
    onDelete: () => void;
}

export const SectionEditor = ({ section, onUpdate, onDelete }: SectionEditorProps) => {

    // --- 逻辑处理 ---

    const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...section, title: e.target.value });
    };

    // 更新列表中的某一项
    const updateItem = (index: number, field: keyof ListItem, value: string) => {
        const newItems = [...section.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        onUpdate({ ...section, items: newItems });
    };

    // 删除某一项 (Item)
    const deleteItem = (index: number) => {
        const newItems = section.items.filter((_, i) => i !== index);
        onUpdate({ ...section, items: newItems });
    };

    // 添加新项 (Item)
    const addItem = () => {
        const newItem: ListItem = {
            id: Date.now().toString(),
            title: '',
            description: ''
        };
        onUpdate({ ...section, items: [...section.items, newItem] });
    };

    // 定义输入框配置，方便循环渲染
    const inputConfig: { key: keyof ListItem; label: string; placeholder: string }[] = [
        { key: 'title', label: '名称', placeholder: '如：Google (若只写段落可不填)' },
        { key: 'subtitle', label: '详情', placeholder: '如：高级工程师' },
        { key: 'dateRange', label: '时间', placeholder: '如：2023 - 至今' },
    ];

    return (
        <div className={styles.container}>
            {/* 1. 板块头部：标题 + 删除板块按钮 */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <label className={styles.label}>板块标题</label>
                    <input
                        className={styles.titleInput}
                        value={section.title}
                        onChange={handleSectionTitleChange}
                        placeholder="如：工作经历 / 个人总结"
                    />
                </div>

                {/* 删除整个板块的按钮 */}
                <button
                    className="btn-danger"
                    onClick={onDelete}
                    title="删除整个板块"
                    style={{ marginTop: '12px' }} // 微调对齐
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <hr className={styles.divider} />

            {/* 2. 列表内容区域 */}
            <div className={styles.listContainer}>
                {(section.items || []).map((item, index) => (
                    <div key={item.id} className={styles.listItemCard}>
                        {/* Item 头部：序号 + 删除条目按钮 */}
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>#{index + 1}</span>
                            <button
                                className="btn-danger"
                                onClick={() => deleteItem(index)}
                            >
                                <Trash2 size={14} />
                                删除条目
                            </button>
                        </div>

                        {/* 三个基础输入框 */}
                        <div className={styles.inputGrid}>
                            {inputConfig.map((cfg) => (
                                <div key={cfg.key} className={styles.inputGroup}>
                                    <label className={styles.fieldLabel}>{cfg.label}</label>
                                    <input
                                        value={item[cfg.key] || ''}
                                        placeholder={cfg.placeholder}
                                        onChange={(e) => updateItem(index, cfg.key, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 描述文本框 */}
                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>项目描述 / 工作职责</label>
                            <RichEditor
                                content={item.description || ''}
                                onChange={(html) => updateItem(index, 'description', html)}
                            />
                        </div>
                    </div>
                ))}

                {/* 添加新条目按钮 */}
                <button className={styles.addButton} onClick={addItem}>
                    <Plus size={14} />
                    添加新条目
                </button>
            </div>
        </div>
    );
};