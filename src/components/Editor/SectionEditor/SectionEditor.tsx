import type { ResumeSection, ListItem } from '../../../types/resume';
import styles from './SectionEditor.module.css';

interface SectionEditorProps {
    section: ResumeSection;
    onUpdate: (updatedSection: ResumeSection) => void;
}

export const SectionEditor = ({ section, onUpdate }: SectionEditorProps) => {

    // --- 逻辑处理：SectionTitle更新 ---
    const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...section, title: e.target.value });
    };

    // --- 子渲染函数：段落模式 ---
    const renderParagraph = () => {
        // TypeScript 类型守卫：确认在此作用域内 section 是 ParagraphSection
        if (section.type !== 'paragraph') return null;

        return (
            <div className={styles.contentArea}>
                <label className={styles.label}>详细描述</label>
                <textarea
                    className={styles.textArea}
                    value={section.content}
                    onChange={(e) => onUpdate({ ...section, content: e.target.value })}
                    rows={6}
                    placeholder="请输入该板块的详细内容..."
                />
            </div>
        );
    };

    // --- 子渲染函数：列表模式 ---
    const renderList = () => {
        // TypeScript 类型守卫：确认在此作用域内 section 是 ListSection
        if (section.type !== 'list') return null;

        // 更新列表中的某一项
        const updateItem = (index: number, field: keyof ListItem, value: string) => {  //keyof表示field只能是ListItem的属性名之一
            const newItems = [...section.items]; // 1. 克隆数组
            newItems[index] = {                  // 2. 找到并克隆该项
                ...newItems[index],
                [field]: value                     // 3. 用value覆盖掉field对应的属性
            };
            onUpdate({ ...section, items: newItems }); // 4. 汇报总店
        };

        // 删除某一项
        const deleteItem = (index: number) => {
            const newItems = section.items.filter((_, i) => i !== index);
            onUpdate({ ...section, items: newItems });
        };

        // 添加新项
        const addItem = () => {
            const newItem: ListItem = { id: Date.now().toString(), title: '新条目' };
            onUpdate({ ...section, items: [...section.items, newItem] });
        };

        return (
            <div className={styles.listContainer}>
                 {/* 得到结果：.map() 函数执行完后，会返回一个 数组，数组里面装满了你定义的那些 div（即多个 ListItemCard）。 */}
                {section.items.map((item, index) => (
                    <div key={item.id} className={styles.listItemCard}>
                        {/* React 会用key给每一个 div 盖上一个唯一的戳，如果没有key，会导致元素混乱 */}
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>#{index + 1}</span>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => deleteItem(index)}
                            >
                                删除
                            </button>
                        </div>

                        <div className={styles.inputGrid}>
                            <input
                                className={styles.smallInput}
                                value={item.title}
                                placeholder="名称 (如：Google)"
                                // 这种情况下用箭头函数接受事件对象，再传给 updateItem
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                            />
                            <input
                                className={styles.smallInput}
                                value={item.subtitle || ''}
                                placeholder="详情 (如：软件工程师)"
                                onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                            />
                        </div>

                        <textarea
                            className={styles.smallTextArea}
                            value={item.description || ''}
                            placeholder="具体工作内容或成就..."
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                        />
                    </div>
                ))}

                <button className={styles.addButton} onClick={addItem}>
                    + 添加新条目
                </button>
            </div>
        );
    };

    // --- 主渲染出口 ---
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={styles.label}>板块名称</label>
                <input
                    className={styles.titleInput}
                    value={section.title}
                    // 该情况下函数的第一个参数必须接收一个事件对象
                    onChange={handleSectionTitleChange}
                />
            </div>

            <hr className={styles.divider} />

            <div className={styles.body}>
                {/* 根据类型决定调用哪个渲染函数 */}
                {section.type === 'paragraph' ? renderParagraph() : renderList()}
            </div>
        </div>
    );
};