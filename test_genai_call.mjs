import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('NO API KEY FOUND IN .env');
      return;
    }
    
    console.log('Initializing GoogleGenAI');
    const ai = new GoogleGenAI({ apiKey });
    
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        responseText: { type: Type.STRING },
        followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        urgencyLevel: { type: Type.STRING },
        confidenceScore: { type: Type.INTEGER },
        clarificationNeeded: { type: Type.BOOLEAN },
        escalateToDoctor: { type: Type.BOOLEAN }
      },
      required: ['responseText', 'urgencyLevel', 'confidenceScore', 'clarificationNeeded', 'escalateToDoctor']
    };

    console.log('Sending hit to gemini-2.5-flash...');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: "Hello" }] }],
        config: {
            systemInstruction: "You are a test bot.",
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.3
        }
    });

    console.log('Response returned!');
    console.log('Text getter:', typeof response.text);
    console.log('Text contents:', response.text);
  } catch(e) {
    console.error("SDK EXCEPTION THROWN:");
    console.error(e.message);
    console.error(e.stack);
  }
}
run();
