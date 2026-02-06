import { useLayoutEffect, useState, type RefObject } from 'react';
import styles from '@/components/Preview/ResumePreview.module.css';

export const usePreviewLayout = (
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  const [, forceUpdate] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getRelativeTop = (element: HTMLElement, container: HTMLElement): number => {
      const elRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return elRect.top - containerRect.top;
    };

    // --- 0. 准备工作 ---
    const measureDiv = document.createElement('div');
    measureDiv.style.height = '297mm';
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    document.body.appendChild(measureDiv);
    const PAGE_HEIGHT_PX = measureDiv.offsetHeight;
    document.body.removeChild(measureDiv);

    const mmToPx = PAGE_HEIGHT_PX / 297;
    const PADDING_TOP = 15 * mmToPx;
    // const PADDING_BOTTOM = 15 * mmToPx; 
    const VISUAL_GAP = 15 * mmToPx;
    const CONTENT_LIMIT = PAGE_HEIGHT_PX - 15 * mmToPx - VISUAL_GAP; // 简单复原之前的逻辑
    const ORPHAN_THRESHOLD = 30 * mmToPx;

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
      `.rich-text-content > div`
    ];

    const elements = Array.from(container.querySelectorAll<HTMLElement>(selectors.join(',')));

    // --- 3. 重置所有状态 ---
    elements.forEach(el => {
      el.style.marginTop = '';
      el.classList.remove(styles.pageBreakMargin);
    });
    container.querySelectorAll(`.${styles.pageBreakMargin}`).forEach((el: any) => {
      el.style.marginTop = '';
      el.classList.remove(styles.pageBreakMargin);
    });

    container.style.height = 'auto';

    // --- 4. 核心遍历计算 ---

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.offsetHeight === 0) continue;

      // [修改点 1] 使用 getRelativeTop 替代 offsetTop，并定义 top 变量
      const top = getRelativeTop(el, container);

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

        // [修改点 2] 增加阈值判定，防止微小浮动导致的无限抖动
        if (diff > 2) {
          el.style.marginTop = `${diff}px`;
          el.classList.add(styles.pageBreakMargin);
        }
      }
    }

    // [修改点 3] 优化高度设置，减少不必要的重绘
    const finalContentHeight = container.scrollHeight;
    const totalPages = Math.ceil(finalContentHeight / PAGE_HEIGHT_PX);
    if (totalPages > 0) {
      const targetHeight = `${totalPages * PAGE_HEIGHT_PX}px`;
      if (container.style.height !== targetHeight) {
        container.style.height = targetHeight;
      }
    }

    console.log('布局计算完成，触发更新');
  }); // 保持无依赖数组，确保每次 Render 都执行

  // --- 6. 监听容器尺寸变化 (ResizeObserver) ---
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // [修改点 4] 引入防抖逻辑，防止死循环
    let timeoutId: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let _entry of entries) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          forceUpdate(n => n + 1);
        }, 50); // 50ms 防抖
      }
    });

    resizeObserver.observe(container);
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId); // 清理定时器
    };
  }, [containerRef]);
};