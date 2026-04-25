import { GoogleGenAI, Type } from '@google/genai';

console.log('SDK Loaded. Type:', typeof Type);

try {
  const ai = new GoogleGenAI({ apiKey: 'fake_key' });
  console.log('AI Instance created.');
  
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
  
  console.log('Schema valid:', responseSchema);
} catch (err) {
  console.error("CRITICAL SDK ERROR:", err);
}
