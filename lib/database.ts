import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'student', enum: ['student', 'admin', 'instructor'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  status: { type: String, default: 'draft', enum: ['draft', 'active', 'archived'] },
  studentsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  curriculum: [{ type: String }],
  requirements: [{ type: String }],
  learningOutcomes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Course Slot Schema
const courseSlotSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  available: { type: Boolean, default: true },
  maxStudents: { type: Number, default: 20 },
  enrolledStudents: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSlot', required: true },
  status: { type: String, default: 'active', enum: ['active', 'completed', 'cancelled'] },
  progress: { type: Number, default: 0 },
  enrolledAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'completed', enum: ['pending', 'completed', 'failed', 'refunded'] },
  paymentMethod: { type: String },
  transactionDate: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export const CourseSlot = mongoose.models.CourseSlot || mongoose.model('CourseSlot', courseSlotSchema);
export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// Database connection with improved state management
let isConnected = false;

export async function connectToDatabase() {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If connection is in progress, wait for it
  if (mongoose.connection.readyState === 2) {
    while (mongoose.connection.readyState === 2) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return mongoose;
    }
  }

  try {
    // Disconnect if in a bad state
    if (mongoose.connection.readyState === 3) {
      await mongoose.disconnect();
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    };

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string, opts);
    
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
    
    return mongoose;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (!isConnected || mongoose.connection.readyState === 0) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}

// Initialize database with sample data
export async function initializeDatabase() {
  await connectToDatabase();
  console.log('Database connection established');
}