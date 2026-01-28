// src/utils/validator.ts
import type { Resume } from '@/types/resume';

/**
 * 运行时检查对象是否符合 Resume 接口的最基本要求
 * 这是一个 TypeScript 类型守卫 (Type Guard)
 */
export const isValidResume = (data: any): data is Resume => {
    // 1. 必须是对象且非 null
    if (!data || typeof data !== 'object') {
        return false;
    }

    // 2. 检查关键元数据 (id, name, globalSettings) - 可选，但建议检查
    if (!('id' in data) || !('globalSettings' in data)) {
        console.warn("Validation Failed: Missing 'id' or 'globalSettings'");
        return false;
    }

    // 3. 检查 'sectionOrder'
    // 新结构的核心：必须包含 sectionOrder 且必须是数组
    if (!('sectionOrder' in data) || !Array.isArray(data.sectionOrder)) {
        console.warn("Validation Failed: Missing or invalid 'sectionOrder'");
        return false;
    }

    // 4. 检查 'sections' 容器
    // 注意：在新结构中，sections 是一个对象 (Map)，不再是数组
    if (!('sections' in data) || typeof data.sections !== 'object' || Array.isArray(data.sections)) {
        console.warn("Validation Failed: 'sections' is missing or is not an object");
        return false;
    }

    // 5. 检查 'sections.basic' (基础信息)
    // 这是简历最核心的部分，必须存在。注意 JSON 中它是 "basic" 而不是 "basics"
    if (!('basic' in data.sections) || typeof data.sections.basic !== 'object') {
        console.warn("Validation Failed: Missing 'sections.basic'");
        return false;
    }

    // 6. 深入检查 basic 结构
    // 必须包含 data (姓名/头衔) 和 items (联系方式列表)
    const basic = data.sections.basic;
    if (!('data' in basic) || !('items' in basic) || !Array.isArray(basic.items)) {
        console.warn("Validation Failed: Invalid 'sections.basic' structure (missing data or items)");
        return false;
    }

    return true;
};