import { NextRequest } from 'next/server';
import { connectToDatabase, User, Notification } from '@/lib/database';
import { hashPassword, generateToken } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Processing registration request...');
    
    const body = await request.json();
    console.log('📋 Request body received');
    
    const { name, email, password } = registerSchema.parse(body);
    console.log(`👤 Registration attempt for: ${name} (${email})`);

    // Connect to database
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      console.log('❌ User already exists');
      return createErrorResponse('User already exists with this email', 409);
    }

    console.log('✅ Email is available');

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('✅ Password hashed successfully');

    // Create user
    console.log('👤 Creating new user...');
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'student'
    });

    const savedUser = await user.save();
    console.log(`✅ User created successfully with ID: ${savedUser._id}`);

    // Remove password from response
    const userWithoutPassword = {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    };

    // Generate token
    console.log('🎫 Generating authentication token...');
    const token = generateToken({
      id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role
    });

    // Create notification for admin
    try {
      console.log('🔔 Creating admin notification...');
      const notification = new Notification({
        type: 'new_registration',
        message: `New user registered: ${name} (${email})`
      });
      await notification.save();
      console.log('✅ Admin notification created');
    } catch (notifError) {
      console.warn('⚠️ Failed to create admin notification:', notifError);
      // Don't fail registration if notification fails
    }

    console.log('✅ Registration completed successfully');
    return createResponse({
      user: userWithoutPassword,
      token
    }, 201);

  } catch (error) {
    console.error('❌ Registration error:', error);
    if (error instanceof z.ZodError) {
      return createErrorResponse(error.errors[0].message, 400);
    }
    return createErrorResponse('Internal server error', 500);
  }
}