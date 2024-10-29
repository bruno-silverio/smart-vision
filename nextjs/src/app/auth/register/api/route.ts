// the route is /api/auth/register
import { registerFormSchema } from '@/app/lib/validations/RegisterValidation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = registerFormSchema.parse(await request.json());
    return new NextResponse('It works');
  } catch (err: any) {
    return new NextResponse(err.message, { status: 400 });
  }
}