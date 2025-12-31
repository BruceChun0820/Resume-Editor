// src/hooks/useDashboard.ts
import type { Resume } from "@/types/resume";
import { isValidResume } from "@/utils/validator";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface ResumeItem {
    id: string;
    name: string;
    updatedAt: string;
}

export const useDashboard = () => {
    const navigate = useNavigate();

    // 1. 初始化数据
    const [resumes, setResumes] = useState<ResumeItem[]>(() => {
        const savedList = localStorage.getItem("resume-list");
        if (savedList) return JSON.parse(savedList);
        return [];
    });

    // 2. 自动同步到 LocalStorage
    useEffect(() => {
        localStorage.setItem("resume-list", JSON.stringify(resumes));
    }, [resumes]);

    // --- 核心动作 ---

    // A. 创建并跳转
    const createResume = () => {
        const newId = Date.now().toString();
        const newResume: ResumeItem = {
            id: newId,
            name: "未命名简历",
            updatedAt: new Date().toISOString().split('T')[0],
        };

        setResumes((prev) => [newResume, ...prev]);
        navigate(`/editor/${newId}`); // 逻辑层处理跳转
    };

    // B. 删除简历
    const deleteResume = (id: string) => {
        // 二次确认可以在 UI 层做，也可以在这里简单的 window.confirm，或者配合 UI 组件
        setResumes((prev) => prev.filter(r => r.id !== id));
        // 这里也可以顺便清除该简历的详情数据: localStorage.removeItem(`resume-${id}`)
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
        // 这里的副本目前只是列表副本，如果需要连带内容一起复制，需要读取 localStorage(`resume-${original.id}`) 并存入新的 Key
        // 暂时先只做列表层面的演示
        setResumes((prev) => [copy, ...prev]);
    };

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

                // 2. 识别或分配 ID
                // 优先使用 JSON 内自带的 ID，如果没有，才生成新的
                let targetId = jsonData.id;
                let isOverwrite = false;

                if (targetId) {
                    // 检查本地列表是否已经有这个 ID
                    const isExist = resumes.some(r => r.id === targetId);
                    if (isExist) {
                        if (!window.confirm(`检测到本地已存在 ID 为 [${targetId}] 的简历，是否覆盖现有内容？`)) {
                            return; // 用户取消覆盖
                        }
                        isOverwrite = true;
                    }
                } else {
                    // 没 ID 的旧文件或纯数据，生成一个新 ID
                    targetId = Date.now().toString();
                }

                const currentDate = new Date().toISOString().split('T')[0];

                // 3. 构造完整的简历对象
                const finalResume: Resume = {
                    ...jsonData,
                    id: targetId,
                    updatedAt: currentDate,
                    name: jsonData.name || jsonData.basics.name || "未命名简历"
                };

                // 4. 保存详情到 LocalStorage
                localStorage.setItem(`resume-${targetId}`, JSON.stringify(finalResume));

                // 5. 更新 Dashboard 列表
                if (isOverwrite) {
                    // 如果是覆盖，更新列表中对应项的时间和名字
                    setResumes(prev => prev.map(r =>
                        r.id === targetId
                            ? { ...r, name: finalResume.name, updatedAt: currentDate }
                            : r
                    ));
                } else {
                    // 如果是新 ID，插入到列表首位
                    const newItem: ResumeItem = {
                        id: targetId,
                        name: finalResume.name,
                        updatedAt: currentDate
                    };
                    setResumes(prev => [newItem, ...prev]);
                }

                alert(isOverwrite ? "简历已更新！" : "简历导入成功！");

            } catch (err) {
                console.error(err);
                alert('文件读取或解析失败');
            }
        };

        input.click();
    };

    return {
        resumes,
        createResume,
        deleteResume,
        duplicateResume,
        importResume,
    };
};