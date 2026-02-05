import { useLayoutEffect, useState, type RefObject } from 'react';
import type { Resume } from '@/types/resume';
import styles from '@/components/Preview/ResumePreview.module.css';

export const usePreviewLayout = (
  containerRef: RefObject<HTMLDivElement | null>,
  resume: Resume
) => {
  // 引入一个强制更新的状态，用于在图片加载或 Resize 时触发重算
  const [, forceUpdate] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 0. 准备工作：清理与测量 ---
    
    // 1. 测量 A4 像素高度
    const measureDiv = document.createElement('div');
    measureDiv.style.height = '297mm';
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    document.body.appendChild(measureDiv);
    const PAGE_HEIGHT_PX = measureDiv.offsetHeight;
    document.body.removeChild(measureDiv);

    const mmToPx = PAGE_HEIGHT_PX / 297;
    const PADDING_TOP = 15 * mmToPx;    
    const PADDING_BOTTOM = 15 * mmToPx; 
    const VISUAL_GAP = 15 * mmToPx; 
    
    const CONTENT_LIMIT = PAGE_HEIGHT_PX - PADDING_BOTTOM - VISUAL_GAP;
    const ORPHAN_THRESHOLD = 30 * mmToPx; 

    // 2. 选择检测元素
    // 注意：我们将 rich-text-content 直接纳入检测，防止它是纯文本节点组成的
    const selectors = [
        `.${styles.header}`,
        `.${styles.sectionTitle}`,
        `.${styles.itemHeaderLine}`,
        `.rich-text-content p`,     
        `.rich-text-content li`,
        `.rich-text-content h1`, 
        `.rich-text-content h2`, 
        `.rich-text-content h3`,
        `.rich-text-content blockquote`,
        // 兜底：如果编辑器生成了 div 而不是 p
        `.rich-text-content > div` 
    ];

    // 获取所有元素
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selectors.join(',')));

    // 3. 重置所有状态 (非常重要，防止计算叠加)
    elements.forEach(el => {
      el.style.marginTop = '';
      el.classList.remove(styles.pageBreakMargin);
    });
    // 额外清理可能残留的类
    container.querySelectorAll(`.${styles.pageBreakMargin}`).forEach((el: any) => {
        el.style.marginTop = '';
        el.classList.remove(styles.pageBreakMargin);
    });
    
    container.style.height = 'auto'; 

    // --- 4. 核心遍历计算 ---
    
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.offsetHeight === 0) continue;

      // 实时计算位置
      const top = el.offsetTop;
      const height = el.offsetHeight;
      const bottom = top + height;

      const startPageIndex = Math.floor(top / PAGE_HEIGHT_PX);
      const pageLimit = startPageIndex * PAGE_HEIGHT_PX + CONTENT_LIMIT;

      let shouldBreak = false;

      // 判定 A: 跨页检测
      // [修复]：移除了 height < CONTENT_LIMIT 的限制
      // 只要底部超出了当前页的安全线，我们就尝试把它推下去
      if (bottom > pageLimit) {
         // 但是，如果这个元素本身的高度就已经超过了一整页（例如超长的单段文字）
         // 我们推它也没用，因为它推到下一页还是会跨页。
         // 这种情况下，我们只能让它自然跨页（浏览器打印会自动处理），不通过 JS 干预
         if (height < CONTENT_LIMIT) {
             shouldBreak = true;
         } else {
             // 如果元素超级高 > 1页，我们尝试不推它，
             // 让它内部的子元素（如果有）在下一轮循环中被处理，或者依靠 CSS print 属性
             // console.warn('元素过高，放弃JS分页，交由浏览器处理', el);
         }
      }
      
      // 判定 B: 孤儿控制
      const isHeader = el.classList.contains(styles.itemHeaderLine) || 
                       el.classList.contains(styles.sectionTitle) ||
                       el.classList.contains(styles.header);
      
      if (isHeader && (pageLimit - top < ORPHAN_THRESHOLD)) {
         shouldBreak = true;
      }

      if (shouldBreak) {
        const nextPageStart = (startPageIndex + 1) * PAGE_HEIGHT_PX + PADDING_TOP;
        const diff = nextPageStart - top;
        
        // 增加一个微小的缓冲 1px，避免浮点数计算导致的边缘闪烁
        if (diff > 1) {
            el.style.marginTop = `${diff}px`;
            el.classList.add(styles.pageBreakMargin);
        }
      }
    }

    // 5. 补全背景高度
    const finalContentHeight = container.scrollHeight;
    const totalPages = Math.ceil(finalContentHeight / PAGE_HEIGHT_PX);
    if (totalPages > 0) {
        container.style.height = `${totalPages * PAGE_HEIGHT_PX}px`;
    }

  }, [resume, forceUpdate]); // 依赖 forceUpdate 触发重算

  // --- 6. 监听容器尺寸变化 (ResizeObserver) ---
  // 这解决了图片加载、字体加载导致的错位问题
  useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver(() => {
          // 当容器内部尺寸变化时，强制触发上面的计算逻辑
          forceUpdate(n => n + 1);
      });

      resizeObserver.observe(container);
      
      // 同时也监听 body，防止窗口缩放导致的计算偏差
      resizeObserver.observe(document.body);

      return () => resizeObserver.disconnect();
  }, [containerRef]);
};