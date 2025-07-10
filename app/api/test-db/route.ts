import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { createResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await connectToDatabase();
    console.log('✅ Database connection successful');
    
    // Test if we can access the database
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections`);
    
    // Get database stats
    const stats = await db.stats();
    
    return createResponse({
      status: 'connected',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      stats: {
        collections: stats.collections,
        objects: stats.objects,
        dataSize: stats.dataSize
      }
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return createErrorResponse('Database test failed: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}