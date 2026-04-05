const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const questions = [];

// 30 Single-Select Hard Questions (1 mark each)
for (let i = 1; i <= 30; i++) {
  questions.push({
    questionText: `What is the expected output or behavior of the following advanced snippet #${i}?\n\n\`\`\`javascript\nconst fn${i} = () => {\n  console.log('Execution context ${i}');\n  setTimeout(() => console.log('Macro ${i}'), 0);\n  Promise.resolve().then(() => console.log('Micro ${i}'));\n};\nfn${i}();\n\`\`\``,
    questionType: "mcq",
    isMultiSelect: false,
    marks: 1,
    options: [
      { text: `Execution context ${i}, Micro ${i}, Macro ${i}`, isCorrect: true },
      { text: `Execution context ${i}, Macro ${i}, Micro ${i}`, isCorrect: false },
      { text: `Micro ${i}, Execution context ${i}, Macro ${i}`, isCorrect: false },
      { text: `Macro ${i}, Micro ${i}, Execution context ${i}`, isCorrect: false }
    ]
  });
}

// 10 Multi-Select Questions (3 marks each)
for (let i = 31; i <= 40; i++) {
  questions.push({
    questionText: `Which of the following statements are strictly TRUE regarding modern Web Engineering Concept #${i}?\n\n\`\`\`javascript\n// Consider typical Node.js streams and React concurrent rendering\nclass SystemComponent${i} extends React.PureComponent { ... }\n\`\`\``,
    questionType: "mcq",
    isMultiSelect: true,
    marks: 3,
    options: [
      { text: `State updates are batched asynchronously.`, isCorrect: true },
      { text: `Node streams reduce memory footprint for large payloads.`, isCorrect: true },
      { text: `PureComponents strictly evaluate deep equality of nested props.`, isCorrect: false },
      { text: `Hooks cannot be invoked conditionally inside standard React functions.`, isCorrect: true },
      { text: `GraphQL completely enforces statelessness inherently over UDP.`, isCorrect: false }
    ]
  });
}

// 10 Multi-Select Questions (4 marks each)
for (let i = 41; i <= 50; i++) {
  questions.push({
    questionText: `Examine the architectural patterns for microservices deploy #${i}. Which of the following vectors represent robust security and scaling implementations?\n\n\`\`\`json\n{\n  "version": "3",\n  "services": {\n    "web": { "image": "nginx:alpine", "ports": ["80:80"] }\n  }\n}\n\`\`\``,
    questionType: "mcq",
    isMultiSelect: true,
    marks: 4,
    options: [
      { text: `Implementing JWT stateless authentication across isolated service boundaries.`, isCorrect: true },
      { text: `Utilizing Redis as a centralized ephemeral caching layer.`, isCorrect: true },
      { text: `Enforcing CORS origin restrictions at the API Gateway level.`, isCorrect: true },
      { text: `Storing raw bcrypt hashes inside high-availability local storage.`, isCorrect: false },
      { text: `Configuring container orchestration deployment rolling updates to prevent downtime.`, isCorrect: true }
    ]
  });
}

const run = async () => {
  try {
    await connectDB();
    
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) {
        console.error("No lecturer found to assign the quiz to!");
        process.exit(1);
    }
    
    // Wipe previous WMT Quizzes if they exist to avoid duplication
    await Quiz.deleteMany({ course: "WMT" });

    let totalMarksCalculated = questions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: "Web And Mobile Technologies - WMT [Advanced Edition]",
      description: "An incredibly challenging, 100-mark comprehensive engineering quiz covering deep Web and Mobile Technologies concepts, Node V8 execution, React algorithms, and architecture.",
      course: "WMT",
      lecturer: lecturer._id,
      duration: 120, // 2 hours
      passingPercentage: 60,
      pricingType: "paid",
      price: 1500,
      maxAttempts: 3,
      shuffleQuestions: true,
      category: "final_exam",
      isPublished: true,
      totalMarks: totalMarksCalculated,
      questions: questions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with 50 questions!`);
    console.log(`Verified Total Marks Algorithmically: ${totalMarksCalculated}/100`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
