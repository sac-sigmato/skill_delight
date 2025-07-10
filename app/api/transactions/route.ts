import { NextRequest } from 'next/server';
import { connectToDatabase, Transaction, Course } from '@/lib/database';
import { createResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // 🔗 Connect to DB
    await connectToDatabase();

    // 🧾 Fetch all transactions
    const transactions = await Transaction.find()
      .populate('courseId', 'title')
      .sort({ transactionDate: -1 });

    // 📦 Format the response
    const processedTransactions = transactions.map(transaction => ({
      ...transaction.toObject(),
      id: transaction._id.toString(),
      course_title: transaction.courseId?.title || 'Unknown Course',
      date: transaction.transactionDate
    }));

    return createResponse(processedTransactions);

  } catch (error) {
    console.error('❌ Get transactions error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
