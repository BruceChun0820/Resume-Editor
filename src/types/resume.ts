// src/types/resume.ts

/**
 * ==========================================
 * 1. 全局样式配置 (Global Settings)
 * ==========================================
 */
export interface GlobalSettings {
  themeColor: string;    // 主题色，如 "#0047AB"
  fontFamily: string;    // 字体
  baseFontSize: number;  // 基础字号 (14/16/18)
  lineHeight: number;    // 行高 (1.5 - 2.0)
  pagePadding: number;   // 页面边距
  contentWidth: number;  // 内容宽度 (用于A4纸模拟)
}

/**
 * ==========================================
 * 2. 基础信息模块 (Basics)
 * ==========================================
 */

// A. 基础数据
export interface BasicInfoData {
  name: string;
  title: string;       // 职位/头衔
  avatar?: string;     // 头像 Base64 或 URL
  email?: string;
  phone?: string;
  location?: string;
  // 其他自定义字段的数据存储在 layout 中，或者这里用一个 Map
  // 为了方便，我们在 Item 中直接存储值
}

// B. 基础信息布局项 (控制基本信息里的每一个小条目)
// 对应参考图中的 "基础字段" 和 "自定义字段"
export interface BasicInfoItem {
  id: string;
  type: 'system' | 'custom';
  key?: keyof BasicInfoData; // 如果是系统字段，对应上面的 key
  
  label: string;   // 显示的标签名称 (可重命名，如 "电话" -> "手机")
  value: string;   // 内容值
  icon?: string;   // 图标名称
  visible: boolean; // 是否显示
}

export interface BasicsSection {
  data: BasicInfoData;      // 核心数据 (头像、名字、头衔)
  items: BasicInfoItem[];   // 字段列表 (邮箱、电话、自定义...) -> 控制排序和显示
}


/**
 * ==========================================
 * 3. 核心内容模块 (Sections)
 * ==========================================
 */

// 通用列表项 (用于工作、项目、教育、自定义列表)
export interface ResumeItem {
  id: string;
  title: string;       // 标题 (公司名 / 学校名 / 项目名)
  subtitle?: string;   // 副标题 (职位 / 学位 / 角色)
  dateRange?: string;  // 时间段 (2023.09 - 2024.06)
  description?: string;// 详细描述 (HTML 富文本)
  visible: boolean;    // 单条记录的显隐
}

// 模块类型枚举
export type SectionType = 
  | 'basic'      // 基础信息 (特殊处理)
  | 'work'       // 工作经历
  | 'project'    // 项目经历
  | 'education'  // 教育经历
  | 'skills'     // 专业技能 (通常是富文本)
  | 'custom-list'// 自定义列表模块 (如：获奖证书、社团经历)
  | 'custom-text'// 自定义文本模块 (如：自我评价)

// 模块元数据 (侧边栏导航)
export interface SectionConfig {
  id: string;        // 唯一 ID (如 "work", "custom-xyz")
  title: string;     // 模块标题 (如 "工作经历", "我的开源项目")
  type: SectionType; // 模块类型
  icon?: string;     // 侧边栏图标
  visible: boolean;  // 整个模块是否在简历中显示
  isDeletable: boolean; // 是否允许删除 (系统模块 false)
}


/**
 * ==========================================
 * 4. 简历完整结构 (Root)
 * ==========================================
 */
export interface Resume {
  id: string;
  name: string;        // 简历文件名 (如 "我的Java简历_V1")
  updatedAt: string;
  
  // 全局设置
  globalSettings: GlobalSettings;

  // --- 模块管理 (侧边栏) ---
  // 数组顺序决定了侧边栏和简历正文的模块上下顺序
  sectionOrder: SectionConfig[];

  // --- 模块数据存储 (Data Map) ---
  // 使用字典存储，Key 是 SectionConfig.id
  // 这样设计非常灵活，无论是系统模块还是自定义模块，都去这里取数据
  sections: {
    // 基础信息特殊处理
    basic: BasicsSection;
    
    // 其他模块的数据
    // 如果是 List 类型 -> 存 ResumeItem[]
    // 如果是 Text 类型 -> 存 string (HTML)
    [key: string]: BasicsSection | ResumeItem[] | string;
  };
}