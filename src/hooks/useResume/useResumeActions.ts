import type { Resume } from '../../types/resume';
import { verifyPermission, storeDirectoryHandle, saveResumeToLocal } from '../../utils/fileSystem';
import { del } from 'idb-keyval';
import { fileToBase64 } from '../../utils/imageHelper';

/**
 * 这个 Hook 专门处理用户的主动操作
 * 比如：点击导出、点击打印、点击关联文件夹
 */
export const useResumeActions = (
    resume: Resume,
    // 因为 Actions 需要调用 Sync 里的能力，所以要把这些能力传进来
    setSyncHandle: (h: FileSystemDirectoryHandle | null) => void,
    syncImport: (data: Resume) => void,
    updateImage: (imageBase64: string | undefined) => void
) => {

    // 导出 JSON
    const exportJson = () => {
        try {
            const jsonData = JSON.stringify(resume, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume-${resume.basics.name || 'data'}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败');
        }
    };

    // 打印
    const printResume = () => window.print();

    // 触发关联文件夹 (涉及 UI 交互)
    const connectSync = async () => {
        try {
            const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
            const hasPerm = await verifyPermission(handle, true);
            if (hasPerm) {
                await storeDirectoryHandle(handle);
                setSyncHandle(handle); // 调用传入的 setter
                await saveResumeToLocal(handle, resume);
                alert('已开启本地同步！');
            }
        } catch (error) {
            console.log('用户取消');
        }
    };

    // 断开连接
    const disconnectSync = async () => {
        if (window.confirm('取消同步吗？')) {
            await del('resume_sync_dir_handle');
            setSyncHandle(null);
        }
    };

    // 触发导入 (创建 input DOM)
    const triggerImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!window.confirm('确定覆盖吗？')) return;

            try {
                const text = await file.text();
                const importedData = JSON.parse(text) as Resume;
                syncImport(importedData); // 调用 Sync Hook 提供的能力
                alert('导入成功！');
            } catch (err) {
                console.error(err);
                alert('文件解析失败');
            }
        };
        input.click();
    };

    // 动作: 上传头像
    const uploadAvatar = async (file: File) => {
        try {
            // 1. 校验文件大小 (可选，比如限制 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过 2MB');
                return;
            }

            // 2. 转换 Base64 (耗时操作)
            const base64 = await fileToBase64(file);

            // 3. 更新状态 (复用 useResumeState 里的 updateImage)
            updateImage(base64);
        } catch (error: any) {
            alert(error.message || '图片上传失败');
        }
    };

    // 动作: 删除头像
    const removeAvatar = () => {
        updateImage(undefined);
    };

    return {
        uploadAvatar,
        removeAvatar,
        exportJson,
        printResume,
        connectSync,
        disconnectSync,
        triggerImport
    };
};