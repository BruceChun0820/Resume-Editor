import type { Resume } from "../types/resume";

export const initialResume: Resume = {
    basics: {
        name: "Bruce Chun",
        title: "Software Engineer",
        email: "brucechun0@gmail.com",
        phone: "+86 19178295494",
        location: "Shenzhen Guangdong China"
    },
    sections: [
        {
            id: "1",
            type: "list", 
            title: "Summary",
            items: [
                {
                    id: "summary-item-1",
                    title: "", // 留空：这样预览组件就会把它当作纯段落渲染
                    subtitle: "",
                    dateRange: "",
                    // 原来的 content 内容全部放进 description
                    description: `- Programming & Core: Proficient in Java and JVM internals; expertise in multithreading, concurrent programming, and collection frameworks. Familiar with Python for building AI Agent server interfaces and data processing tasks.
- Frameworks & Architecture: Deep understanding of Microservices; highly skilled in Spring Boot, Spring Cloud, and MyBatis for scalable application development.
- Data Management: Expert in Oracle and MySQL, with a strong grasp of database principles and performance optimization strategies.
- AI & Knowledge Bases: Practical experience in AI Agent development based on LangChain; familiar with RAG (Retrieval-Augmented Generation) mechanisms and end-to-end knowledge base construction.
- Middleware: Proficient in mainstream middleware including Kafka, Redis, and Nacos.
- Testing & Tools: Skilled in unit testing with JUnit and Mockito; expert in API documentation and testing via Postman and Swagger.
- DevOps & CI/CD: Experienced in Maven lifecycle management and Jenkins pipeline configuration; familiar with Git-based workflows (GitHub, Bitbucket) and Docker containerization.
- Soft Skills: Strong ability to analyze requirements and produce technical documentation; fluent in English for professional communication, team collaboration, and facilitating cross-functional meetings.`
                }
            ]
        },
        {
            id: "2",
            type: "list",
            title: "Experience",
            items: [
                {
                    id: "exp-1",
                    title: "Senior Software Engineer",
                    subtitle: "Tech Corp",
                    description: `- Contributed to the development of international financial services back-end systems and AI Agent applications.
- Managed back-end services and front-end API integration to ensure high availability.
- Utilized Jira for Agile development management.
- Collaborated with QA engineers on functional integration testing.
- Executed version deployments via CI/CD pipelines.
- Facilitated daily stand-ups to ensure project delivery.`,
                    dateRange: "2020 - Present"
                }
            ]
        }
    ]
};