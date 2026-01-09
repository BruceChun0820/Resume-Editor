import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input"; // 引入 Shadcn Input
import { cn } from "@/lib/utils";
import styles from "./BasicsEditor.module.css";
import type { Resume } from "@/types/resume";

interface BasicsEditorProps {
    basics: Resume['basics'];
    onUpdate: (updatedBasics: Resume['basics']) => void;
    onImageUpload: (file: File) => void;
    onImageRemove: () => void;
}

export const BasicsEditor = ({
    basics,
    onUpdate,
    onImageUpload,
    onImageRemove
}: BasicsEditorProps) => {

    const handleChange = (field: keyof Resume['basics'], value: string) => {
        onUpdate({ ...basics, [field]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
        e.target.value = '';
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

            <div className={styles.editorBody}>
                {/* 左侧：头像区域 (保持原生结构以维持特殊样式) */}
                <div className={styles.avatarSection}>
                    {basics.image ? (
                        <div className={styles.previewContainer}>
                            <img src={basics.image} alt="Avatar" className={styles.avatarPreview} />
                            <button
                                className={styles.removeBtn}
                                onClick={onImageRemove}
                                title="删除照片"
                                type="button" // 显式声明 type 防止触发表单提交
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
                            className={cn(styles.inputGroup, item.fullWidth && styles.fullWidth)}
                        >
                            <label className={styles.fieldLabel}>{item.label}</label>

                            {/* 迁移到 Shadcn Input */}
                            <Input
                                value={basics[item.key] || ''}
                                onChange={(e) => handleChange(item.key, e.target.value)}
                                placeholder={`请输入${item.label}`}
                                className="input-base bg-white"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}