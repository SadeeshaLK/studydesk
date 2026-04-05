require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const Payment = require('../models/Payment');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...\n');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Quiz.deleteMany({}),
      Submission.deleteMany({}),
      Payment.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@studydesk.com',
      password: 'admin123',
      role: 'admin'
    });

    const lecturer = await User.create({
      name: 'Dr. Sanjaya Perera',
      email: 'lecturer@studydesk.com',
      password: 'password123',
      role: 'lecturer'
    });

    const student1 = await User.create({
      name: 'Alex Fernando',
      email: 'student@studydesk.com',
      password: 'password123',
      role: 'student',
      walletBalance: 2000
    });

    const student2 = await User.create({
      name: 'Kavindu Silva',
      email: 'kavindu@studydesk.com',
      password: 'password123',
      role: 'student',
      walletBalance: 500
    });

    console.log('✅ Created users:');
    console.log(`   🛡️ Admin:    admin@studydesk.com / admin123`);
    console.log(`   👨‍🏫 Lecturer: lecturer@studydesk.com / password123`);
    console.log(`   🎓 Student:  student@studydesk.com / password123 (Balance: LKR 2,000)`);
    console.log(`   🎓 Student:  kavindu@studydesk.com / password123 (Balance: LKR 500)`);

    // Create quizzes
    const quiz1 = await Quiz.create({
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of core JavaScript concepts including variables, functions, and data types.',
      course: 'CS201',
      lecturer: lecturer._id,
      duration: 30,
      passingPercentage: 50,
      isPublished: true,
      pricingType: 'free',
      price: 0,
      maxAttempts: 3,
      shuffleQuestions: true,
      questions: [
        {
          questionText: 'Which keyword is used to declare a constant in JavaScript?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: 'var', isCorrect: false },
            { text: 'let', isCorrect: false },
            { text: 'const', isCorrect: true },
            { text: 'define', isCorrect: false }
          ]
        },
        {
          questionText: 'JavaScript is a statically typed language.',
          questionType: 'true-false',
          marks: 2,
          options: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: true }
          ]
        },
        {
          questionText: 'What does DOM stand for?',
          questionType: 'short-answer',
          marks: 3,
          correctAnswer: 'Document Object Model'
        },
        {
          questionText: 'Which method is used to add an element at the end of an array?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: 'push()', isCorrect: true },
            { text: 'pop()', isCorrect: false },
            { text: 'shift()', isCorrect: false },
            { text: 'unshift()', isCorrect: false }
          ]
        },
        {
          questionText: 'What is the output of typeof null?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: '"null"', isCorrect: false },
            { text: '"undefined"', isCorrect: false },
            { text: '"object"', isCorrect: true },
            { text: '"number"', isCorrect: false }
          ]
        },
        {
          questionText: 'NaN === NaN evaluates to true.',
          questionType: 'true-false',
          marks: 2,
          options: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: true }
          ]
        },
        {
          questionText: 'What is the name of the JavaScript runtime for server-side?',
          questionType: 'short-answer',
          marks: 2,
          correctAnswer: 'Node.js'
        }
      ]
    });

    const quiz2 = await Quiz.create({
      title: 'Modern Web Development',
      description: 'Assess your understanding of modern web development practices including HTML5, CSS3, and React.',
      course: 'CS301',
      lecturer: lecturer._id,
      duration: 20,
      passingPercentage: 60,
      isPublished: true,
      pricingType: 'paid',
      price: 500,
      maxAttempts: 2,
      shuffleQuestions: true,
      questions: [
        {
          questionText: 'Which HTML5 element is used for navigation links?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: '<navigation>', isCorrect: false },
            { text: '<nav>', isCorrect: true },
            { text: '<menu>', isCorrect: false },
            { text: '<links>', isCorrect: false }
          ]
        },
        {
          questionText: 'CSS Flexbox is only for one-dimensional layouts.',
          questionType: 'true-false',
          marks: 2,
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false }
          ]
        },
        {
          questionText: 'What hook is used for side effects in React?',
          questionType: 'short-answer',
          marks: 2,
          correctAnswer: 'useEffect'
        },
        {
          questionText: 'Which of the following is NOT a CSS positioning value?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: 'relative', isCorrect: false },
            { text: 'absolute', isCorrect: false },
            { text: 'float', isCorrect: true },
            { text: 'sticky', isCorrect: false }
          ]
        }
      ]
    });

    const quiz3 = await Quiz.create({
      title: 'Database Systems',
      description: 'Evaluate your knowledge of database concepts, SQL queries, and NoSQL databases.',
      course: 'CS401',
      lecturer: lecturer._id,
      duration: 45,
      passingPercentage: 50,
      isPublished: true,
      pricingType: 'paid',
      price: 750,
      maxAttempts: 1,
      shuffleQuestions: false,
      questions: [
        {
          questionText: 'Which SQL clause is used to filter records?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: 'FILTER', isCorrect: false },
            { text: 'WHERE', isCorrect: true },
            { text: 'HAVING', isCorrect: false },
            { text: 'SEARCH', isCorrect: false }
          ]
        },
        {
          questionText: 'MongoDB is a relational database.',
          questionType: 'true-false',
          marks: 2,
          options: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: true }
          ]
        },
        {
          questionText: 'What does ACID stand for in database transactions?',
          questionType: 'short-answer',
          marks: 3,
          correctAnswer: 'Atomicity Consistency Isolation Durability'
        },
        {
          questionText: 'Which of the following is a NoSQL database?',
          questionType: 'mcq',
          marks: 2,
          options: [
            { text: 'MySQL', isCorrect: false },
            { text: 'PostgreSQL', isCorrect: false },
            { text: 'MongoDB', isCorrect: true },
            { text: 'Oracle', isCorrect: false }
          ]
        },
        {
          questionText: 'An index improves query performance.',
          questionType: 'true-false',
          marks: 2,
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false }
          ]
        }
      ]
    });

    console.log('✅ Created quizzes:');
    console.log(`   📝 "${quiz1.title}" (FREE, shuffle ON, max 3 attempts, ${quiz1.questions.length} questions)`);
    console.log(`   📝 "${quiz2.title}" (PAID LKR 500, shuffle ON, max 2 attempts, ${quiz2.questions.length} questions)`);
    console.log(`   📝 "${quiz3.title}" (PAID LKR 750, shuffle OFF, max 1 attempt, ${quiz3.questions.length} questions)`);

    // Create sample submission
    const submission = await Submission.create({
      student: student1._id,
      quiz: quiz1._id,
      attemptNumber: 1,
      answers: quiz1.questions.map((q, i) => {
        const isCorrect = i % 2 === 0;
        if (q.questionType === 'short-answer') {
          return {
            questionId: q._id,
            textAnswer: isCorrect ? q.correctAnswer : 'wrong answer',
            isCorrect,
            marks: isCorrect ? q.marks : 0
          };
        }
        const correctOpt = q.options.find(o => o.isCorrect);
        const wrongOpt = q.options.find(o => !o.isCorrect);
        return {
          questionId: q._id,
          selectedOption: isCorrect ? correctOpt._id.toString() : wrongOpt._id.toString(),
          isCorrect,
          marks: isCorrect ? q.marks : 0
        };
      }),
      score: quiz1.questions.reduce((sum, q, i) => sum + (i % 2 === 0 ? q.marks : 0), 0),
      totalMarks: quiz1.totalMarks,
      percentage: Math.round((quiz1.questions.reduce((sum, q, i) => sum + (i % 2 === 0 ? q.marks : 0), 0) / quiz1.totalMarks) * 100),
      passed: true,
      tabSwitchCount: 1
    });

    // Create sample wallet transactions
    // Student 1: Topped up 3000, purchased quiz2 for 500 → balance should be 2500 initially, but we set 2000 above
    // We'll create transactions that match the walletBalance of 2000
    await Payment.create({
      student: student1._id,
      type: 'topup',
      amount: 3000,
      currency: 'LKR',
      paymentMethod: 'card',
      status: 'completed',
      cardLast4: '4242',
      balanceAfter: 3000,
      paidAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
    });

    await Payment.create({
      student: student1._id,
      type: 'purchase',
      quiz: quiz2._id,
      amount: quiz2.price,
      currency: 'LKR',
      paymentMethod: 'card',
      status: 'completed',
      balanceAfter: 2500,
      paidAt: new Date(Date.now() - 86400000) // 1 day ago
    });

    await Payment.create({
      student: student1._id,
      type: 'topup',
      amount: 500,
      currency: 'LKR',
      paymentMethod: 'card',
      status: 'completed',
      cardLast4: '1234',
      balanceAfter: 3000,
      paidAt: new Date(Date.now() - 43200000) // 12 hours ago
    });

    // Simulate a purchase that brought balance to 2000
    // (we won't create it since it would require another quiz, the wallet was set directly)

    // Student 2: Topped up 500
    await Payment.create({
      student: student2._id,
      type: 'topup',
      amount: 500,
      currency: 'LKR',
      paymentMethod: 'card',
      status: 'completed',
      cardLast4: '5678',
      balanceAfter: 500,
      paidAt: new Date()
    });

    console.log('✅ Created sample submission & wallet transactions');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('━'.repeat(50));
    console.log('Login Credentials:');
    console.log('━'.repeat(50));
    console.log('🛡️  Admin:    admin@studydesk.com / admin123');
    console.log('👨‍🏫 Lecturer: lecturer@studydesk.com / password123');
    console.log('🎓 Student:  student@studydesk.com / password123 (Balance: LKR 2,000)');
    console.log('🎓 Student:  kavindu@studydesk.com / password123 (Balance: LKR 500)');
    console.log('━'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
