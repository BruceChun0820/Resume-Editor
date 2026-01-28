// src/hooks/useFileSystemSync.ts
import { useState, useEffect, useCallback } from 'react';
import { getDirectoryHandle, storeDirectoryHandle, verifyPermission } from '@/utils/fileSystem';
import { del } from 'idb-keyval';

export const useFileSystemSync = () => {
    const [syncHandle, setSyncHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [isReady, setIsReady] = useState(false); // 标记初始化是否完成

    // 1. 初始化：自动恢复连接
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initHandle = async () => {
            try {
                const savedHandle = await getDirectoryHandle();
                // 静默检查权限
                if (savedHandle && await verifyPermission(savedHandle, false)) {
                    setSyncHandle(savedHandle);
                    console.log('🔗 [FS] 自动恢复连接:', savedHandle.name);
                }
            } catch (err) {
                console.warn('无法恢复文件夹连接:', err);
            } finally {
                setIsReady(true);
            }
        };
        initHandle();
    }, []);

    // 2. 动作：主动连接
    const connect = useCallback(async () => {
        try {
            const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
            if (await verifyPermission(handle, true)) {
                await storeDirectoryHandle(handle);
                setSyncHandle(handle);
                return true;
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('关联文件夹失败:', error);
                alert('关联失败，请检查浏览器支持情况(需HTTPS)');
            }
        }
        return false;
    }, []);

    // 3. 动作：断开连接
    const disconnect = useCallback(async () => {
        await del('resume_sync_dir_handle');
        setSyncHandle(null);
    }, []);

    return {
        syncHandle,
        isReady,
        connect,
        disconnect
    };
};