const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const ipLectureQuizzes = [
  {
    title: "IP Lec 01: Introduction & Data Types",
    description: "C syntax, primitive types (int, float, char), and variable declaration.",
    questions: [
      { q: "Which character is used to terminate a C statement?", opts: [":", ";", ".", ","], ans: 1 },
      { q: "What is the size of an int on a standard 32-bit system?", opts: ["1 byte", "2 bytes", "4 bytes", "8 bytes"], ans: 2 },
      { q: "Which format specifier is used for a single character?", opts: ["%d", "%f", "%c", "%s"], ans: 2 },
      { q: "What is the first function called in every C program?", opts: ["start()", "init()", "main()", "run()"], ans: 2 },
      { q: "Which of these is a valid variable name?", opts: ["1variable", "total_sum", "total sum", "switch"], ans: 1 },
      { q: "C is a high level programming language.", opts: ["Low", "High", "Middle", "None"], ans: 1 },
      { q: "Which operator is used for assignment?", opts: ["==", ":=", "->", "="], ans: 3 },
      { q: "Value of (5 % 2) in C?", opts: ["2.5", "2", "1", "0"], ans: 2 },
      { q: "Keyword to declare a constant?", opts: ["static", "const", "final", "fixed"], ans: 1 },
      { q: "Header file for printf() and scanf()?", opts: ["<conio.h>", "<math.h>", "<stdio.h>", "<stdlib.h>"], ans: 2 },
      { q: "Identify valid data types in C:", opts: [{t: "int", c: true}, {t: "double", c: true}, {t: "string", c: false}, {t: "float", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int a = 10; char b = 'A'; Select true statements:", opts: [{t: "a is integer", c: true}, {t: "b is char", c: true}, {t: "a+b is valid", c: true}], isMulti: true, marks: 10 },
      { q: "Reserved Keywords in C:", opts: [{t: "if", c: true}, {t: "return", c: true}, {t: "switch", c: true}, {t: "main", c: false}], isMulti: true, marks: 10 },
      { q: "Format Specifiers:", opts: [{t: "%d (int)", c: true}, {t: "%f (float)", c: true}, {t: "%.2f (2 decimal)", c: true}], isMulti: true, marks: 10 },
      { q: "Escape Sequences:", opts: [{t: "newline", c: true}, {t: "tab", c: true}, {t: "return", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 02: Operators and Expressions",
    description: "Arithmetic, Relational, Logical, and Bitwise operators in C.",
    questions: [
      { q: "What is the value of a if: int a = 5; a++;", opts: ["5", "6", "4", "0"], ans: 1 },
      { q: "Which operator has higher precedence?", opts: ["+", "*", "-", "="], ans: 1 },
      { q: "Relational operator for not equal to:", opts: ["<>", "!=", "==", "=!"], ans: 1 },
      { q: "Logical AND operator in C:", opts: ["&", "&&", "AND", "||"], ans: 1 },
      { q: "Bitwise OR operator in C:", opts: ["|", "||", "OR", "^"], ans: 0 },
      { q: "Result of (5 > 2 && 4 < 1)?", opts: ["1 (True)", "0 (False)", "Indeterminate", "Error"], ans: 1 },
      { q: "Which operator is used for a ternary conditional?", opts: ["if-else", "? :", "switch", "while"], ans: 1 },
      { q: "Sizeof() is an:", opts: ["Operator", "Function", "Variable", "Keyword"], ans: 0 },
      { q: "Result of 10 / 3 in C (integer division)?", opts: ["3.33", "3", "3.0", "4"], ans: 1 },
      { q: "Operator for division remainder?", opts: ["/", "\\", "%", "&"], ans: 2 },
      { q: "Identify Unary Operators:", opts: [{t: "++", c: true}, {t: "--", c: true}, {t: "!", c: true}, {t: "+", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Bitwise Operators:", opts: [{t: "&", c: true}, {t: "|", c: true}, {t: "^", c: true}, {t: "&&", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int x = 10, y = 20; int z = x > y ? x : y; What is z?", opts: [{t: "20", c: true}, {t: "10", c: false}], isMulti: true, marks: 10 },
      { q: "Logical Operators in C:", opts: [{t: "&&", c: true}, {t: "||", c: true}, {t: "!", c: true}], isMulti: true, marks: 10 },
      { q: "Compound Assignment Operators:", opts: [{t: "+=", c: true}, {t: "*=", c: true}, {t: "/=", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 03: Control Structures I (Selection)",
    description: "if, if-else, nested if, and switch-case statements.",
    questions: [
      { q: "Default case in switch-case is:", opts: ["Mandatory", "Optional", "Error", "Only for strings"], ans: 1 },
      { q: "Keyword used to exit a switch case?", opts: ["return", "exit", "break", "continue"], ans: 2 },
      { q: "Which control structure is best for multiple discrete values?", opts: ["if-else", "switch", "while", "for"], ans: 1 },
      { q: "Result of if(0) { printf(hi); } else { printf(bye); }?", opts: ["hi", "bye", "hi bye", "Error"], ans: 1 },
      { q: "Nested if means:", opts: ["One if inside another", "if-else chain", "switch inside if", "None"], ans: 0 },
      { q: "Which can be used as a switch expression?", opts: ["float", "int/char", "double", "arrays"], ans: 1 },
      { q: "If break is missing in switch case:", opts: ["Only one case runs", "Fall-through to next case", "Error", "Restart"], ans: 1 },
      { q: "Logical OR (||) results in true if:", opts: ["Both true", "One true", "Both false", "Both 1 & 2"], ans: 3 },
      { q: "Keyword for none of above in switch?", opts: ["else", "default", "other", "final"], ans: 1 },
      { q: "Condition in if must result in:", opts: ["0 or non-zero value", "Always 1", "Char", "String"], ans: 0 },
      { q: "Switch-case properties:", opts: [{t: "Requires break", c: true}, {t: "Expression must be discrete", c: true}, {t: "Can have float", c: false}, {t: "Has default case", c: true}], isMulti: true, marks: 10 },
      { q: "Selection Statements include:", opts: [{t: "if", c: true}, {t: "if-else", c: true}, {t: "switch", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int x = 5; if(x=2) printf(T); printf(F); Output?", opts: [{t: "T", c: true}, {t: "F", c: false}], isMulti: true, marks: 10 },
      { q: "When to use nested if vs switch:", opts: [{t: "Switch for ranges", c: false}, {t: "Nested if for complex ranges", c: true}, {t: "Switch for fixed constants", c: true}], isMulti: true, marks: 10 },
      { q: "Logical negation impacts:", opts: [{t: "!(True) = False", c: true}, {t: "!(5 > 2) = False", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 04: Control Structures II (Loops)",
    description: "for, while, and do-while iterative loops.",
    questions: [
      { q: "Which loop is Exit-controlled?", opts: ["for", "while", "do-while", "None"], ans: 2 },
      { q: "Which loop is guaranteed to run at least once?", opts: ["for", "while", "do-while", "None"], ans: 2 },
      { q: "Infinite loop condition for while?", opts: ["while(0)", "while(1)", "while(TRUE)"], ans: 1 },
      { q: "How many parts are in a standard for loop header?", opts: ["1", "2", "3", "4"], ans: 2 },
      { q: "Keyword to skip the current iteration and go to next?", opts: ["break", "continue", "skip", "return"], ans: 1 },
      { q: "Keyword to terminate the loop entirely?", opts: ["break", "continue", "stop", "exit"], ans: 0 },
      { q: "Entry-controlled loops include:", opts: ["while", "for", "do-while", "Both 1 & 2"], ans: 3 },
      { q: "Increment/Decrement usually happens in which part of for?", opts: ["1st", "2nd", "3rd", "Inside body"], ans: 2 },
      { q: "Default initialization in for(;;) results in:", opts: ["Error", "Infinite loop", "One loop", "0 loops"], ans: 1 },
      { q: "Nested loops are commonly used for:", opts: ["1D arrays", "2D arrays/Matrices", "Inputs", "Nothing"], ans: 1 },
      { q: "Components of for(init; cond; upd):", opts: [{t: "Initialization", c: true}, {t: "Condition", c: true}, {t: "Update", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int i=0; while(i < 3) { i++; } Runs how many times?", opts: [{t: "3", c: true}, {t: "1", c: false}], isMulti: true, marks: 10 },
      { q: "Differences between while and do-while:", opts: [{t: "while is entry-controlled", c: true}, {t: "do-while runs min once", c: true}], isMulti: true, marks: 10 },
      { q: "Termination keywords:", opts: [{t: "break", c: true}, {t: "continue", c: true}], isMulti: true, marks: 10 },
      { q: "Loop complexity: Nested loops (n and m):", opts: [{t: "O(n*m)", c: true}, {t: "O(n2)", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 05: Functions and Scope",
    description: "Definition, calling, parameters, and variable scope (Local/Global).",
    questions: [
      { q: "Keyword used to return a value from a function?", opts: ["output", "send", "return", "back"], ans: 2 },
      { q: "Return type of a function that returns nothing?", opts: ["int", "char", "null", "void"], ans: 3 },
      { q: "A function that calls itself is:", opts: ["Iterative", "Recursive", "Main", "Inline"], ans: 1 },
      { q: "Variable declared inside a function is:", opts: ["Global", "Local", "Static", "External"], ans: 1 },
      { q: "Scope of a Global variable?", opts: ["Entire file", "Inside main only", "One function", "None"], ans: 0 },
      { q: "Parameter passed during function call is:", opts: ["Formal", "Actual", "Dummy", "Static"], ans: 1 },
      { q: "Prototype of a function is used for:", opts: ["Defining logic", "Declaration/Signature", "Testing", "Execution"], ans: 1 },
      { q: "Call by Value means:", opts: ["Copy of value is passed", "Original address is passed", "Global access", "None"], ans: 0 },
      { q: "Call by Reference (pointers) means:", opts: ["Copy passed", "Original address passed", "Hard coding", "Error"], ans: 1 },
      { q: "A function can return how many values using return?", opts: ["0", "1", "Unlimited", "2"], ans: 1 },
      { q: "Function components:", opts: [{t: "Return type", c: true}, {t: "Name", c: true}, {t: "Parameters", c: true}, {t: "Body", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int sum(int x, int y) { return x+y; }", opts: [{t: "sum is name", c: true}, {t: "returns int", c: true}], isMulti: true, marks: 10 },
      { q: "Standard library functions:", opts: [{t: "printf()", c: true}, {t: "pow()", c: true}], isMulti: true, marks: 10 },
      { q: "Benefits of using functions:", opts: [{t: "Reusability", c: true}, {t: "Modularity", c: true}, {t: "Easier debugging", c: true}], isMulti: true, marks: 10 },
      { q: "Recursion base case purpose:", opts: [{t: "Stop infinite calls", c: true}, {t: "Final result", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 06: Arrays - 1D and 2D",
    description: "Indexing, initialization, and matrix operations.",
    questions: [
      { q: "C array starting index?", opts: ["1", "0", "-1", "Any"], ans: 1 },
      { q: "Declaration for array of 10 integers?", opts: ["int a(10);", "int a[10];", "array a[10];", "int[10] a;"], ans: 1 },
      { q: "Accessing 5th element of array arr?", opts: ["arr(4)", "arr[4]", "arr[5]", "arr(5)"], ans: 1 },
      { q: "What is stored at arr[10] for int arr[10];?", opts: ["Last element", "Garbage/Error", "Zero", "First element"], ans: 1 },
      { q: "Declaration for 2D array (3 rows, 4 cols)?", opts: ["int a[3][4];", "int a[4][3];", "int a[3,4];", "dim a[3,4]"], ans: 0 },
      { q: "Array elements are stored in memory...", opts: ["Randomly", "Contiguously", "Singly", "Varies"], ans: 1 },
      { q: "Int a[] = {1, 2, 3}; Size of a?", opts: ["Unknown", "3", "4", "6"], ans: 1 },
      { q: "To calculate average of array, first you need:", opts: ["Product", "Sum", "Max", "Min"], ans: 1 },
      { q: "Transpose of matrix swaps:", opts: ["Signs", "Rows and Columns", "Values", "Everything"], ans: 1 },
      { q: "Correct way to initialize 2D array?", opts: ["{1,2,3,4}", "{{1,2},{3,4}}", "[1,2;3,4]"], ans: 1 },
      { q: "Array properties:", opts: [{t: "Homogeneous elements", c: true}, {t: "Fixed size", c: true}, {t: "0-indexed", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int a[3] = {10, 20, 30}; Result of a[1]?", opts: [{t: "20", c: true}, {t: "10", c: false}], isMulti: true, marks: 10 },
      { q: "Multi-dimensional arrays:", opts: [{t: "2D (Matrix)", c: true}, {t: "3D (Cube)", c: true}], isMulti: true, marks: 10 },
      { q: "Common array errors:", opts: [{t: "Out of bounds access", c: true}, {t: "Mixing data types", c: true}], isMulti: true, marks: 10 },
      { q: "2D Array Memory layout:", opts: [{t: "Row-major order", c: true}, {t: "Linearized", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 07: Pointers - Introduction",
    description: "Address-of, dereferencing, and pointer arithmetic.",
    questions: [
      { q: "Symbol for the address-of operator?", opts: ["*", "&", "@", "address"], ans: 1 },
      { q: "Symbol for the dereference (value-at) operator?", opts: ["&", "*", "->", "val"], ans: 1 },
      { q: "Declaration of an integer pointer p?", opts: ["int p;", "int *p;", "pointer p;", "int &p;"], ans: 1 },
      { q: "What does int *p = &x; store in p?", opts: ["Value of x", "Address of x", "Pointer to p", "None"], ans: 1 },
      { q: "Null pointer typically points to:", opts: ["0 / NULL", "Garbage", "1", "Last addr"], ans: 0 },
      { q: "Incrementing a pointer (p++) increases its value by:", opts: ["1 byte", "size of its data type", "1 bit", "0"], ans: 1 },
      { q: "Relationship between array name and pointers:", opts: ["Same thing", "Array name is constant pointer to first element", "No relation", "Error"], ans: 1 },
      { q: "Pointer to a pointer is declared as:", opts: ["**p", "*p*", "p**", "pointer2"], ans: 0 },
      { q: "Dereferencing a NULL pointer leads to:", opts: ["Value 0", "Segmentation fault / Crash", "Wait", "Correct output"], ans: 1 },
      { q: "Address of a variable is usually in which format?", opts: ["Decimal", "Hexadecimal", "Binary", "Roman"], ans: 1 },
      { q: "Pointer Operators:", opts: [{t: "& (Address-of)", c: true}, {t: "* (Value-at)", c: true}, {t: "-> (Member access)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: int x = 10; int *p = &x; Result of *p?", opts: [{t: "10", c: true}, {t: "Addr", c: false}], isMulti: true, marks: 10 },
      { q: "Pointer Arithmetic valid ops:", opts: [{t: "p + i", c: true}, {t: "p - i", c: true}], isMulti: true, marks: 10 },
      { q: "Generic pointer type in C?", opts: [{t: "void*", c: true}, {t: "any*", c: false}], isMulti: true, marks: 10 },
      { q: "Safety with pointers:", opts: [{t: "Always initialize", c: true}, {t: "Check for NULL", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 08: Strings and String Handling",
    description: "Char arrays, null-terminator, and <string.h> functions.",
    questions: [
      { q: "Strings in C are terminated by which character?", opts: ["newline", "null-zero", "dot", "semi"], ans: 1 },
      { q: "Function to calculate length of string?", opts: ["size()", "length()", "strlen()", "count()"], ans: 2 },
      { q: "Function to copy strings?", opts: ["strcpy()", "memcpy()", "move()", "strcopy()"], ans: 0 },
      { q: "Function to compare strings?", opts: ["cmp()", "strcmp()", "test()", "match()"], ans: 1 },
      { q: "Declaration for a string ST and value Hi?", opts: ["char s = Hi;", "char s[] = Hi;", "string s = Hi;", "char s[2] = Hi;"], ans: 1 },
      { q: "Strcmp() returns 0 if:", opts: ["Different", "Same", "Logic error", "Null"], ans: 1 },
      { q: "Function to concatenate (join) strings?", opts: ["join()", "strcat()", "add()", "merge()"], ans: 1 },
      { q: "Strlen() of Hello? (excluding null)", opts: ["4", "5", "6", "0"], ans: 1 },
      { q: "Which header is required for string functions?", opts: ["<stdio.h>", "<string.h>", "<stdlib.h>", "<ctype.h>"], ans: 1 },
      { q: "How many bytes does C occupy in memory?", opts: ["1", "2 (incl. null)", "0", "4"], ans: 1 },
      { q: "String functions in <string.h>:", opts: [{t: "strlen", c: true}, {t: "strcmp", c: true}, {t: "strrev", c: true}, {t: "strcat", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: char s[10] = Hi; sizeof(s)?", opts: [{t: "10", c: true}, {t: "2", c: false}], isMulti: true, marks: 10 },
      { q: "Correct string initialization:", opts: [{t: "char s[] = Hi;", c: true}, {t: "char *s = Hi;", c: true}], isMulti: true, marks: 10 },
      { q: "Reading string with spaces using scanf(%s)?", opts: [{t: "Stops at first space", c: true}, {t: "Reads full line", c: false}], isMulti: true, marks: 10 },
      { q: "Alternative to read line with spaces:", opts: [{t: "fgets()", c: true}, {t: "scanf %[^n]s", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 09: Structures and Unions",
    description: "User-defined data types, member access, and memory layout.",
    questions: [
      { q: "Keyword to define a structure?", opts: ["struct", "class", "type", "union"], ans: 0 },
      { q: "Operator to access structure members?", opts: ["->", ":", ".", "*"], ans: 2 },
      { q: "Union shares the same memory for all members.", opts: ["Same", "Different", "Separated", "No"], ans: 0 },
      { q: "Size of a Union is equal to:", opts: ["Sum of all members", "Size of largest member", "Fixed 8 bytes", "0"], ans: 1 },
      { q: "Arrow operator (->) is used when accessing members via:", opts: ["Values", "Pointers", "Global vars", "None"], ans: 1 },
      { q: "Structure can contain elements of different data types.", opts: ["Same", "Different", "Float only", "Int only"], ans: 1 },
      { q: "Size of Structure is usually:", opts: ["Small", "Sum of all members (approx)", "0", "Fixed"], ans: 1 },
      { q: "Definition of a struct Book variable b1?", opts: ["b1 Book;", "struct Book b1;", "Book struct b1;", "define Book b1"], ans: 1 },
      { q: "Can a structure contain another structure?", opts: ["Yes (Nested)", "No", "Only if same type", "Error"], ans: 0 },
      { q: "Typedef is used to:", opts: ["Declare vars", "Create aliases for types", "Logic", "Sorting"], ans: 1 },
      { q: "Structure vs Union:", opts: [{t: "Struct separate memory", c: true}, {t: "Union shared memory", c: true}, {t: "Sum vs Max size", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: struct S { int a; char b; };", opts: [{t: "User defined type", c: true}, {t: "S is tag name", c: true}, {t: "a and b are members", c: true}], isMulti: true, marks: 10 },
      { q: "Accessing members:", opts: [{t: "s.a (direct)", c: true}, {t: "p->a (pointer)", c: true}], isMulti: true, marks: 10 },
      { q: "Typedef benefits:", opts: [{t: "Readability", c: true}, {t: "Shorter code", c: true}], isMulti: true, marks: 10 },
      { q: "Self-referential structure used in:", opts: [{t: "Linked Lists", c: true}, {t: "Trees", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "IP Lec 10: File Handling and Memory",
    description: "Opening, reading, writing pipes and basic dynamic memory.",
    questions: [
      { q: "Pointer type used for file handling in C?", opts: ["FILE*", "char*", "int*", "void*"], ans: 0 },
      { q: "Function to open a file?", opts: ["open()", "fopen()", "start()", "create()"], ans: 1 },
      { q: "Mode code for writing to a file?", opts: ["r", "w", "a", "x"], ans: 1 },
      { q: "Mode code for appending to file?", opts: ["r", "w", "a", "t"], ans: 2 },
      { q: "Function to close a file?", opts: ["close()", "fclose()", "end()", "quit()"], ans: 1 },
      { q: "Value of fopen() if file doesn't exist (in r mode)?", opts: ["0", "NULL", "1", "Error string"], ans: 1 },
      { q: "Function to dynamically allocate memory in C?", opts: ["alloc()", "malloc()", "new", "set()"], ans: 1 },
      { q: "Dynamic memory is allocated from which region?", opts: ["Stack", "Heap", "Global", "Code"], ans: 1 },
      { q: "Function to deallocate/free dynamic memory?", opts: ["delete", "remove", "free()", "clear()"], ans: 2 },
      { q: "EOF stands for:", opts: ["End Of File", "Error On File", "Every Other File", "None"], ans: 0 },
      { q: "File Access Modes:", opts: [{t: "r (read)", c: true}, {t: "w (write)", c: true}, {t: "a (append)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: FILE *f = fopen(t.txt, r); if(f == NULL) printf(E);", opts: [{t: "File missing", c: true}, {t: "Permission denied", c: true}], isMulti: true, marks: 10 },
      { q: "Dynamic memory functions in <stdlib.h>:", opts: [{t: "malloc", c: true}, {t: "calloc", c: true}, {t: "realloc", c: true}, {t: "free", c: true}], isMulti: true, marks: 10 },
      { q: "Difference Malloc vs Calloc:", opts: [{t: "Calloc initializes to 0", c: true}, {t: "Malloc is faster", c: true}], isMulti: true, marks: 10 },
      { q: "Dangling pointer occurs when:", opts: [{t: "Freeing memory but keeping pointer", c: true}, {t: "Pointer to local var after exit", c: true}], isMulti: true, marks: 10 }
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

    console.log(`All 10 IP lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
