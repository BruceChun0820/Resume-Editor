import { EditorSidebar } from '@/components/Editor/EditorSidebar/EditorSidebar'
import { ResumePreview } from '@/components/Preview/ResumePreview'
import { useResume } from '@/hooks/useResume'
import { useParams } from 'react-router-dom' // 引入 hook以此获取路由里的 id
import Styles from './Editor.module.css'
import '@/App.css'
export default function Editor() {
  // 获取路由参数，比如 /editor/123 里的 "123"
  // 虽然目前还没用到 id 加载数据，但未来会用到
  const { id } = useParams<{ id: string }>();; 

  const resumeId = id || "default-resume";
  // 从自定义 Hook 中获取所有数据和封装好的动作
  const {
    resume,
    syncHandle,
    actions
  } = useResume(resumeId);

  return (
    <div className={Styles.appContainer}>
      {/* 左侧编辑器 */}
      <EditorSidebar
        // 数据状态
        resume={resume}
        syncHandle={syncHandle}

        // 基础编辑动作 (来自 useResumeState)
        onBasicsUpdate={actions.updateBasics}
        onSectionUpdate={actions.updateSection}
        onAddSection={actions.addSection}
        onDeleteSection={actions.deleteSection}
        onResumeReset={actions.resetResume}

        // 交互与同步动作 (来自 useResumeActions)
        onUploadAvatar={actions.uploadAvatar}
        onRemoveAvatar={actions.removeAvatar}
        onConnectSync={actions.connectSync}
        onDisconnectSync={actions.disconnectSync}
        onImportJson={actions.triggerImport}
        onExportJson={actions.exportJson}
        onPrint={actions.printResume}
      />

      {/* 右侧预览区 */}
      <div className={Styles.previewContainer}>
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}