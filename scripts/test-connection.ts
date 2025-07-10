import { connectToDatabase, disconnectFromDatabase } from '../lib/database';

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    
    // Test connection
    await connectToDatabase();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test basic operations
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections in database`);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach((collection: any) => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Test database stats
    const stats = await db.stats();
    console.log(`💾 Database size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📄 Total documents: ${stats.objects}`);
    
    await disconnectFromDatabase();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        console.error('🌐 Network error: Cannot reach MongoDB Atlas. Check your internet connection.');
      } else if (error.message.includes('authentication failed')) {
        console.error('🔐 Authentication error: Check your MongoDB credentials.');
      } else if (error.message.includes('timeout')) {
        console.error('⏰ Connection timeout: MongoDB Atlas might be unreachable.');
      } else {
        console.error('🔧 Error details:', error.message);
      }
    }
    
    process.exit(1);
  }
}

testConnection();