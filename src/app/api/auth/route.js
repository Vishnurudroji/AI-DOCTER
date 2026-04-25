import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vitacare-local-secret-39fn3f9jn3fn');

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();
    if (otp !== '1234') return errorResponse('Invalid OTP. Use 1234 for testing.', 401);

    let user = await prisma.user.findUnique({ where: { phoneNumber: phone } });
    
    // If new user or incomplete basic setup
    if (!user || !user.name || !user.language) {
      return successResponse({ isNew: true });
    }

    // Returning user with basic setup completed - directly issue JWT!
    const token = await issueSession(user);
    return successResponse({ isNew: false, user });

  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function PUT(req) {
  try {
    const { phone, otp, name, language } = await req.json();
    if (otp !== '1234') return errorResponse('Invalid Auth', 401);
    if (!name || name.trim().length < 2) return errorResponse('Valid name is required', 400);

    let user = await prisma.user.upsert({
      where: { phoneNumber: phone },
      update: { name, language: language || 'English' },
      create: { phoneNumber: phone, name, language: language || 'English' }
    });

    const token = await issueSession(user);
    return successResponse({ isNew: false, user });

  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('vitacare_session');
  return successResponse({ message: 'Logged out' });
}

async function issueSession(user) {
  const alg = 'HS256';
  const jwt = await new SignJWT({ userId: user.id, phone: user.phoneNumber, name: user.name })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set('vitacare_session', jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  return jwt;
}
