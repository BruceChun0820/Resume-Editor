import styles from "./BasicsEditor.module.css";
import type { Resume } from "../../../types/resume";
import { fileToBase64 } from "../../../utils/imageHelper";
import { Upload, X } from "lucide-react";

interface BasicsEditorProps {
    basics: Resume['basics'];
    onUpdate: (updatedBasics: Resume['basics']) => void;
}

export const BasicsEditor = ({ basics, onUpdate }: BasicsEditorProps) => {
    const handleChange = (field: keyof Resume['basics'], value: string) => {
        onUpdate({ ...basics, [field]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            onUpdate({ ...basics, image: base64 });
        } catch (error: any) {
            alert(error.message);
        }
    };

    // 删除图片
    const removeImage = () => {
        onUpdate({ ...basics, image: undefined });
    };

    const config: { key: keyof Resume['basics']; label: string; fullWidth?: boolean }[] = [
        { key: 'name', label: '姓名' },
        { key: 'title', label: '求职意向' },
        { key: 'email', label: '电子邮箱', fullWidth: true },
        { key: 'phone', label: '联系电话' },
        { key: 'location', label: '所在城市' },
    ];

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>个人信息</h3>

            {/* 关键：新增这个 editorBody 包装层来匹配 CSS 中的 flex 布局 */}
            <div className={styles.editorBody}>

                {/* 1. 左侧：头像区域 */}
                <div className={styles.avatarSection}>
                    {basics.image ? (
                        <div className={styles.previewContainer}>
                            <img src={basics.image} alt="Avatar" className={styles.avatarPreview} />
                            <button className={styles.removeBtn} onClick={removeImage} title="删除照片">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className={styles.uploadBtn}>
                            <Upload size={16} />
                            <span>上传照片</span>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageUpload}
                                className={styles.hiddenInput}
                            />
                        </label>
                    )}
                </div>

                {/* 2. 右侧：输入框网格区域 */}
                <div className={styles.grid}>
                    {config.map((item) => (
                        <div
                            key={item.key}
                            className={`${styles.inputGroup} ${item.fullWidth ? styles.fullWidth : ''}`}
                        >
                            <label className={styles.fieldLabel}>{item.label}</label>
                            <input
                                value={basics[item.key] || ''}
                                onChange={(e) => handleChange(item.key, e.target.value)}
                                placeholder={`请输入${item.label}`}
                            />
                        </div>
                    ))}
                </div>
            </div> 
        </div>
    );
}