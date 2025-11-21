import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Fortune } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const drawFortune = async (): Promise<Fortune> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The lucky level of the lot, e.g., 上上簽, 中吉, 下下簽.",
      },
      poem: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A 4-line traditional Chinese poem describing the fortune (Traditional Chinese characters).",
      },
      interpretation: {
        type: Type.STRING,
        description: "A detailed explanation of the poem and what it means for the future (Traditional Chinese).",
      },
      meaning: {
        type: Type.STRING,
        description: "A short summary for specific aspects like Wealth, Health, Love (e.g., '求財：得利 自身：平安').",
      },
    },
    required: ["title", "poem", "interpretation", "meaning"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a unique, traditional Chinese Kau Cim (Fortune Stick) result. It should feel authentic, using Traditional Chinese characters. The poem should be poetic and cryptic, typical of temples. The interpretation should be helpful.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 1.2, // High temperature for variety
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Fortune;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error generating fortune:", error);
    // Fallback in case of API error to avoid breaking the UI
    return {
      title: "中平簽",
      poem: ["雲開見月正分明", "不須進退問前程", "婚姻皆由天註定", "且把心頭事安寧"],
      interpretation: "此卦雲開見月之象。凡事守舊則吉。",
      meaning: "家宅：祈福。 自身：安。 求財：守待。",
    };
  }
};
