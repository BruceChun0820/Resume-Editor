// src/utils/validator.ts
import type { Resume } from '@/types/resume';

/**
 * 强健的运行时检查 (Type Guard)
 * 目标：防止不完整的 JSON 导致 React 渲染时读取 undefined 崩溃
 */
export const isValidResume = (data: any): data is Resume => {
    // 0. 防御性编程：包裹 try-catch
    // 防止 data 为 null 或深度嵌套不存在时，校验逻辑本身报错
    try {
        // 1. 基础对象检查
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.warn("Validator: Root is not an object");
            return false;
        }

        // 2. 检查必须存在的顶级 Key
        // 注意：GlobalSettings 虽然重要，但在某些旧版本可能缺失，这里视你的兼容性需求而定
        // 如果缺失会导致 ThemeProvider 崩溃，则必须检查
        const requiredKeys = ['id', 'sections', 'sectionOrder'];
        for (const key of requiredKeys) {
            if (!(key in data)) {
                console.warn(`Validator: Missing root key '${key}'`);
                return false;
            }
        }

        // 3. 检查 sectionOrder (必须是数组)
        if (!Array.isArray(data.sectionOrder)) {
            console.warn("Validator: sectionOrder is not an array");
            return false;
        }

        // 4. 检查 sections 容器 (必须是对象 Map)
        if (!data.sections || typeof data.sections !== 'object' || Array.isArray(data.sections)) {
            console.warn("Validator: sections is not a valid object map");
            return false;
        }

        // 5. 关键：检查 Basic 基础信息 (Header组件强依赖)
        if (!data.sections.basic || typeof data.sections.basic !== 'object') {
             console.warn("Validator: Missing sections.basic");
             return false;
        }
        // 深入检查 basic.items (防止 .map 崩溃)
        if (!data.sections.basic.items || !Array.isArray(data.sections.basic.items)) {
             console.warn("Validator: basic.items is missing or not an array");
             return false;
        }

        // 6. 🔥 核心修复：一致性检查 (防止白屏的终极防线)
        // 逻辑：sectionOrder 里提到的每个 ID，sections 里必须真的有数据
        for (const sectionConfig of data.sectionOrder) {
            // 确保配置项本身合法
            if (!sectionConfig || typeof sectionConfig !== 'object' || !sectionConfig.id) {
                console.warn("Validator: Invalid item in sectionOrder");
                return false;
            }

            const sectionId = sectionConfig.id;
            const targetData = data.sections[sectionId];

            // 致命错误拦截：Order 里有，Data 里没有 -> 渲染必崩
            if (!targetData) {
                console.warn(`Validator: Integrity Error! Section '${sectionId}' found in order but missing in data.`);
                return false;
            }
            
            // 针对新结构的检查：sections 中的值不应该是数组（应该是对象或 Map）
            // 除非你的 ResumeItem 定义允许它是数组，否则这里也要拦截
            if (Array.isArray(targetData)) {
                 // console.warn(`Validator: Section '${sectionId}' data is array (expected object for Map structure)`);
                 // 注意：取决于你的 sections 定义，如果是 Record<string, SectionData> 且 SectionData 是数组则没问题
                 // 如果你是为了兼容旧数据，这里可以放宽
            }
        }

        // 所有检查通过
        return true;

    } catch (e) {
        console.error("Validator Crashed:", e);
        return false;
    }
};