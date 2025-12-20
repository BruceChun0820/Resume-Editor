import styles from "./BasicsEditor.module.css";
import type { Resume } from "../../../types/resume";

interface BasicsEditorProps {
    basics: Resume['basics'];
    onUpdate: (updatedBasics: Resume['basics']) => void;
}

export const BasicsEditor = ({ basics, onUpdate }: BasicsEditorProps) => {
    const handleChange = (field: keyof Resume['basics'], value: string) => {
        onUpdate({ ...basics, [field]: value });
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
            <div className={styles.grid}>
                {config.map((item) => (
                    // 反引号 (`)：代表这是一个模板字符串，允许你在字符串里通过 ${} 嵌入 JavaScript 变量或表达式。
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
    );
}