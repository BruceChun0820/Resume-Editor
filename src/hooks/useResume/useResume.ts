import { useResumeState } from './useResumeState';
import { useResumeSync } from './useResumeSync';
import { useResumeActions } from './useResumeActions';

export const useResume = (resumeId: string) => {
    // 1. 数据层 (Model & ViewModel)
    // 包含 resume 数据本体，以及 updateSection, addCustomSection 等基础方法
    const { resume, actions: stateActions } = useResumeState(resumeId);

    // 2. 持久化层 (Persistence)
    // 处理 File System Access API
    const { syncHandle, setSyncHandle, disconnectSync } = useResumeSync(resume);

    // 3. 交互层 (Interaction)
    // 处理导出、打印、头像
    const interactionActions = useResumeActions(
        resume, 
        stateActions.updateBasicData
    );

    return {
        // --- 状态 ---
        resume,
        syncHandle, 

        // --- 动作集合 ---
        actions: {
            // A. 数据操作 (来自 State Hook)
            ...stateActions, 
            
            // B. 交互操作 (来自 Actions Hook)
            ...interactionActions,

            // C. 同步操作 (来自 Sync Hook)
            setSyncHandle,
            disconnectSync
        }
    };
};