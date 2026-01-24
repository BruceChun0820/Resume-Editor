// src/data/initialResume.ts
import { type Resume } from "@/types/resume";

export const initialResume: Resume = {
  id: 'default-id',
  name: '未命名简历',
  updatedAt: new Date().toISOString().split('T')[0],
  
  // 1. 全局样式配置 (默认值)
  globalSettings: {
    themeColor: '#0047AB',    // 经典的简历蓝
    fontFamily: 'sans-serif',
    baseFontSize: 14,
    lineHeight: 1.6,
    pagePadding: 24,
    contentWidth: 595,        // A4 像素宽度
  },

  // 2. 侧边栏目录 (决定了模块的显示顺序)
  sectionOrder: [
    { 
      id: 'basic', 
      title: '基本信息', 
      type: 'basic', 
      icon: 'User', 
      visible: true, 
      isDeletable: false 
    },
    { 
      id: 'skills', 
      title: '专业技能', 
      type: 'skills', 
      icon: 'Zap', 
      visible: true, 
      isDeletable: false 
    },
    { 
      id: 'work', 
      title: '工作经历', 
      type: 'work', 
      icon: 'Briefcase', 
      visible: true, 
      isDeletable: false 
    },
    { 
      id: 'projects', 
      title: '项目经历', 
      type: 'project', 
      icon: 'Rocket', 
      visible: true, 
      isDeletable: false 
    },
    { 
      id: 'education', 
      title: '教育经历', 
      type: 'education', 
      icon: 'GraduationCap', 
      visible: true, 
      isDeletable: false 
    },
  ],

  // 3. 具体内容数据 (根据 ID 索引)
  sections: {
    // --- 基础信息模块 ---
    basic: {
      data: {
        name: "你的名字",
        title: "求职意向 / 职位",
        avatar: "", // 头像 Base64
      },
      // 可排序的具体字段列表
      items: [
        { 
          id: 'phone', 
          type: 'system', 
          key: 'phone', 
          label: '电话', 
          value: '', 
          icon: 'Phone', 
          visible: true 
        },
        { 
          id: 'email', 
          type: 'system', 
          key: 'email', 
          label: '邮箱', 
          value: '', 
          icon: 'Mail', 
          visible: true 
        },
        { 
          id: 'loc', 
          type: 'system', 
          key: 'location', 
          label: '地址', 
          value: '', 
          icon: 'MapPin', 
          visible: true 
        },
      ]
    },

    // --- 技能模块 (富文本) ---
    skills: `<ul><li><p>熟练掌握 Java / Python / JavaScript</p></li><li><p>熟悉 React 前端框架</p></li></ul>`,

    // --- 列表类模块 (数组) ---
    work: [
      {
        id: 'exp-1',
        title: '某某科技公司',
        subtitle: '高级开发工程师',
        dateRange: '2021.06 - 至今',
        description: '<p>负责核心业务系统的后端开发与维护，优化数据库查询性能...</p>',
        visible: true
      }
    ],

    projects: [
        {
            id: 'proj-1',
            title: '企业级 CRM 管理系统',
            subtitle: '全栈负责人',
            dateRange: '2022.01 - 2022.12',
            description: '<p>从零搭建基于 React + Spring Boot 的客户管理系统...</p>',
            visible: true
        }
    ],

    education: [
        {
            id: 'edu-1',
            title: '某某大学',
            subtitle: '软件工程 (本科)',
            dateRange: '2016.09 - 2020.06',
            description: '',
            visible: true
        }
    ]
  }
};