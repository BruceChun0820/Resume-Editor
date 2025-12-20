import type { Resume } from '../../types/resume';
import styles from './ResumePreview.module.css';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  return (
    <div className={styles.paper}>
      {/* 1. 基础信息展示 */}
      <header>
        <h1 className={styles.name}>{resume.basics.name}</h1>
        <span className={styles.jobTitle}>{resume.basics.title}</span>
        <span className={styles.jobTitle}>{resume.basics.email}</span>
        <p className={styles.jobTitle}>{resume.basics.phone}</p>
      </header>
      
      <hr className={styles.divider} />

      {/* 2. 动态板块展示 */}
      {resume.sections.map(section => (
        <section key={section.id} className={styles.section}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          
          {section.type === 'paragraph' && (
            <p className={styles.paragraph}>
              {section.content}
            </p>
          )}

          {/* 列表渲染 */}
          {section.type === 'list' && (
            <ul className={styles.list}>
              {section.items.map(item => (
                <li key={item.id} className={styles.listItem}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  {item.subtitle && (
                    <span className={styles.itemSubtitle}> | {item.subtitle}</span>
                  )}
                  {/* 如果有描述内容也可以在这里渲染 */}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};