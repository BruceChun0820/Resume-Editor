// src/components/Editor/LeftNavigation/SortableNavItem/NavItemView.tsx
import React from 'react';
import { GripVertical, Eye, EyeOff, Lock } from 'lucide-react';
import styles from './SortableNavItem.module.css';

interface NavItemViewProps {
    title: string;
    icon: React.ReactNode;
    isActive: boolean;
    isVisible: boolean;
    isDraggable?: boolean; // 新增：控制是否显示拖拽手柄
    
    // 事件
    onClick: () => void;
    onToggleVisibility?: (e: React.MouseEvent) => void;
    
    // 拖拽相关的 Props (直接透传)
    dragHandleProps?: any;
    containerRef?: React.Ref<HTMLDivElement>;
    style?: React.CSSProperties;
    className?: string; // 允许外部叠加样式 (比如 dnd 的 isDragging)
}

export const NavItemView = ({
    title, icon, isActive, isVisible, isDraggable = true,
    onClick, onToggleVisibility,
    dragHandleProps, containerRef, style, className
}: NavItemViewProps) => {
    return (
        <div
            ref={containerRef}
            style={style}
            className={`
                ${styles.container} 
                ${isActive ? styles.active : ''} 
                ${className || ''}
            `}
        >
            {/* 1. 左侧：显隐控制 (如果是固定模块，可能不让隐藏，或者保持原样) */}
            <div className={`${styles.actionArea} ${!isVisible ? styles.isHidden : ''}`}>
                {onToggleVisibility ? (
                    <button 
                        className={styles.iconBtn} 
                        onClick={onToggleVisibility}
                        title={isVisible ? "点击隐藏" : "点击显示"}
                    >
                        {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                ) : (
                    // 如果不能切换显隐 (比如基础信息强制显示)，占位或显示个锁
                    <span className={styles.iconBtn} style={{ opacity: 0.3 }}>
                        <Lock size={12} />
                    </span>
                )}
            </div>

            {/* 2. 中间：内容区 */}
            <div className={styles.contentArea} onClick={onClick}>
                <span className={styles.icon}>{icon}</span>
                <span className={styles.text}>{title}</span>
            </div>

            {/* 3. 右侧：拖拽手柄 */}
            {isDraggable ? (
                <div 
                    className={styles.dragHandle} 
                    {...dragHandleProps}
                    title="按住拖拽"
                >
                    <GripVertical size={14} />
                </div>
            ) : (
                // 不可拖拽时，右侧留空或显示空占位，保持对齐
                <div className={styles.dragHandle} style={{ cursor: 'default', opacity: 0 }} />
            )}
        </div>
    );
};