import './App.css'
import { EditorSidebar } from './components/Editor/EditorSidebar/EditorSidebar'
import { ResumePreview } from './components/Preview/ResumePreview'
import { useResume } from './hooks/useResume'

function App() {
  // 从自定义 Hook 中获取所有数据和封装好的动作
  const {
    resume,
    syncHandle,
    actions
  } = useResume();

  return (
    <div className="app-container">
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
      <div className="preview-container">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

export default App