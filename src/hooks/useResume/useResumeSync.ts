// src/hooks/useResumeSync.ts
import { useEffect } from 'react';
import type { Resume } from '@/types/resume';
import { saveResumeToLocal } from '@/utils/fileSystem';
import { useFileSystemSync } from '../useFileSystemSync/useFileSystemSync'; // 引入新 Hook

export const useResumeSync = (resume: Resume) => {

    const { syncHandle, disconnect } = useFileSystemSync();

    // 1. 自动保存逻辑 (监听 resume 变化 -> 写入硬盘)
    useEffect(() => {
        if (!resume || !resume.id) return;

        // 设置防抖，避免每次按键都写硬盘
        const timer = setTimeout(async () => {
            try {
                // A. 保存详情到 LocalStorage (这里是单一数据源的持久化)
                localStorage.setItem(`resume-${resume.id}`, JSON.stringify(resume));

                // B. 更新 Dashboard 列表索引
                const listStr = localStorage.getItem("resume-list");
                let list = listStr ? JSON.parse(listStr) : [];
                const index = list.findIndex((item: any) => item.id === resume.id);
                
                const newItem = {
                    id: resume.id,
                    name: resume.name,
                    updatedAt: resume.updatedAt
                };

                if (index !== -1) {
                    // 只有当关键信息变化时才更新列表，减少开销
                    if (list[index].name !== newItem.name || list[index].updatedAt !== newItem.updatedAt) {
                        list[index] = newItem;
                        localStorage.setItem("resume-list", JSON.stringify(list));
                    }
                } else {
                    list.unshift(newItem);
                    localStorage.setItem("resume-list", JSON.stringify(list));
                }

                // C. 核心差异：直接检查 handle 是否存在，存在就写
                if (syncHandle) {
                    await saveResumeToLocal(syncHandle, resume);
                    console.log('💾 [AutoSave] 已同步至本地文件');
                }

            } catch (err) {
                console.error('自动保存失败:', err);
            }
        }, 1000); // 1秒延迟

        return () => clearTimeout(timer);
    }, [resume, syncHandle]); // 依赖 syncHandle，一旦连接建立，下次修改就会自动保存

    return {
        syncHandle,
        disconnectSync: disconnect
    };
};