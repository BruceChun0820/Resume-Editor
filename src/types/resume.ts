// src/types/resume.ts

export interface Resume {
    id: string;        
    name: string;    
    updatedAt: string; 
    basics: {
        name: string;  // 求职者姓名 (例如 "Alex Chen")
        title: string;
        email: string;
        phone: string;
        location: string;
        image?: string; // Base64 头像
    };
    sections: ResumeSection[];
}

export type SectionType = 'list'; 

export interface ResumeSection {
    id: string;
    type: SectionType; 
    title: string;
    items: ListItem[]; 
}

export interface ListItem {
    id: string;
    title: string;       
    subtitle?: string;   
    description?: string; 
    dateRange?: string;  
}