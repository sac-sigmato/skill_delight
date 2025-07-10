import { NextRequest } from 'next/server';
import { connectToDatabase, User, Course, CourseSlot, Notification, Transaction, Enrollment } from '@/lib/database';
import { hashPassword } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Ensure clean connection
    await connectToDatabase();
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data with proper error handling
    console.log('🧹 Clearing existing data...');
    try {
      await Promise.all([
        User.deleteMany({}),
        Course.deleteMany({}),
        CourseSlot.deleteMany({}),
        Notification.deleteMany({}),
        Transaction.deleteMany({}),
        Enrollment.deleteMany({})
      ]);
      console.log('✅ Existing data cleared');
    } catch (clearError) {
      console.log('⚠️ No existing data to clear or clear operation failed:', clearError);
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await hashPassword('admin123');
    const adminUser = new User({
      email: 'admin@skilldelight.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin'
    });
    const savedAdmin = await adminUser.save();
    console.log('✅ Admin user created');

    // Create sample students
    console.log('👥 Creating sample students...');
    const studentPassword = await hashPassword('student123');
    const students = [
      { email: 'john.doe@example.com', name: 'John Doe' },
      { email: 'jane.smith@example.com', name: 'Jane Smith' },
      { email: 'mike.johnson@example.com', name: 'Mike Johnson' },
      { email: 'sarah.wilson@example.com', name: 'Sarah Wilson' },
      { email: 'david.brown@example.com', name: 'David Brown' }
    ];

    const savedStudents = [];
    for (const studentData of students) {
      const student = new User({
        email: studentData.email,
        password: studentPassword,
        name: studentData.name,
        role: 'student'
      });
      const savedStudent = await student.save();
      savedStudents.push(savedStudent);
    }
    console.log(`✅ Created ${savedStudents.length} sample students`);

    // Create sample courses
    console.log('📚 Creating sample courses...');
    const courses = [
      {
        title: 'Full Stack Web Development',
        description: 'Master modern web development with React, Node.js, and MongoDB. Build production-ready applications.',
        fullDescription: 'This comprehensive course will take you from beginner to advanced full-stack developer. You\'ll learn the most in-demand technologies including React, Node.js, Express, MongoDB, and more. Through hands-on projects and real-world examples, you\'ll build a complete understanding of modern web development.',
        instructor: 'John Smith',
        duration: '12 weeks',
        price: 299,
        category: 'Programming',
        level: 'Intermediate',
        image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'active',
        studentsCount: 234,
        rating: 4.8,
        curriculum: [
          'HTML5 & CSS3 Fundamentals',
          'JavaScript ES6+ Features',
          'React.js & Component Architecture',
          'State Management with Redux',
          'Node.js & Express.js',
          'MongoDB & Database Design',
          'Authentication & Security',
          'Deployment & DevOps',
          'Testing & Quality Assurance',
          'Final Project Development'
        ],
        requirements: [
          'Basic understanding of HTML and CSS',
          'Familiarity with programming concepts',
          'A computer with internet connection',
          'Willingness to learn and practice'
        ],
        learningOutcomes: [
          'Build full-stack web applications',
          'Master React.js and modern JavaScript',
          'Create RESTful APIs with Node.js',
          'Design and implement databases',
          'Deploy applications to production',
          'Implement authentication and security',
          'Write clean, maintainable code',
          'Use version control with Git'
        ]
      },
      {
        title: 'Data Science & Machine Learning',
        description: 'Learn Python, pandas, scikit-learn, and deep learning. Analyze data and build predictive models.',
        fullDescription: 'Dive deep into the world of data science and machine learning. This course covers everything from data analysis and visualization to building sophisticated machine learning models. You\'ll work with real datasets and learn to extract meaningful insights from data.',
        instructor: 'Sarah Johnson',
        duration: '16 weeks',
        price: 399,
        category: 'Data Science',
        level: 'Advanced',
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'active',
        studentsCount: 189,
        rating: 4.9,
        curriculum: [
          'Python for Data Science',
          'NumPy & Pandas',
          'Data Visualization with Matplotlib & Seaborn',
          'Statistical Analysis',
          'Machine Learning Fundamentals',
          'Supervised Learning Algorithms',
          'Unsupervised Learning',
          'Deep Learning with TensorFlow',
          'Natural Language Processing',
          'Capstone Project'
        ],
        requirements: [
          'Basic Python programming knowledge',
          'Understanding of mathematics and statistics',
          'Experience with data analysis is helpful',
          'Jupyter Notebook setup'
        ],
        learningOutcomes: [
          'Analyze and visualize complex datasets',
          'Build machine learning models',
          'Implement deep learning algorithms',
          'Process and analyze text data',
          'Create predictive models',
          'Deploy ML models to production',
          'Work with big data tools',
          'Apply statistical methods'
        ]
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'Master digital marketing strategies, SEO, social media, and analytics to grow your business online.',
        fullDescription: 'This comprehensive digital marketing course will teach you everything you need to know to succeed in the digital landscape. From SEO and content marketing to social media advertising and analytics, you\'ll learn proven strategies that drive real results.',
        instructor: 'Michael Chen',
        duration: '10 weeks',
        price: 249,
        category: 'Marketing',
        level: 'Beginner',
        image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'active',
        studentsCount: 156,
        rating: 4.7,
        curriculum: [
          'Digital Marketing Fundamentals',
          'Search Engine Optimization (SEO)',
          'Content Marketing Strategy',
          'Social Media Marketing',
          'Pay-Per-Click Advertising (PPC)',
          'Email Marketing Campaigns',
          'Analytics & Data Interpretation',
          'Conversion Rate Optimization',
          'Marketing Automation',
          'Campaign Planning & Execution'
        ],
        requirements: [
          'Basic computer skills',
          'Understanding of business concepts',
          'Access to social media platforms',
          'Willingness to experiment and learn'
        ],
        learningOutcomes: [
          'Develop comprehensive marketing strategies',
          'Optimize websites for search engines',
          'Create engaging content that converts',
          'Run effective social media campaigns',
          'Analyze marketing performance data',
          'Build automated marketing funnels',
          'Increase website conversion rates',
          'Manage advertising budgets effectively'
        ]
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn user interface and user experience design principles. Create beautiful, functional designs.',
        fullDescription: 'Master the art and science of UI/UX design in this comprehensive course. You\'ll learn design thinking, user research, wireframing, prototyping, and how to create interfaces that users love. Perfect for aspiring designers and developers who want to improve their design skills.',
        instructor: 'Emily Rodriguez',
        duration: '8 weeks',
        price: 199,
        category: 'Design',
        level: 'Beginner',
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'active',
        studentsCount: 203,
        rating: 4.6,
        curriculum: [
          'Design Thinking & Process',
          'User Research & Personas',
          'Information Architecture',
          'Wireframing & Sketching',
          'Visual Design Principles',
          'Color Theory & Typography',
          'Prototyping with Figma',
          'Usability Testing',
          'Responsive Design',
          'Portfolio Development'
        ],
        requirements: [
          'No prior design experience needed',
          'Computer with internet access',
          'Figma account (free)',
          'Creative mindset and attention to detail'
        ],
        learningOutcomes: [
          'Apply design thinking methodology',
          'Conduct user research and testing',
          'Create wireframes and prototypes',
          'Design beautiful user interfaces',
          'Understand color and typography',
          'Build responsive designs',
          'Use Figma professionally',
          'Develop a design portfolio'
        ]
      },
      {
        title: 'Python Programming for Beginners',
        description: 'Start your programming journey with Python. Learn fundamentals and build real projects.',
        fullDescription: 'Perfect for complete beginners, this course will teach you Python programming from scratch. You\'ll learn the fundamentals of programming, work with data, and build practical projects that demonstrate your skills.',
        instructor: 'Alex Thompson',
        duration: '6 weeks',
        price: 149,
        category: 'Programming',
        level: 'Beginner',
        image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'active',
        studentsCount: 312,
        rating: 4.5,
        curriculum: [
          'Python Basics & Syntax',
          'Variables & Data Types',
          'Control Structures',
          'Functions & Modules',
          'File Handling',
          'Error Handling',
          'Object-Oriented Programming',
          'Working with APIs',
          'Final Project'
        ],
        requirements: [
          'No programming experience required',
          'Computer with Python installed',
          'Enthusiasm to learn'
        ],
        learningOutcomes: [
          'Write Python programs confidently',
          'Understand programming fundamentals',
          'Work with files and data',
          'Build practical applications',
          'Debug and troubleshoot code'
        ]
      },
      {
        title: 'Business Analytics with Excel',
        description: 'Master Excel for business analysis, data visualization, and reporting.',
        fullDescription: 'Learn advanced Excel techniques for business analytics. This course covers data analysis, visualization, pivot tables, formulas, and automation to help you make data-driven business decisions.',
        instructor: 'Lisa Wang',
        duration: '4 weeks',
        price: 99,
        category: 'Business',
        level: 'Intermediate',
        image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'active',
        studentsCount: 87,
        rating: 4.4,
        curriculum: [
          'Excel Fundamentals Review',
          'Advanced Formulas & Functions',
          'Data Analysis Tools',
          'Pivot Tables & Charts',
          'Data Visualization',
          'Automation with Macros',
          'Business Reporting',
          'Dashboard Creation'
        ],
        requirements: [
          'Basic Excel knowledge',
          'Microsoft Excel installed',
          'Business context understanding'
        ],
        learningOutcomes: [
          'Perform complex data analysis',
          'Create professional reports',
          'Build interactive dashboards',
          'Automate repetitive tasks',
          'Make data-driven decisions'
        ]
      }
    ];

    const savedCourses = [];
    for (let i = 0; i < courses.length; i++) {
      const courseData = courses[i];
      console.log(`Creating course ${i + 1}/${courses.length}: ${courseData.title}`);
      const course = new Course(courseData);
      const savedCourse = await course.save();
      savedCourses.push(savedCourse);
    }
    console.log(`✅ Created ${savedCourses.length} sample courses`);

    // Create course slots
    console.log('📅 Creating course slots...');
    const slotsData = [
      // Full Stack Web Development slots
      { courseIndex: 0, date: '2025-01-15', time: '10:00 AM - 12:00 PM', available: true },
      { courseIndex: 0, date: '2025-01-22', time: '2:00 PM - 4:00 PM', available: true },
      { courseIndex: 0, date: '2025-01-29', time: '10:00 AM - 12:00 PM', available: false },
      { courseIndex: 0, date: '2025-02-05', time: '3:00 PM - 5:00 PM', available: true },

      // Data Science & ML slots
      { courseIndex: 1, date: '2025-01-20', time: '9:00 AM - 11:00 AM', available: true },
      { courseIndex: 1, date: '2025-01-27', time: '3:00 PM - 5:00 PM', available: false },
      { courseIndex: 1, date: '2025-02-03', time: '1:00 PM - 3:00 PM', available: true },

      // Digital Marketing slots
      { courseIndex: 2, date: '2025-01-18', time: '11:00 AM - 1:00 PM', available: true },
      { courseIndex: 2, date: '2025-01-25', time: '4:00 PM - 6:00 PM', available: true },
      { courseIndex: 2, date: '2025-02-01', time: '2:00 PM - 4:00 PM', available: true },
      { courseIndex: 2, date: '2025-02-08', time: '10:00 AM - 12:00 PM', available: false },

      // UI/UX Design slots
      { courseIndex: 3, date: '2025-01-16', time: '1:00 PM - 3:00 PM', available: true },
      { courseIndex: 3, date: '2025-01-23', time: '10:00 AM - 12:00 PM', available: true },
      { courseIndex: 3, date: '2025-01-30', time: '3:00 PM - 5:00 PM', available: false },
      { courseIndex: 3, date: '2025-02-06', time: '11:00 AM - 1:00 PM', available: true },

      // Python Programming slots
      { courseIndex: 4, date: '2025-01-17', time: '9:00 AM - 11:00 AM', available: true },
      { courseIndex: 4, date: '2025-01-24', time: '2:00 PM - 4:00 PM', available: true },
      { courseIndex: 4, date: '2025-01-31', time: '10:00 AM - 12:00 PM', available: true },

      // Business Analytics slots
      { courseIndex: 5, date: '2025-02-10', time: '1:00 PM - 3:00 PM', available: true },
      { courseIndex: 5, date: '2025-02-17', time: '3:00 PM - 5:00 PM', available: true }
    ];

    const savedSlots = [];
    for (let i = 0; i < slotsData.length; i++) {
      const slotData = slotsData[i];
      console.log(`Creating slot ${i + 1}/${slotsData.length}`);
      const slot = new CourseSlot({
        courseId: savedCourses[slotData.courseIndex]._id,
        date: slotData.date,
        time: slotData.time,
        available: slotData.available,
        maxStudents: 20,
        enrolledStudents: slotData.available ? Math.floor(Math.random() * 15) : 20
      });
      const savedSlot = await slot.save();
      savedSlots.push(savedSlot);
    }
    console.log(`✅ Created ${savedSlots.length} course slots`);

    // Create sample enrollments
    console.log('📝 Creating sample enrollments...');
    const enrollments = [
      { studentIndex: 0, courseIndex: 0, slotIndex: 0, status: 'active', progress: 65 },
      { studentIndex: 0, courseIndex: 2, slotIndex: 7, status: 'completed', progress: 100 },
      { studentIndex: 1, courseIndex: 1, slotIndex: 4, status: 'active', progress: 30 },
      { studentIndex: 1, courseIndex: 3, slotIndex: 11, status: 'active', progress: 45 },
      { studentIndex: 2, courseIndex: 4, slotIndex: 14, status: 'active', progress: 80 },
      { studentIndex: 3, courseIndex: 0, slotIndex: 1, status: 'active', progress: 25 },
      { studentIndex: 4, courseIndex: 2, slotIndex: 8, status: 'completed', progress: 100 }
    ];

    const savedEnrollments = [];
    for (let i = 0; i < enrollments.length; i++) {
      const enrollmentData = enrollments[i];
      console.log(`Creating enrollment ${i + 1}/${enrollments.length}`);
      const enrollment = new Enrollment({
        userId: savedStudents[enrollmentData.studentIndex]._id,
        courseId: savedCourses[enrollmentData.courseIndex]._id,
        slotId: savedSlots[enrollmentData.slotIndex]._id,
        status: enrollmentData.status,
        progress: enrollmentData.progress
      });
      const savedEnrollment = await enrollment.save();
      savedEnrollments.push(savedEnrollment);
    }
    console.log(`✅ Created ${savedEnrollments.length} sample enrollments`);

    // Create sample transactions
    console.log('💳 Creating sample transactions...');
    const transactions = [
      { studentIndex: 0, courseIndex: 0, amount: 299, status: 'completed' },
      { studentIndex: 0, courseIndex: 2, amount: 249, status: 'completed' },
      { studentIndex: 1, courseIndex: 1, amount: 399, status: 'completed' },
      { studentIndex: 1, courseIndex: 3, amount: 199, status: 'completed' },
      { studentIndex: 2, courseIndex: 4, amount: 149, status: 'completed' },
      { studentIndex: 3, courseIndex: 0, amount: 299, status: 'completed' },
      { studentIndex: 4, courseIndex: 2, amount: 249, status: 'completed' }
    ];

    const savedTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      const transactionData = transactions[i];
      console.log(`Creating transaction ${i + 1}/${transactions.length}`);
      const transaction = new Transaction({
        userId: savedStudents[transactionData.studentIndex]._id,
        courseId: savedCourses[transactionData.courseIndex]._id,
        amount: transactionData.amount,
        status: transactionData.status,
        paymentMethod: 'credit_card'
      });
      const savedTransaction = await transaction.save();
      savedTransactions.push(savedTransaction);
    }
    console.log(`✅ Created ${savedTransactions.length} sample transactions`);

    // Create sample notifications
    console.log('🔔 Creating sample notifications...');
    const notifications = [
      {
        type: 'new_enrollment',
        message: 'New enrollment: Full Stack Web Development - $299',
        read: false
      },
      {
        type: 'course_added',
        message: 'New course added: Business Analytics with Excel',
        read: false
      },
      {
        type: 'slot_created',
        message: 'New slot added to Python Programming: 2025-01-17 at 9:00 AM - 11:00 AM',
        read: true
      },
      {
        type: 'new_enrollment',
        message: 'New enrollment: Data Science & Machine Learning - $399',
        read: false
      },
      {
        type: 'course_completed',
        message: 'Student completed: Digital Marketing Mastery',
        read: true
      }
    ];

    const savedNotifications = [];
    for (let i = 0; i < notifications.length; i++) {
      const notificationData = notifications[i];
      console.log(`Creating notification ${i + 1}/${notifications.length}`);
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();
      savedNotifications.push(savedNotification);
    }
    console.log(`✅ Created ${savedNotifications.length} sample notifications`);

    const summary = {
      message: 'Database seeding completed successfully!',
      data: {
        users: savedStudents.length + 1,
        courses: savedCourses.length,
        slots: savedSlots.length,
        enrollments: savedEnrollments.length,
        transactions: savedTransactions.length,
        notifications: savedNotifications.length
      },
      credentials: {
        admin: {
          email: 'admin@skilldelight.com',
          password: 'admin123'
        },
        student: {
          email: 'john.doe@example.com',
          password: 'student123'
        }
      }
    };

    console.log('🎉 Database seeding completed successfully!');
    return createResponse(summary, 201);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return createErrorResponse('Database seeding failed: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}