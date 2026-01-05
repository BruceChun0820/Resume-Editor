// src/hooks/useDashboard.ts
import type { Resume } from "@/types/resume";
import { isValidResume } from "@/utils/validator";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDirectoryHandle, storeDirectoryHandle, verifyPermission } from "@/utils/fileSystem";
import { initialResume } from "@/data/initialResume";
export interface ResumeItem {
    id: string;
    name: string;
    updatedAt: string;
}

export const useDashboard = () => {
    const navigate = useNavigate();

    // 保存当前的文件夹句柄
    const [syncHandle, setSyncHandle] = useState<FileSystemDirectoryHandle | null>(null);

    // 1. 初始化数据
    const [resumes, setResumes] = useState<ResumeItem[]>(() => {
        const savedList = localStorage.getItem("resume-list");
        if (savedList) return JSON.parse(savedList);
        return [];
    });

    // 自动同步到 LocalStorage
    useEffect(() => {
        localStorage.setItem("resume-list", JSON.stringify(resumes));
    }, [resumes]);

    // 初始化时检查本地文件夹连接状态
    useEffect(() => {
        const checkSyncStatus = async () => {
            const handle = await getDirectoryHandle();
            if (handle) {
                setSyncHandle(handle);
            }
        };
        checkSyncStatus();
    }, []);

    // --- 核心动作 ---

    // A. 创建并跳转
    const createResume = () => {
        // 1. 算法：计算唯一名称
        const baseName = "未命名简历";
        let uniqueName = baseName;
        let counter = 1;

        // 创建一个 Set 方便快速查找现有名字
        const existingNames = new Set(resumes.map(r => r.name));

        // 循环检查：如果 "未命名简历" 存在，就试 "(1)"，还存在就试 "(2)"...
        while (existingNames.has(uniqueName)) {
            uniqueName = `${baseName} (${counter})`;
            counter++;
        }

        // 2. 生成 ID 和 时间
        const newId = Date.now().toString();
        const currentDate = new Date().toISOString().split('T')[0];

        // 3. 准备完整的详情数据
        // 我们需要把这个名字写入到简历的详情里，这样进入编辑器后，标题也是对的
        const newResumeDetail: Resume = {...initialResume,
            id: newId,
            name: uniqueName, // 🔥 使用计算出的唯一名字
            updatedAt: currentDate,
        };

        // 4. 🔥 关键：像 Import 一样，直接初始化 LocalStorage
        // 这样 useResumeState 初始化时会直接读取到这个名字，而不是默认的"未命名"
        localStorage.setItem(`resume-${newId}`, JSON.stringify(newResumeDetail));

        // 5. 更新 Dashboard 列表
        const newItem: ResumeItem = {
            id: newId,
            name: uniqueName,
            updatedAt: currentDate,
        };

        setResumes((prev) => [newItem, ...prev]);
        
        // 6. 跳转
        navigate(`/editor/${newId}`);
    };

    // B. 删除简历
    const deleteResume = (id: string) => {
        if (window.confirm("确定要删除这份简历吗？此操作无法撤销。")) {
            setResumes((prev) => prev.filter(r => r.id !== id));
            localStorage.removeItem(`resume-${id}`);
        }
    };

    // C. 创建副本
    const duplicateResume = (original: ResumeItem) => {
        const newId = Date.now().toString();
        const copy: ResumeItem = {
            ...original,
            id: newId,
            name: `${original.name} (副本)`,
            updatedAt: new Date().toISOString().split('T')[0],
        };

    // 尝试复制详情内容
        const originalContent = localStorage.getItem(`resume-${original.id}`);
        if (originalContent) {
            const parsedContent = JSON.parse(originalContent);
            parsedContent.id = newId;
            parsedContent.name = copy.name;
            localStorage.setItem(`resume-${newId}`, JSON.stringify(parsedContent));
        }

        setResumes((prev) => [copy, ...prev]);
    };

    // 导入简历Json
    const importResume = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const jsonData = JSON.parse(text);

                // 1. 格式校验
                if (!isValidResume(jsonData)) {
                    alert('格式错误：无效的简历 JSON 文件');
                    return;
                }

                // 2. 确定 ID
                // 如果 JSON 里自带 ID，就用自带的；否则生成新的
                const targetId = jsonData.id || Date.now().toString();

                // 3. 准备完整的简历数据对象
                const currentDate = new Date().toISOString().split('T')[0];
                const finalResume: Resume = {
                    ...jsonData,
                    id: targetId, // 确保 ID 一致
                    updatedAt: currentDate,
                    name: jsonData.name || jsonData.basics?.name || "导入的简历"
                };

                // 4. 存入/覆盖 LocalStorage 详情数据
                // 逻辑：既然用户主动导入了，就代表他想编辑这份文件的内容，所以直接覆盖
                localStorage.setItem(`resume-${targetId}`, JSON.stringify(finalResume));

                // 5. 更新 Dashboard 列表状态
                const exists = resumes.some(r => r.id === targetId);

                if (exists) {
                    console.log('简历已存在，更新元数据');
                    // A. 如果已存在：只更新列表里的元数据（比如名字可能变了），不新增卡片
                    setResumes(prev => prev.map(r =>
                        r.id === targetId
                            ? { ...r, name: finalResume.name, updatedAt: currentDate }
                            : r
                    ));
                } else {
                    console.log('简历不存在，新增卡片');
                    // B. 如果不存在：新增一个卡片
                    const newItem: ResumeItem = {
                        id: targetId,
                        name: finalResume.name,
                        updatedAt: currentDate
                    };
                    setResumes(prev => [newItem, ...prev]);
                }

                // 6. 直接跳转到编辑器
                navigate(`/editor/${targetId}`);

            } catch (err) {
                console.error(err);
                alert('解析 JSON 失败，请检查文件是否损坏。');
            }
        };

        input.click();
    };

    // 关联文件夹
    const connectFolder = async () => {
        try {
            const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
            const hasPerm = await verifyPermission(handle, true);
            
            if (hasPerm) {
                await storeDirectoryHandle(handle);
                setSyncHandle(handle); // 更新状态，UI 会变成绿色
                // alert 不再需要，UI 变化就是最好的反馈
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('关联文件夹失败:', error);
                alert('关联失败，请重试');
            }
        }
    };

    return {
        resumes,
        createResume,
        deleteResume,
        duplicateResume,
        importResume,
        connectFolder,
        syncHandle,
    };
};