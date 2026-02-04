import React, { useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { 
    DndContext, 
    closestCenter, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    DragOverlay,
    type DragEndEvent,
    type DragStartEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
    ArrowLeft, Plus, 
    User, Briefcase, GraduationCap, Code, FolderGit2, Star 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Resume, SectionType } from "@/types/resume";
import styles from "./LeftNavigation.module.css";

// 引入拆分后的组件
import { SortableNavItem } from './SortableNavItem/SortableNavItem';
import { NavItemView } from './SortableNavItem/NavItemView'; // 引入纯视图组件

// Helper: 图标映射
const getIcon = (type: SectionType) => {
    switch (type) {
        case 'basic': return <User size={16} />;
        case 'work': return <Briefcase size={16} />;
        case 'education': return <GraduationCap size={16} />;
        case 'skills': return <Code size={16} />;
        case 'project': return <FolderGit2 size={16} />;
        case 'custom-list': 
        case 'custom-text': 
        default: return <Star size={16} />;
    }
};

interface LeftNavigationProps {
    resume: Resume;
    activeSectionId: string;
    onSelect: (id: string) => void;
    onAddSection: (title: string, type: SectionType) => void;
    onReorder: (newOrder: any[]) => void; 
    onToggleVisibility: (id: string) => void;
}

export const LeftNavigation = ({ 
    resume, 
    activeSectionId, 
    onSelect, 
    onAddSection,
    onReorder,
    onToggleVisibility
}: LeftNavigationProps) => {
    const navigate = useNavigate();
    const [activeDragId, setActiveDragId] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    // --- 1. 核心逻辑：分离固定项和可排序项 ---
    // 假设 id 为 'basic' 的是基础信息，必须固定在第一位
    const basicSection = resume.sectionOrder.find(s => s.id === 'basic');
    const draggableSections = resume.sectionOrder.filter(s => s.id !== 'basic');

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (over && active.id !== over.id) {
            // 注意：这里我们只在 draggableSections 数组里找索引
            const oldIndex = draggableSections.findIndex((item) => item.id === active.id);
            const newIndex = draggableSections.findIndex((item) => item.id === over.id);
            
            // 1. 计算出可排序部分的最新顺序
            const newSortedList = arrayMove(draggableSections, oldIndex, newIndex);
            
            // 2. [关键闭环]：重新把 basic 拼回头部，生成完整的 sectionOrder
            const finalOrder = basicSection 
                ? [basicSection, ...newSortedList] 
                : newSortedList;

            // 3. 通知上层更新数据
            onReorder(finalOrder);
        }
    };

    const activeDragItem = resume.sectionOrder.find(s => s.id === activeDragId);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                    type="button"
                >
                    <ArrowLeft size={16} className={styles.backIcon}/>
                    <span>返回仪表盘</span>
                </button>
            </div>

            <ScrollArea.Root className={styles.scrollRoot}>
                <ScrollArea.Viewport className={styles.scrollViewport}>
                    
                    <DndContext 
                        sensors={sensors} 
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className={styles.listArea}>
                            
                            {/* --- 2. 渲染固定的头部 (Basic Info) --- */}
                            {basicSection && (
                                <NavItemView 
                                    title={basicSection.title}
                                    icon={getIcon(basicSection.type)}
                                    isActive={activeSectionId === basicSection.id}
                                    isVisible={true} // 基础信息通常强制显示，或者取 basicSection.visible
                                    isDraggable={false} // 禁止拖拽
                                    onClick={() => onSelect(basicSection.id)}
                                    // 基础信息不允许隐藏，所以不传 onToggleVisibility，或者传入一个空函数
                                    onToggleVisibility={undefined} 
                                />
                            )}

                            {/* --- 3. 渲染可排序列表 --- */}
                            <SortableContext 
                                items={draggableSections.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {draggableSections.map((section) => (
                                    <SortableNavItem
                                        key={section.id}
                                        id={section.id}
                                        title={section.title}
                                        icon={getIcon(section.type)}
                                        isActive={activeSectionId === section.id}
                                        isVisible={section.visible}
                                        onClick={() => onSelect(section.id)}
                                        onToggleVisibility={(e) => {
                                            e.stopPropagation();
                                            onToggleVisibility(section.id);
                                        }}
                                    />
                                ))}
                            </SortableContext>
                        </div>

                        {/* 拖拽时的 Overlay */}
                        <DragOverlay>
                            {activeDragId && activeDragItem ? (
                                <NavItemView 
                                    title={activeDragItem.title}
                                    icon={getIcon(activeDragItem.type)}
                                    isActive={true} // 拖拽时保持高亮状态好看一点
                                    isVisible={activeDragItem.visible}
                                    isDraggable={true}
                                    onClick={() => {}}
                                    className={styles.dragOverlay} // 确保引用了正确的 Overlay 样式
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className={styles.scrollbar}>
                    <ScrollArea.Thumb className={styles.thumb} />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <div className={styles.footer}>
                <p className={styles.footerLabel}>添加新模块</p>
                <div className={styles.buttonGrid}>
                    <button 
                        className={`btn-secondary ${styles.dashedBtn}`}
                        onClick={() => onAddSection('自定义列表', 'custom-list')}
                    >
                        <Plus size={14} /> 列表模块
                    </button>
                    <button 
                        className={`btn-secondary ${styles.dashedBtn}`}
                        onClick={() => onAddSection('自定义文本', 'custom-text')}
                    >
                        <Plus size={14} /> 文本模块
                    </button>
                </div>
            </div>
        </aside>
    );
};