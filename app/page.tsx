"use client";

import { useState, useEffect } from "react";
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
import {
  Clock,
  Users,
  Star,
  BookOpen,
  ArrowRight,
  Play,
  Calendar,
  Award,
  Compass,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import CoursesSection from "@/components/courses/coursesSection";
import Logo from "./logo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  earlyBirdPrice?: number;
  image: string;
  category: string;
  level: string;
  maxSeats?: number;
  slots: {
    id: string;
    date: string; // Using 'date' as start date
    endDate?: string;
    time: string;
    available: boolean;
    durationHours?: number;
    isWeekend?: boolean;
    seatsLeft?: number;
  }[];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryCourse, setEnquiryCourse] = useState<string>("");
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    console.log("Enquiry for:", enquiryCourse);
    console.log("Submitted with:", enquiryForm);
    setEnquiryForm({ name: "", email: "", phone: "", country: "" });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/courses", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setCourses(data.data);
      } else if (data && Array.isArray(data)) {
        setCourses(data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load courses"
      );
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "All",
    "Programming",
    "Data Science",
    "Marketing",
    "Design",
    "Business",
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById("schedule-section");
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img
                className="w-24 h-12"
                src="./logo.png"
                alt="Skill Delight Logo"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
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
              <Link
                href="/corporate"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Corporate
              </Link>
              <Link
                href="/resources"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Resources
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
              <Compass className="mr-2 h-5 w-5" />
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

      {/* Courses Section */}
      <CoursesSection courses={filteredCourses} />

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
            {courses.slice(0, 6).map((course) => {
              const firstSlot =
                course.slots && course.slots.length > 0
                  ? course.slots[0]
                  : null;

              return (
                <Card
                  key={course.id}
                  className="flex flex-col hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {course.title || "Untitled Course"}
                    </CardTitle>
                    <CardDescription>
                      with {course.instructor || "Unknown Instructor"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      {firstSlot && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {firstSlot.time || "Time TBD"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {firstSlot.date && firstSlot.endDate
                                ? `${new Date(
                                    firstSlot.date
                                  ).toLocaleDateString()} - ${new Date(
                                    firstSlot.endDate
                                  ).toLocaleDateString()}`
                                : "Date TBD"}
                            </div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary">
                                {firstSlot.isWeekend ? "Weekend" : "Weekday"}
                              </Badge>
                              {course.duration && (
                                <Badge variant="outline">
                                  {course.duration}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge
                            className={
                              firstSlot.available
                                ? (firstSlot.seatsLeft ?? 6) <= 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {firstSlot.available
                              ? (firstSlot.seatsLeft ?? 6) <= 5
                                ? "Filling Fast"
                                : "Available"
                              : "Sold Out"}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Link href={`/courses/${course.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" /> View Sessions
                        </Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="flex-1"
                            onClick={() => setEnquiryCourse(course.title)}
                          >
                            Enquiry Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Enquiry for {enquiryCourse}
                            </DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={handleEnquirySubmit}
                            className="space-y-4"
                          >
                            <input
                              name="name"
                              value={enquiryForm.name}
                              onChange={handleEnquiryChange}
                              placeholder="Name"
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              name="email"
                              type="email"
                              value={enquiryForm.email}
                              onChange={handleEnquiryChange}
                              placeholder="Email"
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              name="phone"
                              value={enquiryForm.phone}
                              onChange={handleEnquiryChange}
                              placeholder="Phone"
                              className="w-full p-2 border rounded"
                              required
                            />
                            <input
                              name="country"
                              value={enquiryForm.country}
                              onChange={handleEnquiryChange}
                              placeholder="Country"
                              className="w-full p-2 border rounded"
                              required
                            />
                            <Button type="submit" className="w-full">
                              Submit Enquiry
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                <img
                  className="w-24 h-12 bg-white"
                  src="./logo.png"
                  alt="Logo"
                />
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
              <p className="text-gray-300 mb-4">Mon-Fri: 9AM-6PM EST</p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5 text-gray-400 hover:text-white transition" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5 text-gray-400 hover:text-white transition" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5 text-gray-400 hover:text-white transition" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5 text-gray-400 hover:text-white transition" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <h4 className="text-lg font-semibold mb-4">
              Get our weekly newsletter
            </h4>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition rounded text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Skill Delight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
