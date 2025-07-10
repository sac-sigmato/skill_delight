'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function TestDbPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleTest = async () => {
    setIsTesting(true);
    setError('');
    setTestResult(null);

    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();

      if (response.ok) {
        setTestResult(data);
      } else {
        setError(data.error || 'Database test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      setError('Failed to connect to test endpoint');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeed = async () => {
    setIsTesting(true);
    setError('');

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({ ...testResult, seedResult: data });
      } else {
        setError(data.error || 'Seeding failed');
      }
    } catch (error) {
      console.error('Seeding error:', error);
      setError('Failed to connect to seeding endpoint');
    } finally {
      setIsTesting(false);
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
            <CardTitle className="text-2xl">Database Connection Test</CardTitle>
            <CardDescription>
              Test the database connection and seed with sample data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-4">
              <Button 
                onClick={handleTest} 
                disabled={isTesting}
                variant="outline"
                className="flex-1"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>

              <Button 
                onClick={handleSeed} 
                disabled={isTesting || !testResult}
                className="flex-1"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Database
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Error</h3>
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {testResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Database Connection Successful!</h3>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Connection Details:</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Database:</strong> {testResult.data?.database}</div>
                    <div><strong>Collections:</strong> {testResult.data?.collections?.length || 0}</div>
                    <div><strong>Documents:</strong> {testResult.data?.stats?.objects || 0}</div>
                  </div>
                </div>

                {testResult.data?.collections && testResult.data.collections.length > 0 && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">Existing Collections:</h4>
                    <div className="flex flex-wrap gap-2">
                      {testResult.data.collections.map((collection: string) => (
                        <span key={collection} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {collection}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {testResult.seedResult && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Seeding Complete!</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{testResult.seedResult.data?.users}</div>
                        <div className="text-xs text-gray-600">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{testResult.seedResult.data?.courses}</div>
                        <div className="text-xs text-gray-600">Courses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{testResult.seedResult.data?.slots}</div>
                        <div className="text-xs text-gray-600">Slots</div>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <a href="/">View Homepage</a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}