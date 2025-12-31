import { useResumeState } from './useResumeState';
import { useResumeSync } from './useResumeSync';
import { useResumeActions } from './useResumeActions';

export const useResume = (resumeId: string) => {
    // 1. 数据层 (Model)
    const { resume, setResume, actions: stateActions } = useResumeState(resumeId);

    // 2. 本地文件同步层 (File System)
    const { syncHandle } = useResumeSync(resume);

    // 3. 交互层 (Controller)
    const interactionActions = useResumeActions(
        resume, 
        stateActions.updateImage
    );

    // 4. 统一对外暴露 (ViewModel)
    return {
        // 数据状态
        resume,
        syncHandle, 

        // 所有可执行的动作
        actions: {
            ...stateActions,      // 基础编辑 (updateBasics, addSection...)
            ...interactionActions // 交互动作 (exportJson, print, uploadAvatar...)
        }
    };
};