const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const lectureQuizzes = [
  {
    title: "MC Lecture 01: Logic and Control",
    course: "IT1020 - MC",
    description: "Deep dive into Propositional Logic, Truth Tables, and Logical Equivalences.",
    questions: [
      { q: "What is the truth value of P ∧ ¬P?", opts: ["Always True", "Always False", "Depends on P", "Indeterminate"], ans: 1, marks: 5 },
      { q: "Translate to symbols: 'P if and only if Q'", opts: ["P → Q", "Q → P", "P ↔ Q", "P ∧ Q"], ans: 2, marks: 5 },
      { q: "In logic, what is a Tautology?", opts: ["Always False", "Always True", "Sometimes True", "A contradiction"], ans: 1, marks: 5 },
      { q: "Simplify ¬(P ∨ Q) using De Morgan's Law.", opts: ["¬P ∧ ¬Q", "¬P ∨ ¬Q", "P ∧ Q", "¬P ∧ Q"], ans: 0, marks: 5 },
      { q: "If P is True and Q is False, what is the value of P → Q?", opts: ["True", "False", "Indeterminate", "1"], ans: 1, marks: 5 },
      { q: "The converse of P → Q is:", opts: ["Q → P", "¬P → ¬Q", "¬Q → ¬P", "P ∧ ¬Q"], ans: 0, marks: 5 },
      { q: "The contrapositive of P → Q is:", opts: ["Q → P", "¬P → ¬Q", "¬Q → ¬P", "P ∧ ¬Q"], ans: 2, marks: 5 },
      { q: "Evaluate (True ∨ False) ∧ (False ∨ True).", opts: ["True", "False", "0", "Indeterminate"], ans: 0, marks: 5 },
      { q: "What is the result of ¬True?", opts: ["False", "1", "True", "Null"], ans: 0, marks: 5 },
      { q: "Which symbol represents 'There exists'?", opts: ["∀", "∃", "∈", "⊆"], ans: 1, marks: 5 },
      { q: "Calculate the truth value of (1+1=2) ∧ (2+2=5).", type: 'short-answer', ans: "False", marks: 10 },
      { q: "What is the logical negation of 'All cats are black'?", type: 'short-answer', ans: "Some cats are not black", marks: 10 },
      { q: "In a truth table for 3 variables, how many rows are required?", type: 'short-answer', ans: "8", marks: 10 },
      { q: "INTEGRATED: Let P=True, Q=False, R=True. \nPart 1: Find value of (P ∧ Q) ∨ R. \nPart 2: Find value of P → (Q ∧ R).", opts: ["Part1: True, Part2: False", "Part1: False, Part2: True", "Part1: True, Part2: True", "Part1: False, Part2: False"], ans: 0, marks: 20 },
    ]
  },
  {
    title: "MC Lecture 02: Partial Fractions",
    course: "IT1020 - MC",
    description: "Advanced decomposition of rational functions into simpler partial fractions.",
    questions: [
      { q: "Decompose 1/((x-1)(x-2)) into A/(x-1) + B/(x-2). Find A.", opts: ["1", "-1", "2", "-2"], ans: 1, marks: 5 },
      { q: "What form should be used for 1/(x²(x+1))?", opts: ["A/x + B/(x+1)", "A/x + B/x² + C/(x+1)", "A/x² + B/(x+1)", "Ax+B/x² + C/(x+1)"], ans: 1, marks: 5 },
      { q: "If the numerator degree is equal to the denominator degree, what is the first step?", opts: ["Decompose immediately", "Long Division", "Substitution", "Integration"], ans: 1, marks: 5 },
      { q: "For factor (x²+1) in denominator, use numerator form:", opts: ["A", "Ax+B", "A/x", "Ax²"], ans: 1, marks: 5 },
      { q: "Solve for A: 3x+5 = A(x+1) + B(x-1) at x=1.", opts: ["A=2", "A=4", "A=8", "A=1"], ans: 1, marks: 5 },
      { q: "Identify a proper rational function.", opts: ["x²/x", "1/(x+1)", "(x²+1)/x", "x/x"], ans: 1, marks: 5 },
      { q: "Number of constants needed for 1/((x-1)(x-2)(x-3))?", opts: ["2", "3", "4", "1"], ans: 1, marks: 5 },
      { q: "Value of B in 1/((x-1)(x-2)) = A/(x-1) + B/(x-2)?", opts: ["1", "-1", "2", "0"], ans: 0, marks: 5 },
      { q: "Decomposition of 1/(x-a)² involves:", opts: ["A/(x-a)", "A/(x-a) + B/(x-a)²", "A/(x-a)²", "Ax+B/(x-a)²"], ans: 1, marks: 5 },
      { q: "In P(x)/Q(x), if deg(P) < deg(Q), it is called:", opts: ["Improper", "Proper", "Partial", "Complex"], ans: 1, marks: 5 },
      { q: "Find the value of A in: x/(x-1)(x+1) = A/(x-1) + B/(x+1).", type: 'short-answer', ans: "0.5", marks: 10 },
      { q: "If (3x+2)/((x+1)(x+2)) = A/(x+1) + B/(x+2), find B.", type: 'short-answer', ans: "4", marks: 10 },
      { q: "What is the value of the constant term after long division of (x²+1)/(x²-1)?", type: 'short-answer', ans: "1", marks: 10 },
      { q: "INTEGRATED: f(x) = (x²+x+1)/((x-1)(x²+1)). \nPart 1: How many constants are required? \nPart 2: What is the numerator form for (x²+1)?", opts: ["Part1: 3, Part2: Bx+C", "Part1: 2, Part2: B", "Part1: 3, Part2: B", "Part1: 4, Part2: Bx"], ans: 0, marks: 20 },
    ]
  },
  {
    title: "MC Lecture 03: Trigonometry",
    course: "IT1020 - MC",
    description: "Mastering Identities, Wave Functions, and Harmonic Oscillations.",
    questions: [
      { q: "sin²θ + cos²θ = ?", opts: ["0", "1", "tan θ", "sec θ"], ans: 1, marks: 5 },
      { q: "sin(2θ) =", opts: ["2 sin θ", "2 sin θ cos θ", "cos²θ - sin²θ", "2 cos θ"], ans: 1, marks: 5 },
      { q: "Value of sin(π/2)?", opts: ["0", "1", "0.5", "-1"], ans: 1, marks: 5 },
      { q: "Value of cos(π)?", opts: ["1", "0", "-1", "0.5"], ans: 2, marks: 5 },
      { q: "tan θ =", opts: ["cos/sin", "sin/cos", "1/sin", "1/cos"], ans: 1, marks: 5 },
      { q: "Period of sin(x)?", opts: ["π", "2π", "π/2", "3π"], ans: 1, marks: 5 },
      { q: "1 + tan²θ =", opts: ["cot²θ", "sec²θ", "cosec²θ", "sin²θ"], ans: 1, marks: 5 },
      { q: "Value of sin(30°)?", opts: ["√3 / 2", "1/2", "1/√2", "1"], ans: 1, marks: 5 },
      { q: "Complementary angle of 30°?", opts: ["60°", "150°", "90°", "30°"], ans: 0, marks: 5 },
      { q: "If tan θ = 1, θ = ?", opts: ["30°", "45°", "60°", "90°"], ans: 1, marks: 5 },
      { q: "Find sin(90°) + cos(0°).", type: 'short-answer', ans: "2", marks: 10 },
      { q: "If sin x = 0.5, find smallest positive x in degrees.", type: 'short-answer', ans: "30", marks: 10 },
      { q: "What is the reciprocal of sec θ?", type: 'short-answer', ans: "cos θ", marks: 10 },
      { q: "INTEGRATED: Consider y = 3 sin(2x). \nPart 1: What is the amplitude? \nPart 2: What is the frequency factor?", opts: ["Part1: 3, Part2: 2", "Part1: 2, Part2: 3", "Part1: 3, Part2: 1", "Part1: 1, Part2: 2"], ans: 0, marks: 20 },
    ]
  },
  {
    title: "MC Lecture 04: Differentiation",
    course: "IT1020 - MC",
    description: "Calculus I: Limits, Derivatives, Chain Rule, and Applications.",
    questions: [
      { q: "d/dx (xⁿ) =", opts: ["nxⁿ", "nxⁿ⁻¹", "xⁿ⁺¹", "n/x"], ans: 1, marks: 5 },
      { q: "d/dx (sin x) =", opts: ["cos x", "-cos x", "tan x", "sec x"], ans: 0, marks: 5 },
      { q: "d/dx (eˣ) =", opts: ["xeˣ", "eˣ", "eˣ⁻¹", "log x"], ans: 1, marks: 5 },
      { q: "Product Rule: d/dx (uv) =", opts: ["u'v'", "uv' + vu'", "u'v - v'u", "uv"], ans: 1, marks: 5 },
      { q: "Slope of y=x² at x=2?", opts: ["2", "4", "1", "0"], ans: 1, marks: 5 },
      { q: "d/dx (constant) =", opts: ["1", "constant", "0", "x"], ans: 2, marks: 5 },
      { q: "d/dx (log x) =", opts: ["x", "1/x", "eˣ", "1"], ans: 1, marks: 5 },
      { q: "Second derivative of x³?", opts: ["3x²", "6x", "6", "0"], ans: 1, marks: 5 },
      { q: "Chain Rule is used for:", opts: ["Sums", "Products", "Composite functions", "Constants"], ans: 2, marks: 5 },
      { q: "Rate of change of position is:", opts: ["Acceleration", "Velocity", "Jerk", "Time"], ans: 1, marks: 5 },
      { q: "Calculate f'(1) for f(x) = 5x³.", type: 'short-answer', ans: "15", marks: 10 },
      { q: "Find d/dx (sin x + cos x) at x=0.", type: 'short-answer', ans: "1", marks: 10 },
      { q: "Value of limit (x→2) for x².", type: 'short-answer', ans: "4", marks: 10 },
      { q: "INTEGRATED: f(x) = sin(x²). \nPart 1: Result of d/dx using Chain Rule. \nPart 2: Value of f'(0).", opts: ["Part1: 2x cos(x²), Part2: 0", "Part1: cos(x²), Part2: 1", "Part1: 2x, Part2: 0", "Part1: sin(2x), Part2: 0"], ans: 0, marks: 20 },
    ]
  },
  {
    title: "MC Lecture 05: Integration",
    course: "IT1020 - MC",
    description: "Calculus II: Definite and Indefinite Integrals, Area under curves.",
    questions: [
      { q: "∫ xⁿ dx =", opts: ["nxⁿ⁻¹", "xⁿ⁺¹/(n+1)", "log x", "xⁿ"], ans: 1, marks: 5 },
      { q: "∫ sin x dx =", opts: ["cos x", "-cos x", "tan x", "sec x"], ans: 1, marks: 5 },
      { q: "∫ 1/x dx =", opts: ["log x", "eˣ", "x", "1"], ans: 0, marks: 5 },
      { q: "Integral of a constant k?", opts: ["0", "k", "kx", "k²"], ans: 2, marks: 5 },
      { q: "Definite integral from a to a is:", opts: ["1", "0", "∞", "a"], ans: 1, marks: 5 },
      { q: "Area under y=x from 0 to 2?", opts: ["1", "2", "4", "0"], ans: 1, marks: 5 },
      { q: "∫ eˣ dx =", opts: ["eˣ", "xeˣ", "log x", "1/x"], ans: 0, marks: 5 },
      { q: "Integration is the reverse of:", opts: ["Addition", "Differentiation", "Multiplication", "Limits"], ans: 1, marks: 5 },
      { q: "What is 'C' in indefinite integrals?", opts: ["Calculus", "Constant of integration", "Coefficient", "Complex"], ans: 1, marks: 5 },
      { q: "∫ (f(x) + g(x)) dx =", opts: ["∫f + ∫g", "∫f * ∫g", "f+g", "0"], ans: 0, marks: 5 },
      { q: "Evaluate ∫₀² 3x² dx.", type: 'short-answer', ans: "8", marks: 10 },
      { q: "Find ∫ cos x dx from 0 to pi/2.", type: 'short-answer', ans: "1", marks: 10 },
      { q: "Integral of 2x + 1?", type: 'short-answer', ans: "x^2 + x", marks: 10 },
      { q: "INTEGRATED: Consider ∫ (2x + 3) dx from 0 to 1. \nPart 1: Find Indefinite Integral. \nPart 2: Find Definite value.", opts: ["Part1: x²+3x, Part2: 4", "Part1: 2x², Part2: 2", "Part1: x²+3x, Part2: 1", "Part1: 3x, Part2: 3"], ans: 0, marks: 20 },
    ]
  },
  {
    title: "MC Lecture 06: Complex Numbers",
    course: "IT1020 - MC",
    description: "Imaginary numbers, Argand Diagrams, Modulus, and Polar forms.",
    questions: [
      { q: "i² =", opts: ["1", "-1", "0", "√-1"], ans: 1, marks: 5 },
      { q: "Real part of 3 + 4i?", opts: ["3", "4", "5", "i"], ans: 0, marks: 5 },
      { q: "Modulus of 3 + 4i?", opts: ["7", "5", "25", "1"], ans: 1, marks: 5 },
      { q: "Conjugate of 1 + i?", opts: ["1 + i", "1 - i", "-1 - i", "i - 1"], ans: 1, marks: 5 },
      { q: "i³ =", opts: ["1", "-1", "i", "-i"], ans: 3, marks: 5 },
      { q: "i⁴ =", opts: ["1", "-1", "i", "-i"], ans: 0, marks: 5 },
      { q: "Argand diagram x-axis represents:", opts: ["Imaginary", "Real", "Modulus", "Angle"], ans: 1, marks: 5 },
      { q: "Polar form involves r and:", opts: ["x", "y", "θ", "z"], ans: 2, marks: 5 },
      { q: "(1+i) + (2+3i) =", opts: ["3+4i", "2+3i", "1+2i", "4+2i"], ans: 0, marks: 5 },
      { q: "The value of √-16?", opts: ["4", "4i", "-4", "-4i"], ans: 1, marks: 5 },
      { q: "Find real part of i(2+i).", type: 'short-answer', ans: "-1", marks: 10 },
      { q: "Value of |1 + i|².", type: 'short-answer', ans: "2", marks: 10 },
      { q: "Find imaginary part of (3-i) - (1+2i).", type: 'short-answer', ans: "-3", marks: 10 },
      { q: "INTEGRATED: z = 1 + i√3. \nPart 1: Find modulus |z|. \nPart 2: Find argument arg(z) in degrees.", opts: ["Part1: 2, Part2: 60", "Part1: 1, Part2: 45", "Part1: 2, Part2: 30", "Part1: 4, Part2: 60"], ans: 0, marks: 20 },
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of lectureQuizzes) {
      await Quiz.deleteMany({ title: lqz.title });

      const dbQuestions = lqz.questions.map(q => ({
        questionText: q.q,
        questionType: q.type || 'mcq',
        isMultiSelect: false,
        marks: q.marks,
        options: q.opts ? q.opts.map((text, idx) => ({ text, isCorrect: idx === q.ans })) : [],
        correctAnswer: q.type === 'short-answer' ? q.ans : undefined
      }));

      const totalMarks = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

      await Quiz.create({
        title: lqz.title,
        description: lqz.description,
        course: lqz.course,
        lecturer: lecturer._id,
        duration: 45,
        passingPercentage: 50,
        pricingType: 'free',
        maxAttempts: 5,
        shuffleQuestions: true,
        category: 'lesson_based',
        isPublished: true,
        totalMarks: totalMarks,
        questions: dbQuestions,
      });
      console.log(`Successfully created quiz: ${lqz.title} (${totalMarks} marks)`);
    }

    console.log(`All 6 lecture quizzes created!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
