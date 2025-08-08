"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Briefcase,
  Users,
  TrendingUp,
  ShieldCheck,
  Video,
  MessageSquare,
} from "lucide-react";

export default function Corporate() {
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
                className="text-gray-900 hover:text-blue-600 transition-colors"
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
            Corporate Training{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Solutions
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empower your workforce with cutting-edge skills. We offer
            customized, expert-led training programs designed to drive growth
            and innovation in your organization.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Partner with Skill Delight?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide flexible and effective learning solutions tailored to
              your business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry veterans with real-world experience and a
                passion for teaching.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Customized Curriculum
              </h3>
              <p className="text-gray-600">
                We tailor course content to match your team's specific goals and
                skill gaps.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Measurable Results</h3>
              <p className="text-gray-600">
                Track your team's progress with detailed analytics and see a
                tangible return on investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solutions Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Training Solutions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-3 text-blue-600" />
                  Live Virtual Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Interactive, real-time classes led by experts, accessible from
                  anywhere.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="mr-3 text-teal-600" />
                  On-Demand Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  A library of pre-recorded courses for flexible, self-paced
                  learning.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-3 text-orange-600" />
                  Custom Workshops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Bespoke workshops designed to tackle your organization's
                  unique challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Request a Consultation
            </h2>
            <p className="text-xl text-gray-600">
              Let's discuss how we can help your team achieve its goals.
            </p>
          </div>
          <Card className="p-8 shadow-xl">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                placeholder="Full Name"
                className="p-3 border rounded-lg w-full"
              />
              <input
                placeholder="Company Name"
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="email"
                placeholder="Work Email"
                className="p-3 border rounded-lg w-full"
              />
              <input
                placeholder="Phone Number"
                className="p-3 border rounded-lg w-full"
              />
              <textarea
                placeholder="Tell us about your training needs..."
                rows={4}
                className="md:col-span-2 p-3 border rounded-lg w-full"
              ></textarea>
              <div className="md:col-span-2 text-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
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
                Empowering learners and businesses worldwide.
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
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/" className="hover:text-white">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/corporate" className="hover:text-white">
                    For Business
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <p className="text-gray-300">Email: corporate@skilldelight.com</p>
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
