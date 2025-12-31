// src/utils/fileSystem.ts
import { get, set } from 'idb-keyval';

const DIR_HANDLE_KEY = 'resume_sync_dir_handle';
const FILENAME_MAP_PREFIX = 'resume_sync_filename_'; // 映射表前缀

// --- 基础 Handle 管理 ---

export const storeDirectoryHandle = async (handle: FileSystemDirectoryHandle) => {
    try {
        await set(DIR_HANDLE_KEY, handle);
    } catch (error) {
        console.error('存储目录句柄失败:', error);
    }
};

export const getDirectoryHandle = async () => {
    return await get<FileSystemDirectoryHandle>(DIR_HANDLE_KEY);
};

export const verifyPermission = async (handle: FileSystemHandle, readWrite: boolean = false) => {
    const options = { mode: readWrite ? 'readwrite' : 'read' } as const;
    if ((await handle.queryPermission(options)) === 'granted') return true;
    if ((await handle.requestPermission(options)) === 'granted') return true;
    return false;
};

// 辅助函数：生成安全的文件名
const getSafeFileName = (resumeName: string) => {
    const safeName = (resumeName || '未命名简历').replace(/[\\/:*?"<>|]/g, '_');
    return `${safeName}.json`;
};

// --- 核心逻辑：基于记录的删除/创建方案 ---

export const saveResumeToLocal = async (dirHandle: FileSystemDirectoryHandle, resumeData: any) => {
    try {
        // 1. 数据兜底
        if (!resumeData.id) resumeData.id = Date.now().toString();
        if (!resumeData.name) resumeData.name = "未命名简历";

        const resumeId = resumeData.id;
        const newFileName = getSafeFileName(resumeData.name);
        
        // 2. 查账：获取上次保存的文件名
        const mapKey = `${FILENAME_MAP_PREFIX}${resumeId}`;
        const lastFileName = localStorage.getItem(mapKey);

        // 3. 比较与清理：如果改名了，删除旧文件
        if (lastFileName && lastFileName !== newFileName) {
            try {
                // 直接尝试删除旧文件
                await dirHandle.removeEntry(lastFileName);
                console.log(`[AutoSave] 重命名检测: 已删除旧文件 ${lastFileName}`);
            } catch (err: any) {
                // 如果文件本身就不存在（比如用户手动在文件夹里删了），忽略错误
                if (err.name !== 'NotFoundError') {
                    console.warn('[AutoSave] 删除旧文件失败:', err);
                }
            }
        }

        // 4. 创建新文件 (create: true 保证了如果不存在则新建，存在则覆盖)
        const fileHandle = await dirHandle.getFileHandle(newFileName, { create: true });

        // 5. 写入内容
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(resumeData, null, 2));
        await writable.close();

        // 6. 更新账本：记住这次的文件名
        localStorage.setItem(mapKey, newFileName);

        console.log(`[AutoSave] 同步成功: ${newFileName}`);

    } catch (error) {
        console.error('保存简历到本地失败:', error);
    }
};

// 读取逻辑：读取时也要更新账本，防止异地操作导致映射丢失
export const loadResumeFromLocal = async (fileHandle: FileSystemFileHandle): Promise<any> => {
    try {
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        
        // 关键：如果是从文件读取的，顺便更新一下本地记录
        if (data.id && data.name) {
            // 这里我们信任当前读取的文件名是正确的
            localStorage.setItem(`${FILENAME_MAP_PREFIX}${data.id}`, fileHandle.name);
        }
        
        return data;
    } catch (error) {
        console.error('加载本地文件失败:', error);
        return null;
    }
};