import styles from "./BasicsEditor.module.css";
import type { Resume } from "../../../types/resume";
import { Upload, X } from "lucide-react";

interface BasicsEditorProps {
    basics: Resume['basics'];
    // 文本更新：保持原样，直接回传完整的 basics 对象
    onUpdate: (updatedBasics: Resume['basics']) => void; 
    // 图片上传：只负责传出 File 对象，不处理转换
    onImageUpload: (file: File) => void;
    // 图片删除：只负责触发信号
    onImageRemove: () => void;
}

export const BasicsEditor = ({ 
    basics, 
    onUpdate, 
    onImageUpload, 
    onImageRemove 
}: BasicsEditorProps) => {

    // 处理输入框变化
    const handleChange = (field: keyof Resume['basics'], value: string) => {
        onUpdate({ ...basics, [field]: value });
    };

    // 处理文件选择事件
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file); // 直接把“炸弹”扔给父组件，自己不拆
        }
        // 建议清空 input value，否则选同一张图不会触发 onChange
        e.target.value = ''; 
    };

    // 配置项：使得 JSX 更简洁
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

            <div className={styles.editorBody}>
                {/* 左侧：头像区域 */}
                <div className={styles.avatarSection}>
                    {basics.image ? (
                        <div className={styles.previewContainer}>
                            <img src={basics.image} alt="Avatar" className={styles.avatarPreview} />
                            <button 
                                className={styles.removeBtn} 
                                onClick={onImageRemove} // 直接调用 Props
                                title="删除照片"
                            >
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
                                onChange={handleFileChange}
                                className={styles.hiddenInput}
                            />
                        </label>
                    )}
                </div>

                {/* 右侧：输入框网格区域 */}
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