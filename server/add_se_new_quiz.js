const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const singleSelects = [
  { q: "Which of the following is NOT a Software Development Life Cycle (SDLC) model?", opts: ["Waterfall", "Spiral", "Big Bang", "Agile", "Boolean"], ans: 4 },
  { q: "In Agile methodology, what is a 'Sprint'?", opts: ["A fast way to write code", "A time-boxed iteration during which a usable increment is created", "A daily stand-up meeting", "The final delivery phase"], ans: 1 },
  { q: "Which UML diagram best captures the dynamic behavior of a system showing the flow of control from activity to activity?", opts: ["Class Diagram", "Activity Diagram", "Deployment Diagram", "Object Diagram"], ans: 1 },
  { q: "In Use Case Diagrams, what does an '<<include>>' relationship signify?", opts: ["Optional behavior", "Mandatory behavior reused across multiple use cases", "Inheritance between actors", "A database relationship"], ans: 1 },
  { q: "Which Design Pattern restricts the instantiation of a class to one single object?", opts: ["Factory Method", "Observer", "Singleton", "Decorator"], ans: 2 },
  { q: "What is the primary role of a 'Scrum Master'?", opts: ["To write the most difficult code", "To design the database architecture", "To facilitate the team and remove impediments", "To directly manage and fire developers"], ans: 2 },
  { q: "A State Chart Diagram is primarily used to model:", opts: ["Static database structures", "The lifecycle of an object passing through different states", "The structural relationships of classes", "The physical network topology"], ans: 1 },
  { q: "Which architectural pattern strictly separates the application's data modeling, user interface, and control logic?", opts: ["Client-Server", "Microservices", "Model-View-Controller (MVC)", "Peer-to-Peer"], ans: 2 },
  { q: "What is Black-box testing?", opts: ["Testing software with full knowledge of its internal code structure", "Testing software based purely on its specifications and inputs/outputs", "Testing network security vulnerabilities", "Testing code immediately after writing it"], ans: 1 },
  { q: "Which of the following represents a non-functional requirement?", opts: ["The system must allow users to log in.", "The system must generate an invoice.", "The system must load any page within 2 seconds.", "The system must calculate tax automatically."], ans: 2 },
  { q: "In the Observer Design Pattern, who notifies the dependent objects (observers) when a state changes?", opts: ["The Client", "The Main Thread", "The Subject", "The Controller"], ans: 2 },
  { q: "What is 'Technical Debt'?", opts: ["Money owed to cloud providers like AWS", "The cost of additional rework caused by choosing an easy solution now instead of a better approach", "The budget allocated for purchasing IDEs", "Financial leverage used by tech startups"], ans: 1 },
  { q: "Review this concept: 'Ensuring that software components are highly related in their functionality'. This defines:", opts: ["Coupling", "Encapsulation", "Cohesion", "Inheritance"], ans: 2 },
  { q: "Which principle states that 'A class should have one, and only one, reason to change'?", opts: ["Open/Closed Principle", "Single Responsibility Principle", "Liskov Substitution Principle", "Dependency Inversion Principle"], ans: 1 },
  { q: "Which behavioral design pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests?", opts: ["Command", "Strategy", "State", "Adapter"], ans: 0 },
  { q: "What is Continuous Integration (CI)?", opts: ["Writing code continuously without breaks", "Merging developer code to a shared repository frequently to detect errors early via automated builds", "Testing software continuously for 24 hours", "Integrating third-party APIs into the backend"], ans: 1 },
  { q: "Which diagram provides a high-level view of the physical hardware components and where software is deployed?", opts: ["Component Diagram", "State Diagram", "Deployment Diagram", "Sequence Diagram"], ans: 2 },
  { q: "In a Sequence Diagram, how is the timeline of an object represented?", opts: ["A solid horizontal line", "A solid rectangular box", "A dashed vertical line called a Lifeline", "A generic stick figure"], ans: 2 },
  { q: "Which testing phase is performed by the end users to validate if the software meets their business requirements?", opts: ["Unit Testing", "Integration Testing", "User Acceptance Testing (UAT)", "System Testing"], ans: 2 },
  { q: "What is the defining characteristic of the Factory Method Design Pattern?", opts: ["It acts as a wrapper", "It delegates the instantiation of objects to subclasses", "It allows a state machine to be constructed", "It forces global access"], ans: 1 },
  { q: "In software engineering, what does 'Refactoring' mean?", opts: ["Rewriting the program in a different language", "Restructuring existing computer code without changing its external behavior", "Adding new features continuously", "Removing database tables"], ans: 1 },
  { q: "What does 'Coupling' refer to in system design?", opts: ["The degree of independence between software modules", "The number of lines of code in a module", "The speed at which modules communicate", "The reusability of a UI component"], ans: 0 },
  { q: "If an Agile team is using a Kanban board, what is the primary purpose?", opts: ["Visualizing work, limiting work-in-progress, and maximizing flow", "Creating detailed Gantt charts", "Writing source code linearly", "Enforcing strict daily meetings"], ans: 0 },
  { q: "Which metric calculates the total lines of code to determine software complexity?", opts: ["Cyclomatic Complexity", "LOC (Lines of Code)", "Halstead Complexity", "Function Point Analysis"], ans: 1 },
  { q: "In a Use Case Diagram, what represents an external entity interacting with the system?", opts: ["A Component", "A Note", "An Actor", "An Interface"], ans: 2 },
  { q: "What is White-box testing?", opts: ["Testing the UI specifically for visually impaired users", "Testing the software without knowing its internal logic", "Testing the software with full access to the internal logic and source code", "Automated deployment testing"], ans: 2 },
  { q: "Which SOLID principle suggests that high-level modules should not depend on low-level modules, but rather both should depend on abstractions?", opts: ["Single Responsibility", "Open/Closed", "Interface Segregation", "Dependency Inversion"], ans: 3 },
  { q: "What is a 'Mock' in the context of unit testing?", opts: ["A fake object crafted to simulate the behavior of real objects in controlled ways", "A test that intentionally fails", "A junior developer who observes tests", "A syntax error simulation tool"], ans: 0 },
  { q: "Which Creational Design Pattern allows building complex objects step by step?", opts: ["Prototype", "Singleton", "Builder", "Facade"], ans: 2 },
  { q: "What is the primary difference between Verification and Validation?", opts: ["Verification: \"Are we building the product right?\", Validation: \"Are we building the right product?\"", "Verification is done by users, Validation is done by developers", "Verification checks UI, Validation checks the Database", "There is no functional difference"], ans: 0 }
];

const multiSelects = [
  {
    q: "Which of the following are recognized structural properties necessary for good software design?",
    opts: [
      { text: "High Cohesion", isCorrect: true },
      { text: "High Coupling", isCorrect: false },
      { text: "Low Coupling", isCorrect: true },
      { text: "Maximized Global Variables", isCorrect: false },
      { text: "Information Hiding / Encapsulation", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Consider the 'Agile Manifesto'. Which of the following are part of its core values?",
    opts: [
      { text: "Individuals and interactions over processes and tools.", isCorrect: true },
      { text: "Comprehensive documentation over working software.", isCorrect: false },
      { text: "Customer collaboration over contract negotiation.", isCorrect: true },
      { text: "Responding to change over following a plan.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following accurately describes the State Chart Diagram elements in UML?",
    opts: [
      { text: "They represent the complete lifecycle of a single object.", isCorrect: true },
      { text: "Transitions can be triggered by external Events.", isCorrect: true },
      { text: "They focus primarily on how multiple objects interact simultaneously.", isCorrect: false },
      { text: "They utilize 'Guard Conditions' to dictate whether a transition occurs.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Review this JavaScript snippet regarding the Singleton pattern:\n```javascript\nclass Database {\n  constructor() {\n    if (Database.instance) {\n      return Database.instance;\n    }\n    this.connection = 'MySQL';\n    Database.instance = this;\n  }\n}\nconst db1 = new Database();\nconst db2 = new Database();\n```\nWhat are the accurate outcomes of this implementation?",
    opts: [
      { text: "db1 and db2 hold references to the exact same instance in memory.", isCorrect: true },
      { text: "db1 === db2 evaluates to false.", isCorrect: false },
      { text: "It prevents multiple database connections from being accidentally spawned.", isCorrect: true },
      { text: "It is an example of a Behavioral Design Pattern.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Which of the following represent valid structural design patterns?",
    opts: [
      { text: "Adapter", isCorrect: true },
      { text: "Facade", isCorrect: true },
      { text: "Observer", isCorrect: false },
      { text: "Decorator", isCorrect: true },
      { text: "Factory", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Which artifacts are standard outputs of the Requirements Elicitation and Analysis phase?",
    opts: [
      { text: "Use Case Diagrams", isCorrect: true },
      { text: "Software Requirements Specification (SRS) Document", isCorrect: true },
      { text: "Compiled Source Code", isCorrect: false },
      { text: "Non-functional Constraints List", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Select the accurate statements regarding Continuous Integration & Continuous Deployment (CI/CD):",
    opts: [
      { text: "CI ensures code merges trigger automated units tests.", isCorrect: true },
      { text: "CD completely eliminates the need for human developers.", isCorrect: false },
      { text: "CD pipelines can automatically push valid code straight to production servers.", isCorrect: true },
      { text: "They significantly increase the time-to-market for software products.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "What benefits does the Model-View-Controller (MVC) architectural pattern offer?",
    opts: [
      { text: "It isolates Business Logic from User Interface rendering.", isCorrect: true },
      { text: "It necessitates the use of a NoSQL database.", isCorrect: false },
      { text: "Multiple different Views can reuse the exact same Model.", isCorrect: true },
      { text: "It improves the testability of individual application layers.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which scenarios perfectly match the application of the 'Observer' Design Pattern?",
    opts: [
      { text: "A GUI button triggering multiple unrelated event listeners when clicked.", isCorrect: true },
      { text: "A central state store notifying multiple React components that a user logged in.", isCorrect: true },
      { text: "Creating objects from a dynamic interface depending on string input.", isCorrect: false },
      { text: "A newsletter publisher broadcasting emails to a dynamic list of subscribers.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which statements correctly describe the differences between Unit Testing and Integration Testing?",
    opts: [
      { text: "Unit tests typically mock external databases, whereas integration tests may connect to them.", isCorrect: true },
      { text: "Integration tests focus purely on the frontend UI pixels.", isCorrect: false },
      { text: "Unit tests are executed much faster than integration tests.", isCorrect: true },
      { text: "Unit Testing verifies individual functions/classes; Integration Testing verifies the connections between them.", isCorrect: true }
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

    // Wipe previous 'SE' instances
    await Quiz.deleteMany({ title: "Software Engineering - SE" });

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
      title: "Software Engineering - SE",
      description: "A comprehensive 100-mark Software Engineering examination testing Design Patterns, UML, Agile models, and standard SDLC artifacts.",
      course: "SE2030 - SE",
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
