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
    const reports = await prisma.report.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse simulated JSON blobs natively for the UI
    const decoded = reports.map(r => ({
      ...r,
      metadata: r.metadata ? JSON.parse(r.metadata) : null
    }));
    
    return successResponse(decoded);
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}

export async function POST(req) {
  try {
    const userId = await getUserId();
    const data = await req.json();
    if (!data.title || !data.type) return errorResponse("Missing required fields", 400);

    const report = await prisma.report.create({
      data: {
        userId,
        title: data.title,
        type: data.type,
        fileUrl: data.fileUrl || null,
        doctorName: data.doctorName || null,
        hospitalName: data.hospitalName || null,
        reportDate: data.reportDate || null,
        notes: data.notes || null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });
    
    return successResponse({ ...report, metadata: report.metadata ? JSON.parse(report.metadata) : null });
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}

export async function PUT(req) {
  try {
    const userId = await getUserId();
    const data = await req.json();
    
    const existing = await prisma.report.findFirst({ where: { id: data.id, userId } });
    if (!existing) return errorResponse("Not Found or Unauthorized", 404);

    const report = await prisma.report.update({
      where: { id: data.id },
      data: {
        title: data.title,
        type: data.type,
        fileUrl: data.fileUrl,
        doctorName: data.doctorName,
        hospitalName: data.hospitalName,
        reportDate: data.reportDate,
        notes: data.notes,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });
    
    return successResponse({ ...report, metadata: report.metadata ? JSON.parse(report.metadata) : null });
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}

export async function DELETE(req) {
  try {
    const userId = await getUserId();
    const data = await req.json();

    const existing = await prisma.report.findFirst({ where: { id: data.id, userId } });
    if (!existing) return errorResponse("Not Found or Unauthorized", 404);

    await prisma.report.delete({ where: { id: data.id } });
    return successResponse({ deleted: true });
  } catch(err) {
    return errorResponse(err.message, err.message === 'Unauthorized' ? 401 : 500);
  }
}
