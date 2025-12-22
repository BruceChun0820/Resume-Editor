import './App.css'
import { EditorSidebar } from './components/Editor/EditorSidebar/EditorSidebar'
import { ResumePreview } from './components/Preview/ResumePreview'
import { useResume } from './hooks/useResume' // 引入我们刚写的 Hook

function App() {
  const { 
    resume, 
    updateBasics, 
    updateSection, 
    addSection, 
    deleteSection, 
    resetResume 
  } = useResume();

  return (
    <div className="app-container">
      {/* 左侧编辑器 */}
      <EditorSidebar
        resume={resume}
        onBasicsUpdate={updateBasics}
        onSectionUpdate={updateSection}
        onAddSection={addSection}      // 传入添加能力
        onDeleteSection={deleteSection} // 传入删除能力
        onResumeReset={resetResume}
      />

      {/* 右侧预览区 */}
      <div className="preview-container">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

export default App