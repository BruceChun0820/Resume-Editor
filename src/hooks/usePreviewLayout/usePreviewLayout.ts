// src/hooks/usePreviewLayout/usePreviewLayout.ts
import { useLayoutEffect, type RefObject } from 'react';
import type { Resume } from '@/types/resume';
import styles from '@/components/Preview/ResumePreview.module.css'; // 引用样式用于选择器

/**
 * 负责计算 A4 分页逻辑的 Custom Hook
 * 核心功能：检测元素是否超出当前页，如果是，则添加 margin 推到下一页
 */
export const usePreviewLayout = (
  containerRef: RefObject<HTMLDivElement | null>,
  resume: Resume
) => {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. 动态测量 A4 纸在当前屏幕 DPI 下的像素高度
    // 这是一个非常精准的做法，比写死像素值要好
    const measureDiv = document.createElement('div');
    measureDiv.style.height = '297mm';
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    document.body.appendChild(measureDiv);
    const PAGE_HEIGHT_PX = measureDiv.offsetHeight;
    document.body.removeChild(measureDiv);

    // 计算比例和边距常量
    const mmToPx = PAGE_HEIGHT_PX / 297;
    const PADDING_TOP = 15 * mmToPx;    
    const PADDING_BOTTOM = 15 * mmToPx; 
    const VISUAL_GAP = 15 * mmToPx; 
    
    // 内容安全区域（页高 - 上下边距 - 视觉缝隙）
    const CONTENT_LIMIT = PAGE_HEIGHT_PX - PADDING_BOTTOM - VISUAL_GAP;
    
    // 孤儿控制阈值：如果页面底部剩余空间小于这个值（约2行高度），强制换页
    const ORPHAN_THRESHOLD = 30 * mmToPx; 

    // 2. 选择需要检测分页的关键元素
    // 注意：我们不再选择 .listItem，允许浏览器在列表项内部自动断页
    const elements = Array.from(container.querySelectorAll<HTMLElement>(
      `.${styles.header}, 
       .${styles.sectionTitle}, 
       .${styles.itemHeaderLine}` 
    ));

    // 3. 重置状态：清除之前计算出的所有 margin 和类名
    elements.forEach(el => {
      el.style.marginTop = '';
      el.classList.remove(styles.pageBreakMargin);
    });
    
    // 同时清除可能残留在 listItem 上的类（兼容旧逻辑）
    const allListItems = container.querySelectorAll(`.${styles.listItem}`);
    allListItems.forEach((el: any) => {
      el.style.marginTop = '';
      el.classList.remove(styles.pageBreakMargin);
    });
    
    // 重置容器高度
    container.style.height = 'auto'; 

    // 4. 核心遍历：计算位置并插入断点
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.offsetHeight === 0) continue;

      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;

      // 计算当前元素处于第几页
      const currentPageIndex = Math.floor(top / PAGE_HEIGHT_PX);
      // 当前页的“物理底部红线”
      const currentPageLimit = currentPageIndex * PAGE_HEIGHT_PX + CONTENT_LIMIT;
      // 剩余可用空间
      const remainingSpace = currentPageLimit - bottom;

      let shouldBreak = false;

      // 判定 A：如果已经溢出了当前页的安全区域
      // 判定 B：如果是标题，且剩余空间太小（孤儿标题）
      if (remainingSpace < ORPHAN_THRESHOLD) {
         shouldBreak = true;
      }

      if (shouldBreak) {
        // 计算下一页的起始位置 (页码 * 页高 + 顶部内边距)
        const nextPageStart = (currentPageIndex + 1) * PAGE_HEIGHT_PX + PADDING_TOP;
        
        // 获取当前可能存在的 margin（虽然我们在第3步重置了，但为了健wd壮性）
        const currentStyle = window.getComputedStyle(el);
        const currentMargin = parseFloat(currentStyle.marginTop) || 0;
        
        const diff = nextPageStart - top;
        
        // 只有当需要向下推时才操作
        if (diff > 0) {
            // 1. 设置视觉上的 margin，让用户在预览时看到空白
            el.style.marginTop = `${currentMargin + diff}px`;
            // 2. 添加标记类，打印时这个类会变成 `break-before: page`
            el.classList.add(styles.pageBreakMargin);
        }
      }
    }

    // 5. 补全背景高度
    // 为了让预览界面的最后一张纸看起来是完整的 A4 大小
    const finalContentHeight = container.scrollHeight;
    const totalPages = Math.ceil(finalContentHeight / PAGE_HEIGHT_PX);
    if (totalPages > 0) {
        container.style.height = `${totalPages * PAGE_HEIGHT_PX}px`;
    }

  }, [resume]); // 当简历数据变化时重新计算
};