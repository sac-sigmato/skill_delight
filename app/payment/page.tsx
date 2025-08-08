'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CreditCard, Lock, ArrowLeft, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';

interface EnrollmentData {
  courseId: string;
  courseTitle: string;
  slotId: string;
  price: number;
  timestamp: string;
}

export default function Payment() {
  const router = useRouter();
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login?redirect=enrollment');
      return;
    }
    setUser(JSON.parse(userData));

    // Check for pending enrollment
    const pendingEnrollment = localStorage.getItem('pendingEnrollment');
    if (!pendingEnrollment) {
      router.push('/');
      return;
    }

    setEnrollmentData(JSON.parse(pendingEnrollment));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      // Format expiry date MM/YY
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
  };

  // const handlePayment = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsProcessing(true);

  //   try {
  //     // Call enrollment API
  //     const token = localStorage.getItem('token');
  //     const response = await fetch('/api/enrollments', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         courseId: enrollmentData?.courseId,
  //         slotId: enrollmentData?.slotId,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Enrollment failed');
  //     }

  //     // Clean up pending enrollment
  //     localStorage.removeItem('pendingEnrollment');

  //     setIsProcessing(false);
  //     router.push('/payment/success');
  //   } catch (error) {
  //     console.error('Payment error:', error);
  //     setIsProcessing(false);
  //     // Handle error - you might want to show an error message
  //   }
  // };


  const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: enrollmentData?.courseId,
        courseTitle: enrollmentData?.courseTitle,
        slotId: enrollmentData?.slotId, 
        price: enrollmentData?.price,
        userEmail: user.email,
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      throw new Error('Stripe session not created');
    }
  } catch (err) {
    console.error('Stripe redirect error:', err);
    toast.error('Failed to initiate payment.');
    setIsProcessing(false);
  }
};

const [currency, setCurrency] = useState("USD");
const [locale, setLocale] = useState("en-US");
useEffect(() => {
  const detectCurrency = async () => {
    try {
      // Try getting country from IP
      const res = await fetch("https://ipapi.co/json");
      const data = await res.json();
      const countryCode = data.country || "US";
      const userLocale = data.languages?.split(",")[0] || "en-US";

      setLocale(userLocale);
      setCurrency(data.currency || "USD");
    } catch (error) {
      console.error("Location detection failed. Falling back to USD.");
      setCurrency("USD");
    }
  };

  detectCurrency();
}, []);
const formattedPrice = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: currency,
}).format(enrollmentData?.price || 0);

  if (!enrollmentData || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/courses/${enrollmentData.courseId}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Enter your card details to complete the enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4">
                    <Lock className="h-4 w-4" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing Payment..."
                      : `Pay $${enrollmentData.price}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {enrollmentData.courseTitle}
                  </h3>
                  <p className="text-gray-600">Online Live Course</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Enrolled Student
                    </span>
                  </div>
                  <p className="text-blue-700">{user.name}</p>
                  <p className="text-blue-600 text-sm">{user.email}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Course Fee</span>
                    <span>
                      {formattedPrice}
                      {enrollmentData.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span> {formattedPrice}0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span> {formattedPrice}0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {" "}
                    {formattedPrice}
                    {enrollmentData.price}
                  </span>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      What's included:
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-green-700">
                    <li>• Live interactive sessions</li>
                    <li>• Course materials & resources</li>
                    <li>• Certificate of completion</li>
                    <li>• 30-day money-back guarantee</li>
                    <li>• Lifetime access to recordings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}