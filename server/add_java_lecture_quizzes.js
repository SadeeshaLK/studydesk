const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const javaQuizzes = [
  {
    title: "Java Lec 01: Introduction & Fundamentals",
    description: "Java environment (JVM/JDK/JRE), variables, and primitive data types.",
    questions: [
      { q: "Which component is responsible for executing Java bytecode?", opts: ["JDK", "JRE", "JVM", "Compiler"], ans: 2 },
      { q: "What is the size of a 'long' data type in Java?", opts: ["4 bytes", "8 bytes", "2 bytes", "16 bytes"], ans: 1 },
      { q: "Which keyword is used to declare a constant in Java?", opts: ["const", "final", "static", "fixed"], ans: 1 },
      { q: "Legal identifier in Java?", opts: ["1variable", "_variable", "var-name", "class"], ans: 1 },
      { q: "Default value of an uninitialized local 'int' variable?", opts: ["0", "null", "No default (compile error)", "Garbage"], ans: 2 },
      { q: "Java is known as a _______ language.", opts: ["Compiled only", "Interpreted only", "Both Compiled and Interpreted", "Assembly"], ans: 2 },
      { q: "Which command is used to compile a Java file?", opts: ["java", "javac", "javadoc", "run"], ans: 1 },
      { q: "Floating point default type is:", opts: ["float", "double", "decimal", "long"], ans: 1 },
      { q: "Extension of a compiled Java class file?", opts: [".java", ".class", ".obj", ".exe"], ans: 1 },
      { q: "Standard output method in Java?", opts: ["printf()", "cout", "System.out.println()", "print()"], ans: 2 },
      { q: "Identify Java primitive types:", opts: [{t: "float", c: true}, {t: "boolean", c: true}, {t: "byte", c: true}, {t: "String", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: public class Test { public static void main(String[] args) { int x = 10; } } Select true:", opts: [{t: "Compiled file is Test.class", c: true}, {t: "main is entry point", c: true}], isMulti: true, marks: 10 },
      { q: "JRE includes:", opts: [{t: "JVM", c: true}, {t: "Library classes", c: true}, {t: "Compiler", c: false}], isMulti: true, marks: 10 },
      { q: "Valid comments in Java:", opts: [{t: "// line", c: true}, {t: "/* block */", c: true}, {t: "/** doc */", c: true}], isMulti: true, marks: 10 },
      { q: "Primitive numeric types:", opts: [{t: "int", c: true}, {t: "short", c: true}, {t: "long", c: true}, {t: "char", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 02: Operators and Control Flow",
    description: "Arithmetic, Relational, Logical operators and if-else/switch selection.",
    questions: [
      { q: "Result of '5 + 2 * 3' in Java?", opts: ["21", "11", "10", "15"], ans: 1 },
      { q: "Logical 'AND' operator in Java?", opts: ["&", "&&", "AND", "|"], ans: 1 },
      { q: "Ternary operator syntax?", opts: ["if-else", "for", "? :", "switch"], ans: 2 },
      { q: "Can 'float' be used in switch expression?", opts: ["Yes", "No", "Only if casted", "Since Java 12"], ans: 1 },
      { q: "Default case in switch is:", opts: ["Mandatory", "Optional", "Error", "Last"], ans: 1 },
      { q: "Relationship operator for 'equality'?", opts: ["=", "==", "===", "equals"], ans: 1 },
      { q: "Which has highest precedence?", opts: ["*", "+", "++ (postfix)", "()"], ans: 3 },
      { q: "Output of `System.out.println(10 % 3);`?", opts: ["1", "3", "0", "3.33"], ans: 0 },
      { q: "Bitwise XOR operator?", opts: ["|", "&", "^", "~"], ans: 2 },
      { q: "Instanceof operator checks for:", opts: ["Value", "Object type", "Memory", "Null"], ans: 1 },
      { q: "Identify Logical Operators:", opts: [{t: "&&", c: true}, {t: "||", c: true}, {t: "!", c: true}, {t: "&", c: false}], isMulti: true, marks: 10 },
      { q: "Statements used for selection:", opts: [{t: "if", c: true}, {t: "switch", c: true}, {t: "while", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int x=10; if(x > 5) { x=2; } else { x=5; } Value of x?", opts: [{t: "2", c: true}, {t: "10", c: false}, {t: "5", c: false}], isMulti: true, marks: 10 },
      { q: "Switch-case can handle:", opts: [{t: "int", c: true}, {t: "String", c: true}, {t: "Enum", c: true}, {t: "double", c: false}], isMulti: true, marks: 10 },
      { q: "Relational operators:", opts: [{t: ">=", c: true}, {t: "!=", c: true}, {t: "==", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 03: Iterations (Loops)",
    description: "For, While, and Do-While loops and their properties.",
    questions: [
      { q: "Which loop is 'Entry-controlled'?", opts: ["while", "do-while", "for", "Both 1 & 3"], ans: 3 },
      { q: "Loop that runs at least once?", opts: ["while", "for", "do-while", "None"], ans: 2 },
      { q: "Skip current iteration and move to next?", opts: ["break", "continue", "skip", "next"], ans: 1 },
      { q: "Standard 'for' loop components count?", opts: ["1", "2", "3", "4"], ans: 2 },
      { q: "Infinite loop condition for while?", opts: ["while(1)", "while(true)", "while(0)", "while(null)"], ans: 1 },
      { q: "Which part of for loop runs exactly once?", opts: ["Condition", "Initialization", "Update", "Body"], ans: 1 },
      { q: "Termination keyword for loops?", opts: ["stop", "break", "exit", "end"], ans: 1 },
      { q: "Nested loops complexity (n * n)?", opts: ["O(n)", "O(2n)", "O(n²)", "O(log n)"], ans: 2 },
      { q: "ForEach loop is also called:", opts: ["Nested loop", "Enhanced for loop", "Map", "While"], ans: 1 },
      { q: "Loop used when iterations are known?", opts: ["while", "for", "do-while", "Any"], ans: 1 },
      { q: "Loop types in Java:", opts: [{t: "for", c: true}, {t: "while", c: true}, {t: "do-while", c: true}, {t: "repeat-until", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: for(int i=0; i<3; i++) { System.out.print(i); } Output?", opts: [{t: "012", c: true}, {t: "123", c: false}, {t: "0123", c: false}], isMulti: true, marks: 10 },
      { q: "While vs Do-While:", opts: [{t: "While checks first", c: true}, {t: "Do-while runs min 1 time", c: true}], isMulti: true, marks: 10 },
      { q: "Standard jump statements:", opts: [{t: "break", c: true}, {t: "continue", c: true}, {t: "return", c: true}, {t: "goto", c: false}], isMulti: true, marks: 10 },
      { q: "Valid infinite loops:", opts: [{t: "for(;;)", c: true}, {t: "while(true)", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 04: Arrays and String Handling",
    description: "Array declaration, 2D arrays, and String class methods.",
    questions: [
      { q: "Starting index of Java array?", opts: ["1", "0", "-1", "Any"], ans: 1 },
      { q: "Attribute to get array length?", opts: ["length()", "size", "length", "count"], ans: 2 },
      { q: "Strings in Java are:", opts: ["Mutable", "Immutable", "Char arrays only", "None"], ans: 1 },
      { q: "Method to compare two strings for equality?", opts: ["==", "equals()", "compare()", "isSame()"], ans: 1 },
      { q: "Declaration of integer array of 5 elements?", opts: ["int a[5];", "int a = new int(5);", "int[] a = new int[5];", "array a[5];"], ans: 2 },
      { q: "Concatenate two strings s1 and s2?", opts: ["s1 + s2", "s1.concat(s2)", "s1.add(s2)", "Both 1 & 2"], ans: 3 },
      { q: "Result of accessing arr[10] for arr size 10?", opts: ["null", "0", "ArrayIndexOutOfBoundsException", "Error"], ans: 2 },
      { q: "Converting integer to string?", opts: ["String.valueOf(i)", "Integer.toString(i)", "i + \"\"", "All of above"], ans: 3 },
      { q: "String method to find a character index?", opts: ["find()", "indexOf()", "search()", "at()"], ans: 1 },
      { q: "2D array initialization example?", opts: ["int[][] a = {{1},{2}};", "int a[1,2];", "int a = [][];", "None"], ans: 0 },
      { q: "Array Characteristics:", opts: [{t: "Fixed size", c: true}, {t: "Object in Java", c: true}, {t: "Homogeneous", c: true}, {t: "Dynamic size", c: false}], isMulti: true, marks: 10 },
      { q: "String Methods:", opts: [{t: "trim()", c: true}, {t: "substring()", c: true}, {t: "toLowerCase()", c: true}, {t: "reverse()", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: String s = \"Java\"; s.concat(\" SE\"); System.out.print(s); Output?", opts: [{t: "Java", c: true}, {t: "Java SE", c: false}, {t: "Strings are immutable", c: true}], isMulti: true, marks: 10 },
      { q: "Multi-dimensional array ways:", opts: [{t: "int[][]", c: true}, {t: "int[] a[]", c: true}, {t: "int a[][]", c: true}], isMulti: true, marks: 10 },
      { q: "StringBuffer vs StringBuilder:", opts: [{t: "SB is thread-safe", c: true}, {t: "SBuilder is faster", c: true}, {t: "Both are mutable", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 05: OOP Fundamentals (Classes & Objects)",
    description: "Defining classes, creating objects, and constructor logic.",
    questions: [
      { q: "Keyword to create an instance of a class?", opts: ["create", "init", "new", "this"], ans: 2 },
      { q: "Blueprint for an object is called:", opts: ["Method", "Variable", "Class", "Package"], ans: 2 },
      { q: "Default constructor has how many parameters?", opts: ["1", "0", "Unlimited", "2"], ans: 1 },
      { q: "State of an object is represented by:", opts: ["Methods", "Return type", "Fields/Attributes", "Constructor"], ans: 2 },
      { q: "Which keyword references the current object?", opts: ["self", "super", "this", "it"], ans: 2 },
      { q: "Constructors in Java:", opts: ["Return void", "Have no return type", "Return the class", "Are methods"], ans: 1 },
      { q: "Class variables shared by all objects are declared as:", opts: ["final", "private", "static", "shared"], ans: 2 },
      { q: "Object destroyed in Java by:", opts: ["delete()", "Garbage Collector", "NULL", "System.exit()"], ans: 1 },
      { q: "Method to define object behavior?", opts: ["Interface", "Field", "Method", "Constructor"], ans: 2 },
      { q: "Constructor name must match:", opts: ["Package name", "Method name", "Class name", "File name"], ans: 2 },
      { q: "OOP Pillars:", opts: [{t: "Encapsulation", c: true}, {t: "Inheritance", c: true}, {t: "Polymorphism", c: true}, {t: "Abstraction", c: true}], isMulti: true, marks: 10 },
      { q: "Constructor types:", opts: [{t: "Default", c: true}, {t: "Parameterized", c: true}, {t: "Copy", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: class A { A() { } } Select true:", opts: [{t: "A() is a constructor", c: true}, {t: "A is a class", c: true}], isMulti: true, marks: 10 },
      { q: "Access Modifiers:", opts: [{t: "public", c: true}, {t: "private", c: true}, {t: "protected", c: true}, {t: "internal", c: false}], isMulti: true, marks: 10 },
      { q: "Object instantiation steps:", opts: [{t: "Declaration", c: true}, {t: "Instantiation", c: true}, {t: "Initialization", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 06: Encapsulation and Data Hiding",
    description: "Private variables, getters/setters, and package access.",
    questions: [
      { q: "Encapsulation combines Data and...", opts: ["Methods", "Hardware", "Users", "Internet"], ans: 0 },
      { q: "Standard modifier for encapsulated variables?", opts: ["public", "private", "protected", "static"], ans: 1 },
      { q: "Method to retrieve a private variable?", opts: ["Setter", "Constructor", "Getter", "Main"], ans: 2 },
      { q: "Data hiding protects from:", opts: ["Deletion", "Direct unauthorized access", "Speed loss", "Bugs"], ans: 1 },
      { q: "Getter methods usually return:", opts: ["void", "The variable type", "int only", "boolean"], ans: 1 },
      { q: "Setters usually have which return type?", opts: ["int", "void", "boolean", "The class"], ans: 1 },
      { q: "Java package is a:", opts: ["Library", "Folder/Namespace for related classes", "Zip file", "Method"], ans: 1 },
      { q: "Default access (no modifier) means:", opts: ["Public anywhere", "Private to class", "Accessible within same package", "Proteced"], ans: 2 },
      { q: "Keyword to use a class from another package?", opts: ["load", "use", "import", "package"], ans: 2 },
      { q: "Encapsulation promotes:", opts: ["Tight coupling", "Loose coupling", "Higher speed", "Less code"], ans: 1 },
      { q: "Benefits of Encapsulation:", opts: [{t: "Control over data", c: true}, {t: "Flexibility", c: true}, {t: "Security", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: private int age; public void setAge(int a) { age=a; } This is:", opts: [{t: "Encapsulation", c: true}, {t: "Setter", c: true}], isMulti: true, marks: 10 },
      { q: "POJO classes typically feature:", opts: [{t: "Private fields", c: true}, {t: "Getters/Setters", c: true}, {t: "Zero logic", c: true}], isMulti: true, marks: 10 },
      { q: "Encapsulation examples:", opts: [{t: "Using classes", c: true}, {t: "Access levels", c: true}, {t: "No variables", c: false}], isMulti: true, marks: 10 },
      { q: "Reasons for data hiding:", opts: [{t: "Prevent corruption", c: true}, {t: "Change implementation easily", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 07: Inheritance and Method Overriding",
    description: "Extending classes, the 'super' keyword, and polymorphism.",
    questions: [
      { q: "Keyword used for inheritance?", opts: ["implements", "extends", "inherits", "subclass"], ans: 1 },
      { q: "Class that is inherited from is called:", opts: ["Child", "Subclass", "Superclass/Parent", "Derived"], ans: 2 },
      { q: "Java supports which type of inheritance?", opts: ["Multiple (with classes)", "Single", "Multilevel", "Both 2 & 3"], ans: 3 },
      { q: "Keyword to call superclass constructor?", opts: ["this()", "super()", "parent()", "base()"], ans: 1 },
      { q: "Can we inherit a 'final' class?", opts: ["Yes", "No", "Only if public", "Sometimes"], ans: 1 },
      { q: "Same method name/params in child as parent is called:", opts: ["Overloading", "Overriding", "Hiding", "Static"], ans: 1 },
      { q: "Annotation used for overriding?", opts: ["@inherit", "@super", "@Override", "@parent"], ans: 2 },
      { q: "Object is the ultimate superclass of all classes in Java?", opts: ["True", "False", "Only for strings", "Wait"], ans: 0 },
      { q: "Private members are inherited by subclasses?", opts: ["True", "False", "Only with super", "Always"], ans: 1 },
      { q: "IS-A relationship is represented by:", opts: ["Aggregation", "Composition", "Inheritance", "Interface"], ans: 2 },
      { q: "Inheritance Types in Java:", opts: [{t: "Single", c: true}, {t: "Multilevel", c: true}, {t: "Hierarchical", c: true}, {t: "Multiple", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: class B extends A { } Select true:", opts: [{t: "A is superclass", c: true}, {t: "B is subclass", c: true}, {t: "B IS-A A", c: true}], isMulti: true, marks: 10 },
      { q: "Overloading vs Overriding:", opts: [{t: "Overriding is in same class", c: false}, {t: "Overriding in child class", c: true}, {t: "Overloading same class", c: true}], isMulti: true, marks: 10 },
      { q: "Uses of 'super' keyword:", opts: [{t: "Access parent field", c: true}, {t: "Call parent method", c: true}, {t: "Call parent constructor", c: true}], isMulti: true, marks: 10 },
      { q: "Can we override a static method?", opts: [{t: "No (Method Hiding)", c: true}, {t: "Yes", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 08: Polymorphism and Abstraction",
    description: "Abstract classes, Interfaces, and Runtime Polymorphism.",
    questions: [
      { q: "Keyword to declare an abstract class?", opts: ["interface", "virtual", "abstract", "final"], ans: 2 },
      { q: "Can we create an object of an abstract class?", opts: ["Yes", "No", "If it has main", "Sometimes"], ans: 1 },
      { q: "Interface contains by default:", opts: ["Concrete methods", "Abstract methods only", "Fields only", "Constructor"], ans: 1 },
      { q: "Keyword to implement an interface?", opts: ["extends", "implements", "inherits", "use"], ans: 1 },
      { q: "Dynamic Method Dispatch used for:", opts: ["Compile-time poly", "Runtime polymorphism", "Errors", "Memory"], ans: 1 },
      { q: "An interface can have how many methods?", opts: ["1", "0", "Unlimited", "Fixed"], ans: 2 },
      { q: "Default methods appeared in interfaces in:", opts: ["Java 5", "Java 7", "Java 8", "Java 11"], ans: 2 },
      { q: "Abstract method has:", opts: ["A body", "No body", "Parameters only", "Void return"], ans: 1 },
      { q: "Runtime polymorphism is achieved via:", opts: ["Method Overloading", "Method Overriding", "Templates", "Pointers"], ans: 1 },
      { q: "Inheritance for interfaces uses:", opts: ["implements", "extends (between interfaces)", "inherits", "None"], ans: 1 },
      { q: "Abstraction vs Encapsulation:", opts: [{t: "Abs is 'what'", c: true}, {t: "Enc is 'how'", c: true}, {t: "Both same", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: Animal a = new Dog(); a.makeSound(); This is:", opts: [{t: "Upcasting", c: true}, {t: "Runtime Poly", c: true}, {t: "Overriding", c: true}], isMulti: true, marks: 10 },
      { q: "Interface characteristics:", opts: [{t: "100% abstract (pre-8)", c: true}, {t: "Fields are static final", c: true}, {t: "Multiple implementation allowed", c: true}], isMulti: true, marks: 10 },
      { q: "Valid Polymorphism:", opts: [{t: "Overloading", c: true}, {t: "Overriding", c: true}, {t: "Casting", c: false}], isMulti: true, marks: 10 },
      { q: "Difference Abstract Class vs Interface:", opts: [{t: "AC can have fields", c: true}, {t: "Interface multiple", c: true}, {t: "AC uses extends", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 09: Exception Handling",
    description: "Try-catch-finally blocks, throw/throws, and custom exceptions.",
    questions: [
      { q: "Which block handles an exception?", opts: ["try", "catch", "finally", "throw"], ans: 1 },
      { q: "Block that always executes regardless of exception?", opts: ["try", "catch", "finally", "else"], ans: 2 },
      { q: "Keyword to manually throw an exception?", opts: ["throws", "throw", "exit", "raise"], ans: 1 },
      { q: "Keyword to declare a method might throw an exception?", opts: ["throw", "throws", "try", "error"], ans: 1 },
      { q: "Superclass of all Exceptions?", opts: ["Error", "Exception", "Throwable", "Object"], ans: 2 },
      { q: "ArithmeticException is a:", opts: ["Checked Exception", "Unchecked (Runtime)", "Error", "None"], ans: 1 },
      { q: "NullPointerException occurs when:", opts: ["Array size 0", "Object is null", "Price is high", "Memory full"], ans: 1 },
      { q: "Checked exceptions are checked at:", opts: ["Runtime", "Compile-time", "Design time", "Server side"], ans: 1 },
      { q: "Can we have multiple 'catch' blocks for one 'try'?", opts: ["Yes", "No", "Only if nested", "Maybe"], ans: 0 },
      { q: "Custom exceptions extend which class?", opts: ["Object", "Exception", "Error", "String"], ans: 1 },
      { q: "Identify Unchecked exceptions:", opts: [{t: "ArithmeticException", c: true}, {t: "NullPointer", c: true}, {t: "IOException", c: false}, {t: "IndexOutOfBounds", c: true}], isMulti: true, marks: 10 },
      { q: "Identify Checked exceptions:", opts: [{t: "SQLException", c: true}, {t: "IOException", c: true}, {t: "RuntimeException", c: false}], isMulti: true, marks: 10 },
      { q: "Block Order Requirement:", opts: [{t: "Try first", c: true}, {t: "Catch second", c: true}, {t: "Finally last", c: true}], isMulti: true, marks: 10 },
      { q: "Exception Handling keywords:", opts: [{t: "try", c: true}, {t: "catch", c: true}, {t: "finally", c: true}, {t: "throw", c: true}, {t: "throws", c: true}], isMulti: true, marks: 10 },
      { q: "System.exit(0) in try block:", opts: [{t: "Terminates JVM", c: true}, {t: "Skips finally", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "Java Lec 10: Collections Framework & File I/O",
    description: "ArrayList, HashMap, and File stream operations.",
    questions: [
      { q: "Dynamic array in Java?", opts: ["Array", "ArrayList", "Vector", "Both 2 & 3"], ans: 3 },
      { q: "Collection for key-value pairs?", opts: ["List", "Set", "Map / HashMap", "Queue"], ans: 2 },
      { q: "Class to create an empty file?", opts: ["File", "Scanner", "Writer", "None"], ans: 0 },
      { q: "Method to add element to ArrayList?", opts: ["put()", "append()", "add()", "push()"], ans: 2 },
      { q: "Set collection stores:", opts: ["Duplicates", "Unique elements only", "Order only", "None"], ans: 1 },
      { q: "Package for collections?", opts: ["java.lang", "java.io", "java.util", "java.net"], ans: 2 },
      { q: "ArrayList vs LinkedList:", opts: ["AL is faster access", "LL is faster for adding/removing", "Wait", "Both 1 & 2"], ans: 3 },
      { q: "Map method to get a value by key?", opts: ["find()", "get()", "pull()", "fetch()"], ans: 1 },
      { q: "Scanner class package?", opts: ["java.io", "java.util", "java.sql", "None"], ans: 1 },
      { q: "Method to read the next integer from console?", opts: ["nextInt()", "readInt()", "getInt()", "input()"], ans: 0 },
      { q: "Identify Collections interfaces:", opts: [{t: "List", c: true}, {t: "Set", c: true}, {t: "Map", c: true}, {t: "ArrayList", c: false}], isMulti: true, marks: 10 },
      { q: "List Implementations:", opts: [{t: "ArrayList", c: true}, {t: "LinkedList", c: true}, {t: "Vector", c: true}, {t: "HashSet", c: false}], isMulti: true, marks: 10 },
      { q: "File Reading classes:", opts: [{t: "FileReader", c: true}, {t: "Scanner", c: true}, {t: "BufferedReader", c: true}], isMulti: true, marks: 10 },
      { q: "Map Implementations:", opts: [{t: "HashMap", c: true}, {t: "TreeMap", c: true}, {t: "Hashtable", c: true}], isMulti: true, marks: 10 },
      { q: "Which are generic classes?", opts: [{t: "ArrayList<T>", c: true}, {t: "List<T>", c: true}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of javaQuizzes) {
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
        course: "JAVA - Object Oriented Programming",
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
      console.log(`Successfully created Java quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 10 Java lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
