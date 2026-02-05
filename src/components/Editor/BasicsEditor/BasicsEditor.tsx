import { Upload, X, Plus } from "lucide-react";
import styles from "./BasicsEditor.module.css";
import type { BasicInfoData, BasicInfoItem } from "@/types/resume";
import { useBasicsEditor } from "./useBasicsEditor";

// 属性定义保持不变
interface BasicsEditorProps {
    data: BasicInfoData;
    items: BasicInfoItem[];
    onDataChange: (data: Partial<BasicInfoData>) => void;
    onItemsChange: (items: BasicInfoItem[]) => void;
}

export const BasicsEditor = ({
    data,
    items,
    onDataChange,
    onItemsChange
}: BasicsEditorProps) => {

    const {
        handleDataChange,
        handleImageUpload,
        handleImageRemove,
        handleItemChange,
        handleItemLabelChange,
        addItem,
        deleteItem
    } = useBasicsEditor(items, onDataChange, onItemsChange);

    return (
        <div className={styles.container}>
            <div className={styles.editorBody}>
                {/* --- 头像区域 --- */}
                <div className={styles.avatarSection}>
                    {data.avatar ? (
                        <div className={styles.previewContainer}>
                            <img src={data.avatar} alt="Avatar" className={styles.avatarPreview} />
                            <button
                                className={styles.removeBtn}
                                onClick={handleImageRemove}
                                type="button"
                                title="移除头像"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className={styles.uploadBtn}>
                            <Upload size={20} />
                            <span className="text-xs font-medium">上传照片</span>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                className={styles.hiddenInput}
                            />
                        </label>
                    )}
                </div>

                {/* --- 表单区域 --- */}
                <div className={styles.formArea}>
                    
                    {/* 姓名/职位 */}
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>姓名</label>
                            <input
                                type="text"
                                value={data.name || ''}
                                onChange={(e) => handleDataChange('name', e.target.value)}
                                placeholder="请输入姓名"
                                className="input-base" 
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>职位</label>
                            <input
                                type="text"
                                value={data.title || ''}
                                onChange={(e) => handleDataChange('title', e.target.value)}
                                placeholder="如：前端开发"
                                className="input-base"
                            />
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* 动态列表 */}
                    <div className={styles.grid}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.dynamicInputGroup}>
                                <div className={styles.labelRow}>
                                    <input 
                                        className={styles.editableLabel}
                                        value={item.label}
                                        onChange={(e) => handleItemLabelChange(item.id, e.target.value)}
                                        aria-label="修改标签名"
                                    />
                                    <button 
                                        onClick={() => deleteItem(item.id)}
                                        className={styles.deleteItemBtn}
                                        title="删除此条目"
                                        type="button"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                                    placeholder={`输入${item.label}`}
                                    className="input-base"
                                />
                            </div>
                        ))}
                    </div>

                    <button 
                        type="button"
                        className={`btn-secondary ${styles.addButton}`}
                        onClick={addItem}
                    >
                        <Plus size={14} /> 
                        添加信息
                    </button>
                </div>
            </div>
        </div>
    );
};