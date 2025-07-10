import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skill Delight - Expert-Led Online Courses',
  description: 'Master new skills with live, interactive online courses. Learn from industry experts and advance your career with comprehensive learning programs.',
  keywords: 'online courses, learning platform, skill development, programming, data science, design, marketing',
  authors: [{ name: 'Skill Delight' }],
  openGraph: {
    title: 'Skill Delight - Expert-Led Online Courses',
    description: 'Master new skills with live, interactive online courses. Learn from industry experts and advance your career.',
    url: 'https://skilldelight.com',
    siteName: 'Skill Delight',
    images: [
      {
        url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'Skill Delight Online Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Delight - Expert-Led Online Courses',
    description: 'Master new skills with live, interactive online courses.',
    images: ['https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://skilldelight.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={inter.className}>{children} <Toaster /></body>
    </html>
  );
}