import { EditorSidebar } from '@/components/Editor/EditorSidebar/EditorSidebar'
import { ResumePreview } from '@/components/Preview/ResumePreview'
import { useResume } from '@/hooks/useResume/useResume'
import { useNavigate, useParams } from 'react-router-dom' // 引入 hook以此获取路由里的 id
import Styles from './Editor.module.css'
import '@/App.css'

export default function Editor() {
  // 获取路由参数，比如 /editor/123 里的 "123"
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const resumeId = id || "default-resume";

  // 从自定义 Hook 中获取所有数据和封装好的动作
  const {
    resume,
    actions
  } = useResume(resumeId);

  return (
    <div className={Styles.appContainer}>
      {/* 左侧编辑器 */}
      <EditorSidebar
        // 数据状态
        resume={resume}

        // 基础编辑动作 (来自 useResumeState)
        onBasicsUpdate={actions.updateBasics}
        onSectionUpdate={actions.updateSection}
        onAddSection={actions.addSection}
        onDeleteSection={actions.deleteSection}
        onResumeReset={actions.resetResume}
        onBack={() => navigate('/')}
        onRename={actions.renameResume}

        // 交互与同步动作 (来自 useResumeActions)
        onUploadAvatar={actions.uploadAvatar}
        onRemoveAvatar={actions.removeAvatar}

        // 保留导出和打印
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