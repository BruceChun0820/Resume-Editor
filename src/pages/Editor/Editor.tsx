import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
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

  // 2. 配置打印功能
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Resume-${resume.name || 'Untitled'}`,
    // 注入打印专用样式，确保无页眉页脚，背景色准确
    pageStyle: `
      @page {
        size: A4;
        margin: 0mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  // 3. 聚合 Actions：用页面级的打印函数覆盖默认的空函数
  const enhancedActions = {
    ...actions,
    printResume: handlePrint,
  };

  return (
    <div className={Styles.appContainer}>
      {/* 左侧：侧边栏容器 
         关键：CSS 中 .sidebarWrapper 限制了它的宽度
      */}
      <div className={Styles.sidebarWrapper}>
        <EditorSidebar
          resume={resume}
          actions={enhancedActions} // 🔥 关键修改：只传这一个对象
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