import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { z } from 'zod';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vitacare-local-secret-39fn3f9jn3fn');

const profileSchema = z.object({
  age: z.coerce.number().positive().optional().nullable(),
  gender: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  weight: z.coerce.number().optional().nullable(),
  height: z.coerce.number().optional().nullable(),
  allergies: z.string().optional().nullable(),
  conditions: z.string().optional().nullable(),
  emergencyName: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function POST(req) {
  try {
    const token = (await cookies()).get('vitacare_session')?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const { payload } = await jwtVerify(token, SECRET);

    const body = await req.json();
    const validatedData = profileSchema.parse(body);
    
    // Check if substantial fields are provided to mark it as completed
    const isCompleted = !!(validatedData.age && validatedData.bloodGroup && validatedData.gender && validatedData.emergencyName);

    const profile = await prisma.profile.upsert({
      where: { userId: payload.userId },
      update: { ...validatedData, completed: isCompleted },
      create: { ...validatedData, userId: payload.userId, completed: isCompleted }
    });

    return successResponse(profile);
  } catch (err) {
    if (err instanceof z.ZodError) return errorResponse(err.errors[0].message, 400);
    return errorResponse(err.message, 500);
  }
}

export async function GET(req) {
  try {
    const token = (await cookies()).get('vitacare_session')?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const { payload } = await jwtVerify(token, SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true }
    });
    
    return successResponse(user);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
