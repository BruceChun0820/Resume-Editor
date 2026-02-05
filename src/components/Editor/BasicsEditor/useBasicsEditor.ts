// src/components/Editor/BasicsEditor/useBasicsEditor.ts
import { useCallback } from 'react';
import type { BasicInfoData, BasicInfoItem } from '@/types/resume';
import { fileToBase64 } from '@/utils/imageHelper';

export const useBasicsEditor = (
    items: BasicInfoItem[],
    onDataChange: (data: Partial<BasicInfoData>) => void,
    onItemsChange: (items: BasicInfoItem[]) => void
) => {

    // 1. 修改固定字段 (姓名、职位)
    const handleDataChange = useCallback((field: keyof BasicInfoData, value: string) => {
        onDataChange({ [field]: value });
    }, [onDataChange]);

    // 2. 修改头像 (上传)
    const handleImageUpload = useCallback(async (file: File) => {
        try {
            if (file.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过 2MB');
                return;
            }
            const base64 = await fileToBase64(file);
            onDataChange({ avatar: base64 });
        } catch (error) {
            console.error('Image upload failed', error);
        }
    }, [onDataChange]);

    // 3. 删除头像
    const handleImageRemove = useCallback(() => {
        onDataChange({ avatar: '' });
    }, [onDataChange]);

    // 4. 修改动态列表项 (电话、邮箱等)
    const handleItemChange = useCallback((id: string, value: string) => {
        const newItems = items.map(item => 
            item.id === id ? { ...item, value } : item
        );
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    // 5. 修改动态列表项的标签 (比如把 "电话" 改成 "手机")
    const handleItemLabelChange = useCallback((id: string, label: string) => {
        const newItems = items.map(item => 
            item.id === id ? { ...item, label } : item
        );
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    // 6. 添加新字段
    const addItem = useCallback(() => {
        const newItem: BasicInfoItem = {
            id: Date.now().toString(),
            label: '自定义',
            value: '',
            type: 'custom',
            visible: true,
            icon: 'Link'
        };
        onItemsChange([...items, newItem]);
    }, [items, onItemsChange]);

    // 7. 删除字段
    const deleteItem = useCallback((id: string) => {
        onItemsChange(items.filter(item => item.id !== id));
    }, [items, onItemsChange]);

    return {
        handleDataChange,
        handleImageUpload,
        handleImageRemove,
        handleItemChange,
        handleItemLabelChange,
        addItem,
        deleteItem
    };
};