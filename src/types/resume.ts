export interface Resume {
    basics: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        image?: string;
    }
    sections: ResumeSection[];
}

export type SectionType = 'list'; 

// 不再需要 BaseSection, ParagraphSection, ListSection 这一套复杂的继承
export interface ResumeSection {
    id: string;
    type: SectionType; // 目前只有 'list'，保留这个字段方便未来扩展（比如 'grid'）
    title: string;
    items: ListItem[]; // 重点：现在的 Section 保证一定有 items 数组
}

// 3. ListItem 保持不变，它是我们的核心数据单元
export interface ListItem {
    id: string;
    title: string;       // 如果是纯段落，这个字段存空字符串
    subtitle?: string;   // 可选
    description?: string; // 如果是纯段落，内容就存在这里
    dateRange?: string;  // 可选
}