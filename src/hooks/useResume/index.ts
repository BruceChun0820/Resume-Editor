// src/hooks/useResume/index.ts
import { useResumeState } from './useResumeState';
import { useResumeSync } from './useResumeSync';
import { useResumeActions } from './useResumeActions'; // 引入新 Hook

export const useResume = (resumeId: string) => {
    // 1. 数据层 (Model)
    const { resume, setResume, actions: stateActions } = useResumeState(resumeId);

    // 2. 持久化层 (Persistence)
    // 它需要 resume 数据来做自动保存，需要 setResume 来做初始化加载
    const { 
        syncHandle, 
        setSyncHandle, 
        importResume: syncImport // 这是一个内部逻辑，用来处理导入后的数据流
    } = useResumeSync(resume, setResume);

    // 3. 交互层 (Controller)
    // 它需要 resume 来做导出，需要 sync 的能力来处理连接/断开
    const interactionActions = useResumeActions(
        resume, 
        setSyncHandle, 
        syncImport,
        stateActions.updateImage // 传入更新头像的方法
    );

    // 4. 统一对外暴露 (ViewModel)
    return {
        // 数据状态
        resume,
        syncHandle,

        // 所有可执行的动作 (合并了 State操作 和 UI交互)
        actions: {
            ...stateActions,     // updateBasics, addSection...
            ...interactionActions // exportJson, connectSync...
        }
    };
};