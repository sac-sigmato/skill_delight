import { NextRequest } from 'next/server';
import { connectToDatabase, Course, CourseSlot, Notification } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const createSlotSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  maxStudents: z.number().min(1).optional(),
});

export async function POST(
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
    const { date, time, maxStudents = 20 } = createSlotSchema.parse(body);

    await connectToDatabase();

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return createErrorResponse('Course not found', 404);
    }

    // Create slot
    const slot = new CourseSlot({
      courseId,
      date,
      time,
      maxStudents
    });

    const savedSlot = await slot.save();

    // Create notification
    const notification = new Notification({
      type: 'slot_created',
      message: `New slot added to ${course.title}: ${date} at ${time}`
    });
    await notification.save();

    return createResponse({
      ...savedSlot.toObject(),
      id: savedSlot._id.toString()
    }, 201);

  } catch (error) {
    console.error('Create slot error:', error);
    if (error instanceof z.ZodError) {
      return createErrorResponse(error.errors[0].message, 400);
    }
    return createErrorResponse('Internal server error', 500);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    await connectToDatabase();

    // Get slots for course
    const slots = await CourseSlot.find({ courseId }).sort({ date: 1, time: 1 });

    const processedSlots = slots.map(slot => ({
      ...slot.toObject(),
      id: slot._id.toString()
    }));

    return createResponse(processedSlots);

  } catch (error) {
    console.error('Get slots error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}