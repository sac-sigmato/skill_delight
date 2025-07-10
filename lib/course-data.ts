export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  image: string;
  category: string;
  level: string;
  fullDescription: string;
  curriculum: string[];
  requirements: string[];
  whatYouLearn: string[];
  slots: {
    id: string;
    date: string;
    time: string;
    available: boolean;
  }[];
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Full Stack Web Development',
    description: 'Master modern web development with React, Node.js, and MongoDB. Build production-ready applications.',
    fullDescription: 'This comprehensive course will take you from beginner to advanced full-stack developer. You\'ll learn the most in-demand technologies including React, Node.js, Express, MongoDB, and more. Through hands-on projects and real-world examples, you\'ll build a complete understanding of modern web development.',
    instructor: 'John Smith',
    duration: '12 weeks',
    students: 234,
    rating: 4.8,
    price: 299,
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Programming',
    level: 'Intermediate',
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
    whatYouLearn: [
      'Build full-stack web applications',
      'Master React.js and modern JavaScript',
      'Create RESTful APIs with Node.js',
      'Design and implement databases',
      'Deploy applications to production',
      'Implement authentication and security',
      'Write clean, maintainable code',
      'Use version control with Git'
    ],
    slots: [
      { id: '1', date: '2025-01-15', time: '10:00 AM - 12:00 PM', available: true },
      { id: '2', date: '2025-01-22', time: '2:00 PM - 4:00 PM', available: true },
      { id: '3', date: '2025-01-29', time: '10:00 AM - 12:00 PM', available: false },
      { id: '4', date: '2025-02-05', time: '3:00 PM - 5:00 PM', available: true },
    ]
  },
  {
    id: '2',
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, pandas, scikit-learn, and deep learning. Analyze data and build predictive models.',
    fullDescription: 'Dive deep into the world of data science and machine learning. This course covers everything from data analysis and visualization to building sophisticated machine learning models. You\'ll work with real datasets and learn to extract meaningful insights from data.',
    instructor: 'Sarah Johnson',
    duration: '16 weeks',
    students: 189,
    rating: 4.9,
    price: 399,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Data Science',
    level: 'Advanced',
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
    whatYouLearn: [
      'Analyze and visualize complex datasets',
      'Build machine learning models',
      'Implement deep learning algorithms',
      'Process and analyze text data',
      'Create predictive models',
      'Deploy ML models to production',
      'Work with big data tools',
      'Apply statistical methods'
    ],
    slots: [
      { id: '3', date: '2025-01-20', time: '9:00 AM - 11:00 AM', available: true },
      { id: '4', date: '2025-01-27', time: '3:00 PM - 5:00 PM', available: false },
      { id: '5', date: '2025-02-03', time: '1:00 PM - 3:00 PM', available: true },
    ]
  },
  {
    id: '3',
    title: 'Digital Marketing Mastery',
    description: 'Master digital marketing strategies, SEO, social media, and analytics to grow your business online.',
    fullDescription: 'This comprehensive digital marketing course will teach you everything you need to know to succeed in the digital landscape. From SEO and content marketing to social media advertising and analytics, you\'ll learn proven strategies that drive real results.',
    instructor: 'Michael Chen',
    duration: '10 weeks',
    students: 156,
    rating: 4.7,
    price: 249,
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Marketing',
    level: 'Beginner',
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
    whatYouLearn: [
      'Develop comprehensive marketing strategies',
      'Optimize websites for search engines',
      'Create engaging content that converts',
      'Run effective social media campaigns',
      'Analyze marketing performance data',
      'Build automated marketing funnels',
      'Increase website conversion rates',
      'Manage advertising budgets effectively'
    ],
    slots: [
      { id: '6', date: '2025-01-18', time: '11:00 AM - 1:00 PM', available: true },
      { id: '7', date: '2025-01-25', time: '4:00 PM - 6:00 PM', available: true },
      { id: '8', date: '2025-02-01', time: '2:00 PM - 4:00 PM', available: true },
      { id: '9', date: '2025-02-08', time: '10:00 AM - 12:00 PM', available: false },
    ]
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn user interface and user experience design principles. Create beautiful, functional designs.',
    fullDescription: 'Master the art and science of UI/UX design in this comprehensive course. You\'ll learn design thinking, user research, wireframing, prototyping, and how to create interfaces that users love. Perfect for aspiring designers and developers who want to improve their design skills.',
    instructor: 'Emily Rodriguez',
    duration: '8 weeks',
    students: 203,
    rating: 4.6,
    price: 199,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Design',
    level: 'Beginner',
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
    whatYouLearn: [
      'Apply design thinking methodology',
      'Conduct user research and testing',
      'Create wireframes and prototypes',
      'Design beautiful user interfaces',
      'Understand color and typography',
      'Build responsive designs',
      'Use Figma professionally',
      'Develop a design portfolio'
    ],
    slots: [
      { id: '10', date: '2025-01-16', time: '1:00 PM - 3:00 PM', available: true },
      { id: '11', date: '2025-01-23', time: '10:00 AM - 12:00 PM', available: true },
      { id: '12', date: '2025-01-30', time: '3:00 PM - 5:00 PM', available: false },
      { id: '13', date: '2025-02-06', time: '11:00 AM - 1:00 PM', available: true },
    ]
  }
];