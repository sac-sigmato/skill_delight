import { NextRequest } from 'next/server';
import { connectToDatabase, Notification } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';


export async function GET(request: NextRequest) {
  try {
    // 🔌 Connect to DB
    await connectToDatabase();

    // 📬 Fetch all notifications (limit to 50, newest first)
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    // 🧾 Process for response
    const processedNotifications = notifications.map(notification => ({
      ...notification.toObject(),
      id: notification._id.toString()
    }));

    return createResponse(processedNotifications);

  } catch (error) {
    console.error('❌ Get notifications error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}


export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { notificationId } = body;

    await connectToDatabase();

    // Mark notification as read
    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return createResponse({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Update notification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}