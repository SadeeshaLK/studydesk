const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const seLectureQuizzes = [
  {
    title: "SE Lec 01: Introduction to Software Engineering",
    description: "Scope, definitions, professional ethics, and SDLC phases.",
    questions: [
      { q: "What defines 'Software Engineering' best?", opts: ["Coding programs", "An engineering discipline for software production", "Maintaining hardware", "Debugging only"], ans: 1 },
      { q: "Which is a core attribute of good software?", opts: ["Maintainability", "Performance", "Security", "All of above"], ans: 3 },
      { q: "Software crisis led to the birth of SE in:", opts: ["1950s", "1960s", "1980s", "2000s"], ans: 1 },
      { q: "Which phase determines 'What' the system must do?", opts: ["Design", "Requirements", "Testing", "Implementation"], ans: 1 },
      { q: "IEEE/ACM focus on SE:", opts: ["Pure Coding", "Professional Ethics", "Standard Tools", "Marketing"], ans: 1 },
      { q: "Legacy systems are:", opts: ["New systems", "Old systems still in use", "Fast systems", "Deleted systems"], ans: 1 },
      { q: "Cloud computing impacts SE by providing:", opts: ["Hardware only", "On-demand resources", "No need for code", "Worse security"], ans: 1 },
      { q: "Which is NOT a generic software process?", opts: ["Specification", "Design", "Marketing", "Validation"], ans: 2 },
      { q: "Validation answers:", opts: ["Built correctly?", "Building the right product?", "Fast enough?", "Safe?"], ans: 1 },
      { q: "Evolution in SE refers to:", opts: ["Deleting code", "Changing software over time", "Hardware upgrades", "Hiring staff"], ans: 1 },
      { q: "Essential software challenges (Brooks):", opts: [{t: "Complexity", c: true}, {t: "Conformity", c: true}, {t: "Invisibility", c: true}, {t: "Speed", c: false}], isMulti: true, marks: 10 },
      { q: "Identify professional software types:", opts: [{t: "Generic products", c: true}, {t: "Custom products", c: true}, {t: "Illegal cracks", c: false}], isMulti: true, marks: 10 },
      { q: "Which are part of SE ethics?", opts: [{t: "Confidentiality", c: true}, {t: "Competence", c: true}, {t: "Copyright", c: true}, {t: "Competition", c: false}], isMulti: true, marks: 10 },
      { q: "Common SE process models:", opts: [{t: "Waterfall", c: true}, {t: "Spiral", c: true}, {t: "Iterative", c: true}, {t: "Triangle", c: false}], isMulti: true, marks: 10 },
      { q: "What affects the software engineering process?", opts: [{t: "Type of software", c: true}, {t: "Requirements stability", c: true}, {t: "Developer experience", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 02: Software Process Models",
    description: "Waterfall, V-Model, Incremental, and Agile methodologies.",
    questions: [
      { q: "Waterfall model is...", opts: ["Iterative", "Sequential", "Circular", "Reactive"], ans: 1 },
      { q: "The V-Model emphasizes:", opts: ["Design", "Testing/Validation", "Coding", "Marketing"], ans: 1 },
      { q: "Rapid Application Development (RAD) focuses on:", opts: ["Slow design", "Prototyping/Speed", "Heavy docs", "Pure logic"], ans: 1 },
      { q: "Waterfall major drawback:", opts: ["Easy to manage", "Late feedback/Risk", "Clear stages", "None"], ans: 1 },
      { q: "Agile Manifesto values...", opts: ["Process over People", "Working software over docs", "Contract over Collab", "Plan over Change"], ans: 1 },
      { q: "Incremental development reduces:", opts: ["Quality", "Risk of rework", "Salary", "Speed"], ans: 1 },
      { q: "A 'Spike' in Agile is used for:", opts: ["Coding", "Research/Exploration", "Testing", "Deployment"], ans: 1 },
      { q: "Scrum 'Sprints' usually last:", opts: ["1 day", "1-4 weeks", "6 months", "1 year"], ans: 1 },
      { q: "Waterfall is best for:", opts: ["Fixing bugs", "Ambiguous requirements", "Stable/Clear requirements", "Fast startups"], ans: 2 },
      { q: "Pair Programming is a practice from:", opts: ["Waterfall", "XP (Extreme Programming)", "COCOMO", "CMMI"], ans: 1 },
      { q: "Agile methods include:", opts: [{t: "Scrum", c: true}, {t: "XP", c: true}, {t: "Kanban", c: true}, {t: "Waterfall", c: false}], isMulti: true, marks: 10 },
      { q: "Waterfall stages (Standard):", opts: [{t: "Requirements", c: true}, {t: "Design", c: true}, {t: "Implementation", c: true}, {t: "Marketing", c: false}], isMulti: true, marks: 10 },
      { q: "Spiral model quadrants:", opts: [{t: "Risk Analysis", c: true}, {t: "Planning", c: true}, {t: "Engineering", c: true}, {t: "Customer Eval", c: true}], isMulti: true, marks: 10 },
      { q: "Process activities in SE:", opts: [{t: "Spec", c: true}, {t: "Dev", c: true}, {t: "Val", c: true}, {t: "Evol", c: true}], isMulti: true, marks: 10 },
      { q: "Reasons for moving away from Waterfall:", opts: [{t: "Changing reqs", c: true}, {t: "Time to market", c: true}, {t: "Need for feedback", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 03: Requirements Engineering",
    description: "Functional vs Non-functional requirements, elicitation, and specification.",
    questions: [
      { q: "Functional requirements describe:", opts: ["Speed", "What system does", "Security", "Uptime"], ans: 1 },
      { q: "Non-functional requirements describe:", opts: ["Logical flow", "System constraints/quality", "User names", "Database tables"], ans: 1 },
      { q: "Requirements elicitation phase is about:", opts: ["Writing code", "Gathering from users", "Drawing boxes", "Testing"], ans: 1 },
      { q: "SRS stands for:", opts: ["Simple Requirements System", "Software Requirements Specification", "Standard Req Set", "None"], ans: 1 },
      { q: "User requirements are often written in:", opts: ["Java", "Natural language", "Python", "Assembly"], ans: 1 },
      { q: "Requirements validation ensures:", opts: ["Fast code", "Correct/Complete spec", "Cheap price", "Small docs"], ans: 1 },
      { q: "A 'Constraint' is a type of:", opts: ["Functional req", "Non-functional req", "User req", "Bug"], ans: 1 },
      { q: "Ethnography in RE is used for:", opts: ["Math", "Observing social/org factors", "Coding", "Marketing"], ans: 1 },
      { q: "Change control boards manage:", opts: ["Salaries", "Requirement changes", "Office décor", "Servers"], ans: 1 },
      { q: "Scenario-based elicitation uses:", opts: ["Logic gates", "Use-case/Sketches", "Calculations", "Hard drives"], ans: 1 },
      { q: "Identify Non-functional requirements:", opts: [{t: "Scalability", c: true}, {t: "Usability", c: true}, {t: "Add User", c: false}, {t: "Security", c: true}], isMulti: true, marks: 10 },
      { q: "RE process includes:", opts: [{t: "Elicitation", c: true}, {t: "Analysis", c: true}, {t: "Validation", c: true}, {t: "Coding", c: false}], isMulti: true, marks: 10 },
      { q: "Requirement conflicts often occur between:", opts: [{t: "User vs Admin", c: true}, {t: "Performance vs Cost", c: true}, {t: "Security vs UX", c: true}], isMulti: true, marks: 10 },
      { q: "Standard SRS structure (IEEE):", opts: [{t: "Intro", c: true}, {t: "Overview", c: true}, {t: "Detailed reqs", c: true}], isMulti: true, marks: 10 },
      { q: "Requirement validation techniques:", opts: [{t: "Reviews", c: true}, {t: "Prototyping", c: true}, {t: "Test generation", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 04: Use Case Modeling",
    description: "Use case diagrams, actors, relationships, and scenarios.",
    questions: [
      { q: "An 'Actor' in a Use Case is:", opts: ["A specific human user", "A role played by external users/systems", "Part of the inner code", "The db"], ans: 1 },
      { q: "The <<include>> relationship means:", opts: ["Optional step", "Mandatory base use case step", "Conflict", "Deletes use case"], ans: 1 },
      { q: "The <<extend>> relationship means:", opts: ["Mandatory", "Optional/Conditional behavior", "Inheritance", "Error"], ans: 1 },
      { q: "Use case boundaries define:", opts: ["The database", "System scope", "Actor's speed", "Testing time"], ans: 1 },
      { q: "A primary actor usually appears on the:", opts: ["Left", "Right", "Bottom", "Inside"], ans: 0 },
      { q: "Association line represent:", opts: ["Data flow", "Communication between actor/use case", "Inheritance", "Error"], ans: 1 },
      { q: "Generalized use case means:", opts: ["Abstract/Common behavior", "Specific instance", "Bug", "Deleted"], ans: 0 },
      { q: "Pre-condition defines:", opts: ["What happens after", "State before use case starts", "Code logic", "User age"], ans: 1 },
      { q: "Use cases describe 'Black Box' behavior because:", opts: ["Transparent", "Internal design is HIDDEN", "Colors", "Speed"], ans: 1 },
      { q: "Main flow is the:", opts: ["Error path", "Happy path (Success)", "Alternative", "Database sync"], ans: 1 },
      { q: "UML relationship types in Use Cases:", opts: [{t: "Association", c: true}, {t: "Generalization", c: true}, {t: "Include", c: true}, {t: "Extend", c: true}], isMulti: true, marks: 10 },
      { q: "A use case description should include:", opts: [{t: "Name", c: true}, {t: "Actors", c: true}, {t: "Post-conditions", c: true}, {t: "Source code", c: false}], isMulti: true, marks: 10 },
      { q: "Invalid Actor in Use Case:", opts: [{t: "Internal Module", c: true}, {t: "Database Table", c: true}, {t: "Human Customer", c: false}], isMulti: true, marks: 10 },
      { q: "Extend vs Include:", opts: [{t: "Extend is optional", c: true}, {t: "Include is mandatory", c: true}, {t: "They are same", c: false}], isMulti: true, marks: 10 },
      { q: "A system boundary is drawn as a:", opts: [{t: "Box", c: true}, {t: "Circle", c: false}, {t: "Stick figure", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 05: Activity Diagrams",
    description: "Control flow, decision nodes, forks/joins, and swimlanes.",
    questions: [
      { q: "A 'Decision Node' is shown as a:", opts: ["Circle", "Rectangle", "Diamond", "Square"], ans: 2 },
      { q: "Forks represent:", opts: ["Stopping", "Parallelizing flow", "Deciding", "Merging"], ans: 1 },
      { q: "Joins represent:", opts: ["Branching", "Synchronizing parallel flows", "Loop", "Termination"], ans: 1 },
      { q: "Swimlanes are used to partition by:", opts: ["Speed", "Responsibilities/Actors", "Time", "Logic gates"], ans: 1 },
      { q: "Initial node is shown as:", opts: ["Double circle", "Solid black circle", "Empty circle", "Square"], ans: 1 },
      { q: "Final node is shown as:", opts: ["Solid black circle", "Bullseye (Circle with dot)", "Square", "Diamond"], ans: 1 },
      { q: "State vs Activity:", opts: ["States are actions", "Activities represent processes/behaviors", "Same", "Deleted"], ans: 1 },
      { q: "Object nodes represent:", opts: ["Logic", "Data flow/Objects between activities", "Time", "Actors"], ans: 1 },
      { q: "Activity diagram used for:", opts: ["Static view", "Dynamic workflow view", "Deployment", "Hardware"], ans: 1 },
      { q: "Merge node vs Join node:", opts: ["Same", "Merge combines decision paths, Join syncs parallel", "Switch", "Loop"], ans: 1 },
      { q: "Activity Diagram Elements:", opts: [{t: "Action", c: true}, {t: "Control Flow", c: true}, {t: "Guard", c: true}, {t: "Interface", c: false}], isMulti: true, marks: 10 },
      { q: "Synchronization nodes:", opts: [{t: "Fork", c: true}, {t: "Join", c: true}, {t: "Decision", c: false}, {t: "Merge", c: false}], isMulti: true, marks: 10 },
      { q: "Swimlanes can represent:", opts: [{t: "Departments", c: true}, {t: "Actors", c: true}, {t: "Components", c: true}], isMulti: true, marks: 10 },
      { q: "UML Activity Guard condition is between:", opts: [{t: "[] brackets", c: true}, {t: "() parens", c: false}, {t: "< > brackets", c: false}], isMulti: true, marks: 10 },
      { q: "Activity Diagrams are best for:", opts: [{t: "Business processes", c: true}, {t: "Algorithmic logic", c: true}, {t: "Component wiring", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 06: Structural Modeling (Class Diagrams)",
    description: "Classes, attributes, methods, and relationships (Agg, Comp, Gen).",
    questions: [
      { q: "UML Class box has how many sections?", opts: ["1", "2", "3", "4"], ans: 2 },
      { q: "Standard notation for private visibility:", opts: ["+", "-", "#", "~"], ans: 1 },
      { q: "Standard notation for public visibility:", opts: ["+", "-", "#", "~"], ans: 0 },
      { q: "Composition is a 'Strong' version of:", opts: ["Inheritance", "Aggregation", "Generalization", "Association"], ans: 1 },
      { q: "A 'Filled Diamond' represent:", opts: ["Aggregation", "Composition", "Inheritance", "Dependency"], ans: 1 },
      { q: "Multiplicity '1..*' means:", opts: ["One and only one", "Zero or one", "One or more", "Zero or more"], ans: 2 },
      { q: "Realization relationship involves:", opts: ["Subclass", "Interface implementation", "Strong composition", "None"], ans: 1 },
      { q: "Abstract class name is printed in:", opts: ["Bold", "Italics", "Underline", "Red"], ans: 1 },
      { q: "Association class is used when:", opts: ["Relationship has attributes", "Conflict", "Simple link", "Inheritance"], ans: 0 },
      { q: "Leaf class means:", opts: ["Root", "Cannot be inherited", "Interface", "Deleted"], ans: 1 },
      { q: "UML Relationship types:", opts: [{t: "Dependency", c: true}, {t: "Association", c: true}, {t: "Aggregation", c: true}, {t: "Composition", c: true}], isMulti: true, marks: 10 },
      { q: "Section of a Class Box:", opts: [{t: "Name", c: true}, {t: "Attributes", c: true}, {t: "Operations", c: true}, {t: "Source", c: false}], isMulti: true, marks: 10 },
      { q: "Visibility modifiers:", opts: [{t: "+ (Public)", c: true}, {t: "- (Private)", c: true}, {t: "# (Protected)", c: true}], isMulti: true, marks: 10 },
      { q: "Agg vs Comp:", opts: [{t: "Comp has lifecycle dependency", c: true}, {t: "Agg is weak", c: true}, {t: "They are same", c: false}], isMulti: true, marks: 10 },
      { q: "Multiplicity notations:", opts: [{t: "1", c: true}, {t: "*", c: true}, {t: "0..1", c: true}, {t: "A..B", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 07: State Chart Diagrams",
    description: "States, transitions, events, guards, and internal actions.",
    questions: [
      { q: "States represent the state of an:", opts: ["Actor", "Object over time", "Database", "Plan"], ans: 1 },
      { q: "A transition is triggered by an:", opts: ["Actor", "Event", "Code logic", "Variable"], ans: 1 },
      { q: "State with no outgoing transitions:", opts: ["Initial", "Final", "Trap", "Self"], ans: 1 },
      { q: "Guard condition in Statechart:", opts: ["Optional [Boolean] to allow transition", "Mandatory", "Error", "Loop"], ans: 0 },
      { q: "Action vs Event:", opts: ["Event triggers, Action is result", "Same", "Deletes", "Logic"], ans: 0 },
      { q: "H-state (History) remembers:", opts: ["User name", "Last active sub-state", "Logs", "Price"], ans: 1 },
      { q: "Self-transition returns to:", opts: ["Next state", "Original state", "Previous", "Start"], ans: 1 },
      { q: "Internal activity 'entry' happens when:", opts: ["Leaving", "Entering state", "Inside", "Error"], ans: 1 },
      { q: "Composite state contains:", opts: ["Nothing", "Sub-states", "Actors", "Boxes"], ans: 1 },
      { q: "State machines are best for:", opts: ["Data flow", "Behavior of a single object", "System wiring", "Hardware"], ans: 1 },
      { q: "State Transition Label structure:", opts: [{t: "Event", c: true}, {t: "Guard", c: true}, {t: "Action", c: true}, {t: "Wait", c: false}], isMulti: true, marks: 10 },
      { q: "State types:", opts: [{t: "Simple", c: true}, {t: "Composite", c: true}, {t: "Initial", c: true}, {t: "Final", c: true}], isMulti: true, marks: 10 },
      { q: "Internal Actions types:", opts: [{t: "entry", c: true}, {t: "exit", c: true}, {t: "do", c: true}, {t: "wait", c: false}], isMulti: true, marks: 10 },
      { q: "Transitions triggered by:", opts: [{t: "Call event", c: true}, {t: "Time event", c: true}, {t: "Signal event", c: true}], isMulti: true, marks: 10 },
      { q: "Difference from Activity Diagram:", opts: [{t: "Focus on object life", c: true}, {t: "Event driven", c: true}, {t: "Not for flow", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 08: Software Verification & Validation",
    description: "Inspection vs Testing, Black-box vs White-box, and Unit Testing.",
    questions: [
      { q: "Verification answers:", opts: ["Built correctly?", "Building the right product?", "Safe?", "Fast?"], ans: 1 },
      { q: "Black-box testing focuses on:", opts: ["Code internal logic", "Functional requirements", "Memory", "Speed"], ans: 1 },
      { q: "White-box testing focuses on:", opts: ["Requirements", "Internal code structure/logic", "Colors", "Price"], ans: 1 },
      { q: "Unit testing is performed by:", opts: ["Testers", "Developers", "Users", "Managers"], ans: 1 },
      { q: "Inspection involves:", opts: ["Executing code", "Document/Code review (Static)", "User testing", "None"], ans: 1 },
      { q: "Regression testing ensures:", opts: ["New features work", "Existing features not broken after changes", "Fast code", "Safety"], ans: 1 },
      { q: "Boundary Value Analysis targets:", opts: ["Middle values", "Edges/Limit values", "Null", "Random"], ans: 1 },
      { q: "Cyclomatic complexity measures:", opts: ["Number of lines", "Number of independent paths", "Speed", "Size"], ans: 1 },
      { q: "User Acceptance Testing (UAT) is done by:", opts: ["Devs", "Clients/Users", "Testers", "Robots"], ans: 1 },
      { q: "Difference between Error and Bug:", opts: ["Same", "Error is human mistake, Bug is in code", "Deletes", "Logic"], ans: 1 },
      { q: "Testing levels:", opts: [{t: "Unit", c: true}, {t: "Integration", c: true}, {t: "System", c: true}, {t: "User", c: true}], isMulti: true, marks: 10 },
      { q: "Static V&V techniques:", opts: [{t: "Walkthroughs", c: true}, {t: "Inspections", c: true}, {t: "Desk checking", c: true}, {t: "Execution", c: false}], isMulti: true, marks: 10 },
      { q: "Dynamic validation involves:", opts: [{t: "Execution", c: true}, {t: "Testing", c: true}, {t: "Code reading", c: false}], isMulti: true, marks: 10 },
      { q: "Black-box techniques:", opts: [{t: "Equivalence partitioning", c: true}, {t: "BVA", c: true}, {t: "Logic pathing", c: false}], isMulti: true, marks: 10 },
      { q: "Test Case contains:", opts: [{t: "Input", c: true}, {t: "Expected output", c: true}, {t: "Pre-conditions", c: true}, {t: "Source", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 09: Design Patterns",
    description: "Creational, Structural, and Behavioral patterns.",
    questions: [
      { q: "Design Pattern is a:", opts: ["Library", "Reusable solution to recurring problem", "Algorithm", "Code snippet"], ans: 1 },
      { q: "Singleton pattern ensures:", opts: ["Multiple instances", "Single instance for a class", "No instance", "Global vars"], ans: 1 },
      { q: "Observer pattern is used for:", opts: ["Inheritance", "One-to-many dependency notification", "Creation", "Deletes"], ans: 1 },
      { q: "Strategy pattern allows:", opts: ["Fixed algorithm", "Interchangeable algorithms at runtime", "Inheritance", "Error"], ans: 1 },
      { q: "MVC stands for:", opts: ["Model View Controller", "Mode Value Count", "Multi View Core", "None"], ans: 0 },
      { q: "Factory pattern handles:", opts: ["Deletion", "Object creation logic", "Testing", "Networking"], ans: 1 },
      { q: "Decorator pattern adds:", opts: ["Inheritance", "Responsibility dynamically", "Static code", "Errors"], ans: 1 },
      { q: "Facade pattern provides:", opts: ["Complex interface", "Simplified interface to complex system", "Private code", "Loop"], ans: 1 },
      { q: "Adapter pattern used when:", opts: ["Code works", "Incompatible interfaces need to collaborate", "Fast", "Memory"], ans: 1 },
      { q: "Composite pattern represents:", opts: ["Simple list", "Part-whole hierarchies", "Random", "Deleted"], ans: 1 },
      { q: "Pattern Categories (GoF):", opts: [{t: "Creational", c: true}, {t: "Structural", c: true}, {t: "Behavioral", c: true}, {t: "Functional", c: false}], isMulti: true, marks: 10 },
      { q: "Creational Patterns include:", opts: [{t: "Singleton", c: true}, {t: "Factory", c: true}, {t: "Prototype", c: true}, {t: "Adapter", c: false}], isMulti: true, marks: 10 },
      { q: "Structural Patterns include:", opts: [{t: "Adapter", c: true}, {t: "Facade", c: true}, {t: "Composite", c: true}, {t: "Observer", c: false}], isMulti: true, marks: 10 },
      { q: "Behavioral Patterns include:", opts: [{t: "Observer", c: true}, {t: "Strategy", c: true}, {t: "Command", c: true}], isMulti: true, marks: 10 },
      { q: "Benefits of patterns:", opts: [{t: "Reduces complexity", c: true}, {t: "Common vocabulary", c: true}, {t: "Standardizes code", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "SE Lec 10: Supportive Processes & Management",
    description: "Quality management, Configuration management, and SW Maintenance.",
    questions: [
      { q: "Configuration Management (SCM) tracks:", opts: ["Work hours", "Changes to artifacts/code versions", "Office location", "Speed"], ans: 1 },
      { q: "Software Maintenance usually accounts for what % of cost?", opts: ["10%", "20%", "60-80%", "5%"], ans: 2 },
      { q: "Quality Assurance involves:", opts: ["Finding bugs in code", "Ensuring process produces quality product", "Marketing", "None"], ans: 1 },
      { q: "Corrective maintenance is for:", opts: ["New features", "Fixing reported errors", "Fast code", "Uptime"], ans: 1 },
      { q: "Adaptive maintenance is for:", opts: ["Errors", "Environment changes (OS/HW)", "Logic", "UX"], ans: 1 },
      { q: "CMMI level 5 is:", opts: ["Initial", "Defined", "Optimizing", "Managed"], ans: 2 },
      { q: "Software metrics measure:", opts: ["Manager height", "Software attributes/performance", "Office size", "Colors"], ans: 1 },
      { q: "A 'Baseline' in SCM is:", opts: ["Deleted code", "Formally reviewed/agreed version", "Draft", "Logic"], ans: 1 },
      { q: "Release management handles:", opts: ["Coding", "System delivery to customers", "Testing unit", "Error"], ans: 1 },
      { q: "Refactoring improves:", opts: ["External behavior", "Internal structure without changing behavior", "Marketing", "Uptime"], ans: 1 },
      { q: "Software Quality characteristics:", opts: [{t: "Reliability", c: true}, {t: "Efficiency", c: true}, {t: "Maintainability", c: true}, {t: "Cost", c: false}], isMulti: true, marks: 10 },
      { q: "SCM components:", opts: [{t: "Version control", c: true}, {t: "Change control", c: true}, {t: "Audit", c: true}, {t: "Testing", c: false}], isMulti: true, marks: 10 },
      { q: "Maintenance types:", opts: [{t: "Corrective", c: true}, {t: "Adaptive", c: true}, {t: "Perfective", c: true}, {t: "Preventive", c: true}], isMulti: true, marks: 10 },
      { q: "ISO 9001 vs CMMI:", opts: [{t: "Both for quality", c: true}, {t: "CMi for SW specific", c: true}, {t: "They are same", c: false}], isMulti: true, marks: 10 },
      { q: "Process improvement goals:", opts: [{t: "Higher Quality", c: true}, {t: "Less rework", c: true}, {t: "Lower cost", c: true}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of seLectureQuizzes) {
      await Quiz.deleteMany({ title: lqz.title });

      const quizQuestions = lqz.questions.map(q => ({
        questionText: q.q,
        questionType: 'mcq',
        isMultiSelect: q.isMulti || false,
        marks: q.isMulti ? 12 : 4,
        options: q.isMulti 
          ? q.opts.map(opt => ({ text: opt.t, isCorrect: opt.c }))
          : q.opts.map((text, i) => ({ text, isCorrect: i === q.ans }))
      }));

      const totalMarks = quizQuestions.reduce((sum, q) => sum + q.marks, 0);

      await Quiz.create({
        title: lqz.title,
        description: lqz.description,
        course: "SE2030 - Software Engineering",
        lecturer: lecturer._id,
        duration: 45,
        passingPercentage: 50,
        pricingType: 'free',
        maxAttempts: 3,
        shuffleQuestions: true,
        category: 'lesson_based',
        isPublished: true,
        totalMarks: totalMarks,
        questions: quizQuestions,
      });
      console.log(`Successfully created SE quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 10 Software Engineering lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
