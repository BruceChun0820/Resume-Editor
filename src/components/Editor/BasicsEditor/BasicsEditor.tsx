// src/components/Editor/BasicsEditor/BasicsEditor.tsx
import { Upload, X, Plus } from "lucide-react"; // 移除了没用到的 Trash2
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./BasicsEditor.module.css";
import type { BasicInfoData, BasicInfoItem } from "@/types/resume";
import { useBasicsEditor } from "./useBasicsEditor";

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
    } = useBasicsEditor(data, items, onDataChange, onItemsChange);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
        e.target.value = ''; // Reset input
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>个人信息</h3>

            <div className={styles.editorBody}>
                {/* --- 左侧：头像区域 --- */}
                <div className={styles.avatarSection}>
                    {data.avatar ? (
                        <div className={styles.previewContainer}>
                            <img src={data.avatar} alt="Avatar" className={styles.avatarPreview} />
                            <button
                                className={styles.removeBtn}
                                onClick={handleImageRemove}
                                title="删除照片"
                                type="button"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className={styles.uploadBtn}>
                            <Upload size={18} />
                            <span>上传照片</span>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={onFileChange}
                                className={styles.hiddenInput}
                            />
                        </label>
                    )}
                </div>

                {/* --- 右侧：表单区域 --- */}
                <div className={styles.formArea}>
                    
                    {/* 1. 固定核心字段 (姓名、职位) */}
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>姓名</label>
                            {/* 应用全局 input-base 样式 */}
                            <Input
                                value={data.name || ''}
                                onChange={(e) => handleDataChange('name', e.target.value)}
                                placeholder="请输入姓名"
                                className="input-base"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.fieldLabel}>求职意向 / 职位</label>
                            <Input
                                value={data.title || ''}
                                onChange={(e) => handleDataChange('title', e.target.value)}
                                placeholder="如：Java 后端开发"
                                className="input-base"
                            />
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* 2. 动态联系方式列表 */}
                    <div className={styles.grid}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.dynamicInputGroup}>
                                <div className={styles.labelRow}>
                                    {/* 允许用户修改 Label */}
                                    <input 
                                        className={styles.editableLabel}
                                        value={item.label}
                                        onChange={(e) => handleItemLabelChange(item.id, e.target.value)}
                                    />
                                    {/* 删除按钮 */}
                                    <button 
                                        onClick={() => deleteItem(item.id)}
                                        className={styles.deleteItemBtn}
                                        title="删除此字段"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <Input
                                    value={item.value}
                                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                                    placeholder={`请输入${item.label}`}
                                    className="input-base"
                                />
                            </div>
                        ))}
                    </div>

                    {/* 添加按钮：使用全局 btn-secondary 和虚线边框 */}
                    <Button 
                        className={`btn-secondary border-dashed ${styles.addItemBtn}`}
                        onClick={addItem}
                    >
                        <Plus size={14} className="mr-1" /> 添加自定义字段
                    </Button>
                </div>
            </div>
        </div>
    );
};