import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an advanced AI Medical Monitor system named "HepaGuard" in a Hepatologist clinic.
Your role is to monitor patient flow and assist medical staff.
The clinic flow is: Entrance -> Telemedicine -> Waiting -> Nurse Station -> Hepatologist -> Monitoring.
Current Status:
- Waiting Room: Moderate load
- Doctor: In session
- Telemedicine: Active

Answer questions about the clinic status, patient flow, or general hepatology terms briefly and professionally.
Keep answers under 50 words.
`;

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // We construct a history for context, but for simplicity in this stateless service,
    // we will just prompt with the context. In a real app, use ai.chats.create
    
    // Construct the full prompt context from history
    const conversationHistory = history.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nChat History:\n${conversationHistory}\nUser: ${newMessage}\nAI:`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return response.text || "I'm processing the data stream, please wait.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Alert: Connection to AI Core unstable. Please retry.";
  }
};
