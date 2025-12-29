import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import type { Resume } from '../../types/resume';
import styles from './ResumePreview.module.css';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  return (
    <div className={styles.paper}>
      {/* 1. 基础信息展示 */}
      <header className={styles.header}>
        {resume.basics.image && (
          <img
            src={resume.basics.image}
            alt={resume.basics.name}
            className={styles.avatar}
          />
        )}
        <div className={styles.headerContent}>
          <h1 className={styles.name}>{resume.basics.name}</h1>
          <div className={styles.basicsGrid}>
            <span className={styles.contactItem}><Briefcase size={14} />{resume.basics.title}</span>
            <span className={styles.contactItem}><Mail size={14} />{resume.basics.email}</span>
            <span className={styles.contactItem}><Phone size={14} />{resume.basics.phone}</span>
            {resume.basics.location && (
              <span className={styles.contactItem}><MapPin size={14} />{resume.basics.location}</span>
            )}
          </div>
        </div>
      </header>

      {/* 2. 动态板块展示 */}
      {resume.sections.map(section => (
        <section key={section.id} className={styles.section}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>

          {/* 统一使用列表渲染逻辑 */}
          <ul className={styles.list}>
            {section.items.map(item => {
              // 关键判断：是否有头部信息（标题、副标题、时间）
              const hasHeader = item.title || item.subtitle || item.dateRange;

              return (
                <li key={item.id} className={styles.listItem}>
                  {/* 如果“条件”为真 (True)：JavaScript 会继续往后看，返回“结果”（也就是括号里的 HTML）。
                  如果“条件”为假 (False)：JavaScript 会在这里直接停下（短路），返回 false。在 React 中，如果表达式返回 false、null 或 undefined，React 就什么都不渲染。 */}
                  {hasHeader && (
                    <div className={styles.itemHeaderLine}>
                      <div className={styles.itemTitleGroup}>
                        {item.title && <span className={styles.itemTitle}>{item.title}</span>}
                        {item.subtitle && (
                          <span className={styles.itemSubtitle}> / {item.subtitle}</span>
                        )}
                      </div>

                      {item.dateRange && (
                        <span className={styles.itemDate}>{item.dateRange}</span>
                      )}
                    </div>
                  )}

                  {/* 描述内容：始终渲染，自动适配 */}
                  <div
                    className={styles.itemDescription}
                    dangerouslySetInnerHTML={{ __html: item.description || '' }}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};