export async function onRequestGet(context) {
  // 环境变量通过 context.env 获取
  const apiKey = context.env.API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API_KEY not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const prompt = "Generate a unique, traditional Chinese Kau Cim (Fortune Stick) result. It should feel authentic, using Traditional Chinese characters. The poem should be poetic and cryptic, typical of temples. The interpretation should be helpful.";
  
  const schema = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING", description: "The lucky level of the lot, e.g., 上上簽, 中吉, 下下簽." },
      poem: { type: "ARRAY", items: { type: "STRING" }, description: "A 4-line traditional Chinese poem describing the fortune (Traditional Chinese characters)." },
      interpretation: { type: "STRING", description: "A detailed explanation of the poem and what it means for the future (Traditional Chinese)." },
      meaning: { type: "STRING", description: "A short summary for specific aspects like Wealth, Health, Love (e.g., '求財：得利 自身：平安')." }
    },
    required: ["title", "poem", "interpretation", "meaning"]
  };

  try {
    // 使用 gemini-2.0-flash-exp 模型，与之前的尝试保持一致，或者使用 stable 版本
    // 注意：原代码使用的是 'gemini-2.5-flash'，但该模型可能未公开或名字有误，通常是 1.5-flash 或 2.0-flash-exp
    // 这里我们使用 gemini-1.5-flash 或 gemini-2.0-flash-exp。为了稳妥，先用 gemini-1.5-flash，或者如果用户之前用的是 2.5 (可能笔误)，我们尝试纠正。
    // 之前的 service/index.js 用的是 'gemini-2.5-flash'，这看起来像是一个笔误或者非常新的模型。
    // 标准的目前是 gemini-1.5-flash。我会使用 gemini-1.5-flash 以确保稳定，或者保持用户意图。
    // 让我们检查一下 service/index.js 里的模型名称。
    // service/index.js: model: 'gemini-2.5-flash'
    // 假设用户有权限访问这个模型，或者这是一个笔误。
    // 为了确保能跑通，我建议使用 'gemini-1.5-flash'，它是目前最常用的。
    // 但如果用户坚持要 2.5，我可以保留。不过 Cloudflare fetch URL 需要准确。
    // 让我们使用 'gemini-1.5-flash' 作为默认，因为它更通用。
    
    const model = 'gemini-2.5-flash'; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 1.2
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // 解析 Gemini 返回的 JSON 结构
    // 结构通常是 candidates[0].content.parts[0].text
    let fortuneText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!fortuneText) {
      throw new Error("No content generated");
    }

    // 确保返回的是纯 JSON
    // 有时候模型可能会包裹在 ```json ... ``` 中，虽然 responseMimeType 设为 json 应该避免这种情况，但做个清理更安全
    fortuneText = fortuneText.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    return new Response(fortuneText, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate fortune", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
