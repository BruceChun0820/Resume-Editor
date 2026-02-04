// src/components/Editor/LeftNavigation/SortableNavItem/SortableNavItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NavItemView } from './NavItemView';
import styles from './SortableNavItem.module.css';

interface SortableNavItemProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    isActive: boolean;
    isVisible: boolean;
    onClick: () => void;
    onToggleVisibility: (e: React.MouseEvent) => void;
}

export const SortableNavItem = (props: SortableNavItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <NavItemView
            {...props}
            isDraggable={true}
            containerRef={setNodeRef}
            style={style}
            className={isDragging ? styles.isDragging : ''}
            dragHandleProps={{ ...attributes, ...listeners }}
        />
    );
};