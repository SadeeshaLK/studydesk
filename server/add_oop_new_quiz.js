const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const questions = [
  // --- SINGLE SELECT (2 Marks each) ---
  {
    q: "Analyze the following Java code:\n```java\nclass Base {\n    public void show() { System.out.print(\"Base \"); }\n}\nclass Derived extends Base {\n    public void show() { System.out.print(\"Derived \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        Base b = new Derived();\n        b.show();\n    }\n}\n```\nWhat is the output?",
    opts: ["Base ", "Derived ", "Compilation Error", "Runtime Error"], ans: 1
  },
  {
    q: "Consider this C++ snippet:\n```cpp\nclass A {\npublic:\n    virtual void f() { cout << \"A\"; }\n};\nclass B : public A {\npublic:\n    void f() { cout << \"B\"; }\n};\nint main() {\n    A *a = new B();\n    a->f();\n    return 0;\n}\n```\nWhat will be printed?",
    opts: ["A", "B", "AB", "Error"], ans: 1
  },
  {
    q: "What is the result of the following Java code?\n```java\ntry {\n    int x = 0;\n    int y = 5 / x;\n} catch (Exception e) {\n    System.out.print(\"Caught \");\n} finally {\n    System.out.print(\"Finally \");\n}\n```",
    opts: ["Caught ", "Finally ", "Caught Finally ", "Error"], ans: 2
  },
  {
    q: "Examine this Java constructor logic:\n```java\nclass Alpha {\n    Alpha() { System.out.print(\"Alpha \"); }\n}\nclass Beta extends Alpha {\n    Beta() {\n        this(5);\n        System.out.print(\"Beta \");\n    }\n    Beta(int x) { System.out.print(\"BetaInt \"); }\n}\n```\nWhat is printed by `new Beta()`?",
    opts: ["Beta BetaInt ", "Alpha BetaInt Beta ", "BetaInt Beta ", "Alpha Beta BetaInt "], ans: 1
  },
  {
    q: "What does this C++ code output?\n```cpp\nclass Box {\n    static int count;\npublic:\n    Box() { count++; }\n    static int getCount() { return count; }\n};\nint Box::count = 0;\nint main() {\n    Box b1, b2, b3;\n    cout << Box::getCount();\n    return 0;\n}\n```",
    opts: ["0", "1", "3", "Undefined"], ans: 2
  },
  { q: "In Java, can an abstract class have a constructor?", opts: ["Yes", "No", "Only if it is private", "Only if it is static"], ans: 0 },
  { q: "Which keyword is used to refer to the current object in C++?", opts: ["self", "this", "me", "current"], ans: 1 },
  { q: "Which access modifier provides the highest level of data hiding?", opts: ["public", "protected", "private", "default"], ans: 2 },
  { q: "What is the return type of a method that does not return any value?", opts: ["int", "void", "null", "empty"], ans: 1 },
  { q: "What is the process of defining two or more methods in the same class with the same name but different parameters?", opts: ["Overriding", "Overloading", "Abstraction", "Encapsulation"], ans: 1 },
  {
    q: "What is the output of this Java code?\n```java\nString s1 = \"hello\";\nString s2 = new String(\"hello\");\nSystem.out.println(s1 == s2);\n```",
    opts: ["true", "false", "Error", "hello"], ans: 1
  },
  { q: "Which of the following is true about a static method?", opts: ["It can access instance variables", "It can use the 'this' keyword", "It can be called without creating an object", "It cannot be overloaded"], ans: 2 },
  { q: "What is the size of an object of an empty class in C++?", opts: ["0 byte", "1 byte", "4 bytes", "8 bytes"], ans: 1 },
  { q: "Which OOP concept is promoted by using interfaces?", opts: ["Encapsulation", "Multiple Inheritance (via implementation)", "Static binding", "Runtime speed"], ans: 1 },
  { q: "What is the default access modifier in C++ classes?", opts: ["public", "private", "protected", "internal"], ans: 1 },
  { q: "Which keyword is used to inherit a class in Java?", opts: ["implements", "inherits", "extends", "super"], ans: 2 },
  { q: "What is the purpose of the 'finally' block in exception handling?", opts: ["To catch exceptions", "To throw exceptions", "To execute code regardless of an exception", "To skip exceptions"], ans: 2 },
  { q: "What is a constructor?", opts: ["A method to destroy objects", "A special method to initialize objects", "A static method", "A private method"], ans: 1 },
  { q: "Which of the following is NOT a pillar of OOP?", opts: ["Abstraction", "Polymorphism", "Encapsulation", "Serialization"], ans: 3 },
  { q: "What is the base class of all classes in Java?", opts: ["Base", "Root", "Object", "Main"], ans: 2 },
  { q: "Can we override a static method in Java?", opts: ["Yes", "No", "Only if it is public", "Only if it is final"], ans: 1 },
  { q: "What is 'Late Binding'?", opts: ["Compile-time polymorphism", "Static binding", "Run-time polymorphism", "Syntax analysis"], ans: 2 },
  { q: "What is the use of 'protected' access modifier?", opts: ["Only within same class", "Within class and its subclasses", "Anywhere in the program", "Only in the main function"], ans: 1 },
  { q: "What is a 'Pure Virtual Function' in C++?", opts: ["A function with no body", "A function assigned = 0", "A private function", "A static function"], ans: 1 },
  { q: "Which of these is an example of 'is-a' relationship?", opts: ["Car has an Engine", "Dog is an Animal", "Student has a Name", "Teacher has a Classroom"], ans: 1 },
  { q: "Which operator is used to access members of an object through a pointer in C++?", opts: [".", "::", "->", "&"], ans: 2 },
  { q: "What is the use of 'final' keyword with a variable in Java?", opts: ["It makes it static", "It makes it a constant", "It makes it private", "It makes it abstract"], ans: 1 },
  { q: "Which concept allows a class to have multiple methods with the same name but different signatures?", opts: ["Polymorphism (Overloading)", "Inheritance", "Encapsulation", "Compilation"], ans: 0 },
  { q: "What happens when an object is passed by value to a function in C++?", opts: ["The actual object is modified", "A copy of the object is created", "A pointer is passed", "A reference is passed"], ans: 1 },
  { q: "Which of these is used to implement 'has-a' relationship?", opts: ["Inheritance", "Composition", "Abstraction", "Overloading"], ans: 1 },

  // --- MULTI SELECT (4 Marks each) ---
  {
    q: "Consider this complex inheritance in Java:\n```java\ninterface A { void x(); }\ninterface B { void y(); }\nclass C implements A, B {\n    public void x() { System.out.print(\"X\"); }\n    public void y() { System.out.print(\"Y\"); }\n}\n```\nWhich of the following are true?",
    opts: [
      { text: "Class C must implement both x() and y().", isCorrect: true },
      { text: "C is-a A.", isCorrect: true },
      { text: "C is-a B.", isCorrect: true },
      { text: "Java supports multiple inheritance through interfaces.", isCorrect: true },
      { text: "An interface can have concrete methods in Java 7.", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which statements about 'Polymorphism' are accurate?",
    opts: [
      { text: "It allows objects of different types to be treated as a common type.", isCorrect: true },
      { text: "Method Overloading is Compile-time polymorphism.", isCorrect: true },
      { text: "Method Overriding is Runtime polymorphism.", isCorrect: true },
      { text: "Polymorphism requires Inheritance.", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Regarding 'Encapsulation', which of these are true?",
    opts: [
      { text: "It helps in data hiding.", isCorrect: true },
      { text: "It reduces coupled code.", isCorrect: true },
      { text: "It makes code more maintainable.", isCorrect: true },
      { text: "It requires all variables to be public.", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Identify valid C++ features:",
    opts: [
      { text: "Multiple Inheritance", isCorrect: true },
      { text: "Operator Overloading", isCorrect: true },
      { text: "Friend Functions", isCorrect: true },
      { text: "Garbage Collection (Automatic)", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "What is true about Constructors in Java?",
    opts: [
      { text: "They can be overloaded.", isCorrect: true },
      { text: "They must have the same name as the class.", isCorrect: true },
      { text: "They can return a value.", isCorrect: false },
      { text: "They are called automatically when an object is created.", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which are valid Exception types in Java?",
    opts: [
      { text: "Checked Exceptions", isCorrect: true },
      { text: "Unchecked Exceptions", isCorrect: true },
      { text: "Errors", isCorrect: true },
      { text: "Warnings", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which keywords are related to Inheritence and Subclasses?",
    opts: [
      { text: "extends", isCorrect: true },
      { text: "super", isCorrect: true },
      { text: "protected", isCorrect: true },
      { text: "static", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which are benefits of Abstraction?",
    opts: [
      { text: "Hides unnecessary complexity.", isCorrect: true },
      { text: "Improves software modularity.", isCorrect: true },
      { text: "Increases code performance significantly.", isCorrect: false },
      { text: "Provides a template for functionality.", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Analyze this snippet:\n```java\nfinal class Locked {}\nclass Key extends Locked {}\n```\nWhat are the multiple outcomes?",
    opts: [
      { text: "Compilation Error on line 2.", isCorrect: true },
      { text: "A final class cannot be inherited.", isCorrect: true },
      { text: "Locked is an abstract class.", isCorrect: false },
      { text: "Key object can still be created if line 2 is removed.", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which of the following are examples of OOP relationships?",
    opts: [
      { text: "Association", isCorrect: true },
      { text: "Aggregation", isCorrect: true },
      { text: "Composition", isCorrect: true },
      { text: "Computation", isCorrect: false }
    ],
    marks: 4, isMulti: true
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    await Quiz.deleteMany({ title: 'Object Oriented Programming - OOP' });

    const dbQuestions = questions.map(q => ({
        questionText: q.q,
        questionType: 'mcq',
        isMultiSelect: q.isMulti || false,
        marks: q.marks || 2,
        options: q.opts.map((opt, idx) => (
            typeof opt === 'string' 
            ? { text: opt, isCorrect: idx === q.ans }
            : { text: opt.text, isCorrect: opt.isCorrect }
        ))
    }));

    const totalMarks = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: 'Object Oriented Programming - OOP',
      description: 'A high-difficulty, 100-mark assessment with dense code analysis on Polymorphism, Class Hierarchies, and Memory Management.',
      course: 'SE1020 - OOP',
      lecturer: lecturer._id,
      duration: 120,
      passingPercentage: 60,
      pricingType: 'free',
      maxAttempts: 3,
      shuffleQuestions: true,
      category: 'final_exam',
      isPublished: true,
      totalMarks: totalMarks,
      questions: dbQuestions,
    });
    
    console.log(`Successfully recreated quiz: ${quiz.title} with ${dbQuestions.length} questions!`);
    console.log(`Verified Total Marks: ${totalMarks}/100`);
    process.exit(0);
  } catch (err) {
    if (err.errors) { console.error(JSON.stringify(err.errors, null, 2)); }
    else { console.error(err.message || err); }
    process.exit(1);
  }
};

run();
