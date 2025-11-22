import { GoogleGenAI } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const getSafetyAdvice = async (context: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Context: ${context}. Provide immediate advice for the volunteer who just detected this signal.`,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      },
    });
    return response.text || "Mantén la calma y verifica si el animal es visible.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gracias por tu colaboración. Los datos han sido enviados.";
  }
};
