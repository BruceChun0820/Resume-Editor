import { useParams } from 'react-router-dom';
import { useResume } from '@/hooks/useResume/useResume';
import { ResumePreview } from '@/components/Preview/ResumePreview';

// 新引入的组件
import { LeftNavigation } from '@/components/Editor/LeftNavigation/LeftNavigation';
import { FormArea } from '@/components/Editor/FormArea/FormArea';
import { useActiveSection } from '@/hooks/useActiveSection/useActiveSection';

import Styles from './Editor.module.css';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const resumeId = id || "default-resume";

  // 1. 数据 Hook
  const { resume, actions } = useResume(resumeId);
  
  // 2. 状态 Hook (当前选中的板块)
  const { activeSectionId, setActiveSectionId } = useActiveSection();

  // 3. 拦截 Add Action (为了自动选中新板块)
  const handleAddSection = (title: string, type: any) => {
    actions.addCustomSection(title, type);
    // 这里有个小问题：addCustomSection 是同步的吗？如果是，我们怎么知道新 ID？
    // 暂时先不自动跳转，或者让 useResume 返回新 ID。
    // 为了简单，我们暂时不做自动跳转，或者跳到最后一个。
    setTimeout(() => {
       const newOrder = [...resume.sectionOrder]; 
       // 这是一个假设，假设新添加的在最后。实际生产代码需要 useResume 返回 id
       const lastId = newOrder[newOrder.length - 1]?.id; 
       if(lastId) setActiveSectionId(lastId);
    }, 100);
  };

  return (
    <div className={Styles.appContainer}>
      
      <LeftNavigation 
        resume={resume}
        activeSectionId={activeSectionId}
        onSelect={setActiveSectionId}
        onAddSection={handleAddSection}
        onReorder={actions.reorderSections}
        onToggleVisibility={actions.toggleSectionVisibility}
      />

      <FormArea 
        resume={resume}
        activeSectionId={activeSectionId}
        actions={actions}
      />

      {/* 3. 右侧：实时预览区 (Flex: 1) */}
      <div className={Styles.previewPanel}>
        <div className={Styles.paperWrapper}>
           <ResumePreview resume={resume} />
        </div>
      </div>

    </div>
  );
}