"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  FileText,
  Video,
  Book,
  ArrowRight,
  Calendar,
} from "lucide-react";

export default function Resources() {
  const blogPosts = [
    {
      title: "10 Tips for Effective Online Learning",
      description:
        "Maximize your learning potential with these proven strategies for success.",
      category: "Learning",
    },
    {
      title: "The Future of AI in Data Science",
      description:
        "Explore the upcoming trends and how they will shape the industry.",
      category: "Data Science",
    },
    {
      title: "A Guide to User-Centric Design",
      description:
        "Learn the core principles of creating products that users love.",
      category: "Design",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#courses-section"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Courses
              </Link>
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
                className="text-gray-900 hover:text-blue-600 transition-colors"
              >
                Resources
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Resources
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Dive deeper into your favorite subjects with our collection of
            articles, webinars, and guides, curated by industry experts to fuel
            your curiosity and growth.
          </p>
        </div>
      </section>

      {/* Resource Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Blog Articles</h3>
              <p className="text-gray-600">
                Insights, tutorials, and career advice from our experts.
              </p>
            </Card>
            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Video className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Webinars</h3>
              <p className="text-gray-600">
                Join live discussions and Q&A sessions on trending topics.
              </p>
            </Card>
            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Book className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">E-books & Guides</h3>
              <p className="text-gray-600">
                In-depth guides and playbooks to master new skills.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From the Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out our latest articles to stay ahead of the curve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="flex flex-col shadow-lg">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-700">{post.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="link" className="p-0 text-blue-600">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Webinars
            </h2>
            <p className="text-xl text-gray-600">
              Register for free to learn from the best in the industry.
            </p>
          </div>
          <div className="space-y-6">
            <Card className="p-6 flex flex-col md:flex-row items-center justify-between shadow-md">
              <div>
                <p className="text-sm text-blue-600 font-semibold flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> August 25, 2025
                </p>
                <h3 className="text-xl font-bold mt-1">
                  Live Q&A: Getting Started in UX/UI Design
                </h3>
              </div>
              <Button className="mt-4 md:mt-0">Register Now</Button>
            </Card>
            <Card className="p-6 flex flex-col md:flex-row items-center justify-between shadow-md">
              <div>
                <p className="text-sm text-blue-600 font-semibold flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> September 10, 2025
                </p>
                <h3 className="text-xl font-bold mt-1">
                  Panel Discussion: The Ethics of AI
                </h3>
              </div>
              <Button className="mt-4 md:mt-0">Register Now</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our wide range of courses and find the perfect one to
            kickstart your career.
          </p>
          <Link href="/#courses-section">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Explore All Courses
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Skill Delight</span>
              </div>
              <p className="text-gray-300">
                Your gateway to knowledge and skills.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <p className="text-gray-300">Email: resources@skilldelight.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Skill Delight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
