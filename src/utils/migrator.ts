// src/utils/migrator.ts
import type { Resume, ResumeItem } from '@/types/resume';
import { initialResume } from '@/data/initialResume';

// 辅助函数：生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * 智能字段映射器：将旧版的各种字段名统一映射到 title/subtitle/dateRange
 */
const mapSectionItem = (item: any): ResumeItem => {
    // 1. 尝试寻找标题 (Title)
    // 旧版可能叫: name (公司/项目), institution (学校), company (公司)
    const title = item.name || item.institution || item.company || item.title || '未命名项目';

    // 2. 尝试寻找副标题 (Subtitle)
    // 旧版可能叫: position (职位), area (专业), studyType (学位)
    const subtitle = item.position || item.area || item.studyType || item.subtitle || '';

    // 3. 尝试组合日期 (DateRange)
    // 旧版通常是 startDate 和 endDate 分开
    let dateRange = item.dateRange || '';
    if (!dateRange && (item.startDate || item.endDate)) {
        const start = item.startDate || '';
        const end = item.endDate || '至今';
        dateRange = `${start} - ${end}`;
    }

    // 4. 尝试组合描述 (Description)
    // 旧版可能是 summary (字符串) 或 highlights (数组)
    let description = item.description || item.summary || '';
    
    // 如果有 highlights 数组，将其转换为 HTML 列表
    if (Array.isArray(item.highlights) && item.highlights.length > 0) {
        const listHtml = item.highlights.map((line: string) => `<li>${line}</li>`).join('');
        description += `<ul>${listHtml}</ul>`;
    }
    
    // 如果有 keywords 数组 (常见于 Skill)，追加到描述里
    if (Array.isArray(item.keywords) && item.keywords.length > 0) {
        description += `<p><strong>关键词:</strong> ${item.keywords.join(', ')}</p>`;
    }

    // 5. 处理 URL (如果有)
    if (item.url) {
        description += `<p><a href="${item.url}" target="_blank">${item.url}</a></p>`;
    }

    return {
        id: generateId(),
        visible: true,
        title,
        subtitle,
        dateRange,
        description, // 这是转换后的富文本 HTML
    };
};

/**
 * 核心迁移函数
 */
export const migrateResume = (oldData: any): Resume => {
    console.log("Migrator: Detecting schema version...", oldData);

    // 1. 深拷贝一份默认模版作为骨架 (确保拥有完整的新结构)
    const newResume = JSON.parse(JSON.stringify(initialResume));

    // 保持 ID 不变 (如果有)
    if (oldData.id) newResume.id = oldData.id;

    // =========================================================
    // 2. 迁移基础信息 (Basics) -> sections.basic
    // =========================================================
    if (oldData.basics) {
        const b = oldData.basics;
        
        // A. 迁移固定字段 (Data)
        newResume.sections.basic.data = {
            name: b.name || '你的名字',
            title: b.title || '你的职位',
            avatar: b.image || '', // 兼容 Base64 头像
        };

        // B. 迁移联系方式 (Items)
        const newItems = [];
        if (b.email) newItems.push({ id: generateId(), icon: 'Mail', value: b.email, visible: true });
        if (b.phone) newItems.push({ id: generateId(), icon: 'Phone', value: b.phone, visible: true });
        if (b.location) newItems.push({ id: generateId(), icon: 'MapPin', value: b.location, visible: true });
        if (b.url) newItems.push({ id: generateId(), icon: 'Link', value: b.url, visible: true });
        
        // 处理 profiles (如 GitHub, LinkedIn)
        if (Array.isArray(b.profiles)) {
            b.profiles.forEach((p: any) => {
                newItems.push({
                    id: generateId(),
                    icon: p.network || 'Globe', // 简单的图标映射逻辑
                    value: p.url || p.username,
                    visible: true
                });
            });
        }
        
        newResume.sections.basic.items = newItems;
    }

    // =========================================================
    // 3. 迁移各板块 (Sections)
    // =========================================================
    
    // 你的 JSON 中 sections 是一个对象: { work: [], education: [] ... }
    if (oldData.sections && !Array.isArray(oldData.sections)) {
        Object.keys(oldData.sections).forEach(key => {
            const oldSectionData = oldData.sections[key];

            // 只有当它是数组时才处理 (例如 work, education)
            if (Array.isArray(oldSectionData)) {
                // 1. 转换数据项
                const newSectionData = oldSectionData.map(mapSectionItem);
                
                // 2. 存入新版 sections Map
                newResume.sections[key] = newSectionData;

                // 3. 确保在 sectionOrder 中
                const exists = newResume.sectionOrder.find((o:any) => o.id === key);
                if (!exists) {
                    // 如果是已知类型，尝试匹配中文名
                    let title = key.charAt(0).toUpperCase() + key.slice(1);
                    if (key === 'work') title = '工作经历';
                    if (key === 'education') title = '教育经历';
                    if (key === 'projects') title = '项目经历';
                    if (key === 'skills') title = '专业技能';
                    
                    newResume.sectionOrder.push({
                        id: key,
                        title: title,
                        visible: true
                    });
                }
            }
        });
    }

    console.log("Migrator: Successfully transformed to:", newResume);
    return newResume;
};