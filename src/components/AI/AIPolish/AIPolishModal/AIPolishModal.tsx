// src/components/AI/AIPolishModal/AIPolishModal.tsx
import { X, Check, RefreshCw } from 'lucide-react';
import styles from './AIPolishModal.module.css';

interface AIPolishModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalText: string;
    polishedText: string;
    onAccept: () => void;
    onRetry: () => void;
    isRetrying: boolean; // 这个状态现在控制骨架屏的显示
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
                        {/* 左侧：原文 */}
                        <div className={styles.column}>
                            <span className={styles.label}>Original / 原文</span>
                            <div className={styles.contentBox}>
                                <div dangerouslySetInnerHTML={{ __html: originalText }} />
                            </div>
                        </div>

                        {/* 右侧：AI 结果 */}
                        <div className={styles.column}>
                            <span className={`${styles.label} ${styles.aiLabel}`}>
                                <span>AI Polished / 优化后</span>
                                {/* 当显示骨架屏时，右上角的文字提示也可以变化 */}
                                {isRetrying && <span style={{ opacity: 0.8, fontWeight: 400 }}>思考中...</span>}
                            </span>
                            
                            <div className={styles.aiContentBox}>
                                {/* 🔥 核心逻辑修改：重写时显示骨架屏，否则显示文本 */}
                                {isRetrying ? (
                                    <div className={styles.skeletonContainer}>
                                        {/* 渲染 5 行骨架条 */}
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLine} />
                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: polishedText }} />
                                )}
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
                        {isRetrying ? "优化中..." : "不满意，重写"}
                    </button>

                    <button 
                        onClick={onAccept} 
                        /* 正在加载时禁用采纳按钮 */
                        disabled={isRetrying} 
                        className={`${styles.btn} ${styles.btnAccept}`}
                        style={isRetrying ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                        <Check size={16} />
                        采纳并替换
                    </button>
                </div>
            </div>
        </div>
    );
};