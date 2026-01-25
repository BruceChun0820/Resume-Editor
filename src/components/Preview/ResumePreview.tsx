// src/components/Preview/ResumePreview.tsx
import { 
  Briefcase, Mail, Phone, MapPin, Globe, Github, Linkedin, Link as LinkIcon 
} from 'lucide-react';
import type { Resume, BasicsSection, ResumeItem } from '@/types/resume';
import styles from './ResumePreview.module.css';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Briefcase: Briefcase,
  Globe: Globe,
  Github: Github,
  Linkedin: Linkedin,
  Link: LinkIcon,
};

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  const basicSection = resume.sections.basic as BasicsSection;
  const { data: basicData, items: basicItems } = basicSection;

  return (
    <div className={styles.paper}>
      {/* 1. Header (回归经典布局) */}
      <header className={styles.header}>
        {basicData.avatar && (
          <img
            src={basicData.avatar}
            alt={basicData.name || 'avatar'}
            className={styles.avatar}
          />
        )}
        
        <div className={styles.headerContent}>
          <h1 className={styles.name}>{basicData.name}</h1>
          {/* 职位信息单独显示 */}
          {basicData.title && (
             <p className={styles.jobTitle}>{basicData.title}</p>
          )}
          
          {/* 回归 Grid 布局的联系方式 */}
          <div className={styles.basicsGrid}>
            {basicItems
              .filter(item => item.visible && item.value && item.value.trim() !== '')
              .map(item => {
                const IconComponent = iconMap[item.icon || 'Link'] || LinkIcon;
                return (
                  <span key={item.id} className={styles.contactItem}>
                    <IconComponent size={14} />
                    {item.value}
                  </span>
                );
              })}
          </div>
        </div>
      </header>

      {/* 2. Body (动态板块) */}
      {resume.sectionOrder
        .filter(section => section.visible && section.id !== 'basic')
        .map(sectionConfig => {
          const sectionData = resume.sections[sectionConfig.id];
          
          // A: 纯文本板块
          if (typeof sectionData === 'string') {
             return (
               <section key={sectionConfig.id} className={styles.section}>
                  <h3 className={styles.sectionTitle}>{sectionConfig.title}</h3>
                  <div 
                    className={cn(styles.itemDescription, "rich-text-content")}
                    dangerouslySetInnerHTML={{ __html: sectionData }}
                  />
               </section>
             );
          }

          // B: 列表板块
          const listData = sectionData as ResumeItem[];
          if (!Array.isArray(listData)) return null;

          return (
            <section key={sectionConfig.id} className={styles.section}>
              <h3 className={styles.sectionTitle}>{sectionConfig.title}</h3>

              <ul className={styles.list}>
                {listData
                  .filter(item => item.visible)
                  .map(item => {
                    const hasHeader = item.title || item.subtitle || item.dateRange;

                    return (
                      <li key={item.id} className={styles.listItem}>
                        {hasHeader && (
                          <div className={styles.itemHeaderLine}>
                            <div className={styles.itemTitleGroup}>
                              {item.title && <span className={styles.itemTitle}>{item.title}</span>}
                              {item.subtitle && (
                                <span className={styles.itemSubtitle}>
                                  {item.title ? ` / ${item.subtitle}` : item.subtitle}
                                </span>
                              )}
                            </div>
                            {item.dateRange && (
                              <span className={styles.itemDate}>{item.dateRange}</span>
                            )}
                          </div>
                        )}

                        {item.description && (
                          <div
                            className={cn(styles.itemDescription, "rich-text-content")}
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        )}
                      </li>
                    );
                  })}
              </ul>
            </section>
          );
        })}
    </div>
  );
};