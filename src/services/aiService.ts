// src/services/aiService.ts

const API_KEY = import.meta.env.VITE_ALI_API_KEY; 

const API_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"; 

interface AIResponse {
  content: string;
  error?: string;
}

/**
 * 通用的 AI 请求发送器
 */
async function sendRequest(messages: any[], temperature = 0.7): Promise<AIResponse> {
  if (!API_KEY || API_KEY.includes("你的")) {
    return { content: "", error: "请配置阿里云 API Key" };
  }

  try {
    console.log("Sending AI Request");
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-plus", 
        messages: messages,
        temperature: temperature,
        stream: false
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `请求失败: ${response.status}`);
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };

  } catch (err: any) {
    console.error("AI Service Error:", err);
    return { content: "", error: err.message || "网络请求异常" };
  }
}

// --- 具体的业务能力 ---

/**
 * 能力 1: 文本润色 (Prompt 针对千问优化)
 */
export const polishText = async (originalText: string): Promise<AIResponse> => {
  const prompt = `
    你是一位专业的简历优化专家。请对用户提供的工作经历描述进行润色。

    【严格遵守以下规则】
    1. **格式保持**：如果原文是列表（有多行），请务必返回 HTML 的 <ul><li>...</li></ul> 格式；如果原文是段落，返回 <p>...</p>。不要返回 Markdown。
    2. **拒绝造假**：严禁编造原文中不存在的数值（如 "提升了50%"、"99.9%可用性"）。如果原文没有数据，就通过使用更专业的动词（如"主导"、"构建"、"优化"）来提升专业度，而不是编造数据。
    3. **STAR法则**：在不改变原意的前提下，优化语言表达，使其更符合 STAR 法则 (情境-任务-行动-结果)。
    4. **精简**：去除口语化表达，保持职业化。

    【待优化文本】
    ${originalText}
  `;

  return sendRequest([
    { role: "system", content: "你是一个严谨的简历优化助手。只润色，不造假。" },
    { role: "user", content: prompt }
  ], 0.4);
};