// src/hooks/useDashboard.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Resume } from "@/types/resume"; // 引用新类型
import { isValidResume } from "@/utils/validator";
import { getDirectoryHandle, storeDirectoryHandle, verifyPermission } from "@/utils/fileSystem";
import { initialResume } from "@/data/initialResume"; // 引用新初始数据
import { useFileSystemSync } from "../useFileSystemSync/useFileSystemSync";

export interface ResumeItem {
    id: string;
    name: string;
    updatedAt: string;
}

export const useDashboard = () => {

    const navigate = useNavigate();

    const { syncHandle, connect, disconnect } = useFileSystemSync();

    // 1. 数据列表逻辑 (保持不变，只关注 LocalStorage)
    const [resumes, setResumes] = useState<ResumeItem[]>(() => {
        if (typeof window === 'undefined') return [];
        const savedList = localStorage.getItem("resume-list");
        if (savedList) {
            try {
                return JSON.parse(savedList);
            } catch (e) {
                console.error("Failed to parse resume list", e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("resume-list", JSON.stringify(resumes));
    }, [resumes]);

    // --- 核心动作 ---

    // A. 创建并跳转
    const createResume = () => {
        // 1. 算法：计算唯一名称
        const baseName = "未命名的简历";
        let uniqueName = baseName;
        let counter = 1;
        const existingNames = new Set(resumes.map(r => r.name));

        while (existingNames.has(uniqueName)) {
            uniqueName = `${baseName} (${counter})`;
            counter++;
        }

        // 2. 生成 ID 和 时间
        const newId = Date.now().toString();
        const currentDate = new Date().toISOString().split('T')[0];

        // 3. 准备完整的详情数据
        // 使用 structuredClone 进行深度克隆
        // 避免不同简历共享同一个 initialResume.sections 对象引用
        const safeInitial = typeof structuredClone === 'function'
            ? structuredClone(initialResume)
            : JSON.parse(JSON.stringify(initialResume));

        const newResumeDetail: Resume = {
            ...safeInitial,
            id: newId,
            name: uniqueName, // 设置文件名
            updatedAt: currentDate,
        };

        // 4. 初始化 LocalStorage
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
        const currentDate = new Date().toISOString().split('T')[0];

        const copyItem: ResumeItem = {
            id: newId,
            name: `${original.name} (副本)`,
            updatedAt: currentDate,
        };

        // 尝试复制详情内容
        const originalContent = localStorage.getItem(`resume-${original.id}`);
        if (originalContent) {
            try {
                const parsedContent = JSON.parse(originalContent);
                const newContent = {
                    ...parsedContent,
                    id: newId,
                    name: copyItem.name,
                    updatedAt: currentDate
                };
                localStorage.setItem(`resume-${newId}`, JSON.stringify(newContent));
                setResumes((prev) => [copyItem, ...prev]);
            } catch (e) {
                console.error("Duplicate failed", e);
                alert("复制失败：源文件数据损坏");
            }
        }
    };

    // D. 导入简历 JSON
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

                // 1. 格式校验 (假设 isValidResume 已经更新适配了新结构)
                if (!isValidResume(jsonData)) {
                    alert('格式错误：无效的简历 JSON 文件');
                    return;
                }

                // 2. 确定 ID
                // 既然是新项目，导入时总是生成新 ID 是最安全的策略
                const targetId = Date.now().toString();
                const currentDate = new Date().toISOString().split('T')[0];

                // 3. 确定简历名称
                const candidateName = jsonData.name
                    || jsonData.sections?.basic?.data?.name
                    || "导入的简历";

                // 4. 构造完整对象
                const finalResume: Resume = {
                    ...jsonData,
                    id: targetId,
                    updatedAt: currentDate,
                    name: candidateName
                };

                // 5. 存入 LocalStorage
                localStorage.setItem(`resume-${targetId}`, JSON.stringify(finalResume));

                // 6. 更新 Dashboard 列表
                const newItem: ResumeItem = {
                    id: targetId,
                    name: finalResume.name,
                    updatedAt: currentDate
                };
                setResumes(prev => [newItem, ...prev]);

                // 7. 跳转
                navigate(`/editor/${targetId}`);

            } catch (err) {
                console.error(err);
                alert('解析 JSON 失败，请检查文件是否损坏。');
            }
        };

        input.click();
    };

    // E. 关联文件夹
    const handleConnect = async () => {
        await connect();
    };

    const handleDisconnect = async () => {
        // 这里可以加一个确认弹窗
        if (window.confirm("确定要断开同步吗？")) {
            await disconnect();
        }
    }

    return {
        resumes,
        createResume,
        deleteResume,
        duplicateResume,
        importResume,
        // 显式赋值写法 (Explicit Assignment)
        // 外部看到的属性名 (Key) : 内部实际的变量/函数名 (Value)
        connectFolder: handleConnect,
        disconnectFolder: handleDisconnect,
        syncHandle,
    };
};