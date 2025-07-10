'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Star, BookOpen, ArrowLeft, Calendar, CheckCircle, Play, Award, Target, User } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  image: string;
  category: string;
  level: string;
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

interface CourseDetailsClientProps {
  courseId: string;
}

export default function CourseDetailsClient({ courseId }: CourseDetailsClientProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log("Fetching course details...");
    
    fetchCourse();
    checkUserAuth();
  }, [courseId]);

  const checkUserAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.id && parsedUser.name && parsedUser.email) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error checking user auth:', error);
    }
  };

  const fetchCourse = async () => {
    try {
      console.log(`🔍 Fetching course details for ID: ${courseId}`);
      
      const response = await fetch(`/api/courses/${courseId}`);
      console.log('📡 Course API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Course API response data:', data);
        
        if (data && data.data) {
          setCourse(data.data);
          console.log('✅ Course loaded successfully:', data.data.title);
        } else {
          console.error('❌ Invalid course data received');
        }
      } else {
        console.error('❌ Failed to fetch course');
      }
    } catch (error) {
      console.error('❌ Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };


const handleEnrollment = () => {
  try {
    console.log("Handling enrollment...");

    if (!selectedSlot) {
      console.log("Please select a time slot before enrolling.");
      toast.error("Please select a time slot before enrolling.");
      return;
    }

    if (!course) {
      console.log("Course information is not available.");
      toast.error("Course information is not available.");
      return;
    }

    if (!user) {
      console.log("User not authenticated. Redirecting to login...");

      const enrollmentIntent = {
        courseId: course.id,
        courseTitle: course.title,
        slotId: selectedSlot,
        price: course.price,
        returnUrl: `/courses/${course.id}`,
      };

      localStorage.setItem(
        "enrollmentIntent",
        JSON.stringify(enrollmentIntent)
      );
      toast("Redirecting to login...");
      router.push("/auth/login?redirect=enrollment");

      return;
    }

    // All validations passed
    toast.success("Enrollment successful! Redirecting to payment...");

    const enrollmentData = {
      courseId: course.id,
      courseTitle: course.title,
      slotId: selectedSlot,
      price: course.price,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("pendingEnrollment", JSON.stringify(enrollmentData));
    router.push("/payment");
  } catch (error) {
    console.error("Error handling enrollment:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Skill Delight
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">{user.name || "User"}</span>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline">{course.category || "General"}</Badge>
                <Badge variant="secondary">{course.level || "Beginner"}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title || "Untitled Course"}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {course.description || "No description available"}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating || 0}</span>
                  <span>({course.students || 0} students)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration || "Duration not specified"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>by {course.instructor || "Unknown Instructor"}</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="mb-8">
              <img
                src={
                  course.image ||
                  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=500"
                }
                alt={course.title || "Course image"}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* About This Course */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  About This Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {course.fullDescription ||
                    course.description ||
                    "No detailed description available"}
                </p>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(course.whatYouLearn || []).map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {item || "Learning outcome"}
                      </span>
                    </div>
                  ))}
                  {(!course.whatYouLearn ||
                    course.whatYouLearn.length === 0) && (
                    <p className="text-gray-500 col-span-2">
                      Learning outcomes not specified
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(course.curriculum || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">
                        {item || "Curriculum item"}
                      </span>
                    </div>
                  ))}
                  {(!course.curriculum || course.curriculum.length === 0) && (
                    <p className="text-gray-500">Curriculum not specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(course.requirements || []).map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        {req || "Requirement"}
                      </span>
                    </li>
                  ))}
                  {(!course.requirements ||
                    course.requirements.length === 0) && (
                    <p className="text-gray-500">No specific requirements</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${course.price || 0}
                </div>
                <CardDescription>
                  One-time payment for lifetime access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Authentication Notice */}
                {!user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Account Required
                      </span>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">
                      You need to create an account or sign in to enroll in this
                      course.
                    </p>
                    <div className="flex space-x-2">
                      <Link href="/auth/login" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register" className="flex-1">
                        <Button size="sm" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Available Slots */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Available Time Slots
                  </h3>
                  <div className="space-y-2">
                    {(course.slots || []).map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          !slot.available
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                            : selectedSlot === slot.id
                            ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() =>
                          slot.available && setSelectedSlot(slot.id)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {slot.date
                                ? new Date(slot.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )
                                : "Date not specified"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {slot.time || "Time not specified"}
                            </div>
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded ${
                              slot.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slot.available ? "Available" : "Full"}
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!course.slots || course.slots.length === 0) && (
                      <p className="text-gray-500 text-sm">
                        No time slots available
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Enroll Button */}
                <Button
                  className={cn(
                    "w-full mb-4",
                    !selectedSlot && "opacity-70 cursor-not-allowed"
                  )}
                  size="lg"
                  onClick={handleEnrollment}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {user ? "Enroll Now" : "Sign In to Enroll"}
                </Button>

                <div className="text-center text-sm text-gray-500 mb-4">
                  30-day money-back guarantee
                </div>

                {/* Course Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Play className="h-4 w-4 text-gray-400" />
                    <span>Live interactive sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Small class sizes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}