import type { Resume } from "../types/resume";

export const initialResume: Resume = {
    id: 'default-id', 
    name: '未命名简历',
    updatedAt: new Date().toISOString().split('T')[0],
    basics: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        image: "" 
    },
    sections: [
        {
            id: "default-summary",
            type: "list", 
            title: "个人总结",
            items: [
                {
                    id: "summary-item-1",
                    title: "",
                    subtitle: "",
                    dateRange: "",
                    description: ""
                }
            ]
        },
        {
            id: "default-experience",
            type: "list",
            title: "工作经历",
            items: [
                {
                    id: "exp-1",
                    title: "",
                    subtitle: "",
                    description: "",
                    dateRange: ""
                }
            ]
        }
    ]
};