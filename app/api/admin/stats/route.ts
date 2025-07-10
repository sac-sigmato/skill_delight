import { NextRequest } from 'next/server';
import { connectToDatabase, User, Course, Enrollment, Transaction } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 401);
    }

    await connectToDatabase();

    // Get total courses
    const totalCourses = await Course.countDocuments();

    // Get total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get total revenue
    const revenueResult = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get total enrollments
    const totalEnrollments = await Enrollment.countDocuments();

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = await Enrollment.countDocuments({
      enrolledAt: { $gte: thirtyDaysAgo }
    });

    // Calculate growth percentage (simplified)
    const growthPercentage = totalEnrollments > 0 ? Math.round((recentEnrollments / totalEnrollments) * 100) : 0;

    const stats = {
      totalCourses,
      totalStudents,
      totalRevenue,
      totalEnrollments,
      growthPercentage
    };

    return createResponse(stats);

  } catch (error) {
    console.error('Get admin stats error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}