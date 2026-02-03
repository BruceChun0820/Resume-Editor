import { Plus } from "lucide-react";
import styles from "./CreateCard.module.css";

interface CreateCardProps {
    onClick: () => void;
}

export function CreateCard({ onClick }: CreateCardProps) {
    return (
        // 移除了 <Card>，直接使用语义化的 div 和 styles
        // 原本的 group 类名逻辑已通过 CSS 的 .card:hover .iconWrapper 实现
        <div 
            onClick={onClick} 
            className={styles.card}
            role="button"
            tabIndex={0}
        >
            <div className={styles.iconWrapper}>
                <Plus size={28} />
            </div>
            <h3 className={styles.title}>新建简历</h3>
            <p className={styles.description}>从空白开始</p>
        </div>
    );
}