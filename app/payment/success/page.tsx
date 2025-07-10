"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, CheckCircle, Play, Home } from "lucide-react";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const router = useRouter();
  const [enrollmentDone, setEnrollmentDone] = useState(false);

  useEffect(() => {
    const completeEnrollment = async () => {
      try {
        const token = localStorage.getItem("token");
        const pending = localStorage.getItem("pendingEnrollment");
        if (!token || !pending) return;

        const { courseId, slotId } = JSON.parse(pending);

        const res = await fetch("/api/enrollments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId, slotId }),
        });

        if (!res.ok) {
          const error = await res.json();
          toast.error(`Enrollment failed: ${error.message || res.statusText}`);
          return;
        }

        // Enrollment successful
        setEnrollmentDone(true);
        localStorage.removeItem("pendingEnrollment");
        toast.success("Enrollment completed successfully!");
      } catch (error) {
        console.error("Enrollment completion error:", error);
        toast.error("Something went wrong after payment.");
      }
    };

    completeEnrollment();
  }, []);

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
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              {enrollmentDone
                ? "You have been successfully enrolled in the course."
                : "Completing enrollment..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    1
                  </div>
                  <span>
                    You’ll receive a confirmation email with course details
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    2
                  </div>
                  <span>Access your student dashboard to track progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    3
                  </div>
                  <span>
                    Join your first live session at the scheduled time
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Need help? Contact our support team at{" "}
                <strong>support@skilldelight.com</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
