const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const dddLectureQuizzes = [
  {
    title: "DDD Lec 01: Introduction to Domain-Driven Design",
    description: "Core concepts, Ubiquitous Language, and the value of DDD in complex systems.",
    questions: [
      { q: "Who authored the seminal 'Blue Book' on Domain-Driven Design?", opts: ["Martin Fowler", "Eric Evans", "Robert C. Martin", "Vaughn Vernon"], ans: 1 },
      { q: "DDD's primary focus is on the...", opts: ["Database schema", "Core Domain and its logic", "UI/UX design", "Network infrastructure"], ans: 1 },
      { q: "What is 'Ubiquitous Language'?", opts: ["A programming language", "Common language shared by devs and domain experts", "Encryption standard", "DB query language"], ans: 1 },
      { q: "A 'Strategic' pattern in DDD is:", opts: ["Entity", "Value Object", "Bounded Context", "Factory"], ans: 2 },
      { q: "The goal of a 'Model' in DDD is to:", opts: ["Be a 1:1 copy of reality", "Abstract essential knowledge to solve problems", "Look good in diagrams", "Generate code automatically"], ans: 1 },
      { q: "Complexity in software usually comes from:", opts: ["Syntax errors", "A messy 'Big Ball of Mud' domain", "Slow CPU", "RAM limits"], ans: 1 },
      { q: "A 'Knowledge Crunching' session involves:", opts: ["Updating GPU drivers", "Devs learning from Domain Experts", "Stress testing", "Debugging"], ans: 1 },
      { q: "Domain logic belongs in the:", opts: ["Controller", "Domain Model", "Service Layer", "Database triggers"], ans: 1 },
      { q: "Which is NOT a DDD pillar?", opts: ["Strategic Design", "Tactical Design", "Visual Basic Coding", "Ubiquitous Language"], ans: 2 },
      { q: "DDD is best suited for:", opts: ["Simple CRUD apps", "Highly complex business domains", "Single-page websites", "Mobile UI only"], ans: 1 },
      { q: "Identify DDD Strategic Patterns:", opts: [{t: "Bounded Context", c: true}, {t: "Context Map", c: true}, {t: "Subdomain", c: true}, {t: "Value Object", c: false}], isMulti: true, marks: 10 },
      { q: "Characteristics of Ubiquitous Language:", opts: [{t: "Eliminates translation between tech/business", c: true}, {t: "Used in code and speech", c: true}, {t: "Found in requirement docs", c: true}, {t: "Changes every week", c: false}], isMulti: true, marks: 10 },
      { q: "What defines a 'Domain'?", opts: [{t: "A sphere of knowledge", c: true}, {t: "Activity or interest", c: true}, {t: "The hosting server", c: false}], isMulti: true, marks: 10 },
      { q: "Benefits of DDD:", opts: [{t: "Common language", c: true}, {t: "Better modularity", c: true}, {t: "Focus on business value", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: class Product { ... } \nIn DDD, if Product names change based on marketing feedback, where should this policy reside?", opts: [{t: "Product Entity", c: true}, {t: "Domain Service", c: true}, {t: "UI Controller", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 02: Strategic Design & Bounded Contexts",
    description: "Subdomains, Bounded Contexts, and Context Mapping techniques.",
    questions: [
      { q: "A Bounded Context defines the boundary for a specific...", opts: ["Database", "Language/Model", "Server", "Team"], ans: 1 },
      { q: "Which subdomain is the most critical to competitive advantage?", opts: ["Generic", "Core", "Supporting", "Infrastructure"], ans: 1 },
      { q: "What is a 'Big Ball of Mud'?", opts: ["A database type", "Haphazardly structured system with no boundaries", "Cloud platform", "New UI trend"], ans: 1 },
      { q: "Context Mapping describes the relationship between:", opts: ["Tables", "Bounded Contexts", "Servers", "Functions"], ans: 1 },
      { q: "An 'Anticorruption Layer' (ACL) is used to:", opts: ["Stop hackers", "Protect a model from a messy external system", "Speed up DB", "Clean UI"], ans: 1 },
      { q: "Which relationship has a 'Supplier/Consumer' nature?", opts: ["Shared Kernel", "Upstream/Downstream", "Customer/Supplier", "Both 2 & 3"], ans: 3 },
      { q: "A 'Supporting Subdomain' is:", opts: ["A core secret", "Necessary for core but not special", "Off-the-shelf software", "Useless"], ans: 1 },
      { q: "A 'Generic Subdomain' is best handled by:", opts: ["Custom coding", "Off-the-shelf software / Outsourcing", "Ignoring it", "Serverless"], ans: 1 },
      { q: "Shared Kernel means:", opts: ["Copied code", "Teams agree to share a subset of the model", "Shared database only", "None"], ans: 1 },
      { q: "Open Host Service (OHS) provides:", opts: ["Private API", "Standardized protocol for many integrations", "Hardware access", "No access"], ans: 1 },
      { q: "Types of Subdomains:", opts: [{t: "Core", c: true}, {t: "Supporting", c: true}, {t: "Generic", c: true}, {t: "External", c: false}], isMulti: true, marks: 10 },
      { q: "Context Map relationships:", opts: [{t: "ACL", c: true}, {t: "Shared Kernel", c: true}, {t: "Conformist", c: true}, {t: "Partitioned", c: false}], isMulti: true, marks: 10 },
      { q: "Why use Bounded Contexts?", opts: [{t: "Split large models", c: true}, {t: "Allow teams to work independently", c: true}, {t: "Force one DB for all", c: false}], isMulti: true, marks: 10 },
      { q: "Characteristics of a Core Subdomain:", opts: [{t: "Highest priority", c: true}, {t: "Difficult to replace", c: true}, {t: "Source of ROI", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: If Team A uses 'Account' as a balance holder and Team B uses it as a 'Credential', these should be in:", opts: [{t: "Separate Bounded Contexts", c: true}, {t: "One big class", c: false}, {t: "The same file", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 03: Entities and Value Objects",
    description: "Tactical design patterns for modeling state and identity.",
    questions: [
      { q: "An Entity is defined primarily by its:", opts: ["Attributes", "Unique Identity", "Methods", "Location"], ans: 1 },
      { q: "A Value Object is defined primarily by its:", opts: ["Identity", "Attributes/State", "Memory address", "Length"], ans: 1 },
      { q: "Value Objects should always be:", opts: ["Mutable", "Immutable", "Generic", "Private"], ans: 1 },
      { q: "Two Value Objects are equal if:", opts: ["IDs match", "All their attributes match", "Addresses match", "Size matches"], ans: 1 },
      { q: "Which is a characteristic of an Entity?", opts: ["Stateless", "Continuity through changes", "Temporary", "Global only"], ans: 1 },
      { q: "Value Objects can have:", opts: ["No methods", "Behavior/Logic related to values", "Its own ID", "Sub-entities"], ans: 1 },
      { q: "A 'Currency' object containing 'Code' and 'Symbol' is a:", opts: ["Entity", "Value Object", "Aggregate", "Service"], ans: 1 },
      { q: "A 'User' object with a unique 'UUID' is a:", opts: ["Entity", "Value Object", "Template", "Constant"], ans: 0 },
      { q: "To change a Value Object, you must:", opts: ["Modify its fields", "Replace with a new instance", "Delete the DB", "Wait"], ans: 1 },
      { q: "Side-effect free functions are best placed in:", opts: ["Entities", "Value Objects", "Controllers", "SQL"], ans: 1 },
      { q: "Entity Characteristics:", opts: [{t: "Identity", c: true}, {t: "Continuity", c: true}, {t: "State change", c: true}, {t: "Immutability", c: false}], isMulti: true, marks: 10 },
      { q: "Value Object Characteristics:", opts: [{t: "No identity", c: true}, {t: "Immutable", c: true}, {t: "Equality by values", c: true}, {t: "Side-effect behavior", c: false}], isMulti: true, marks: 10 },
      { q: "Which are likely Value Objects?", opts: [{t: "Color(R,G,B)", c: true}, {t: "Address", c: true}, {t: "Money", c: true}, {t: "Customer", c: false}], isMulti: true, marks: 10 },
      { q: "Why use Value Objects?", opts: [{t: "Reduce complexity", c: true}, {t: "Avoid identity tracking", c: true}, {t: "Easier to test", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nconst v1 = new Money(100, 'USD'); \nconst v2 = new Money(100, 'USD'); \nIn DDD, (v1 == v2) should be:", opts: [{t: "True", c: true}, {t: "False", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 04: Aggregates and Roots",
    description: "Managing consistency boundaries and enforcing business invariants.",
    questions: [
      { q: "An Aggregate is a cluster of objects that form a...", opts: ["Networking group", "Consistency boundary", "List", "Database"], ans: 1 },
      { q: "The 'Aggregate Root' is the only member that can be:", opts: ["Private", "Referenced externally", "Deleted", "Modified"], ans: 1 },
      { q: "A 'Business Invariant' is a rule that must be:", opts: ["Optional", "Always True (Consistent)", "Slow", "User defined"], ans: 1 },
      { q: "Invariants are enforced by the:", opts: ["Repository", "Aggregate Root", "Controller", "UI"], ans: 1 },
      { q: "References between Aggregates should ideally be by:", opts: ["Object reference", "Global ID", "Local Name", "SQL Query"], ans: 1 },
      { q: "Transactional consistency is guaranteed for:", opts: ["All aggregates", "A single aggregate instance", "Multiple Bounded Contexts", "Entire DB"], ans: 1 },
      { q: "Which is a rule for Aggregate design?", opts: ["Design big aggregates", "Reference by identity", "Model as small as possible", "Both 2 & 3"], ans: 3 },
      { q: "Aggregate Root acts as a:", opts: ["DB Connection", "Gateway / Guard for the aggregate", "View", "Constant"], ans: 1 },
      { q: "Eventual Consistency is used across:", opts: ["Single Aggregate", "Multiple Aggregates", "Private methods", "None"], ans: 1 },
      { q: "Deleting a Root should:", opts: ["Keep child objects", "Delete all objects in aggregate", "Do nothing", "Save logs"], ans: 1 },
      { q: "Aggregate Design Principles:", opts: [{t: "Model small", c: true}, {t: "Enforce invariants", c: true}, {t: "Reference by Identity", c: true}, {t: "No logic", c: false}], isMulti: true, marks: 10 },
      { q: "What belongs in an Aggregate?", opts: [{t: "Root Entity", c: true}, {t: "Local Entities", c: true}, {t: "Value Objects", c: true}], isMulti: true, marks: 10 },
      { q: "Common mistakes in Aggregate design:", opts: [{t: "Aggregates too large", c: true}, {t: "Shared databases", c: false}, {t: "Weak invariants", c: true}], isMulti: true, marks: 10 },
      { q: "Techniques for multi-aggregate updates:", opts: [{t: "Sagas", c: true}, {t: "Domain Events", c: true}, {t: "Distributed Transaction", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nclass Order { items: OrderItem[] } \nIf total price must be calculated when an item is added, 'Order' is a:", opts: [{t: "Aggregate Root", c: true}, {t: "Value Object", c: false}, {t: "Simple Entity", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 05: Domain Services and Factories",
    description: "Orchestrating logic that doesn't fit in a single object.",
    questions: [
      { q: "A Domain Service is used when logic...", opts: ["Belongs to an Entity", "Involves multiple objects or a process", "Is generic", "Is data access"], ans: 1 },
      { q: "A Factory's main responsibility is:", opts: ["Saving data", "Object creation logic", "Testing", "Networking"], ans: 1 },
      { q: "Domain Services are typically:", opts: ["Stateful", "Stateless", "Mutable", "Private"], ans: 1 },
      { q: "Application Service vs Domain Service:", opts: ["Same", "App Service orchestrates, Domain Service has business logic", "App is logic, Domain is UI", "None"], ans: 1 },
      { q: "Factories are helpful for creating:", opts: ["Constants", "Complex Aggregates", "Global vars", "Hard drives"], ans: 1 },
      { q: "Injecting a Domain Service into an Entity is usually:", opts: ["Recommended", "Discouraged (Try to pass as parameter)", "Mandatory", "Fast"], ans: 1 },
      { q: "Service naming should follow the:", opts: ["Developer's name", "Ubiquitous Language", "Library name", "Random"], ans: 1 },
      { q: "Factory methods can be on the:", opts: ["Aggregate Root", "Domain Service", "Dedicated Factory class", "All of above"], ans: 3 },
      { q: "A 'Pure Fabrication' is another name for:", opts: ["Aggregate", "Service", "Value Object", "Bug"], ans: 1 },
      { q: "When a process spans multiple aggregates, use a:", opts: ["Repository", "Domain Service", "Value Object", "SQL View"], ans: 1 },
      { q: "When to use a Domain Service:", opts: [{t: "Business logic spanning multiple entities", c: true}, {t: "Pure transformations/calculations", c: true}, {t: "Database CRUD", c: false}, {t: "Sending emails", c: false}], isMulti: true, marks: 10 },
      { q: "Factory Benefits:", opts: [{t: "Encapsulate creation", c: true}, {t: "Ensure invariants at start", c: true}, {t: "Reduced client coupling", c: true}], isMulti: true, marks: 10 },
      { q: "Identify a Domain Service operation:", opts: [{t: "TransferFunds(Src, Dest, Amt)", c: true}, {t: "CalculateTax(Order)", c: true}, {t: "SaveOrder(Order)", c: false}], isMulti: true, marks: 10 },
      { q: "Difference Application vs Domain Service:", opts: [{t: "App Service interacts with outside world", c: true}, {t: "Domain Service is inside Domain", c: true}, {t: "They are the same", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \ninterface iPaymentGateway { ... } \nA service using this interface should reside in:", opts: [{t: "Infrastructure", c: true}, {t: "Domain Layer (Interface only)", c: true}, {t: "UI Layer", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 06: Repositories and Infrastructure",
    description: "Decoupling domain logic from persistence and external concerns.",
    questions: [
      { q: "A Repository's goal is to:", opts: ["Write SQL in the domain", "Give the illusion of an in-memory collection", "Manage UI", "Encrypt files"], ans: 1 },
      { q: "Repositories should only return:", opts: ["Raw SQL Rows", "Aggregates", "Value Objects", "Strings"], ans: 1 },
      { q: "The Repository interface resides in the:", opts: ["Infrastructure Layer", "Domain Layer", "UI Layer", "Application Layer"], ans: 1 },
      { q: "The Repository implementation resides in the:", opts: ["Domain Layer", "Infrastructure Layer", "App Layer", "SQL"], ans: 1 },
      { q: "One repository should be created per:", opts: ["Entity", "Aggregate Root", "Value Object", "Table"], ans: 1 },
      { q: "Infrastructure Layer handles:", opts: ["Business logic", "Technical concerns (DB, Email, Logging)", "UI layout", "None"], ans: 1 },
      { q: "Dependency Inversion Principle (DIP) allows:", opts: ["Slow code", "Domain to be independent of technical details", "Better UI", "Harder testing"], ans: 1 },
      { q: "Unit of Work (UoW) manages:", opts: ["A single variable", "Transaction boundaries across repositories", "CSS", "RAM"], ans: 1 },
      { q: "Repository methods often include:", opts: ["Add, Remove, FindById", "UpdateCSS, RenderHtml", "StartServer", "LogUser"], ans: 0 },
      { q: "Mapping between Domain Objects and DB should happen in:", opts: ["Domain Layer", "Infrastructure (Mapper)", "Controller", "SQL"], ans: 1 },
      { q: "Repository Responsibilities:", opts: [{t: "Encapsulate querying", c: true}, {t: "Persistence abstraction", c: true}, {t: "Enforcing logic", c: false}, {t: "Mapping", c: true}], isMulti: true, marks: 10 },
      { q: "Infrastructure Layer Examples:", opts: [{t: "MongoDB Driver", c: true}, {t: "SendGrid Client", c: true}, {t: "Logger", c: true}, {t: "Order Logic", c: false}], isMulti: true, marks: 10 },
      { q: "Repository vs DAO:", opts: [{t: "Repository is higher level (Aggregate-based)", c: true}, {t: "DAO is usually 1:1 with tables", c: true}, {t: "They are the same", c: false}], isMulti: true, marks: 10 },
      { q: "Identifying a good Repository method:", opts: [{t: "FindByState(State)", c: true}, {t: "ExecuteRawQuery(SQL)", c: false}, {t: "Save(Aggregate)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nclass UserRepo { GetById(id) { return db.users.find(id); } } \nIf this returns a plain JSON object, what's missing?", opts: [{t: "Mapping to User Aggregate", c: true}, {t: "Encrpytion", c: false}, {t: "A better name", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 07: Domain Events",
    description: "Asynchronous communication and side effects using events.",
    questions: [
      { q: "A Domain Event describes something that...", opts: ["Will happen", "Has already happened in the domain", "Is a user click", "Saves to DB"], ans: 1 },
      { q: "Domain Event names should be in:", opts: ["Present tense", "Past tense", "Future tense", "CamelCase only"], ans: 1 },
      { q: "Events allow Bounded Contexts to remain:", opts: ["Coupled", "Decoupled", "Sequential", "Private"], ans: 1 },
      { q: "Where are Domain Events typically dispatched from?", opts: ["SQL", "Aggregate Root or Domain Service", "UI", "Controller"], ans: 1 },
      { q: "An 'Event Subscriber' reacts to:", opts: ["User clicks", "Dispatched Domain Events", "SQL Errors", "Price change"], ans: 1 },
      { q: "Side effects (e.g. Email after Order) are best handled via:", opts: ["Direct calls", "Domain Events", "Static variables", "None"], ans: 1 },
      { q: "Event Sourcing is a pattern where state is derived from:", opts: ["A table snapshot", "A sequence of all events", "A log file", "User memory"], ans: 1 },
      { q: "Eventual Consistency is achieved via:", opts: ["Locks", "Asynchronous Event Handling", "Single Transaction", "Wait"], ans: 1 },
      { q: "A Domain Event should be:", opts: ["Mutable", "Immutable", "Generic", "Fast"], ans: 1 },
      { q: "Integration Events are used between:", opts: ["Sub-methods", "Bounded Contexts", "Tables", "Hard drives"], ans: 1 },
      { q: "Domain Event Examples:", opts: [{t: "OrderPlaced", c: true}, {t: "EmailSent", c: true}, {t: "PaymentFailed", c: true}, {t: "ButtonClicked", c: false}], isMulti: true, marks: 10 },
      { q: "Why use Domain Events?", opts: [{t: "Decoupling side effects", c: true}, {t: "Auditing", c: true}, {t: "Scalability", c: true}, {t: "Speed", c: false}], isMulti: true, marks: 10 },
      { q: "Event components:", opts: [{t: "Timestamp", c: true}, {t: "Payload/Data", c: true}, {t: "Unique ID", c: true}], isMulti: true, marks: 10 },
      { q: "Subscribing to events can lead to:", opts: [{t: "Eventually consistent updates", c: true}, {t: "Simplified logic", c: true}, {t: "Infinite loops (if careful)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nclass User { register() { this.recordEvent(new UserRegistered(this.id)); } } \nThis logic is part of:", opts: [{t: "Tactical Design", c: true}, {t: "Event Sourcing", c: false}, {t: "UI Design", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 08: Layered Architecture and Hexagonal Design",
    description: "Organizing the system around the Domain: Clean Arch, Ports & Adapters.",
    questions: [
      { q: "In a standard 4-layer architecture, which layer is in the middle?", opts: ["UI", "Application", "Domain", "Infrastructure"], ans: 2 },
      { q: "Which layer should have ZERO dependencies on other layers?", opts: ["UI", "Application", "Domain", "Infrastructure"], ans: 2 },
      { q: "Hexagonal Architecture is also known as:", opts: ["Triangle Arch", "Ports and Adapters", "Big Ball of Mud", "Layered"], ans: 1 },
      { q: "A 'Port' in Hexagonal Architecture is usually an:", opts: ["IP Port", "Interface", "Concrete Class", "Adapter"], ans: 1 },
      { q: "An 'Adapter' in Hexagonal Architecture...", opts: ["Is the domain logic", "Implements the Port (Interface)", "Is a UI box", "None"], ans: 1 },
      { q: "Driving Adapters are:", opts: ["Databases", "User Interfaces / Controllers", "Loggers", "Email APIs"], ans: 1 },
      { q: "Driven Adapters are:", opts: ["User Interfaces", "Persistence / External Services", "Domain Logic", "Code"], ans: 1 },
      { q: "Dependency Rule: Source code dependencies only point...", opts: ["Outwards", "Inwards (towards Domain)", "Nowhere", "Randomly"], ans: 1 },
      { q: "DTOs (Data Transfer Objects) are used for:", opts: ["Domain logic", "Passing data between layers/services", "DB tables", "CSS"], ans: 1 },
      { q: "The Application Layer acts as an:", opts: ["Logic engine", "Orchestrator for use cases", "HTML generator", "SQL wrapper"], ans: 1 },
      { q: "Layers of Clean/Onion Arch:", opts: [{t: "Domain/Entities", c: true}, {t: "Use Cases", c: true}, {t: "Controllers/Adapters", c: true}, {t: "Hard drives", c: false}], isMulti: true, marks: 10 },
      { q: "Hexagonal Architecture Concepts:", opts: [{t: "Inward dependency", c: true}, {t: "Ports (Interfaces)", c: true}, {t: "Adapters", c: true}, {t: "Circular refs", c: false}], isMulti: true, marks: 10 },
      { q: "Application Layer responsibilities:", opts: [{t: "Coordinate use cases", c: true}, {t: "Transaction management", c: true}, {t: "Security checks", c: true}, {t: "Domain logic", c: false}], isMulti: true, marks: 10 },
      { q: "Port types in Hexagonal:", opts: [{t: "Inbound (driving)", c: true}, {t: "Outbound (driven)", c: true}, {t: "TCP Port", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: If a service in the Domain layer tries to call 'fs.readFileSync()', it violates:", opts: [{t: "Layer Isolation", c: true}, {t: "Dependency Rule", c: true}, {t: "Nothing", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DDD Lec 09: Evolving the Domain and Refactoring",
    description: "Maintaining a healthy domain model over time and dealing with legacy.",
    questions: [
      { q: "Refactoring towards 'Insight' means:", opts: ["Formatting code", "Changing model after learning more about the domain", "Deleting files", "SQL Tuning"], ans: 1 },
      { q: "Continuous Integration in DDD includes:", opts: ["Build scripts", "Model and Language synchronization", "Fast CPU", "Price"], ans: 1 },
      { q: "Model Integrity is maintained via:", opts: ["Unit tests", "Bounded Contexts and Context Maps", "Encryption", "Manual check"], ans: 1 },
      { q: "When a Bounded Context stops being 'Clean', it becomes a:", opts: ["Big Ball of Mud", "Diamond Context", "Super Context", "Deleted"], ans: 0 },
      { q: "Refactoring a Domain is risky without:", opts: ["A fast PC", "Automated Regression Tests", "A large team", "A meeting"], ans: 1 },
      { q: "Knowledge Discovery often happens during:", opts: ["Sleeping", "Refactoring and Conversations with experts", "Debugging", "Reading manuals"], ans: 1 },
      { q: "A 'Supple Design' is easy to:", opts: ["Read", "Modify and Extend", "Delete", "Ignore"], ans: 1 },
      { q: "DDD should be applied...", opts: ["Everywhere", "Selectively on complex parts of the system", "Never on legacy", "Always on UI"], ans: 1 },
      { q: "Over-modeling leads to...", opts: ["Faster code", "High maintenance / Over-engineering", "Success", "Low pay"], ans: 1 },
      { q: "Model evolution is a:", opts: ["One-time task", "Continuous process", "End task", "Generic"], ans: 1 },
      { q: "Techniques for Supple Design:", opts: [{t: "Intention-revealing interfaces", c: true}, {t: "Value Objects", c: true}, {t: "Assertion/Contracts", c: true}], isMulti: true, marks: 10 },
      { q: "Ways to handle Legacy systems in DDD:", opts: [{t: "ACL (Anticorruption Layer)", c: true}, {t: "Bubble Context", c: true}, {t: "Complete Rewrite", c: true}, {t: "Ignoring", c: false}], isMulti: true, marks: 10 },
      { q: "Signs of a 'Rotting' domain model:", opts: [{t: "Logic leaks to UI", c: true}, {t: "Big Ball of Mud signs", c: true}, {t: "Rigid structures", c: true}], isMulti: true, marks: 10 },
      { q: "Refactoring vs Rewriting:", opts: [{t: "Refactoring is incremental", c: true}, {t: "Rewriting is high risk", c: true}, {t: "Both are same", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: Renaming 'User.points' to 'Customer.loyaltyCredits' after a business talk is an example of:", opts: [{t: "Refactoring towards Ubiquitous Language", c: true}, {t: "Renaming for fun", c: false}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of dddLectureQuizzes) {
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
        course: "IT2140 - Domain-Driven Design",
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
      console.log(`Successfully created DDD quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 9 DDD lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
