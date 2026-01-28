import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorSidebar } from '@/components/Editor/EditorSidebar/EditorSidebar';
import { ResumePreview } from '@/components/Preview/ResumePreview';
import { useResume } from '@/hooks/useResume/useResume';
import Styles from './Editor.module.css';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resumeId = id || "default-resume";

  // 1. 获取新版 Hook 数据
  const { resume, actions } = useResume(resumeId);

  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={Styles.appContainer}>
      {/* 左侧：侧边栏容器 
         关键：CSS 中 .sidebarWrapper 限制了它的宽度
      */}
      <div className={Styles.sidebarWrapper}>
        <EditorSidebar
          resume={resume}
          actions={actions} // 🔥 关键修改：只传这一个对象
          onBack={() => navigate('/')}
        />
      </div>

      {/* 右侧：预览区容器 */}
      <div className={Styles.previewContainer}>
        {/* 纸张包裹层：负责投影和 A4 尺寸限制 */}
        <div className={Styles.paperWrapper}>
          <div ref={componentRef}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}