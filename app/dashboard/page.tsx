"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Clock,
  Play,
  Settings,
  LogOut,
  User,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Enrollment {
  id: string;
  courseTitle: string;
  course_title: string;
  courseId: { _id: string; title: string }; // updated
  instructor: string;
  next_class_date: string;
  next_class_time: string;
  progress: number;
  status: "active" | "completed" | "pending";
  enrolledAt: string;
  nextClass: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchEnrollments();
  }, [router]);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        router.push("/auth/login");
        return;
      }

      const parsedUser = JSON.parse(userData);

      if (!parsedUser.id || !parsedUser.name || !parsedUser.email) {
        console.warn("Invalid user data structure, redirecting to login");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  };

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setEnrollments(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const activeCourses = enrollments.filter((e) => e.status === "active") || [];
  const completedCourses =
    enrollments.filter((e) => e.status === "completed") || [];

  const averageProgress =
    activeCourses.length > 0
      ? Math.round(
          activeCourses.reduce((acc, e) => acc + (e.progress || 0), 0) /
            activeCourses.length
        )
      : 0;

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
              <span className="text-gray-600">
                Welcome, {user.name || "User"}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Link href="/">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Track your learning progress and manage your courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Courses
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {activeCourses.length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedCourses.length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Progress
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {averageProgress}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Hours Learned
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {activeCourses.length * 10 + completedCourses.length * 20}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Active Courses */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Active Courses
              </h2>
              {activeCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((enrollment) => (
                    <Card
                      key={enrollment.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {enrollment.course_title || "Unknown Course"}
                        </CardTitle>
                        <CardDescription>
                          by {enrollment.instructor || "Unknown Instructor"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{enrollment.progress || 0}%</span>
                            </div>
                            <Progress
                              value={enrollment.progress || 0}
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Next Class:</span>
                            <span>
                              {enrollment.next_class_date
                                ? new Date(
                                    enrollment.next_class_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <Play className="mr-2 h-4 w-4" />
                              Continue
                            </Button>
                            <Link href={`/courses/${enrollment.courseId._id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Active Courses
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You haven't enrolled in any courses yet.
                    </p>
                    <Link href="/">
                      <Button>Browse Courses</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Completed Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((enrollment) => (
                    <Card
                      key={enrollment.id}
                      className="border-green-200 bg-green-50"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {enrollment.course_title || "Unknown Course"}
                          </CardTitle>
                          <Badge className="bg-green-600">Completed</Badge>
                        </div>
                        <CardDescription>
                          by {enrollment.instructor || "Unknown Instructor"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Completed:</span>
                            <span>
                              {enrollment.enrolledAt
                                ? new Date(
                                    enrollment.enrolledAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            variant="outline"
                          >
                            <Award className="mr-2 h-4 w-4" />
                            View Certificate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Upcoming Classes
            </h2>
            {activeCourses.length > 0 ? (
              <div className="space-y-4">
                {activeCourses.map((enrollment) => (
                  <Card key={enrollment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {enrollment.course_title || "Unknown Course"}
                          </h3>
                          <p className="text-gray-600">
                            with {enrollment.instructor || "Unknown Instructor"}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {enrollment.next_class_date
                                ? new Date(
                                    enrollment.next_class_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                            <Clock className="h-4 w-4 ml-4" />
                            <div>
                              <span>
                                {enrollment.next_class_time
                                  ? enrollment.next_class_time.split(" - ")[0]
                                  : "N/A"}
                              </span>
                              -
                              <span>
                                {enrollment.next_class_time
                                  ? enrollment.next_class_time.split(" - ")[1]
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button>Join Class</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Upcoming Classes
                  </h3>
                  <p className="text-gray-600">
                    You don't have any scheduled classes.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="text-lg">{user.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-lg">{user.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Account Type
                  </label>
                  <Badge variant="outline" className="ml-2">
                    Student
                  </Badge>
                </div>
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
