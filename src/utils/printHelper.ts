export const printResumeContent = (contentId: string, documentTitle: string) => {
  // 1. 获取目标 DOM
  const element = document.getElementById(contentId);
  if (!element) {
    console.error(`未找到 ID 为 ${contentId} 的元素`);
    return;
  }

  // 2. 创建隐藏的 Iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  // 获取 Iframe 的 document 对象
  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // --- 开始构建 Iframe 内容 (使用 DOM API 替代 document.write) ---

  // 3. 设置标题
  doc.title = documentTitle;

  // 4. 智能收集并注入当前页面的样式
  // 我们不仅要收集全局样式，还要收集 CSS Modules 生成的样式
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      if (sheet.href) {
        // 外部样式表 (如 CDN 字体)：创建 <link> 标签
        const link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        doc.head.appendChild(link);
      } else {
        // 内部样式表 (Style 标签)：创建 <style> 标签
        // 注意：sheet.cssRules 可能因跨域报错，需要 try-catch
        const rules = Array.from(sheet.cssRules).map((rule) => rule.cssText).join('');
        const style = doc.createElement('style');
        style.textContent = rules;
        doc.head.appendChild(style);
      }
    } catch (e) {
      console.warn('读取样式表失败 (可能是跨域限制，不影响打印):', e);
    }
  });

  // 5. 注入打印专用重置样式
  const printStyle = doc.createElement('style');
  printStyle.textContent = `
    @page {
      size: A4;
      margin: 15mm;
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
    ::-webkit-scrollbar { display: none; }
  `;
  doc.head.appendChild(printStyle);

  // 6. 注入简历内容
  doc.body.innerHTML = element.outerHTML;

  // 7. 执行打印
  // 使用 setTimeout 确保图片和字体加载完成
  setTimeout(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
    
    // 可选：打印后移除 iframe (建议保留较长时间或不移除，以免打印对话框未出现就被销毁)
    // document.body.removeChild(iframe); 
  }, 500);
};