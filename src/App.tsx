import { useState } from 'react'
import './App.css'
import { initialResume } from './data/initialResume'
import type { Resume, ResumeSection } from './types/resume'
import { EditorSidebar } from './components/Editor/EditorSidebar/EditorSidebar'
import { ResumePreview } from './components/Preview/ResumePreview'

function App() {
  const [resume, setResume] = useState<Resume>(initialResume);

  const handleSectionUpdate = (updatedSection: ResumeSection) => {
    const newSections = resume.sections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    );
    setResume({ ...resume, sections: newSections });
  }

  const handleBasicsUpdate = (updatedBasics: Resume['basics']) => {
    setResume({ ...resume, basics: updatedBasics });
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* 左侧：抽离后的编辑器侧边栏 */}
      <EditorSidebar
        resume={resume}
        onSectionUpdate={handleSectionUpdate}
        onBasicsUpdate={handleBasicsUpdate}
      />

      {/* 右侧：抽离后的预览视图 */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#525659', padding: '40px 0' }}>
        <ResumePreview resume={resume} />
      </div>

    </div>
  );
}

export default App