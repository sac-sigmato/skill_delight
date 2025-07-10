"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import StudentList from "@/components/courses/studentList";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  students: number;
  price: number;
  status: "active" | "draft" | "archived";
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  slots: {
    id: string;
    date: string;
    time: string;
    available: boolean;
  }[];
}

interface Transaction {
  id: string;
  course_title: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  createdAt: string;
  read: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [selectedCourseForSlot, setSelectedCourseForSlot] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    price: "",
    category: "",
    level: "",
    duration: "",
    image: "",
  });

  const [newSlot, setNewSlot] = useState({
    date: "",
    time: "",
    available: true,
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [router]);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        router.push("/auth/login");
        return;
      }

      const parsedUser = JSON.parse(userData);

      if (!parsedUser.role || parsedUser.role !== "admin") {
        console.warn("User is not an admin, redirecting to dashboard");
        router.push("/dashboard");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/auth/login");
    }
  };

  const fetchData = async () => {
    try {
      // Fetch courses from API
      const coursesResponse = await fetch("/api/courses");
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log("coursesData", coursesData);
        if (coursesData && coursesData.data) {
          setCourses(coursesData.data);
        }
      }

      // Fetch transactions from API
      const transactionsResponse = await fetch("/api/transactions");
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        if (transactionsData && transactionsData.data) {
          setTransactions(transactionsData.data);
        }
      }

      // Fetch notifications from API
      const notificationsResponse = await fetch("/api/notifications");
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        if (notificationsData && notificationsData.data) {
          setNotifications(notificationsData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (response.ok) {
        const updatedNotifications = notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        instructor: newCourse.instructor,
        price: parseInt(newCourse.price) || 0,
        category: newCourse.category,
        level: newCourse.level,
        duration: newCourse.duration,
        image:
          newCourse.image ||
          "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=500",
      };

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setCourses([...courses, data.data]);
        }

        // Reset form
        setNewCourse({
          title: "",
          description: "",
          instructor: "",
          price: "",
          category: "",
          level: "",
          duration: "",
          image: "",
        });
        setIsAddCourseOpen(false);

        // Refresh data
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error creating course: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error creating course. Please try again.");
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedCourseForSlot) return;

      const slotData = {
        date: newSlot.date,
        time: newSlot.time,
        maxStudents: 20,
      };

      const response = await fetch(
        `/api/courses/${selectedCourseForSlot}/slots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(slotData),
        }
      );

      if (response.ok) {
        // Reset form
        setNewSlot({
          date: "",
          time: "",
          available: true,
        });
        setSelectedCourseForSlot("");
        setIsAddSlotOpen(false);

        // Refresh data
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error creating slot: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Error creating slot. Please try again.");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      if (confirm("Are you sure you want to delete this course?")) {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setCourses(courses.filter((course) => course.id !== courseId));
        } else {
          const errorData = await response.json();
          alert(`Error deleting course: ${errorData.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course. Please try again.");
    }
  };

  const handleToggleCourseStatus = async (courseId: string) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;

      const newStatus = course.status === "active" ? "draft" : "active";

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedCourses = courses.map((c) =>
          c.id === courseId
            ? { ...c, status: newStatus as "active" | "draft" | "archived" }
            : c
        );
        setCourses(updatedCourses);
      } else {
        const errorData = await response.json();
        alert(`Error updating course: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error toggling course status:", error);
      alert("Error updating course. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Skill Delight Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </div>
              <span className="text-gray-600">
                Welcome, {user.name || "Admin"}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage courses, students, and monitor performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {courses.length}
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {courses.reduce((sum, c) => sum + (c.students || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth</p>
                  <p className="text-3xl font-bold text-purple-600">+24%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="slots">Manage Slots</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Management
              </h2>
              <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogDescription>
                      Create a new course for your learning platform
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          value={newCourse.title}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input
                          id="instructor"
                          value={newCourse.instructor}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              instructor: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newCourse.description}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newCourse.price}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              price: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newCourse.category}
                          onValueChange={(value) =>
                            setNewCourse({ ...newCourse, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Programming">
                              Programming
                            </SelectItem>
                            <SelectItem value="Data Science">
                              Data Science
                            </SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                          value={newCourse.level}
                          onValueChange={(value) =>
                            setNewCourse({ ...newCourse, level: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 8 weeks"
                          value={newCourse.duration}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              duration: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL (optional)</Label>
                        <Input
                          id="image"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={newCourse.image}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              image: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddCourseOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Course</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          {course.title || "Untitled"}
                        </TableCell>
                        <TableCell>{course.instructor || "Unknown"}</TableCell>
                        <TableCell>{course.students || 0}</TableCell>
                        <TableCell>${course.price || 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {course.status || "draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              title="View Course"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleToggleCourseStatus(course.id)
                              }
                              title={
                                course.status === "active"
                                  ? "Make Draft"
                                  : "Make Active"
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCourse(course.id)}
                              title="Delete Course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slots" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Course Slots
              </h2>
              <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Time Slot</DialogTitle>
                    <DialogDescription>
                      Add a new time slot to an existing course
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSlot} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="course">Select Course</Label>
                      <Select
                        value={selectedCourseForSlot}
                        onValueChange={setSelectedCourseForSlot}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title || "Untitled Course"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newSlot.date}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, date: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          placeholder="e.g., 10:00 AM - 12:00 PM"
                          value={newSlot.time}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, time: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddSlotOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Slot</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {course.title || "Untitled Course"}
                    </CardTitle>
                    <CardDescription>
                      by {course.instructor || "Unknown Instructor"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Available Slots:</span>
                        <Badge variant="outline">
                          {(course.slots || []).length}
                        </Badge>
                      </div>

                      {course.slots && course.slots.length > 0 ? (
                        <div className="space-y-2">
                          {course.slots.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <div className="text-sm font-medium">
                                  {slot.date
                                    ? new Date(slot.date).toLocaleDateString()
                                    : "No date"}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {slot.time || "No time"}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  slot.available ? "default" : "secondary"
                                }
                              >
                                {slot.available ? "Available" : "Full"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No slots available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Student Management
            </h2>
            <StudentList />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Transactions
            </h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.course_title || "Unknown Course"}
                        </TableCell>
                        <TableCell>${transaction.amount || 0}</TableCell>
                        <TableCell>
                          {transaction.date
                            ? new Date(transaction.date).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {transaction.status || "Unknown"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={
                    !notification.read ? "border-blue-200 bg-blue-50" : ""
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {notification.message || "No message"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleString()
                            : "No timestamp"}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Manage platform settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Settings panel will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
