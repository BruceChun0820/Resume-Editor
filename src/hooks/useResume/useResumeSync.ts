import { useState, useEffect } from 'react';
import type { Resume } from '../../types/resume';
import { getDirectoryHandle, verifyPermission, loadResumeFromLocal, saveResumeToLocal } from '../../utils/fileSystem';
import { del } from 'idb-keyval';

export const useResumeSync = (
    resume: Resume, 
    setResume: React.Dispatch<React.SetStateAction<Resume>>
) => {
    const [syncHandle, setSyncHandle] = useState<FileSystemDirectoryHandle | null>(null);

    // 1. 初始化逻辑：加载句柄 -> 读取文件
    useEffect(() => {
        const initData = async () => {
            const savedHandle = await getDirectoryHandle();
            if (savedHandle && await verifyPermission(savedHandle, true)) {
                setSyncHandle(savedHandle);
                const localData = await loadResumeFromLocal(savedHandle);
                if (localData) setResume(localData);
            }
        };
        initData();
    }, [setResume]);

    // 2. 自动保存逻辑
    useEffect(() => {
        // A. 存 LocalStorage
        localStorage.setItem('resume-data', JSON.stringify(resume));

        // B. 存本地文件 (防抖)
        if (syncHandle) {
            const timer = setTimeout(() => {
                saveResumeToLocal(syncHandle, resume);
                console.log('已同步到本地文件');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resume, syncHandle]);

    // --- 同步相关的动作 ---

    const importResume = async (newResume: Resume) => {
        setResume(newResume);
        // 如果已连接文件夹，立即写入硬盘
        if (syncHandle) {
            await saveResumeToLocal(syncHandle, newResume);
        }
    };

    const disconnectSync = async () => {
        await del('resume_sync_dir_handle');
        setSyncHandle(null);
    };

    return {
        syncHandle,
        setSyncHandle,
        importResume,
        disconnectSync
    };
};