import { GoogleGenAI, Type } from '@google/genai';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vitacare-local-secret-39fn3f9jn3fn');

async function getUserContext() {
  const token = (await cookies()).get('vitacare_session')?.value;
  if (!token) return null;
  const { payload } = await jwtVerify(token, SECRET);
  
  const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { 
          profile: true, 
          medicines: { where: { isActive: true } }, 
          reports: { orderBy: { createdAt: 'desc' }, take: 5 } 
      }
  });
  return user;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const user = await getUserContext();
    if (!user) return errorResponse("Unauthorized", 401);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return errorResponse("AI Engine Offline", 500);

    const ai = new GoogleGenAI({ apiKey });

    // Multi-Layer Context Aggregation
    const systemPrompt = `You are VitaCare AI, a world-class healthcare assistant. 
Mission: Increase health awareness, guide, clarify, and encourage timely action. Keep responses concise, practical, and calming.

USER CONTEXT:
Name: ${user.name || 'User'}
Language: ${user.language || 'English'}
Age: ${user.profile?.age || 'Unknown'} | Gender: ${user.profile?.gender || 'Unknown'} | Blood Group: ${user.profile?.bloodGroup || 'Unknown'}
Medical Conditions: ${user.profile?.conditions || 'None explicitly documented'}
Allergies: ${user.profile?.allergies || 'None explicitly documented'}

Active Medicines: ${user.medicines.map(m => m.name + ' (' + m.dosage + ')').join(', ') || 'None'}
Recent Reports: ${user.reports.map(r => r.type + ': ' + r.title + (r.metadata ? ' ' + r.metadata : '')).join(' | ') || 'None'}

MULTI-LAYER CLINICAL RULES:
1. Question Limits: Never ask more than 3 questions in one round. DO NOT repeat previously answered questions in the chat history.
2. Triage Threshold: Track confidence score dynamically. If confidence > 75 and no red flags exist, STOP asking questions and move to GUIDANCE MODE.
3. Urgent Escalation: If urgent/red flags (chest pain, stroke signs, fainting, confusion, severe bleeding, extreme fever) appear, SKIP ALL QUESTIONS, set urgencyLevel='HIGH', escalateToDoctor=true, and advise IMMEDIATE medical care.
4. Guidance Output Structure: In GUIDANCE MODE, format your response strictly exactly like this:
   * Likely common causes
   * What to do now
   * What to monitor
   * When to see doctor
5. Context Validation: Explicitly align precautions based on their profiled Medical Conditions (e.g., advising sugar-checks for Diabetes).

OUTPUT STRICTLY CONFORMS TO THE JSON SCHEMA.
`;

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

    const chatHistory = data.history || [];
    
    // Formatting history for SDK
    let contents = chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    
    // Google Gemini API strictly requires conversational contents to natively start with 'user'
    if (contents.length > 0 && contents[0].role === 'model') {
        contents.shift(); 
    }

    contents.push({ role: 'user', parts: [{ text: data.message }] });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.3
        }
    });

    const parsed = JSON.parse(response.text);
    return successResponse(parsed);

  } catch(err) {
    console.error(err);
    if (err.message === 'Unauthorized') return errorResponse("Unauthorized", 401);
    
    // Rule-Based Safe Fallback
    const fallbackResponse = {
        responseText: "VitaCare is currently experiencing heavy network load formatting diagnostic insights safely. General Rule: Ensure you stay hydrated, rest comfortably, and closely monitor your specific symptoms. If you experience any critical warning signs—such as severe chest pain, breathing difficulties, or fainting—please seek immediate emergency medical care.",
        followUpQuestions: [],
        urgencyLevel: "MEDIUM",
        confidenceScore: 50,
        clarificationNeeded: false,
        escalateToDoctor: true
    };
    return successResponse(fallbackResponse);
  }
}
