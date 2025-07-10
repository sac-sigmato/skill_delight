import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Course, CourseSlot } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  fullDescription: z.string().optional(),
  instructor: z.string().min(1, 'Instructor is required'),
  duration: z.string().min(1, 'Duration is required'),
  price: z.number().min(0, 'Price must be positive'),
  image: z.string().url().optional(),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  curriculum: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    console.log('📚 Fetching courses from database...');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status') || 'active';

    // Connect to database
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Build query
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    console.log('🔍 Query:', query);

    // Fetch courses from database
    const courses = await Course.find(query).sort({ createdAt: -1 });
    console.log(`📊 Found ${courses.length} courses in database`);

    // Get slots for each course
    const coursesWithSlots = await Promise.all(
      courses.map(async (course) => {
        try {
          const slots = await CourseSlot.find({ courseId: course._id });
          return {
            ...course.toObject(),
            id: course._id.toString(),
            students: course.studentsCount || 0,
            fullDescription: course.fullDescription || course.description,
            whatYouLearn: course.learningOutcomes || [],
            curriculum: course.curriculum || [],
            requirements: course.requirements || [],
            slots: slots.map(slot => ({
              id: slot._id.toString(),
              date: slot.date,
              time: slot.time,
              available: slot.available
            }))
          };
        } catch (slotError) {
          console.warn(`⚠️ Error fetching slots for course ${course._id}:`, slotError);
          return {
            ...course.toObject(),
            id: course._id.toString(),
            students: course.studentsCount || 0,
            fullDescription: course.fullDescription || course.description,
            whatYouLearn: course.learningOutcomes || [],
            curriculum: course.curriculum || [],
            requirements: course.requirements || [],
            slots: []
          };
        }
      })
    );

    console.log(`📤 Returning ${coursesWithSlots.length} courses`);
    return createResponse(coursesWithSlots);

  } catch (error) {
    console.error('❌ Get courses error:', error);
    return createErrorResponse('Failed to fetch courses from database', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const courseData = createCourseSchema.parse(body);

    await connectToDatabase();

    // Create course
    const course = new Course({
      ...courseData,
      fullDescription: courseData.fullDescription || courseData.description,
      image: courseData.image || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=500',
      status: 'draft',
      curriculum: courseData.curriculum || [],
      requirements: courseData.requirements || [],
      learningOutcomes: courseData.learningOutcomes || []
    });

    const savedCourse = await course.save();

    return createResponse({
      ...savedCourse.toObject(),
      id: savedCourse._id.toString()
    }, 201);

  } catch (error) {
    console.error('Create course error:', error);
    if (error instanceof z.ZodError) {
      return createErrorResponse(error.errors[0].message, 400);
    }
    return createErrorResponse('Internal server error', 500);
  }
}