import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vitacare-local-secret-39fn3f9jn3fn');

async function getUserId() {
  const token = (await cookies()).get('vitacare_session')?.value;
  if (!token) throw new Error("Unauthorized");
  const { payload } = await jwtVerify(token, SECRET);
  return payload.userId;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const medicines = await prisma.medicine.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(medicines);
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}

export async function POST(req) {
  try {
    const userId = await getUserId();
    const data = await req.json();
    if (!data.name || !data.dosage || !data.timeOfDay) return errorResponse("Missing required fields", 400);

    const med = await prisma.medicine.create({
      data: {
        userId,
        name: data.name,
        dosage: data.dosage,
        time: data.time || "08:00 AM",
        timeOfDay: data.timeOfDay,
        frequency: data.frequency || "Once daily",
        daysLeft: data.daysLeft ? parseInt(data.daysLeft) : 30
      }
    });
    return successResponse(med);
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}

export async function PUT(req) {
  try {
    const userId = await getUserId();
    const data = await req.json();
    
    const existing = await prisma.medicine.findFirst({ where: { id: data.id, userId } });
    if (!existing) return errorResponse("Not Found or Unauthorized", 404);

    if (data.action === 'toggle') {
       const med = await prisma.medicine.update({
         where: { id: data.id },
         data: { isActive: !existing.isActive }
       });
       return successResponse(med);
    } 
    else if (data.action === 'update') {
       const med = await prisma.medicine.update({
         where: { id: data.id },
         data: {
           name: data.name,
           dosage: data.dosage,
           timeOfDay: data.timeOfDay,
           daysLeft: data.daysLeft ? parseInt(data.daysLeft) : existing.daysLeft,
           time: data.time || existing.time
         }
       });
       return successResponse(med);
    }
    else if (data.action === 'mark') {
       const med = await prisma.medicine.update({
         where: { id: data.id },
         data: { isMarked: data.isMarked }
       });
       return successResponse(med);
    }

    return errorResponse("Invalid action", 400);

  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(req) {
  try {
    const userId = await getUserId();
    const data = await req.json();

    const existing = await prisma.medicine.findFirst({ where: { id: data.id, userId } });
    if (!existing) return errorResponse("Not Found or Unauthorized", 404);

    await prisma.medicine.delete({ where: { id: data.id } });
    return successResponse({ deleted: true });
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}
