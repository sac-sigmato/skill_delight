import { NextRequest } from 'next/server';
import { connectToDatabase, Course, CourseSlot, Enrollment, Transaction, Notification } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const enrollmentSchema = z.object({
  courseId: z.string(),
  slotId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { courseId, slotId } = enrollmentSchema.parse(body);

    await connectToDatabase();

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return createErrorResponse('Course not found', 404);
    }

    // Check if slot exists and is available
    const slot = await CourseSlot.findById(slotId);

    if (!slot || slot.courseId.toString() !== courseId) {
      return createErrorResponse('Slot not found', 404);
    }

    if (!slot.available || slot.enrolledStudents >= slot.maxStudents) {
      return createErrorResponse('Slot is not available', 400);
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: user.id,
      courseId
    });

    if (existingEnrollment) {
      return createErrorResponse('Already enrolled in this course', 400);
    }

    // Create enrollment
    const enrollment = new Enrollment({
      userId: user.id,
      courseId,
      slotId
    });

    const savedEnrollment = await enrollment.save();

    // Update slot enrolled students count
    await CourseSlot.findByIdAndUpdate(slotId, {
      $inc: { enrolledStudents: 1 }
    });

    // Update course students count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { studentsCount: 1 }
    });

    // Create transaction record
    const transaction = new Transaction({
      userId: user.id,
      courseId,
      amount: course.price,
      status: 'completed'
    });
    await transaction.save();

    // Create notification
    const notification = new Notification({
      type: 'new_enrollment',
      message: `New enrollment: ${course.title} - $${course.price}`
    });
    await notification.save();

    return createResponse({
      ...savedEnrollment.toObject(),
      id: savedEnrollment._id.toString()
    }, 201);

  } catch (error) {
    console.error('Enrollment error:', error);
    if (error instanceof z.ZodError) {
      return createErrorResponse(error.errors[0].message, 400);
    }
    return createErrorResponse('Internal server error', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    await connectToDatabase();

    // Get user enrollments with populated course and slot data
    const enrollments = await Enrollment.find({ userId: user.id })
      .populate('courseId', 'title instructor')
      .populate('slotId', 'date time')
      .sort({ enrolledAt: -1 });

    const processedEnrollments = enrollments.map(enrollment => ({
      ...enrollment.toObject(),
      id: enrollment._id.toString(),
      course_title: enrollment.courseId.title,
      instructor: enrollment.courseId.instructor,
      next_class_date: enrollment.slotId.date,
      next_class_time: enrollment.slotId.time
    }));

    return createResponse(processedEnrollments);

  } catch (error) {
    console.error('Get enrollments error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}