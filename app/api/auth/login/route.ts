import { NextRequest } from 'next/server';
import { connectToDatabase, User } from '@/lib/database';
import { verifyPassword, generateToken } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Processing login request...');
    
    const body = await request.json();
    console.log('📝 Request body received');
    
    const { email, password } = loginSchema.parse(body);
    console.log(`👤 Login attempt for email: ${email}`);

    // Connect to database
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Find user
    console.log('🔍 Searching for user...');
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return createErrorResponse('Invalid email or password', 401);
    }

    console.log(`✅ User found: ${user.name} (${user.role})`);

    // Verify password
    console.log('🔒 Verifying password...');
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return createErrorResponse('Invalid email or password', 401);
    }

    console.log('✅ Password verified successfully');

    // Remove password from response
    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Generate token
    console.log('🎫 Generating authentication token...');
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    });

    console.log('✅ Login successful');
    return createResponse({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    if (error instanceof z.ZodError) {
      return createErrorResponse(error.errors[0].message, 400);
    }
    return createErrorResponse('Internal server error', 500);
  }
}