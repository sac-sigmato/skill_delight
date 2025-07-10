import { connectToDatabase, User, Course, CourseSlot, Notification } from '../lib/database';
import { hashPassword } from '../lib/auth';

async function initDB() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Database connected successfully!');
    
    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@skilldelight.com' });
    if (!existingAdmin) {
      const adminPassword = await hashPassword('admin123');
      const adminUser = new User({
        email: 'admin@skilldelight.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created: admin@skilldelight.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create sample courses
    const courses = [
      {
        title: 'Full Stack Web Development',
        description: 'Master modern web development with React, Node.js, and MongoDB.',
        fullDescription: 'This comprehensive course will take you from beginner to advanced full-stack developer. You\'ll learn the most in-demand technologies including React, Node.js, Express, MongoDB, and more.',
        instructor: 'John Smith',
        duration: '12 weeks',
        price: 299,
        category: 'Programming',
        level: 'Intermediate',
        image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=500',
        status: 'active',
        curriculum: [
          'HTML5 & CSS3 Fundamentals',
          'JavaScript ES6+ Features',
          'React.js & Component Architecture',
          'State Management with Redux',
          'Node.js & Express.js',
          'MongoDB & Database Design',
          'Authentication & Security',
          'Deployment & DevOps'
        ],
        requirements: [
          'Basic understanding of HTML and CSS',
          'Familiarity with programming concepts',
          'A computer with internet connection'
        ],
        learningOutcomes: [
          'Build full-stack web applications',
          'Master React.js and modern JavaScript',
          'Create RESTful APIs with Node.js',
          'Design and implement databases'
        ]
      },
      {
        title: 'Data Science & Machine Learning',
        description: 'Learn Python, pandas, scikit-learn, and deep learning.',
        fullDescription: 'Dive deep into the world of data science and machine learning. This course covers everything from data analysis and visualization to building sophisticated machine learning models.',
        instructor: 'Sarah Johnson',
        duration: '16 weeks',
        price: 399,
        category: 'Data Science',
        level: 'Advanced',
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500',
        status: 'active',
        curriculum: [
          'Python for Data Science',
          'NumPy & Pandas',
          'Data Visualization',
          'Statistical Analysis',
          'Machine Learning Fundamentals',
          'Deep Learning with TensorFlow'
        ],
        requirements: [
          'Basic Python programming knowledge',
          'Understanding of mathematics and statistics',
          'Jupyter Notebook setup'
        ],
        learningOutcomes: [
          'Analyze and visualize complex datasets',
          'Build machine learning models',
          'Implement deep learning algorithms',
          'Create predictive models'
        ]
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'Complete guide to digital marketing including SEO, social media, content marketing, and analytics.',
        fullDescription: 'Master the art and science of digital marketing. Learn how to create effective marketing campaigns, optimize for search engines, and measure your success.',
        instructor: 'Michael Brown',
        duration: '8 weeks',
        price: 199,
        category: 'Marketing',
        level: 'Beginner',
        image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=500',
        status: 'active',
        curriculum: [
          'Digital Marketing Fundamentals',
          'Search Engine Optimization (SEO)',
          'Social Media Marketing',
          'Content Marketing Strategy',
          'Email Marketing',
          'Analytics and Measurement'
        ],
        requirements: [
          'Basic computer skills',
          'Understanding of social media platforms',
          'Willingness to learn'
        ],
        learningOutcomes: [
          'Create effective marketing campaigns',
          'Optimize websites for search engines',
          'Develop social media strategies',
          'Measure and analyze marketing performance'
        ]
      }
    ];
    
    for (const courseData of courses) {
      const existingCourse = await Course.findOne({ title: courseData.title });
      if (!existingCourse) {
        const course = new Course(courseData);
        const savedCourse = await course.save();
        
        // Add sample slots for each course
        const slots = [
          { courseId: savedCourse._id, date: '2025-01-15', time: '10:00 AM - 12:00 PM' },
          { courseId: savedCourse._id, date: '2025-01-22', time: '2:00 PM - 4:00 PM' },
          { courseId: savedCourse._id, date: '2025-01-29', time: '10:00 AM - 12:00 PM' }
        ];
        
        for (const slotData of slots) {
          const slot = new CourseSlot(slotData);
          await slot.save();
        }
        
        console.log(`Course created: ${courseData.title}`);
      } else {
        console.log(`Course already exists: ${courseData.title}`);
      }
    }
    
    console.log('Sample data initialization completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDB();