import { mockCourses } from '@/lib/course-data';
import CourseDetailsClient from './CourseDetailsClient';

export async function generateStaticParams() {
  return mockCourses.map((course) => ({
    id: course.id,
  }));
}

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  return <CourseDetailsClient courseId={params.id} />;
}