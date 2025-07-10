// app/api/students/route.ts

import { NextRequest } from 'next/server';
import { connectToDatabase, User } from '@/lib/database';
import { createResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const students = await User.find({ role: 'student' })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    const formatted = students.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      joined: user.createdAt,
    }));

    return createResponse(formatted);
  } catch (error) {
    console.error('❌ Failed to fetch students:', error);
    return createErrorResponse('Failed to fetch students', 500);
  }
}
