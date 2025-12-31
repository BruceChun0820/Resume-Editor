// src/utils/validator.ts
import type { Resume } from '../types/resume';

/**
 * 运行时检查对象是否符合 Resume 接口的最基本要求
 * 这是一个 TypeScript 类型守卫 (Type Guard)
 */
export const isValidResume = (data: any): data is Resume => {
    // 必须是对象且非 null
    if (!data || typeof data !== 'object') {
        return false;
    }

    // 必须包含 basics 对象
    if (!('basics' in data) || typeof data.basics !== 'object') {
        console.warn("Validation Failed: Missing 'basics'");
        return false;
    }

    // 必须包含 sections 数组
    if (!('sections' in data) || !Array.isArray(data.sections)) {
        console.warn("Validation Failed: Missing 'sections'");
        return false;
    }

    return true;
};