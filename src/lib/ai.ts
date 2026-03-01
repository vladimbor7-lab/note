import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const structureNote = async (content: string): Promise<string> => {
  const model = "gemini-flash-latest";
  const prompt = `
    You are an expert editor and structurer. 
    Take the following unstructured text (stream of consciousness) and convert it into clean, organized Markdown.
    - Use headers (#, ##, ###) for main topics.
    - Use bullet points for lists.
    - Use bold for key terms.
    - Fix grammar and spelling errors.
    - Keep the tone professional but retain the original meaning.
    - Do NOT add any conversational filler ("Here is the structured text..."). Just output the Markdown.

    Text:
    ${content}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || content;
};

export const autoTagNote = async (content: string): Promise<string[]> => {
  const model = "gemini-flash-latest";
  const prompt = `
    Analyze the following text and suggest 3-5 relevant tags.
    Output ONLY a JSON array of strings. Example: ["work", "ideas", "urgent"]
    Do not output Markdown formatting like \`\`\`json.

    Text:
    ${content}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  try {
    const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text || "[]");
  } catch (e) {
    console.error("Failed to parse tags", e);
    return [];
  }
};

export const processVoiceNote = async (audioBase64: string): Promise<{ text: string; actionItems: string[]; summary: string }> => {
  const model = "gemini-flash-latest";
  
  const prompt = `
    Listen to this audio.
    1. Transcribe it fully, but format it as clean Markdown (use headers, bullet points where appropriate).
    2. Extract a concise Summary.
    3. Extract a list of Action Items (if any).
    
    Output ONLY valid JSON with this structure:
    {
      "text": "Structured transcription here...",
      "summary": "Concise summary...",
      "actionItems": ["Item 1", "Item 2"]
    }
    Do not use Markdown formatting for the JSON itself.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "audio/mp3",
            data: audioBase64
          }
        },
        { text: prompt }
      ]
    }
  });

  try {
    const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text || "{}");
  } catch (e) {
    console.error("Failed to parse voice response", e);
    return { text: "", summary: "", actionItems: [] };
  }
};

export const findRelatedNotes = async (currentNote: string, otherNotes: {id: string, title: string, content: string}[]): Promise<string[]> => {
    // Simple implementation: Ask Gemini to pick from the list
    // In a real app with thousands of notes, we'd use embeddings.
    // For < 50 notes, this context window approach works fine.
    
    if (otherNotes.length === 0) return [];

    const model = "gemini-flash-latest";
    const notesContext = otherNotes.map(n => `ID: ${n.id}\nTitle: ${n.title}\nContent Preview: ${n.content.slice(0, 200)}...`).join("\n---\n");

    const prompt = `
      I am writing a new note:
      "${currentNote}"

      Here is a list of my existing notes:
      ${notesContext}

      Identify up to 3 existing notes that are semantically related to my new note.
      Return ONLY a JSON array of their IDs. Example: ["id1", "id2"]
      If none are related, return [].
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    try {
        const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text || "[]");
    } catch (e) {
        console.error("Failed to parse related notes", e);
        return [];
    }
}
