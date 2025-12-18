// src/components/Preview/ResumePreview.tsx
import type { Resume } from '../../types/resume';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  return (
    <div style={{ 
      width: '210mm', 
      minHeight: '297mm', 
      backgroundColor: '#fff', 
      padding: '20mm',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      margin: '0 auto' 
    }}>
      {/* 1. 基础信息展示 */}
      <h1 style={{ margin: 0, color: '#333' }}>{resume.basics.name}</h1>
      <p style={{ color: '#666' }}>{resume.basics.title}</p>
      <hr />

      {/* 2. 动态板块展示 */}
      {resume.sections.map(section => (
        <div key={section.id} style={{ marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            {section.title}
          </h3>
          
          {/* 段落渲染 */}
          {section.type === 'paragraph' && (
            <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>
              {section.content}
            </p>
          )}

          {/* 列表渲染 */}
          {section.type === 'list' && (
            <ul style={{ paddingLeft: '20px' }}>
              {section.items.map(item => (
                <li key={item.id} style={{ marginBottom: '5px' }}>
                  <strong>{item.title}</strong>
                  {item.subtitle && <span> | {item.subtitle}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};