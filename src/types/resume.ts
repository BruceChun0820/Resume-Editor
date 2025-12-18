export interface Resume {
    basics: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
    }
    sections: ResumeSection[];
}

export type SectionType = 'paragraph' | 'list'; // 类似于枚举类型

export interface BaseSection {
    id: string;
    type: SectionType;
    title: string;
}

export interface ParagraphSection extends BaseSection {
    type: 'paragraph';
    content: string;
}

export interface ListSection extends BaseSection {
    type: 'list';
    items: ListItem[];
}
export interface ListItem {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    dateRange?: string;
}

export type ResumeSection = ParagraphSection | ListSection;
