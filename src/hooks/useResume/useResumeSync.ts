import { useState, useEffect } from 'react';
import type { Resume } from '@/types/resume';
import { getDirectoryHandle, verifyPermission, saveResumeToLocal } from '@/utils/fileSystem';
import { del } from 'idb-keyval';

export const useResumeSync = (resume: Resume) => {
    const [syncHandle, setSyncHandle] = useState<FileSystemDirectoryHandle | null>(null);

    // 1. 初始化逻辑：尝试恢复文件夹连接
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initHandle = async () => {
            try {
                const savedHandle = await getDirectoryHandle();
                // false 表示只检查权限状态，不立即请求弹窗，避免页面一加载就弹窗
                if (savedHandle && await verifyPermission(savedHandle, false)) {
                    setSyncHandle(savedHandle);
                    console.log('自动恢复了文件夹连接:', savedHandle.name);
                }
            } catch (err) {
                console.warn('无法恢复文件夹连接:', err);
            }
        };
        initHandle();
    }, []);

    // 2. 自动保存逻辑 (监听 resume 变化 -> 写入硬盘)
    useEffect(() => {
        // 如果没有关联文件夹，什么都不做
        if (!syncHandle) return;

        // 防抖保存 (1秒)
        const timer = setTimeout(async () => {
            try {
                // saveResumeToLocal 需要适配新的 Resume 结构
                await saveResumeToLocal(syncHandle, resume);
                console.log('自动保存成功:', new Date().toLocaleTimeString());
            } catch (err) {
                console.error('自动保存失败:', err);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [resume, syncHandle]);

    // --- 动作 ---

    const disconnectSync = async () => {
        await del('resume_sync_dir_handle');
        setSyncHandle(null);
    };

    return {
        syncHandle,
        setSyncHandle, // 暴露给 Dashboard 用来建立新连接
        disconnectSync
    };
};