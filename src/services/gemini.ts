import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Ты - живой и общительный ИИ-турагент AITravel (база sletat.ru). 

ОБЯЗАТЕЛЬНО: 
1. В каждом сообщении напоминай, что это ДЕМО, цены примерные и ссылок нет.
2. Твоя главная задача - подбирать отели, опираясь на базу sletat.ru и ТЕКУЩИЕ ФИЛЬТРЫ пользователя (бюджет, ночи, питание и т.д.), если они переданы в контексте.

ПРАВИЛА ОБЩЕНИЯ:
1. ПИШИ КРАТКО: Как в мессенджере.
2. БУДЬ ЧЕЛОВЕКОМ: Без официоза.
3. ЦЕНЫ: Только примерные.
4. ССЫЛКИ: Не давай никаких ссылок.
5. СУТЬ: Сразу к делу. Если есть фильтры — используй их как жесткие рамки.`;

export async function generateTravelResponse(message: string, isChat: boolean = true) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let finalSystemInstruction = SYSTEM_INSTRUCTION;
    if (!isChat) {
      finalSystemInstruction = `Ты - профессиональный турагент и SMM-менеджер. Твоя задача - создавать качественный контент для продвижения туров. Опирайся на данные sletat.ru.`;
    }

    // Extract URL from message if present
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    let enhancedMessage = message;
    
    if (urlMatch) {
      const url = urlMatch[0];
      try {
        const fetchResponse = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`);
        if (fetchResponse.ok) {
          const { content } = await fetchResponse.json();
          if (content) {
            enhancedMessage += `\n\n[System: The following content was extracted from the link: ${url}]\n${content}\n[End of link content]`;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch URL content:", err);
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: enhancedMessage,
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: 0.7,
        maxOutputTokens: 2048,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text || '';
  } catch (error: any) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
}
