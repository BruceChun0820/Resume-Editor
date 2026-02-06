// src/components/AI/AIPolishModal.tsx
import { X, Check, RefreshCw } from 'lucide-react';
import styles from './AIPolishModal.module.css';

interface AIPolishModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalText: string;
    polishedText: string;
    onAccept: () => void;
    onRetry: () => void;
    isRetrying: boolean;
}

export const AIPolishModal = ({ 
    isOpen, onClose, originalText, polishedText, onAccept, onRetry, isRetrying 
}: AIPolishModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        ✨ AI 润色建议
                    </h3>
                    <button onClick={onClose} className={styles.closeBtn} title="关闭">
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.grid}>
                        <div className={styles.column}>
                            <span className={styles.label}>Original / 原文</span>
                            <div className={styles.contentBox}>
                                <div dangerouslySetInnerHTML={{ __html: originalText }} />
                            </div>
                        </div>

                        <div className={styles.column}>
                            <span className={styles.aiLabel}>
                                AI Polished / 优化后
                                {isRetrying && <span style={{ fontSize: '12px', opacity: 0.8 }}>重新生成中...</span>}
                            </span>
                            <div className={styles.aiContentBox}>
                                <div dangerouslySetInnerHTML={{ __html: polishedText }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose} className={`${styles.btn} ${styles.btnCancel}`}>
                        取消
                    </button>
                    
                    <button onClick={onRetry} disabled={isRetrying} className={`${styles.btn} ${styles.btnRetry}`}>
                        <RefreshCw size={16} className={isRetrying ? styles.spin : ""} />
                        不满意，重写
                    </button>

                    <button onClick={onAccept} className={`${styles.btn} ${styles.btnAccept}`}>
                        <Check size={16} />
                        采纳并替换
                    </button>
                </div>
            </div>
        </div>
    );
};