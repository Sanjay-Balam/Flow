import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Password123", 12);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@eduflow.com",
      password,
      role: "ADMIN",
    },
  });

  // Create Educators
  const educator1 = await prisma.user.create({
    data: {
      name: "Dr. Sarah Johnson",
      email: "sarah@eduflow.com",
      password,
      role: "EDUCATOR",
    },
  });

  const educator2 = await prisma.user.create({
    data: {
      name: "Prof. Mike Chen",
      email: "mike@eduflow.com",
      password,
      role: "EDUCATOR",
    },
  });

  // Create Students
  const student1 = await prisma.user.create({
    data: {
      name: "Alice Williams",
      email: "alice@eduflow.com",
      password,
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Bob Martinez",
      email: "bob@eduflow.com",
      password,
      role: "STUDENT",
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: "Carol Davis",
      email: "carol@eduflow.com",
      password,
      role: "STUDENT",
    },
  });

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Full-Stack Web Development with Next.js",
      description: "Master modern web development with Next.js 16, React, TypeScript, and Tailwind CSS. Build production-ready applications from scratch with server-side rendering, API routes, and database integration.",
      category: "Web Development",
      status: "PUBLISHED",
      educatorId: educator1.id,
      lessons: {
        create: [
          { title: "Introduction to Next.js", content: "Next.js is a React framework that enables server-side rendering and static site generation. In this lesson, we will explore the core concepts of Next.js including the App Router, file-based routing, and server components. You will learn how to set up a new project and understand the project structure.", order: 1 },
          { title: "TypeScript Fundamentals", content: "TypeScript adds static typing to JavaScript, helping catch errors early. We will cover interfaces, types, generics, and how TypeScript integrates with React components. By the end of this lesson, you will be comfortable writing type-safe code.", order: 2 },
          { title: "Building APIs with Route Handlers", content: "Next.js provides a powerful way to build APIs using Route Handlers. Learn how to create RESTful endpoints, handle different HTTP methods, validate request data, and return appropriate responses. We will build a complete CRUD API.", order: 3 },
          { title: "Database Integration with Prisma", content: "Prisma is a modern ORM for Node.js and TypeScript. Learn how to define schemas, run migrations, and perform CRUD operations. We will connect our Next.js app to PostgreSQL and build data models for a real application.", order: 4 },
          { title: "Authentication and Authorization", content: "Implement secure authentication using NextAuth.js. Learn about JWT tokens, session management, protected routes, and role-based access control. We will build a complete auth system from scratch.", order: 5 },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Data Science with Python",
      description: "Dive into data science with Python. Learn pandas, NumPy, matplotlib, and scikit-learn. Analyze real-world datasets, build machine learning models, and create compelling data visualizations.",
      category: "Data Science",
      status: "PUBLISHED",
      educatorId: educator2.id,
      lessons: {
        create: [
          { title: "Python for Data Science", content: "Get started with Python for data science. We will cover essential Python concepts, Jupyter notebooks, and the scientific computing ecosystem. Learn about lists, dictionaries, and control flow for data manipulation.", order: 1 },
          { title: "Data Analysis with Pandas", content: "Pandas is the go-to library for data analysis in Python. Learn how to load, clean, transform, and analyze datasets. We will work with DataFrames, handle missing data, and perform aggregations.", order: 2 },
          { title: "Data Visualization", content: "Create stunning visualizations with matplotlib and seaborn. Learn about different chart types, customization options, and best practices for presenting data insights effectively.", order: 3 },
          { title: "Machine Learning Basics", content: "Introduction to machine learning with scikit-learn. Understand supervised and unsupervised learning, train models, evaluate performance, and make predictions on new data.", order: 4 },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "UI/UX Design Principles",
      description: "Learn the fundamentals of user interface and user experience design. Understand design thinking, wireframing, prototyping, and usability testing to create beautiful and functional digital products.",
      category: "Design",
      status: "PUBLISHED",
      educatorId: educator1.id,
      lessons: {
        create: [
          { title: "Design Thinking Process", content: "Design thinking is a human-centered approach to innovation. Learn the five stages: empathize, define, ideate, prototype, and test. Understand how to apply this framework to solve real design challenges.", order: 1 },
          { title: "Wireframing and Prototyping", content: "Learn to create wireframes and prototypes using modern tools. Understand the difference between low-fidelity and high-fidelity prototypes, and how to iterate on your designs based on feedback.", order: 2 },
          { title: "Visual Design Fundamentals", content: "Master the principles of visual design including typography, color theory, layout, and hierarchy. Learn how to create visually appealing interfaces that guide users through your product.", order: 3 },
        ],
      },
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: "Digital Marketing Strategy",
      description: "Master digital marketing from SEO to social media marketing. Learn to create effective campaigns, analyze metrics, and drive business growth through online channels.",
      category: "Marketing",
      status: "PUBLISHED",
      educatorId: educator2.id,
      lessons: {
        create: [
          { title: "SEO Fundamentals", content: "Search Engine Optimization is crucial for online visibility. Learn on-page and off-page SEO techniques, keyword research, and how to optimize your content for search engines.", order: 1 },
          { title: "Social Media Marketing", content: "Leverage social media platforms to build brand awareness and engage with your audience. Learn content strategies for different platforms and how to measure social media ROI.", order: 2 },
          { title: "Email Marketing", content: "Build effective email marketing campaigns. Learn about list building, segmentation, automation, A/B testing, and creating compelling email content that converts.", order: 3 },
        ],
      },
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: "Advanced React Patterns",
      description: "Take your React skills to the next level. Learn advanced patterns like compound components, render props, custom hooks, and state machines for building scalable applications.",
      category: "Web Development",
      status: "DRAFT",
      educatorId: educator1.id,
      lessons: {
        create: [
          { title: "Compound Components", content: "Learn the compound component pattern for building flexible and reusable component APIs. Understand how to share state between related components using React context.", order: 1 },
          { title: "Custom Hooks Deep Dive", content: "Master custom hooks for extracting and reusing component logic. Learn patterns for data fetching, form handling, animations, and more.", order: 2 },
        ],
      },
    },
  });

  const course6 = await prisma.course.create({
    data: {
      title: "Business Analytics Fundamentals",
      description: "Learn how to use data to drive business decisions. Cover statistical analysis, data modeling, and business intelligence tools to transform raw data into actionable insights.",
      category: "Business",
      status: "DRAFT",
      educatorId: educator2.id,
      lessons: {
        create: [
          { title: "Introduction to Business Analytics", content: "Understand the role of analytics in modern business. Learn about descriptive, predictive, and prescriptive analytics, and how they drive decision-making.", order: 1 },
          { title: "Statistical Analysis for Business", content: "Apply statistical methods to business problems. Learn about hypothesis testing, regression analysis, and how to interpret results for stakeholders.", order: 2 },
        ],
      },
    },
  });

  // Create Enrollments
  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id, progress: 60 },
      { userId: student1.id, courseId: course2.id, progress: 30 },
      { userId: student2.id, courseId: course1.id, progress: 80 },
      { userId: student2.id, courseId: course3.id, progress: 50 },
      { userId: student3.id, courseId: course2.id, progress: 100 },
      { userId: student3.id, courseId: course4.id, progress: 20 },
      { userId: student3.id, courseId: course1.id, progress: 40 },
    ],
  });

  console.log("Seeding completed!");
  console.log(`Created: 1 admin, 2 educators, 3 students, 6 courses, 7 enrollments`);
  console.log(`Login credentials: any email above with password "Password123"`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
