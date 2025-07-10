import { NextRequest } from 'next/server';
import { connectToDatabase, Course, CourseSlot } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';
import mongoose from 'mongoose';

// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    console.log(`🔍 Fetching course details for ID: ${courseId}`);

    // Connect to database
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully');

    let course = null;

    // Check if the ID is a valid MongoDB ObjectId
    if (isValidObjectId(courseId)) {
      console.log('📝 Valid MongoDB ObjectId detected, searching database...');
      
      // Get course from database using ObjectId
      course = await Course.findById(courseId);
    } else {
      console.log('📝 Not a valid MongoDB ObjectId, searching by other criteria...');
      
      // Try to find by title or other fields if it's not a valid ObjectId
      // This could be useful for URL-friendly slugs in the future
      course = await Course.findOne({
        $or: [
          { title: { $regex: courseId, $options: 'i' } },
          { _id: courseId } // Just in case
        ]
      });
    }

    if (!course) {
      console.log(`❌ Course with ID ${courseId} not found in database`);
      return createErrorResponse('Course not found', 404);
    }

    console.log(`📚 Found course in database: ${course.title}`);
    
    // Get slots for the course
    const slots = await CourseSlot.find({ courseId: course._id });

    const processedCourse = {
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

    console.log(`📤 Returning course: ${processedCourse.title}`);
    return createResponse(processedCourse);

  } catch (error) {
    console.error('❌ Get course error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 401);
    }

    const courseId = params.id;
    const body = await request.json();

    await connectToDatabase();

    // Check if course exists
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return createErrorResponse('Course not found', 404);
    }

    // Update course
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.instructor) updateData.instructor = body.instructor;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.status) updateData.status = body.status;
    updateData.updatedAt = new Date();

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return createResponse(updatedCourse);

  } catch (error) {
    console.error('Update course error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 401);
    }

    const courseId = params.id;

    await connectToDatabase();

    // Check if course exists
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return createErrorResponse('Course not found', 404);
    }

    // Delete course and related data
    await Course.findByIdAndDelete(courseId);
    await CourseSlot.deleteMany({ courseId });

    return createResponse({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Delete course error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}