const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const extractQuestions = () => {
    const dir = 'f:/StudyDesk/ques/wmt';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    let allExtracted = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const startIndex = content.indexOf('const ALL_QUESTIONS = [');
        if (startIndex !== -1) {
            try {
                const startObj = content.indexOf('[', startIndex);
                const endIndex = content.indexOf('];\n', startIndex) !== -1 
                    ? content.indexOf('];\n', startIndex) + 1 
                    : content.indexOf('];', startIndex) + 1;
                
                let arrayStr = content.substring(startObj, endIndex);
                
                // We use eval carefully since it's local trusted data
                const arr = eval(`(${arrayStr})`);
                if (Array.isArray(arr)) {
                    allExtracted = allExtracted.concat(arr);
                }
            } catch (e) {
                console.error(`Error parsing ${file}: ${e.message}`);
            }
        }
    });
    
    return allExtracted;
};

const run = async () => {
  try {
    await connectDB();
    
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) {
        console.error("No lecturer found!");
        process.exit(1);
    }

    const rawQuestions = extractQuestions();
    console.log(`Extracted ${rawQuestions.length} questions from HTML files.`);
    
    // Shuffle raw questions
    for (let i = rawQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rawQuestions[i], rawQuestions[j]] = [rawQuestions[j], rawQuestions[i]];
    }

    // Wipe previous 'WMT new' instances to avoid duplication
    await Quiz.deleteMany({ title: "WMT new" });

    // Select exactly 30 single-selection questions
    const selectedRaw = rawQuestions.slice(0, 30);

    const parseToMarkdown = (text) => {
        if (!text) return "";
        return text.replace(/<br\s*\/?>/gi, '\n')
            .replace(/<pre>/gi, '\n```javascript\n')
            .replace(/<\/pre>/gi, '\n```\n')
            .replace(/<code>/gi, '`')
            .replace(/<\/code>/gi, '`')
            .replace(/<\/?[^>]+(>|$)/g, "") // Strip any remaining unhandled HTML tags FIRST
            .replace(/&lt;/g, '<') // THEN decode entities so literal brackets are safe
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    };
    
    let dbQuestions = selectedRaw.map(q => {
        return {
            questionText: parseToMarkdown(q.q),
            questionType: "mcq",
            isMultiSelect: false,
            marks: 2, // 30 questions * 2 marks = 60 marks
            options: q.opts.map((optText, idx) => ({
                text: parseToMarkdown(optText),
                isCorrect: idx === q.answer
            }))
        }
    });

    // Now let's manually craft 10 HARD MULTI-SELECT questions to get to 100 marks total
    // 10 questions * 4 marks each = 40 marks. So Total = 100 marks.
    // Total questions = 30 + 10 = 40 questions. (Meets "more than 30")
    
    const hardMultiSelects = [
      {
        questionText: `Which of the following are valid lifecycle phases of a React Component (Class or Functional equivalent)?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "Mounting", isCorrect: true },
          { text: "Updating", isCorrect: true },
          { text: "Unmounting", isCorrect: true },
          { text: "Terminating", isCorrect: false },
          { text: "Suspending", isCorrect: false }
        ]
      },
      {
        questionText: `Examine the snippet:\n\`\`\`javascript\nconst a = [1, 2, 3];\nconst b = [...a];\nb.push(4);\n\`\`\`\nWhich of the following statements are true?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "Array 'b' contains [1, 2, 3, 4]", isCorrect: true },
          { text: "Array 'a' contains [1, 2, 3, 4]", isCorrect: false },
          { text: "The spread operator created a shallow copy of 'a'", isCorrect: true },
          { text: "b === a returns true", isCorrect: false }
        ]
      },
      {
        questionText: `Which modules are built-in to Node.js natively?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "fs (File System)", isCorrect: true },
          { text: "express", isCorrect: false },
          { text: "path", isCorrect: true },
          { text: "crypto", isCorrect: true },
          { text: "axios", isCorrect: false }
        ]
      },
      {
        questionText: `What HTTP methods are considered idempotent in REST architectures?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "GET", isCorrect: true },
          { text: "PUT", isCorrect: true },
          { text: "DELETE", isCorrect: true },
          { text: "POST", isCorrect: false },
          { text: "PATCH", isCorrect: false }
        ]
      },
      {
        questionText: `Review this Express middleware:\n\`\`\`javascript\napp.use((req, res, next) => {\n  console.log('Intercepted!');\n  // missing next()\n});\n\`\`\`\nWhat are the multiple consequences?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "The request will hang indefinitely for the client.", isCorrect: true },
          { text: "Subsequent route handlers will not be executed.", isCorrect: true },
          { text: "The server will crash and throw an Unhandled Exception.", isCorrect: false },
          { text: "Response headers will be automatically sent with a 200 OK.", isCorrect: false }
        ]
      },
      {
        questionText: `Which of these commands correctly initialize a new Node project and install React locally?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "npm init -y", isCorrect: true },
          { text: "npm install react react-dom", isCorrect: true },
          { text: "npx create-react-app --global", isCorrect: false },
          { text: "node install react", isCorrect: false }
        ]
      },
      {
        questionText: `In MongoDB, which queries return documents where the \`age\` field is greater than or equal to 18?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "{ age: { $gte: 18 } }", isCorrect: true },
          { text: "{ age: { $gt: 17 } }", isCorrect: true }, // Assuming integers
          { text: "{ age: >= 18 }", isCorrect: false },
          { text: "{ $match: { age: { $gte: 18 } } } (Inside an aggregation pipeline)", isCorrect: true }
        ]
      },
      {
        questionText: `Which behaviors describe the JavaScript Event Loop?\n\`\`\`javascript\nsetTimeout(() => console.log('A'), 0);\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');\n\`\`\``,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "Macrotasks (like setTimeout) execute after Microtasks.", isCorrect: true },
          { text: "The output order is C -> B -> A", isCorrect: true },
          { text: "The main thread is blocked until A and B finish.", isCorrect: false },
          { text: "Promises are handled by the callback queue.", isCorrect: false }
        ]
      },
      {
        questionText: `Which of the following are valid NoSQL database paradigms often deployed alongside Node.js?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "Document Stores (MongoDB)", isCorrect: true },
          { text: "Key-Value Stores (Redis)", isCorrect: true },
          { text: "Relational Tables (PostgreSQL)", isCorrect: false },
          { text: "Graph Databases (Neo4j)", isCorrect: true }
        ]
      },
      {
        questionText: `What does the \`useEffect\` hook in React allow you to do?`,
        questionType: "mcq",
        isMultiSelect: true,
        marks: 4,
        options: [
          { text: "Perform side effects in function components.", isCorrect: true },
          { text: "Mutate the DOM directly after render.", isCorrect: true },
          { text: "Fetch data from an API on component mount.", isCorrect: true },
          { text: "Declare state variables inside class components.", isCorrect: false }
        ]
      }
    ];

    dbQuestions = dbQuestions.concat(hardMultiSelects);

    let totalMarksCalculated = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: "WMT new",
      description: "An incredibly challenging, 100-mark comprehensive quiz constructed from direct WMT course materials with advanced logic questions mixed in.",
      course: "WMT",
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
    console.error(err);
    process.exit(1);
  }
};

run();
