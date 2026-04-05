const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const singleSelects = [
  { q: "What is typically the first phase in the software development lifecycle?", opts: ["Design", "Requirement Analysis", "Testing", "Implementation"], ans: 1 },
  { q: "Which of the following is considered a low-level programming language?", opts: ["Python", "Java", "Assembly", "C#"], ans: 2 },
  { q: "What translates a high-level language program into machine code all at once before execution?", opts: ["Interpreter", "Compiler", "Assembler", "Linker"], ans: 1 },
  { q: "In programming, a loop that never terminates is known as a(n):", opts: ["Infinite loop", "Syntax error", "Dead loop", "Endless branch"], ans: 0 },
  { q: "Consider the following C-like pseudocode:\n```c\nint x = 5;\nint y = x++;\nprint(y);\n```\nWhat is the expected output?", opts: ["4", "5", "6", "Error"], ans: 1 },
  { q: "Which data structure operates on a 'First In, First Out' (FIFO) principle?", opts: ["Stack", "Array", "Queue", "Tree"], ans: 2 },
  { q: "What is the primary purpose of a variable in programming?", opts: ["To perform mathematical operations", "To display output to the screen", "To store data that can be changed during execution", "To repeat a block of code"], ans: 2 },
  { q: "In an array of length N, what is the index of the last element in a 0-indexed language?", opts: ["N", "N-1", "0", "1"], ans: 1 },
  { q: "Which operator is typically used for a logical AND?", opts: ["||", "&&", "!", "&"], ans: 1 },
  { q: "What does 'IDE' stand for?", opts: ["Integrated Design Environment", "Integrated Development Environment", "Internal Development Error", "Interpretive Design Engine"], ans: 1 },
  { q: "If `A = true` and `B = false`, what does `A || B` evaluate to?", opts: ["true", "false", "Cannot be determined", "null"], ans: 0 },
  { q: "What defines a function signature?", opts: ["The code inside the function block", "The function name and its parameter types", "The return type only", "The visibility specifier (public/private)"], ans: 1 },
  { q: "Which of these is a valid declaration of an integer pointer in C/C++?", opts: ["int &ptr;", "int *ptr;", "pointer int ptr;", "int ptr*;"], ans: 1 },
  { q: "Look at the following snippet:\n```c\nfor(int i=0; i<3; i++) {\n  print(i);\n}\n```\nWhat is printed?", opts: ["123", "012", "0123", "12"], ans: 1 },
  { q: "What type of error is detected by the compiler before the program runs?", opts: ["Runtime Error", "Logical Error", "Semantic Error", "Syntax Error"], ans: 3 },
  { q: "What is an algorithm?", opts: ["A programming language syntax", "A software tool for debugging", "A step-by-step procedure to solve a problem", "A type of data structure"], ans: 2 },
  { q: "Which keyword is used to return a value from a function?", opts: ["give", "send", "return", "output"], ans: 2 },
  { q: "A boolean variable can store which of the following values?", opts: ["Any integer", "true or false", "A single character", "A string of text"], ans: 1 },
  { q: "Consider a recursive function. What is the essential condition required to stop recursion?", opts: ["A loop structure", "A Base Case", "Global variables", "A void return type"], ans: 1 },
  { q: "What is the result of `10 % 3` in most programming languages?", opts: ["3.33", "3", "1", "0"], ans: 2 },
  { q: "What is 'Scope' in programming?", opts: ["The amount of memory used by a program", "The region of the code where a variable is accessible", "The mathematical precision of floating-point numbers", "The time it takes for a program to compile"], ans: 1 },
  { q: "Which of these represents a comment in C, C++, or Java?", opts: ["<!-- comment -->", "# comment", "/* comment */", "-- comment"], ans: 2 },
  { q: "What is the process of finding and fixing errors in a program?", opts: ["Compiling", "Executing", "Debugging", "Linking"], ans: 2 },
  { q: "Which control structure is best suited for executing a block of code a known, specific number of times?", opts: ["while loop", "do-while loop", "switch statement", "for loop"], ans: 3 },
  { q: "If `a = 5` and `b = 10`, what does `a == b` return?", opts: ["5", "10", "true", "false"], ans: 3 },
  { q: "What is a 'string' in computer programming?", opts: ["A sequence of characters", "A numerical value", "A true/false condition", "A single memory address"], ans: 0 },
  { q: "Review the code:\n```c\nint x = 10;\nif (x > 5) print('A');\nelse print('B');\n```\nWhat is the output?", opts: ["A", "B", "AB", "Nothing"], ans: 0 },
  { q: "Which data type is most appropriate for storing a person's age?", opts: ["float", "int", "boolean", "char"], ans: 1 },
  { q: "What is a multi-dimensional array typically used to represent?", opts: ["A single list of items", "A matrix or table of data", "A queue", "A binary tree"], ans: 1 },
  { q: "In object-oriented terms (if applicable to intro), what is an instance of a class?", opts: ["A method", "A property", "An object", "An algorithm"], ans: 2 }
];

const multiSelects = [
  {
    q: "Which of the following are valid examples of selection/conditional control structures?",
    opts: [
      { text: "if-else statement", isCorrect: true },
      { text: "switch statement", isCorrect: true },
      { text: "for loop", isCorrect: false },
      { text: "ternary operator (? :)", isCorrect: true },
      { text: "continue statement", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Consider the snippet:\n```c\nint arr[5] = {1, 2, 3, 4, 5};\n```\nWhich of the following expressions correctly access elements within the array bounds?",
    opts: [
      { text: "arr[0]", isCorrect: true },
      { text: "arr[4]", isCorrect: true },
      { text: "arr[5]", isCorrect: false },
      { text: "arr[-1]", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Which of the following can cause a Runtime Error?",
    opts: [
      { text: "Dividing an integer by zero", isCorrect: true },
      { text: "Missing a semicolon at the end of a statement", isCorrect: false },
      { text: "Accessing an array element out of bounds", isCorrect: true },
      { text: "Misspelling a keyword like 'whlie'", isCorrect: false },
      { text: "Attempting to open a file that does not exist", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following are considered fundamental scalar data types in languages like C/C++?",
    opts: [
      { text: "int", isCorrect: true },
      { text: "float", isCorrect: true },
      { text: "char", isCorrect: true },
      { text: "Array", isCorrect: false },
      { text: "Struct", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Review this code snippet:\n```c\nint a = 10, b = 20;\nint temp = a;\na = b;\nb = temp;\n```\nWhat is true about this snippet?",
    opts: [
      { text: "It swaps the values of 'a' and 'b'.", isCorrect: true },
      { text: "At the end, a = 20 and b = 10.", isCorrect: true },
      { text: "It results in a compilation error.", isCorrect: false },
      { text: "The variable 'temp' is unnecessary for swapping their values like this.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Which of the following correctly pair an operator with its corresponding category?",
    opts: [
      { text: "&& - Logical Operator", isCorrect: true },
      { text: "== - Assignment Operator", isCorrect: false },
      { text: "+ - Arithmetic Operator", isCorrect: true },
      { text: "> - Relational/Comparison Operator", isCorrect: true },
      { text: "++ - Identity Operator", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "What defines a well-constructed recursive function?",
    opts: [
      { text: "It calls itself within its own body.", isCorrect: true },
      { text: "It must have at least one Base Case to terminate.", isCorrect: true },
      { text: "It must use a strict 'while' loop.", isCorrect: false },
      { text: "Each recursive call should progress closer to the base case.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following statements about functions/methods are correct?",
    opts: [
      { text: "They promote code reusability.", isCorrect: true },
      { text: "They can take zero or more parameters/arguments.", isCorrect: true },
      { text: "Every function must return a non-void value.", isCorrect: false },
      { text: "Variables defined inside a function are generally local to it.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "In typical programming languages, what effects flow control and branching?",
    opts: [
      { text: "Variables declared without initialization", isCorrect: false },
      { text: "If-then-else blocks", isCorrect: true },
      { text: "Function/method calls", isCorrect: true },
      { text: "Looping constructs (for, while)", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Examine this fragment:\n```c\nfor(int i=0; i<10; i++) {\n  if(i == 5) break;\n  if(i % 2 == 0) continue;\n  print(i);\n}\n```\nWhich of the following are accurate observations?",
    opts: [
      { text: "The loop terminates entirely when i equals 5.", isCorrect: true },
      { text: "The 'continue' statement skips the print for even numbers.", isCorrect: true },
      { text: "It will print the number 2.", isCorrect: false },
      { text: "The numbers printed are 1 and 3.", isCorrect: true }
    ],
    marks: 4
  }
];

const run = async () => {
  try {
    await connectDB();
    
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) {
        console.error("No lecturer found!");
        process.exit(1);
    }

    // Wipe previous 'IP' instances
    await Quiz.deleteMany({ title: "Introduction to Programming - IP" });

    let dbQuestions = singleSelects.map(q => ({
        questionText: q.q,
        questionType: "mcq",
        isMultiSelect: false,
        marks: 2,
        options: q.opts.map((text, idx) => ({
            text: text,
            isCorrect: idx === q.ans
        }))
    }));

    // Add multi selects
    dbQuestions = dbQuestions.concat(multiSelects.map(q => ({
        questionText: q.q,
        questionType: "mcq",
        isMultiSelect: true,
        marks: q.marks,
        options: q.opts
    })));

    let totalMarksCalculated = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: "Introduction to Programming - IP",
      description: "An extensive 100-mark Introduction to Programming examination testing fundamental concepts, operators, control flow, functions, and arrays.",
      course: "IT1010 - IP",
      lecturer: lecturer._id,
      duration: 120, // 2 hours
      passingPercentage: 60,
      pricingType: "free",
      maxAttempts: 3,
      shuffleQuestions: true,
      category: "final_exam",
      isPublished: true,
      totalMarks: totalMarksCalculated,
      questions: dbQuestions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with ${dbQuestions.length} questions!`);
    console.log(`Verified Total Marks Algorithmically: ${totalMarksCalculated}/100`);
    process.exit(0);
  } catch (err) {
    if (err.errors) {
      console.error(JSON.stringify(err.errors, null, 2));
    } else {
      console.error(err.message || err);
    }
    process.exit(1);
  }
};

run();
