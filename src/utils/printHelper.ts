// 为了获取 CSS Modules 编译后的哈希类名
import styles from '@/components/Preview/ResumePreview.module.css';

export const printResumeContent = (contentId: string, documentTitle: string) => {
  // 1. 获取目标 DOM
  const element = document.getElementById(contentId);
  if (!element) {
    console.error(`未找到 ID 为 ${contentId} 的元素`);
    return;
  }

  const originalTitle = document.title;
  document.title = documentTitle;

  // 2. 创建隐藏的 Iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // 3. 设置标题
  doc.title = documentTitle;

  // 4. 智能收集并注入当前页面的样式
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      if (sheet.href) {
        const link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        doc.head.appendChild(link);
      } else {
        const rules = Array.from(sheet.cssRules).map((rule) => rule.cssText).join('');
        const style = doc.createElement('style');
        style.textContent = rules;
        doc.head.appendChild(style);
      }
    } catch (e) {
      console.warn('样式读取受限:', e);
    }
  });

  // 获取 CSS Modules 编译后的真实类名
  // 防止样式文件没加载导致 undefined，做个兜底
  const pageBreakClass = styles.pageBreakMargin || 'pageBreakMargin';
  const paperClass = styles.paper || 'paper';

  const printStyle = doc.createElement('style');
  printStyle.textContent = `
    /* A. 设置纸张与基础环境 (核心修改点) */
    @page {
      size: A4;
      margin: 15mm !important; 
    }
    
    body {
      margin: 0;
      padding: 0;
      background-color: white;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* B. 重置 .paper 容器 */
    .${paperClass} {
      margin: 0 !important;
      padding: 0 !important; 
      
      width: 100% !important;
      height: auto !important;
      box-shadow: none !important;
      border: none !important;
      background: white !important;
      display: block !important;
    }

    /* C. 处理分页断点 */
    .${pageBreakClass} {
      margin-top: 0 !important; 
      padding-top: 0 !important;
      
      break-before: page !important;
      page-break-before: always !important;
      
      display: block !important;
      visibility: visible !important;
    }

    /* D. 辅助优化 */
    li, p, div {
      break-inside: auto; 
    }
    ::-webkit-scrollbar { display: none; }
  `;
  doc.head.appendChild(printStyle);

  // 6. 注入简历内容
  doc.body.innerHTML = element.outerHTML;

  // 7. 执行打印
  setTimeout(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
    setTimeout(() => {
      document.title = originalTitle;
      document.body.removeChild(iframe);
    }, 100);
  }, 500);
};