// src/components/Editor/SectionEditor/useSectionEditor.ts
import { useCallback } from 'react';
import type { ResumeItem } from '@/types/resume';

/**
 * 专门处理 SectionEditor 内部的列表操作逻辑
 * 核心是将 UI 事件转换为数据的不可变更新
 */
export const useSectionEditor = (
    items: ResumeItem[],
    onItemsChange: (newItems: ResumeItem[]) => void,
    onTitleChange: (newTitle: string) => void
) => {

    // 1. 修改板块标题
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onTitleChange(e.target.value);
    }, [onTitleChange]);

    // 2. 修改单个条目的某个字段
    const updateItem = useCallback((index: number, field: keyof ResumeItem, value: string) => {
        const newItems = [...items];
        // 浅拷贝当前项，确保 React 感知到变化
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    // 3. 删除条目
    const deleteItem = useCallback((index: number) => {
        // 使用 filter 移除指定索引的项
        const newItems = items.filter((_, i) => i !== index);
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    // 4. 添加新条目
    const addItem = useCallback(() => {
        const newItem: ResumeItem = {
            id: Date.now().toString(),
            title: '',
            subtitle: '',
            dateRange: '',
            description: '',
            visible: true
        };
        // 添加到数组末尾
        onItemsChange([...items, newItem]);
    }, [items, onItemsChange]);

    return {
        handleTitleChange,
        updateItem,
        deleteItem,
        addItem
    };
};