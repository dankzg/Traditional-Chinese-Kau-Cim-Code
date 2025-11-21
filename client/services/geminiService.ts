import { Fortune } from '../types';

// When deployed on Cloudflare Pages, the functions are served at the same origin.
// Locally, if using 'npm run dev' (Vite), you might need to configure a proxy or use 'wrangler pages dev'.
// For simplicity in production, relative path works best.
const API_URL = '/api/fortune';

export const drawFortune = async (): Promise<Fortune> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Fortune;
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
