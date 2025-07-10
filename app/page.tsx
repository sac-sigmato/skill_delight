'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, BookOpen, ArrowRight, Play, Calendar, Award } from 'lucide-react';
import CoursesSection from '@/components/courses/coursesSection';
import Logo from "./logo.png";

interface Course {
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
  slots: {
    id: string;
    date: string;
    time: string;
    available: boolean;
  }[];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('🔄 Fetching courses from API...');
      
      const response = await fetch('/api/courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 API Response data:', data);
      
      if (data && data.data && Array.isArray(data.data)) {
        setCourses(data.data);
        console.log(`✅ Successfully loaded ${data.data.length} courses`);
      } else if (data && Array.isArray(data)) {
        setCourses(data);
        console.log(`✅ Successfully loaded ${data.length} courses (direct array)`);
      } else {
        console.warn('⚠️ Unexpected data format:', data);
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      setError(error instanceof Error ? error.message : 'Failed to load courses');
      
      // Set empty array to show "no courses" message instead of loading forever
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', 'Programming', 'Data Science', 'Marketing', 'Design', 'Business'];
  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById('schedule-section');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {/* <BookOpen className="h-8 w-8 text-blue-600" /> */}
              <img className="w-24 h-12" src="./logo.png" alt="" />
              {/* <span className="text-2xl font-bold text-gray-900">
                Skill Delight
              </span> */}
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <button
                onClick={scrollToCourses}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Explore
              </button>
              <button
                onClick={scrollToSchedule}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Schedule
              </button>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Signup</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
            alt="Students learning online"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-teal-50/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master New Skills with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              {" "}
              Expert-Led{" "}
            </span>
            Online Courses
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners in live, interactive online classes.
            Learn from industry experts, get hands-on experience, and advance
            your career with our comprehensive courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={scrollToCourses}
            >
              <Play className="mr-2 h-5 w-5" />
              Explore Courses
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToSchedule}>
              <Calendar className="mr-2 h-5 w-5" />
              View Schedule
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
              <div className="text-gray-600">Course Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
      <CoursesSection />

      {/* Courses Section */}
      {/* <section id="courses-section" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed to help you achieve your career goals
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Courses</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchCourses} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={course.image || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=500'} 
                      alt={course.title || 'Course image'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {course.level || 'Beginner'}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-600 text-white">
                        ${course.price || 0}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category || 'General'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating || 0}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {course.title || 'Untitled Course'}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {course.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration || 'Duration not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students || 0}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      by <span className="font-medium">{course.instructor || 'Unknown Instructor'}</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full group">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedCategory === 'All' 
                    ? 'No courses are currently available. Please check back later.' 
                    : `No courses found in the ${selectedCategory} category.`
                  }
                </p>
                {selectedCategory !== 'All' && (
                  <Button onClick={() => setSelectedCategory('All')} variant="outline">
                    View All Courses
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section> */}

      {/* Schedule Section */}
      <section id="schedule-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Schedule
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              View all upcoming course sessions and find the perfect time for
              your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    {course.title || "Untitled Course"}
                  </CardTitle>
                  <CardDescription>
                    with {course.instructor || "Unknown Instructor"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Available Sessions:</span>
                      <Badge variant="outline">
                        {course.slots?.filter((s) => s.available).length || 0}
                      </Badge>
                    </div>

                    {course.slots
                      ?.filter((slot) => slot.available)
                      .slice(0, 2)
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {slot.date
                                ? new Date(slot.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "Date TBD"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {slot.time || "Time TBD"}
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                      ))}

                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outline" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        View All Sessions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Skill Delight?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We provide the best learning experience with industry experts and
              modern technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Live Interactive Classes
              </h3>
              <p className="text-gray-300">
                Join live sessions with expert instructors and interact with
                fellow learners in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Experts</h3>
              <p className="text-gray-300">
                Learn from professionals who have real-world experience in their
                respective fields.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Flexible Scheduling
              </h3>
              <p className="text-gray-300">
                Choose from multiple time slots that fit your schedule and
                learning preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Skill Delight</span> */}
                <img className="w-24 h-12 bg-white" src="./logo.png" alt="" />
              </div>
              <p className="text-gray-300 mb-4">
                Empowering learners worldwide with expert-led online courses and
                interactive learning experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={scrollToCourses}
                    className="hover:text-white transition-colors"
                  >
                    All Courses
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("Programming");
                      scrollToCourses();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Programming
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("Design");
                      scrollToCourses();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Design
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("Marketing");
                      scrollToCourses();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Marketing
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <p className="text-gray-300 mb-2">Email: info@skilldelight.com</p>
              <p className="text-gray-300 mb-2">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-300">Mon-Fri: 9AM-6PM EST</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Skill Delight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}