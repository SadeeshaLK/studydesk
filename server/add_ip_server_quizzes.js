const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const ipLectureQuizzes = [
  {
    title: "IP - Lecture 01: Programming Concepts",
    description: "Introduction to computing, C language syntax, and basic data types.",
    questions: [
      { q: "Which character ends a standard C statement?", opts: [":", ";", ".", ","], ans: 1 },
      { q: "Size of 'int' on a 32-bit system?", opts: ["1 byte", "2 bytes", "4 bytes", "8 bytes"], ans: 2 },
      { q: "Format specifier for a single character?", opts: ["%d", "%f", "%c", "%s"], ans: 2 },
      { q: "First function called in a C program?", opts: ["start()", "init()", "main()", "run()"], ans: 2 },
      { q: "Valid variable name in C?", opts: ["1var", "total_sum", "total sum", "switch"], ans: 1 },
      { q: "C is a _____ level language.", opts: ["Low", "High", "Middle", "None"], ans: 1 },
      { q: "Operator for assignment?", opts: ["==", ":=", "->", "="], ans: 3 },
      { q: "Result of (5 % 2)?", opts: ["2.5", "2", "1", "0"], ans: 2 },
      { q: "Declaring a constant in C?", opts: ["static", "const", "final", "fixed"], ans: 1 },
      { q: "Header for printf() and scanf()?", opts: ["<conio.h>", "<math.h>", "<stdio.h>", "<stdlib.h>"], ans: 2 },
      { q: "Identify C primitive data types:", opts: [{t: "int", c: true}, {t: "double", c: true}, {t: "string", c: false}, {t: "float", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int a = 10; char b = 'A';` \nSelect true statements:", opts: [{t: "a is integer", c: true}, {t: "b is char", c: true}, {t: "a+b is valid", c: true}], isMulti: true, marks: 10 },
      { q: "Reserved Keywords in C:", opts: [{t: "if", c: true}, {t: "return", c: true}, {t: "switch", c: true}, {t: "main", c: false}], isMulti: true, marks: 10 },
      { q: "Format Specifiers mapping:", opts: [{t: "%d (int)", c: true}, {t: "%f (float)", c: true}, {t: "%.2f (2 point precision)", c: true}], isMulti: true, marks: 10 },
      { q: "Escape Sequences:", opts: [{t: "\\n (newline)", c: true}, {t: "\\t (tab)", c: true}, {t: "\\r (return)", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 02: Operators & Expressions",
    description: "Arithmetic, Relational, Logical, and Bitwise operations.",
    questions: [
      { q: "Value of 'a' if: `int a = 5; a++;`?", opts: ["5", "6", "4", "0"], ans: 1 },
      { q: "Higher precedence operator?", opts: ["+", "*", "-", "="], ans: 1 },
      { q: "Relational 'not equal' operator?", opts: ["<>", "!=", "==", "=!"], ans: 1 },
      { q: "Logical AND operator in C?", opts: ["&", "&&", "AND", "||"], ans: 1 },
      { q: "Bitwise OR operator?", opts: ["|", "||", "OR", "^"], ans: 0 },
      { q: "Result of `(5 > 2 && 4 < 1)`?", opts: ["1 (True)", "0 (False)", "Indeterminate", "Error"], ans: 1 },
      { q: "Operator for ternary condition?", opts: ["if-else", "? :", "switch", "while"], ans: 1 },
      { q: "Sizeof() is an:", opts: ["Operator", "Function", "Variable", "Keyword"], ans: 0 },
      { q: "Result of `10 / 3` in integer division?", opts: ["3.33", "3", "3.0", "4"], ans: 1 },
      { q: "Operator for division remainder?", opts: ["/", "\\", "%", "&"], ans: 2 },
      { q: "Identify Unary Operators:", opts: [{t: "++", c: true}, {t: "--", c: true}, {t: "!", c: true}, {t: "+", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Bitwise Operators:", opts: [{t: "&", c: true}, {t: "|", c: true}, {t: "^", c: true}, {t: "&&", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int x = 10, y = 20; int z = x > y ? x : y;` z is:", opts: [{t: "20", c: true}, {t: "10", c: false}, {t: "y value", c: true}], isMulti: true, marks: 10 },
      { q: "Logical Operators Category:", opts: [{t: "&&", c: true}, {t: "||", c: true}, {t: "!", c: true}, {t: "==", c: false}], isMulti: true, marks: 10 },
      { q: "Compound Assignment:", opts: [{t: "+=", c: true}, {t: "*=", c: true}, {t: "/=", c: true}, {t: "==", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 03: Control Structures I",
    description: "Decision making using if, if-else, and switch-case.",
    questions: [
      { q: "Switch 'default' case purpose?", opts: ["Runs if no match", "Mandatory", "Error", "Strings only"], ans: 0 },
      { q: "Exit switch block using?", opts: ["return", "exit", "break", "continue"], ans: 2 },
      { q: "Structure for multiple fixed values?", opts: ["if-else", "switch", "while", "for"], ans: 1 },
      { q: "Result of `if(0) { printf(\"hi\"); } else { printf(\"bye\"); }`?", opts: ["hi", "bye", "hi bye", "Error"], ans: 1 },
      { q: "Nested if means:", opts: ["If in if", "if chain", "switch in if", "None"], ans: 0 },
      { q: "Permitted switch-case expression types?", opts: ["float", "int/char", "double", "arrays"], ans: 1 },
      { q: "Missing 'break' in switch leads to:", opts: ["One case runs", "Fall-through", "Error", "Restart"], ans: 1 },
      { q: "Logical OR (||) is true if:", opts: ["Both true", "One true", "Both false", "Both 1 & 2"], ans: 3 },
      { q: "Keyword for 'fallback' in switch?", opts: ["else", "default", "other", "final"], ans: 1 },
      { q: "Condition in 'if' should evaluate to:", opts: ["Numeric value", "Always 1", "Char", "String"], ans: 0 },
      { q: "Switch Properties:", opts: [{t: "Requires break", c: true}, {t: "Expression is discrete", c: true}, {t: "Can have float", c: false}, {t: "Has default", c: true}], isMulti: true, marks: 10 },
      { q: "Selection Statements include:", opts: [{t: "if", c: true}, {t: "if-else", c: true}, {t: "switch", c: true}, {t: "while", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int x = 5; if(x=2) printf(\"T\"); else printf(\"F\");` Output?", opts: [{t: "T", c: true}, {t: "F", c: false}, {t: "Assignment makes it true", c: true}], isMulti: true, marks: 10 },
      { q: "When to use nested if vs switch:", opts: [{t: "Switch for constants", c: true}, {t: "Nested if for ranges", c: true}], isMulti: true, marks: 10 },
      { q: "Logical negation behavior:", opts: [{t: "!(True) = False", c: true}, {t: "!(5 > 2) = False", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 04: Control Structures II",
    description: "Iterative loops: for, while, and do-while.",
    questions: [
      { q: "Which loop is 'Exit-controlled'?", opts: ["for", "while", "do-while", "None"], ans: 2 },
      { q: "Which loop is guaranteed to run at least once?", opts: ["for", "while", "do-while", "None"], ans: 2 },
      { q: "Infinite while loop condition?", opts: ["while(0)", "while(1)", "while(TRUE)", "while(n++)"], ans: 1 },
      { q: "Standard 'for' header components count?", opts: ["1", "2", "3", "4"], ans: 2 },
      { q: "Skip current iteration using?", opts: ["break", "continue", "skip", "return"], ans: 1 },
      { q: "Terminate loop entirely using?", opts: ["break", "continue", "stop", "exit"], ans: 0 },
      { q: "Entry-controlled loops include:", opts: ["while", "for", "do-while", "Both 1 & 2"], ans: 3 },
      { q: "Loop counter update usually occurs where in 'for'?", opts: ["1st", "2nd", "3rd", "Inside body"], ans: 2 },
      { q: "Initialization in `for(;;)` results in:", opts: ["Error", "Infinite loop", "One loop", "0 loops"], ans: 1 },
      { q: "Nested loops are commonly used for:", opts: ["1D arrays", "2D arrays", "Input", "Nothing"], ans: 1 },
      { q: "Components of `for(init; cond; upd)`:", opts: [{t: "Initialization", c: true}, {t: "Condition", c: true}, {t: "Update", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int i=0; while(i < 3) { printf(\"%d\", i); i++; }` Result?", opts: [{t: "012", c: true}, {t: "Runs 3 times", c: true}, {t: "123", c: false}], isMulti: true, marks: 10 },
      { q: "While vs Do-While differences:", opts: [{t: "While is entry controlled", c: true}, {t: "Do-while runs min once", c: true}], isMulti: true, marks: 10 },
      { q: "Jump Keywords in loops:", opts: [{t: "break", c: true}, {t: "continue", c: true}], isMulti: true, marks: 10 },
      { q: "Loop complexity: Nested (n and m):", opts: [{t: "O(n*m)", c: true}, {t: "O(n^2)", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 05: Functions & Modularization",
    description: "Creating functions, parameters, and variable scope.",
    questions: [
      { q: "Keyword to return a value from a function?", opts: ["output", "send", "return", "back"], ans: 2 },
      { q: "Return type of a function returning nothing?", opts: ["int", "char", "null", "void"], ans: 3 },
      { q: "Function calling itself is called?", opts: ["Iterative", "Recursive", "Main", "Inline"], ans: 1 },
      { q: "Variable declared inside a function scope?", opts: ["Global", "Local", "Static", "External"], ans: 1 },
      { q: "Scope of a Global variable?", opts: ["Entire file", "Main only", "One function", "None"], ans: 0 },
      { q: "Parameter passed during function call?", opts: ["Formal", "Actual", "Dummy", "Static"], ans: 1 },
      { q: "Function Prototype is used for?", opts: ["Defining logic", "Declaration/Signature", "Testing", "Execution"], ans: 1 },
      { q: "Call by Value means:", opts: ["Copy is passed", "Original address passed", "Global access", "None"], ans: 0 },
      { q: "Call by Reference (pointers) means:", opts: ["Copy passed", "Original address passed", "Hard coding", "Error"], ans: 1 },
      { q: "Max values a function can return (via return)?", opts: ["0", "1", "Unlimited", "2"], ans: 1 },
      { q: "Function components:", opts: [{t: "Return type", c: true}, {t: "Name", c: true}, {t: "Parameters", c: true}, {t: "Body", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int sum(int x, int y) { return x+y; }` Select true:", opts: [{t: "sum is name", c: true}, {t: "returns int", c: true}, {t: "takes 2 params", c: true}], isMulti: true, marks: 10 },
      { q: "Standard Library Functions:", opts: [{t: "printf()", c: true}, {t: "pow()", c: true}, {t: "sqrt()", c: true}], isMulti: true, marks: 10 },
      { q: "Benefits of using functions:", opts: [{t: "Reusability", c: true}, {t: "Modularity", c: true}, {t: "Ease of debug", c: true}], isMulti: true, marks: 10 },
      { q: "Recursion Base Case importance:", opts: [{t: "Stops infinite calls", c: true}, {t: "Ensures results", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 06: Data Structures - Arrays",
    description: "1D and 2D arrays, indexing, and memory allocation.",
    questions: [
      { q: "C array starting index?", opts: ["1", "0", "-1", "Any"], ans: 1 },
      { q: "Declaration for array of 10 integers?", opts: ["int a(10);", "int a[10];", "array a[10];", "int[10] a;"], ans: 1 },
      { q: "Accessing 5th element of 'arr'?", opts: ["arr(4)", "arr[4]", "arr[5]", "arr(5)"], ans: 1 },
      { q: "Accessing `arr[10]` on `int arr[10];` results in?", opts: ["Last element", "Garbage/Error", "Zero", "First element"], ans: 1 },
      { q: "Declaration for 2D array (3x4)?", opts: ["int a[3][4];", "int a[4][3];", "int a[3,4];", "dim a[3,4]"], ans: 0 },
      { q: "Array elements memory storage?", opts: ["Random", "Contiguous", "Linked", "Floating"], ans: 1 },
      { q: "Size of `int a[] = {1, 2, 3};`?", opts: ["Unknown", "3", "4", "6"], ans: 1 },
      { q: "Transpose of matrix (2D) swaps?", opts: ["Signs", "Rows/Columns", "Data", "Memory"], ans: 1 },
      { q: "Correct 2D initialization?", opts: ["{1,2,3,4}", "{{1,2},{3,4}}", "[1,2;3,4]", "None"], ans: 1 },
      { q: "Elements in an array must be:", opts: ["Different", "Same type (Homogeneous)", "Floating", "Nullable"], ans: 1 },
      { q: "Array Characteristics:", opts: [{t: "Homogeneous", c: true}, {t: "Fixed size", c: true}, {t: "0-indexed", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int a[3] = {10, 20, 30}; printf(\"%d\", a[1]);` Output?", opts: [{t: "20", c: true}, {t: "10 (first element)", c: false}, {t: "a[1] is second", c: true}], isMulti: true, marks: 10 },
      { q: "Multi-dimensional Array Types:", opts: [{t: "1D (Vector)", c: false}, {t: "2D (Matrix)", c: true}, {t: "3D (Cube)", c: true}], isMulti: true, marks: 10 },
      { q: "Common Array Errors:", opts: [{t: "Index out of bounds", c: true}, {t: "Logic error", c: true}, {t: "Mixed data types", c: true}], isMulti: true, marks: 10 },
      { q: "2D Memory Layout Order:", opts: [{t: "Row-major", c: true}, {t: "Column-only", c: false}, {t: "Contiguous", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 07: Memory Management - Pointers",
    description: "Addresses, dereferencing, and pointer arithmetic.",
    questions: [
      { q: "Address-of operator symbol?", opts: ["*", "&", "@", "address"], ans: 1 },
      { q: "Dereference (value-at) symbol?", opts: ["&", "*", "->", "val"], ans: 1 },
      { q: "Integer pointer 'p' declaration?", opts: ["int p;", "int *p;", "pointer p;", "int &p;"], ans: 1 },
      { q: "What does `int *p = &x;` store in p?", opts: ["Value of x", "Address of x", "Address of p", "None"], ans: 1 },
      { q: "Null pointer target address?", opts: ["0 / NULL", "Garbage", "1", "Last addr"], ans: 0 },
      { q: "Incrementing `p++` moves by:", opts: ["1 bit", "sizeof (datatype)", "1 word", "0"], ans: 1 },
      { q: "Relationship between array name and address?", opts: ["None", "Array name is constant ptr", "Both same", "Error"], ans: 1 },
      { q: "Pointer to pointer declaration?", opts: ["**p", "*p*", "p**", "pointer2"], ans: 0 },
      { q: "Dereferencing NULL leads to?", opts: ["Value 0", "Segmentation Fault (Crash)", "Wait", "Correct output"], ans: 1 },
      { q: "Variable address format is usually?", opts: ["Decimal", "Hexadecimal", "Binary", "Roman"], ans: 1 },
      { q: "Pointer Related Operators:", opts: [{t: "& (Address-of)", c: true}, {t: "* (Value-at)", c: true}, {t: "-> (Member access)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `int x = 10; int *p = &x; printf(\"%d\", *p);` Output?", opts: [{t: "10", c: true}, {t: "Addr of x", c: false}, {t: "Value at p is x", c: true}], isMulti: true, marks: 10 },
      { q: "Pointer Arithmetic valid ops:", opts: [{t: "p + i", c: true}, {t: "p - i", c: true}, {t: "p * i", c: false}], isMulti: true, marks: 10 },
      { q: "Global 'generic' pointer type?", opts: [{t: "void*", c: true}, {t: "int*", c: false}], isMulti: true, marks: 10 },
      { q: "Pointer Safety Rules:", opts: [{t: "Initialize always", c: true}, {t: "Check NULL", c: true}, {t: "Use any address", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 08: Character Arrays & Strings",
    description: "Strings in C, null-termination, and string.h library.",
    questions: [
      { q: "C string termination character?", opts: ["\\n", "\\0 (Null)", ".", ";"], ans: 1 },
      { q: "Calculate string length using?", opts: ["size()", "length()", "strlen()", "count()"], ans: 2 },
      { q: "Function to copy strings?", opts: ["strcpy()", "memcpy()", "move()", "strcopy()"], ans: 0 },
      { q: "Function to compare strings?", opts: ["cmp()", "strcmp()", "test()", "match()"], ans: 1 },
      { q: "Correct string declaration for 'Hi'?", opts: ["char s = \"Hi\";", "char s[] = \"Hi\";", "string s = \"Hi\";", "char s[2] = \"Hi\";"], ans: 1 },
      { q: "Strcmp() return value if strings match?", opts: ["1", "0", "-1", "NULL"], ans: 1 },
      { q: "Combine 'append' strings using?", opts: ["join()", "strcat()", "add()", "merge()"], ans: 1 },
      { q: "String length of \"C-Lang\"?", opts: ["5", "6", "7", "Unknown"], ans: 1 },
      { q: "String header requirement?", opts: ["<stdio.h>", "<string.h>", "<stdlib.h>", "<math.h>"], ans: 1 },
      { q: "Bytes for char 'A' in a string?", opts: ["1", "2 (incl null)", "0", "4"], ans: 1 },
      { q: "Functions in String Library:", opts: [{t: "strlen", c: true}, {t: "strcmp", c: true}, {t: "strcat", c: true}, {t: "strrev (non-standard but common)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `char s[10] = \"Hi\"; printf(\"%d\", (int)sizeof(s));` Output?", opts: [{t: "10", c: true}, {t: "3 (incl null)", c: false}], isMulti: true, marks: 10 },
      { q: "String Initialization Ways:", opts: [{t: "char s[] = \"A\";", c: true}, {t: "char *s = \"A\";", c: true}], isMulti: true, marks: 10 },
      { q: "Scanf(\"%s\") limitation:", opts: [{t: "Stops at space", c: true}, {t: "No spaces", c: true}], isMulti: true, marks: 10 },
      { q: "Full line reading with spaces:", opts: [{t: "fgets()", c: true}, {t: "scanf(\" %[^\\n]s\")", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 09: User Defined Types",
    description: "Structures (struct), Unions, and Type Aliasing.",
    questions: [
      { q: "Keyword for defining a structure?", opts: ["struct", "class", "type", "union"], ans: 0 },
      { q: "Accessing struct member operator?", opts: ["->", ":", ".", "*"], ans: 2 },
      { q: "Union shares the _____ address for members?", opts: ["Same", "Different", "Linked", "No"], ans: 0 },
      { q: "Size of Union equals?", opts: ["Sum of all", "Size of largest member", "Fixed", "0"], ans: 1 },
      { q: "Ptr structure access operator?", opts: ["->", ".", "::", "@"], ans: 0 },
      { q: "Heterogeneous data collection?", opts: ["Array", "Structure", "Variable", "Loop"], ans: 1 },
      { q: "Alias creation keyword?", opts: ["define", "typedef", "alias", "type"], ans: 1 },
      { q: "Struct 'Book' variable 'b1' syntax?", opts: ["b1 Book;", "struct Book b1;", "Book struct b1;", "None"], ans: 1 },
      { q: "Can structures be nested?", opts: ["Yes", "No", "Only if static", "Error"], ans: 0 },
      { q: "Size of Structure?", opts: ["Sum of sizes (+ padding)", "Size of largest", "Fixed", "0"], ans: 0 },
      { q: "Structure vs Union differences:", opts: [{t: "Struct separate memory", c: true}, {t: "Union shared memory", c: true}, {t: "Sum vs Max size", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `struct S { int a; char b; };` defines:", opts: [{t: "User data type", c: true}, {t: "Members a/b", c: true}], isMulti: true, marks: 10 },
      { q: "Member Access syntax:", opts: [{t: "obj.field", c: true}, {t: "ptr->field", c: true}], isMulti: true, marks: 10 },
      { q: "Typedef benefits:", opts: [{t: "Short names", c: true}, {t: "Abstraction", c: true}], isMulti: true, marks: 10 },
      { q: "Complex data structures using structs:", opts: [{t: "Linked List", c: true}, {t: "Trees", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP - Lecture 10: Persistent Storage - Files",
    description: "File I/O operations and dynamic memory allocation.",
    questions: [
      { q: "Pointer type for C files?", opts: ["FILE*", "char*", "int*", "stream"], ans: 0 },
      { q: "Function to open a file?", opts: ["open()", "fopen()", "init()", "start()"], ans: 1 },
      { q: "Write mode character?", opts: ["r", "w", "a", "x"], ans: 1 },
      { q: "Append mode character?", opts: ["r", "w", "a", "s"], ans: 2 },
      { q: "Closing file function?", opts: ["close()", "fclose()", "end()", "exit()"], ans: 1 },
      { q: "If file missing in 'r' mode, fopen returns?", opts: ["0", "NULL", "1", "Error"], ans: 1 },
      { q: "Dynamic memory allocation function?", opts: ["malloc()", "calloc()", "realloc()", "All of above"], ans: 3 },
      { q: "Memory allocated by malloc is in?", opts: ["Stack", "Heap", "Cache", "ROM"], ans: 1 },
      { q: "Cleanup dynamic memory using?", opts: ["delete", "remove", "free()", "clear()"], ans: 2 },
      { q: "EOF stands for?", opts: ["End Of File", "Error On File", "None", "Every Other File"], ans: 0 },
      { q: "File Modes Categories:", opts: [{t: "r (read)", c: true}, {t: "w (write)", c: true}, {t: "rb (read binary)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: `FILE *f = fopen(\"t.txt\", \"r\"); if(f == NULL) printf(\"E\");` prints E when?", opts: [{t: "File missing", c: true}, {t: "No permission", c: true}], isMulti: true, marks: 10 },
      { q: "Dynamic Memory library (<stdlib.h>) functions:", opts: [{t: "malloc", c: true}, {t: "free", c: true}, {t: "realloc", c: true}], isMulti: true, marks: 10 },
      { q: "Malloc vs Calloc:", opts: [{t: "Calloc zero-init", c: true}, {t: "Malloc is faster", c: true}], isMulti: true, marks: 10 },
      { q: "Dangling pointer cause:", opts: [{t: "Freeing without nulling", c: true}, {t: "Local pointers after scope", c: true}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of ipLectureQuizzes) {
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
        course: "IT1010 - Introduction to Programming",
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
      console.log(`Successfully created IP quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 10 content-derived IP lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
