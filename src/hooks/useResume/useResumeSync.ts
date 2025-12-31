import { useState, useEffect } from 'react';
import type { Resume } from '../../types/resume';
import { getDirectoryHandle, verifyPermission, saveResumeToLocal } from '../../utils/fileSystem';
import { del } from 'idb-keyval';

export const useResumeSync = (resume: Resume) => {
    const [syncHandle, setSyncHandle] = useState<FileSystemDirectoryHandle | null>(null);

    // 1. 初始化逻辑：只恢复文件夹连接
    useEffect(() => {
        const initHandle = async () => {
            const savedHandle = await getDirectoryHandle();
            // false 表示只检查权限状态，不立即请求弹窗
            if (savedHandle && await verifyPermission(savedHandle, false)) {
                setSyncHandle(savedHandle);
                console.log('自动恢复了文件夹连接:', savedHandle.name);
            }
        };
        initHandle();
    }, []);

    // 自动保存逻辑 (监听 resume 变化 -> 写入硬盘)
    useEffect(() => {
        // 如果没有关联文件夹，什么都不做
        if (!syncHandle) return;

        // 防抖保存
        const timer = setTimeout(async () => {
            // saveResumeToLocal 会根据 resume.name 生成文件名
            // 从而实现不同简历对应不同文件
            await saveResumeToLocal(syncHandle, resume);
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
        setSyncHandle, // 暴露给外部用来更新 handle
        disconnectSync
    };
};