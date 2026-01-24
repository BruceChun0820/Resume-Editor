import { 
  Briefcase, Mail, Phone, MapPin, Globe, Github, Linkedin, Link as LinkIcon 
} from 'lucide-react';
import type { Resume, BasicsSection, ResumeItem } from '@/types/resume';
import styles from './ResumePreview.module.css';
import { cn } from '@/lib/utils';

// 图标映射表：将字符串映射为组件
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
  // 1. 获取基础信息数据
  // 使用类型断言或可选链确保安全，虽然在我们的架构中 basic 一定存在
  const basicSection = resume.sections.basic as BasicsSection;
  const { data: basicData, items: basicItems } = basicSection;

  return (
    <div className={styles.paper}>
      {/* --- 1. Header (基础信息) --- */}
      <header className={styles.header}>
        {/* 左侧头像 */}
        {basicData.avatar && (
          <img
            src={basicData.avatar}
            alt={basicData.name || 'avatar'}
            className={styles.avatar}
          />
        )}
        
        {/* 右侧信息 */}
        <div className={styles.headerContent}>
          <h1 className={styles.name}>{basicData.name}</h1>
          <p className={styles.jobTitle}>{basicData.title}</p>
          
          {/* 动态渲染联系方式列表 */}
          <div className={styles.basicsGrid}>
            {basicItems
              .filter(item => item.visible) // 只渲染可见的
              .map(item => {
                // 动态获取图标，如果没有匹配则默认显示 Link
                const IconComponent = iconMap[item.icon || 'Link'] || LinkIcon;
                return (
                  <span key={item.id} className={styles.contactItem}>
                    <IconComponent size={14} />
                    {/* 如果是链接类型，可以加个 a 标签，这里简化为文本 */}
                    {item.value}
                  </span>
                );
              })}
          </div>
        </div>
      </header>

      {/* --- 2. Body (动态板块) --- */}
      <div className={styles.bodyContent}>
        {resume.sectionOrder
          .filter(section => section.visible && section.id !== 'basic') // 过滤掉隐藏的和已经渲染的 Basic
          .map(sectionConfig => {
            const sectionData = resume.sections[sectionConfig.id];
            
            // 情况 A：纯文本板块 (Skills, Summary)
            // 数据类型是 string (HTML)
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

            // 情况 B：列表板块 (Work, Project, Education)
            // 数据类型是 ResumeItem[]
            const listData = sectionData as ResumeItem[];
            if (!Array.isArray(listData)) return null; // 类型安全检查

            return (
              <section key={sectionConfig.id} className={styles.section}>
                <h3 className={styles.sectionTitle}>{sectionConfig.title}</h3>

                <ul className={styles.list}>
                  {listData
                    .filter(item => item.visible) // 过滤掉隐藏的条目
                    .map(item => {
                      // 关键判断：是否有头部信息（标题、副标题、时间）
                      const hasHeader = item.title || item.subtitle || item.dateRange;

                      return (
                        <li key={item.id} className={styles.listItem}>
                          {hasHeader && (
                            <div className={styles.itemHeaderLine}>
                              <div className={styles.itemTitleGroup}>
                                {item.title && <span className={styles.itemTitle}>{item.title}</span>}
                                {item.subtitle && (
                                  <span className={styles.itemSubtitle}>
                                    {/* 使用斜杠分隔 */}
                                    {item.title ? ` / ${item.subtitle}` : item.subtitle}
                                  </span>
                                )}
                              </div>
                              {item.dateRange && (
                                <span className={styles.itemDate}>{item.dateRange}</span>
                              )}
                            </div>
                          )}

                          {/* 描述内容 */}
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
    </div>
  );
};