import type { Resume, BasicInfoData } from '@/types/resume';
import { fileToBase64 } from '@/utils/imageHelper';
import { printResumeContent } from '@/utils/printHelper';
/**
 * 处理用户交互动作 (导出、打印、头像上传)
 */
export const useResumeActions = (
    resume: Resume,
    // 传入新的更新方法，签名需匹配 useResumeState 的 updateBasicData
    updateBasicData: (data: Partial<BasicInfoData>) => void
) => {

    // 1. 导出 JSON
    const exportJson = () => {
        try {
            // 获取用户姓名作为文件名，注意新路径：sections.basic.data.name
            const docTitle = resume.name || 'resume';
            const fileName = `resume-${docTitle}.json`;

            const jsonData = JSON.stringify(resume, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败，请检查控制台日志');
        }
    };

    const printResume = () => {
        const docTitle = resume.name || '我的简历';
        // 调用工具函数，传入预览组件的 ID
        printResumeContent('resume-preview-content', `${docTitle}`);
    };

    // 3. 动作: 上传头像
    const uploadAvatar = async (file: File) => {
        try {
            if (file.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过 2MB');
                return;
            }
            const base64 = await fileToBase64(file);

            // 🔥 适配新架构：通过 partial update 更新 avatar 字段
            updateBasicData({ avatar: base64 });

        } catch (error: any) {
            console.error(error);
            alert(error.message || '图片上传失败');
        }
    };

    // 4. 动作: 删除头像
    const removeAvatar = () => {
        // 传入 undefined 或空字符串来清空
        updateBasicData({ avatar: '' });
    };

    return {
        uploadAvatar,
        removeAvatar,
        exportJson,
        printResume,
    };
};