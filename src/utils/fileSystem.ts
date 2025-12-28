
import { get, set } from 'idb-keyval';

const DIR_HANDLE_KEY = 'resume_sync_dir_handle';
const FILE_NAME = 'resume.json';

// 把handle存储到 IndexedDB
// IndexedDB 是浏览器内置的一个轻量级数据库，适合存储结构化数据，存储在本地磁盘但只能通过浏览器访问
export const storeDirectoryHandle = async (handle: FileSystemDirectoryHandle) => {
    try {
        await set(DIR_HANDLE_KEY, handle);
    } catch (error) {
        console.error('存储目录句柄失败:', error);
    }
};

// 2. 从 IndexedDB 获取句柄
export const getDirectoryHandle = async () => {
    return await get<FileSystemDirectoryHandle>(DIR_HANDLE_KEY);
};

// readWrite 参数表示是否需要读写权限，默认为 false（只读）
export const verifyPermission = async (handle: FileSystemHandle, readWrite: boolean = false) => {
    const options = { mode: readWrite ? 'readwrite' : 'read' } as const;

    // 检查是否已经有权限
    if ((await handle.queryPermission(options)) === 'granted') {
        return true;
    }

    // 如果没有权限则请求权限
    if ((await handle.requestPermission(options)) === 'granted') {
        return true;
    }

    // 最终没有权限
    return false;
}

export const saveResumeToLocal = async (dirHandle: FileSystemDirectoryHandle, resumeData: any) => {
    try {
        // 根据Handle找到resume.json文件或者创建resume.json文件
        const fileHandle = await dirHandle.getFileHandle(FILE_NAME, { create: true });

        // 创建写入流
        const writable = await fileHandle.createWritable();

        // 写入数据
        // stringify 1.对象 2.过滤器 3.缩进空格数
        await writable.write(JSON.stringify(resumeData, null, 2));

        // 关闭写入流
        await writable.close();
        console.log('简历已保存到本地文件');
    } catch (error) {
        console.error('保存简历到本地失败:', error);
    }
}

// 从本地文件加载简历数据
export const loadResumeFromLocal = async (dirHandle: FileSystemDirectoryHandle): Promise<any> => {
    try {
        // 获取resume.json文件
        const fileHandle = await dirHandle.getFileHandle(FILE_NAME);

        // 获取文件对象
        const file = await fileHandle.getFile();
        const text = await file.text();

        // 将JSON字符串解析为对象并返回
        return JSON.parse(text);
    } catch (error) {
        console.error('从本地文件加载简历失败:', error);
        return null;
    }
};