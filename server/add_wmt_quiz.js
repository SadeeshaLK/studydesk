const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const questions = [
  {
    questionText: "DOM is:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Linear structure", isCorrect: false },
      { text: "Tree structure", isCorrect: true },
      { text: "Database", isCorrect: false },
      { text: "API", isCorrect: false },
      { text: "Server", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(typeof null);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: false },
      { text: "object", isCorrect: true },
      { text: "string", isCorrect: false },
      { text: "error", isCorrect: false }
    ]
  },
  {
    questionText: "Which is NOT frontend?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "React", isCorrect: false },
      { text: "CSS", isCorrect: false },
      { text: "HTML", isCorrect: false },
      { text: "Node.js", isCorrect: true },
      { text: "JavaScript", isCorrect: false }
    ]
  },
  {
    questionText: "Node.js is:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Language", isCorrect: false },
      { text: "Framework", isCorrect: false },
      { text: "Runtime environment", isCorrect: true },
      { text: "Database", isCorrect: false },
      { text: "Browser", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nlet x = \"5\" + 2;\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "7", isCorrect: false },
      { text: "\"7\"", isCorrect: false },
      { text: "\"52\"", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "52", isCorrect: false }
    ]
  },
  {
    questionText: "Virtual DOM is used for:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Security", isCorrect: false },
      { text: "Performance optimization", isCorrect: true },
      { text: "Database", isCorrect: false },
      { text: "Networking", isCorrect: false },
      { text: "Storage", isCorrect: false }
    ]
  },
  {
    questionText: "HTTP POST is used to:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Retrieve data", isCorrect: false },
      { text: "Delete data", isCorrect: false },
      { text: "Create data", isCorrect: true },
      { text: "Update data", isCorrect: false },
      { text: "Fetch files", isCorrect: false }
    ]
  },
  {
    questionText: "MongoDB stores data as:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Tables", isCorrect: false },
      { text: "Rows", isCorrect: false },
      { text: "Documents", isCorrect: true },
      { text: "Files", isCorrect: false },
      { text: "Graphs", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(5 === \"5\");\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "true", isCorrect: false },
      { text: "false", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "undefined", isCorrect: false },
      { text: "null", isCorrect: false }
    ]
  },
  {
    questionText: "Which is event-driven?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "React", isCorrect: false },
      { text: "Node.js", isCorrect: true },
      { text: "CSS", isCorrect: false },
      { text: "HTML", isCorrect: false },
      { text: "SQL", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log([] == false);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "false", isCorrect: false },
      { text: "true", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: false }
    ]
  },
  {
    questionText: "Which layer handles business logic?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Presentation", isCorrect: false },
      { text: "Application", isCorrect: true },
      { text: "Data", isCorrect: false },
      { text: "Client", isCorrect: false },
      { text: "UI", isCorrect: false }
    ]
  },
  {
    questionText: "Which selector has highest priority?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Class", isCorrect: false },
      { text: "Element", isCorrect: false },
      { text: "Inline", isCorrect: true },
      { text: "External", isCorrect: false },
      { text: "Internal", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nlet x;\nconsole.log(x);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: true },
      { text: "0", isCorrect: false },
      { text: "error", isCorrect: false },
      { text: "NaN", isCorrect: false }
    ]
  },
  {
    questionText: "REST APIs are:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Stateful", isCorrect: false },
      { text: "Stateless", isCorrect: true },
      { text: "Static", isCorrect: false },
      { text: "Dynamic", isCorrect: false },
      { text: "None", isCorrect: false }
    ]
  },
  {
    questionText: "Which is asynchronous?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "setTimeout()", isCorrect: true },
      { text: "for loop", isCorrect: false },
      { text: "if", isCorrect: false },
      { text: "switch", isCorrect: false },
      { text: "var", isCorrect: false }
    ]
  },
  {
    questionText: "React components must:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Return HTML-like JSX", isCorrect: true },
      { text: "Return JSON", isCorrect: false },
      { text: "Return CSS", isCorrect: false },
      { text: "Return SQL", isCorrect: false },
      { text: "Return XML", isCorrect: false }
    ]
  },
  {
    questionText: "Which is NoSQL?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "MySQL", isCorrect: false },
      { text: "Oracle", isCorrect: false },
      { text: "MongoDB", isCorrect: true },
      { text: "PostgreSQL", isCorrect: false },
      { text: "SQL Server", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(\"5\" - 2);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "\"52\"", isCorrect: false },
      { text: "3", isCorrect: true },
      { text: "\"3\"", isCorrect: false },
      { text: "error", isCorrect: false },
      { text: "NaN", isCorrect: false }
    ]
  },
  {
    questionText: "Which is NOT HTTP method?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "GET", isCorrect: false },
      { text: "POST", isCorrect: false },
      { text: "DELETE", isCorrect: false },
      { text: "UPDATE", isCorrect: false }, // Wait, the prompt says UPDATE has X and says Correct is D.
      { text: "PUT", isCorrect: false }
    ]
  },
  {
    questionText: "Which are DOM methods?",
    questionType: "mcq",
    marks: 1, // Will assign 1 mark for the question even if multiple correct, for simplicity
    options: [
      { text: "getElementById()", isCorrect: true },
      { text: "querySelector()", isCorrect: true },
      { text: "getElementsByClassName()", isCorrect: true },
      { text: "selectAll()", isCorrect: false },
      { text: "findNode()", isCorrect: false }
    ]
  },
  {
    questionText: "Which are truthy?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "[]", isCorrect: true },
      { text: "{}", isCorrect: true },
      { text: "\"0\"", isCorrect: true },
      { text: "0", isCorrect: false },
      { text: "null", isCorrect: false }
    ]
  },
  {
    questionText: "Which are React features?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Virtual DOM", isCorrect: true },
      { text: "Components", isCorrect: true },
      { text: "Hooks", isCorrect: true },
      { text: "SQL queries", isCorrect: false },
      { text: "Server rendering only", isCorrect: false }
    ]
  },
  {
    questionText: "Node.js advantages:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Non-blocking I/O", isCorrect: true },
      { text: "Event-driven", isCorrect: true },
      { text: "High scalability", isCorrect: true },
      { text: "Blocking execution", isCorrect: false },
      { text: "Static execution", isCorrect: false }
    ]
  },
  {
    questionText: "REST characteristics:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Stateless", isCorrect: true },
      { text: "Client-server", isCorrect: true },
      { text: "Cacheable", isCorrect: true },
      { text: "Stateful", isCorrect: false },
      { text: "Tight coupling", isCorrect: false }
    ]
  },
  {
    questionText: "MongoDB features:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Flexible schema", isCorrect: true },
      { text: "Horizontal scaling", isCorrect: true },
      { text: "BSON format", isCorrect: true },
      { text: "Fixed schema", isCorrect: false },
      { text: "Only SQL queries", isCorrect: false }
    ]
  },
  {
    questionText: "CSS application methods:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Inline", isCorrect: true },
      { text: "Internal", isCorrect: true },
      { text: "External", isCorrect: true },
      { text: "API", isCorrect: false },
      { text: "Server CSS", isCorrect: false }
    ]
  },
  {
    questionText: "Which cause React re-render?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "State change", isCorrect: true },
      { text: "Props change", isCorrect: true },
      { text: "Context change", isCorrect: true },
      { text: "Variable change", isCorrect: false },
      { text: "Console log", isCorrect: false }
    ]
  },
  {
    questionText: "Frontend technologies:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "HTML", isCorrect: true },
      { text: "CSS", isCorrect: true },
      { text: "JS", isCorrect: true },
      { text: "Node.js", isCorrect: false },
      { text: "MongoDB", isCorrect: false }
    ]
  },
  {
    questionText: "Backend technologies:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Node.js", isCorrect: true },
      { text: "Express", isCorrect: true },
      { text: "MongoDB", isCorrect: true },
      { text: "React", isCorrect: false },
      { text: "CSS", isCorrect: false }
    ]
  },
  {
    questionText: "JavaScript can:",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Modify DOM", isCorrect: true },
      { text: "Validate forms", isCorrect: true },
      { text: "Handle events", isCorrect: true },
      { text: "Direct DB access", isCorrect: false },
      { text: "Compile code", isCorrect: false }
    ]
  },
  {
    questionText: "Which are async?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "setTimeout", isCorrect: true },
      { text: "fetch()", isCorrect: true },
      { text: "Promises", isCorrect: true },
      { text: "for loop", isCorrect: false },
      { text: "switch", isCorrect: false }
    ]
  },
  {
    questionText: "Which are comparison operators?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "==", isCorrect: true },
      { text: "===", isCorrect: true },
      { text: "!=", isCorrect: true },
      { text: "=>", isCorrect: false },
      { text: "=", isCorrect: false }
    ]
  },
  {
    questionText: "Which affect CSS specificity?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "ID", isCorrect: true },
      { text: "Class", isCorrect: true },
      { text: "Element", isCorrect: true },
      { text: "Inline", isCorrect: true },
      { text: "Comment", isCorrect: false }
    ]
  },
  {
    questionText: "Which are NoSQL DBs?",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "MongoDB", isCorrect: true },
      { text: "Cassandra", isCorrect: true },
      { text: "CouchDB", isCorrect: true },
      { text: "MySQL", isCorrect: false },
      { text: "Oracle", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(!!0);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "true", isCorrect: false },
      { text: "false", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(typeof []);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "array", isCorrect: false },
      { text: "object", isCorrect: true },
      { text: "list", isCorrect: false },
      { text: "null", isCorrect: false },
      { text: "error", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nsetTimeout(() => console.log(\"A\"), 0);\nconsole.log(\"B\");\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "A B", isCorrect: false },
      { text: "BA", isCorrect: true }, // The prompt gave B A but let's use BA as string or B A
      { text: "AB", isCorrect: false },
      { text: "B A", isCorrect: true },
      { text: "error", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nlet a = {};\nconsole.log(a == {});\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "true", isCorrect: false },
      { text: "false", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(\"5\" * 2);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "\"52\"", isCorrect: false },
      { text: "10", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "NaN", isCorrect: false },
      { text: "\"10\"", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nfunction test() {\n  return\n  10;\n}\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "10", isCorrect: false },
      { text: "undefined", isCorrect: true },
      { text: "null", isCorrect: false },
      { text: "error", isCorrect: false },
      { text: "0", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nlet x = [1,2];\nconsole.log(x + 1);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "[1,2,1]", isCorrect: false },
      { text: "\"1,21\"", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "error", isCorrect: false },
      { text: "NaN", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log([] + []);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: '""', isCorrect: true },
      { text: "[]", isCorrect: false },
      { text: "0", isCorrect: false },
      { text: "null", isCorrect: false },
      { text: "error", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log({} + []);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "\"[object Object]\"", isCorrect: false },
      { text: "0", isCorrect: false },
      { text: "\"[object Object]\" + \"\"", isCorrect: false },
      { text: "\"[object Object]\" (string)", isCorrect: true },
      { text: "error", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(null == undefined);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "false", isCorrect: false },
      { text: "true", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "NaN", isCorrect: false },
      { text: "0", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(1 < 2 < 3);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "true", isCorrect: true },
      { text: "false", isCorrect: false },
      { text: "error", isCorrect: false },
      { text: "undefined", isCorrect: false },
      { text: "NaN", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(3 > 2 > 1);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "true", isCorrect: false },
      { text: "false", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "NaN", isCorrect: false },
      { text: "undefined", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nlet x = \"hello\";\nx[0] = \"H\";\nconsole.log(x);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "Hello", isCorrect: false },
      { text: "hello", isCorrect: true },
      { text: "H", isCorrect: false },
      { text: "error", isCorrect: false },
      { text: "null", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(Boolean(\"\"));\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "true", isCorrect: false },
      { text: "false", isCorrect: true },
      { text: "error", isCorrect: false },
      { text: "null", isCorrect: false },
      { text: "undefined", isCorrect: false }
    ]
  },
  {
    questionText: "```javascript\nconsole.log(typeof NaN);\n```",
    questionType: "mcq",
    marks: 1,
    options: [
      { text: "NaN", isCorrect: false },
      { text: "number", isCorrect: true },
      { text: "undefined", isCorrect: false },
      { text: "object", isCorrect: false },
      { text: "error", isCorrect: false }
    ]
  }
];

// Re-map question 20 logic: user said D is ❌ but ✅ is missing, wait: The user says "D UPDATE ❌ / Correct: D". So Update is the intended correct answer for "Which is NOT HTTP method?". The user listed it as UPDATE. I'll make D correct.
questions[19].options.forEach(o => {
    if (o.text === 'UPDATE') o.isCorrect = true;
});

const run = async () => {
  try {
    await connectDB();
    
    // Find a lecturer
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) {
        console.error("No lecturer found to assign the quiz to!");
        process.exit(1);
    }
    
    const quiz = await Quiz.create({
      title: "Web And Mobile Technologies - WMT",
      description: "A comprehensive quiz covering Web and Mobile Technologies concepts, DOM, JS, React, and databases.",
      course: "WMT",
      lecturer: lecturer._id,
      duration: 60,
      passingPercentage: 50,
      pricingType: "free",
      maxAttempts: 3,
      shuffleQuestions: true,
      category: "general",
      isPublished: true,
      questions: questions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with ${quiz.questions.length} questions!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
