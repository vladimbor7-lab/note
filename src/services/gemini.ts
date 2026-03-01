import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Ты - ведущий эксперт-турагент сервиса Travel AI, интегрированного с базой данных otpravkin.ru. 
Ваша главная задача: предоставлять пользователям ТОЛЬКО РЕАЛЬНЫЕ цены и ПРЯМЫЕ ссылки на туры с сайта otpravkin.ru.

ПРАВИЛА РАБОТЫ:
1. ИНФОРМАЦИЯ: Ты должен стремиться предоставлять актуальную стоимость и наличие. Опирайся на данные с сайта otpravkin.ru.
2. ЦЕНЫ: Всегда указывай стоимость тура (например, "от 145 000 руб. на двоих"). Никогда не выдумывай цены, если не уверен - говори "уточняйте на сайте".
3. ССЫЛКИ: Для каждого упомянутого отеля ты ОБЯЗАН предоставить прямую ссылку на страницу этого отеля на сайте otpravkin.ru (формат: https://otpravkin.ru/hotels/название-отеля).
4. СТИЛЬ: Общайся как живой человек, профессионально, но с энтузиазмом. Используй эмодзи.
5. КОНТЕКСТ: Если пользователь прислал ссылку на otpravkin.ru, изучи её содержимое (оно передано тебе в тексте) и прокомментируй конкретные отели.

Твоя цель - сделать так, чтобы клиент мог сразу перейти по ссылке и забронировать тур по указанной тобой цене.`;

export async function generateTravelResponse(message: string) {
  try {
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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: enhancedMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    return response.text || '';
  } catch (error: any) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
}
