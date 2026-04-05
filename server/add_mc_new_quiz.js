const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const questions = [
  // --- MCQ (Single Answer, 2 Marks each) ---
  {
    q: "In symbolic logic, if P is 'It is raining' and Q is 'The ground is wet', which expression represents 'If it is raining, then the ground is wet'?",
    opts: ["P ∧ Q", "P ∨ Q", "P → Q", "¬P ∨ Q"], ans: 2
  },
  {
    q: "What is the result of the following matrix multiplication: [1, 2] * [[3], [4]]?",
    opts: ["11", "10", "[11]", "[[3, 4], [6, 8]]"], ans: 0
  },
  {
    q: "Find the derivative of f(x) = x³ + 2x² - 5x + 7 with respect to x.",
    opts: ["3x² + 4x - 5", "3x² + 2x - 5", "x² + 4x - 5", "3x³ + 4x² - 5x"], ans: 0
  },
  {
    q: "Evaluate the integral ∫(2x + 3) dx.",
    opts: ["x² + 3x + C", "2x² + 3x + C", "x² + C", "x² + 3 + C"], ans: 0
  },
  {
    q: "What is the modulus of the complex number z = 3 + 4i?",
    opts: ["5", "7", "25", "√7"], ans: 0
  },
  {
    q: "In partial fractions, if the denominator has a repeated linear factor (x-a)², what forms should be used in the decomposition?",
    opts: ["A/(x-a) + B/(x-a)²", "A/(x-a) + B/x", "A/(x-a)²", "(Ax+B)/(x-a)²"], ans: 0
  },
  {
    q: "If sin(θ) = 3/5 and θ is in the first quadrant, what is cos(θ)?",
    opts: ["4/5", "2/5", "1/5", "3/4"], ans: 0
  },
  {
    q: "What is the transpose of a 3x2 matrix?",
    opts: ["3x2 matrix", "2x3 matrix", "3x3 matrix", "2x2 matrix"], ans: 1
  },
  {
    q: "Solve for x: log₂(x) = 5.",
    opts: ["10", "25", "32", "64"], ans: 2
  },
  {
    q: "In logic, what is the truth value of (True ∨ False) ∧ (False)?",
    opts: ["True", "False", "Indeterminate", "Undefined"], ans: 1
  },
  {
    q: "Find the value of (1 + i)².",
    opts: ["2", "2i", "1 + 2i", "0"], ans: 1
  },
  {
    q: "What is the limit as x approaches 0 of (sin x) / x?",
    opts: ["0", "1", "∞", "Undefined"], ans: 1
  },
  {
    q: "Which of the following is an identity in trigonometry?",
    opts: ["sin²θ - cos²θ = 1", "sin²θ + cos²θ = 1", "tan²θ + 1 = cos²θ", "sin(2θ) = sinθcosθ"], ans: 1
  },
  {
    q: "If matrix A is [[1, 0], [0, 1]], what is A²?",
    opts: ["[[1, 0], [0, 1]]", "[[2, 0], [0, 2]]", "[[0, 1], [1, 0]]", "[[1, 1], [1, 1]]"], ans: 0
  },
  {
    q: "The derivative of cos(x) is:",
    opts: ["sin(x)", "-sin(x)", "sec²(x)", "-cos(x)"], ans: 1
  },
  {
    q: "What is the argument of the complex number z = 1 + i?",
    opts: ["π/2", "π/4", "π", "0"], ans: 1
  },
  {
    q: "Solve the linear system: x + y = 5, x - y = 1. What is the value of x?",
    opts: ["2", "3", "4", "5"], ans: 1
  },
  {
    q: "Evaluate ∫ e^x dx.",
    opts: ["e^x + C", "xe^x + C", "e^(x+1) + C", "1/x + C"], ans: 0
  },
  {
    q: "If A and B are sets, what is A ∩ B?",
    opts: ["Elements in A or B", "Elements in A and B", "Elements only in A", "Elements in neither"], ans: 1 },
  {
    q: "What is the inverse of the matrix [[1, 2], [3, 4]]?",
    opts: ["[[4, -2], [-3, 1]]", "[[-2, 1], [1.5, -0.5]]", "[[1, 3], [2, 4]]", "No inverse exists"], ans: 1
  },

  // --- SHORT ANSWER (Fill in the blanks, 4 Marks each) ---
  {
    q: "Find the value of the determinant of matrix [[4, 6], [3, 8]]. Answer with the number only.",
    type: 'short-answer', ans: "14"
  },
  {
    q: "If z = 2 + 3i and w = 1 - i, find the real part of (z + w).",
    type: 'short-answer', ans: "3"
  },
  {
    q: "Evaluate the derivative of f(x) = 5x at x = 10.",
    type: 'short-answer', ans: "5"
  },
  {
    q: "In the expression (x + 2)(x - 3), what is the constant term? (numerical value only)",
    type: 'short-answer', ans: "-6"
  },
  {
    q: "If 2^x = 16, what is x?",
    type: 'short-answer', ans: "4"
  },
  {
    q: "What is the slope of the line tangent to y = x² at x = 3?",
    type: 'short-answer', ans: "6"
  },
  {
    q: "If cos(θ) = 0, and 0 ≤ θ < π, what is the value of θ? (Answer in terms of pi, e.g., 'pi/2')",
    type: 'short-answer', ans: "pi/2"
  },
  {
    q: "What is the result of (3 + 4i) + (1 - 2i)? (Format: a+bi)",
    type: 'short-answer', ans: "4+2i"
  },
  {
    q: "Find the area under the curve y = 2x from x=0 to x=2.",
    type: 'short-answer', ans: "4"
  },
  {
    q: "If a matrix has 3 rows and 4 columns, how many elements does it have?",
    type: 'short-answer', ans: "12"
  },

  // --- MULTI-INTEGRATED (Dropdown style simulation using MCQ, 10 Marks each) ---
  {
    q: "COMPLEX PROBLEM: Consider the matrix M = [[a, b], [c, d]] where M is the identity matrix. \nPart 1: What is the value of 'a'? \nPart 2: What is the value of 'b'?",
    opts: ["a=1, b=0", "a=0, b=1", "a=1, b=1", "a=0, b=0"], ans: 0, marks: 10
  },
  {
    q: "INTEGRATION CHALLENGE: Consider the function f(x) = sin(x) + cos(x). \nPart 1: Find f'(0). \nPart 2: Find the integral of f(x) from 0 to pi/2.",
    opts: ["f'(0)=1, Integral=2", "f'(0)=0, Integral=1", "f'(0)=1, Integral=1", "f'(0)=-1, Integral=2"], ans: 0, marks: 10
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    await Quiz.deleteMany({ title: 'Mathematics for Computing - MC' });

    const dbQuestions = questions.map(q => ({
        questionText: q.q,
        questionType: q.type || 'mcq',
        isMultiSelect: false,
        marks: q.marks || (q.type === 'short-answer' ? 4 : 2),
        options: q.opts ? q.opts.map((text, idx) => ({ text, isCorrect: idx === q.ans })) : [],
        correctAnswer: q.type === 'short-answer' ? q.ans : undefined
    }));

    const totalMarks = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: 'Mathematics for Computing - MC',
      description: 'A comprehensive 100-mark mathematics assessment covering Logic, Matrices, Complex Numbers, Trigonometry, and Calculus.',
      course: 'IT1020 - MC',
      lecturer: lecturer._id,
      duration: 120,
      passingPercentage: 50,
      pricingType: 'free',
      maxAttempts: 3,
      shuffleQuestions: true,
      category: 'final_exam',
      isPublished: true,
      totalMarks: totalMarks,
      questions: dbQuestions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with ${dbQuestions.length} questions!`);
    console.log(`Verified Total Marks: ${totalMarks}/100`);
    process.exit(0);
  } catch (err) {
    if (err.errors) { console.error(JSON.stringify(err.errors, null, 2)); }
    else { console.error(err.message || err); }
    process.exit(1);
  }
};

run();
