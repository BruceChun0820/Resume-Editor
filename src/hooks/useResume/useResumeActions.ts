import type { Resume } from '../../types/resume';
// import { del } from 'idb-keyval'; // 如果移除了 disconnectSync，这个引用也可以删了
import { fileToBase64 } from '../../utils/imageHelper';

/**
 * 这个 Hook 专门处理用户的主动操作
 * 比如：点击导出、点击打印、上传头像
 */
export const useResumeActions = (
    resume: Resume,
    // setSyncHandle 和 syncImport 都不需要了，因为 Editor 不再处理导入和断开连接
    updateImage: (imageBase64: string | undefined) => void
) => {

    // 1. 导出 JSON
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

    // 2. 打印
    const printResume = () => window.print();

    // 3. 动作: 上传头像
    const uploadAvatar = async (file: File) => {
        try {
            if (file.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过 2MB');
                return;
            }
            const base64 = await fileToBase64(file);
            updateImage(base64);
        } catch (error: any) {
            alert(error.message || '图片上传失败');
        }
    };

    // 4. 动作: 删除头像
    const removeAvatar = () => {
        updateImage(undefined);
    };

    return {
        uploadAvatar,
        removeAvatar,
        exportJson,
        printResume,
    };
};