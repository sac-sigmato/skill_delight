'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSeed = async () => {
    setIsSeeding(true);
    setError('');
    setSeedResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSeedResult(data);
      } else {
        setError(data.error || 'Seeding failed');
      }
    } catch (error) {
      console.error('Seeding error:', error);
      setError('Failed to connect to seeding endpoint');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Skill Delight</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Database Seeding</CardTitle>
            <CardDescription>
              Initialize the database with sample data including courses, users, and enrollments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!seedResult && !error && (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Click the button below to populate the database with sample data. This will:
                </p>
                <ul className="text-left space-y-2 mb-6 max-w-md mx-auto">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Create admin and student accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Add sample courses with slots</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Create enrollments and transactions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Generate notifications</span>
                  </li>
                </ul>
                <Button 
                  onClick={handleSeed} 
                  disabled={isSeeding}
                  size="lg"
                  className="w-full max-w-xs"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Seeding Database...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Seed Database
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Seeding Failed</h3>
                </div>
                <p className="text-red-700">{error}</p>
                <Button 
                  onClick={handleSeed} 
                  variant="outline" 
                  className="mt-4"
                  disabled={isSeeding}
                >
                  Try Again
                </Button>
              </div>
            )}

            {seedResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Seeding Successful!</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{seedResult.data.users}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{seedResult.data.courses}</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{seedResult.data.slots}</div>
                    <div className="text-sm text-gray-600">Slots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{seedResult.data.enrollments}</div>
                    <div className="text-sm text-gray-600">Enrollments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{seedResult.data.transactions}</div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{seedResult.data.notifications}</div>
                    <div className="text-sm text-gray-600">Notifications</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Login Credentials:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Admin:</strong> {seedResult.credentials.admin.email} / {seedResult.credentials.admin.password}
                    </div>
                    <div>
                      <strong>Student:</strong> {seedResult.credentials.student.email} / {seedResult.credentials.student.password}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button asChild className="flex-1">
                    <a href="/">View Homepage</a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/auth/login">Login</a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}