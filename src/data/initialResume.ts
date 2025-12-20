import type { Resume } from "../types/resume";

export const initialResume: Resume = {
    basics: {
        name: "Bruce Chun",
        title: "Software Engineer",
        email: "brucechun0@gmail.com",
        phone: "+86 19178295494",
        location: "San Francisco, CA"
    },
    sections: [
        {
            id: "1",
            type: "paragraph",
            title: "Summary",
            content: "Experienced software engineer with a passion for creating efficient and scalable applications."
        },
        {
            id: "2",
            type: "list",
            title: "Experience",
            items: [
                {
                    id: "1",
                    title: "Senior Software Engineer",
                    subtitle: "Tech Corp",
                    description: "Led development of new features and maintained existing systems.",
                    dateRange: "2020 - Present"
                }
            ]
        }
    ]
};