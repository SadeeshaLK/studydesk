const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const singleSelects = [
  { q: "Which computing discipline primarily focuses on the design and construction of computer systems, integrating hardware and software?", opts: ["Software Engineering", "Computer Engineering", "Information Systems", "Computer Science"], ans: 1 },
  { q: "What does the binary number `1011` represent in decimal format?", opts: ["9", "10", "11", "13"], ans: 2 },
  { q: "How many bits are in a standard fundamental Byte?", opts: ["4", "8", "16", "32"], ans: 1 },
  { q: "Which logic gate outputs TRUE only if BOTH inputs are TRUE?", opts: ["OR", "XOR", "NAND", "AND"], ans: 3 },
  { q: "What is the primary function of the CPU in a computer architecture?", opts: ["Long term data storage", "Executing instructions and data processing", "Displaying visual graphics", "Cooling the motherboard"], ans: 1 },
  { q: "In hexadecimal representation, what decimal value does the letter 'C' correspond to?", opts: ["10", "11", "12", "14"], ans: 2 },
  { q: "Which logic gate functions as an Inverter, changing a 1 to a 0 and a 0 to a 1?", opts: ["NAND", "NOR", "NOT", "XOR"], ans: 2 },
  { q: "What does ASCII stand for in data representation?", opts: ["American Standard Code for Information Interchange", "Asian Standard Computer Information Interface", "Automated System Code for Internal Interchange", "Arithmetic Standard Computation Instruction"], ans: 0 },
  { q: "A kilobyte (KB) is traditionally equal to how many bytes?", opts: ["1000", "1024", "1048", "2048"], ans: 1 },
  { q: "Which Boolean expression represents an OR gate with inputs A and B?", opts: ["A . B", "A' B", "A / B", "A + B"], ans: 3 },
  { q: "Convert the decimal number `15` to binary form:", opts: ["1010", "1111", "1101", "1001"], ans: 1 },
  { q: "Which computing discipline is strictly defined by integrating business processes with IT solutions?", opts: ["Information Technology", "Computer Science", "Information Systems", "Cybersecurity"], ans: 2 },
  { q: "Given an XOR gate with inputs A=1 and B=1, what is the output?", opts: ["1", "0", "Requires a third input", "Undefined"], ans: 1 },
  { q: "In the Von Neumann Architecture, what is the purpose of the ALU?", opts: ["Arithmetic and Logic operations", "Audio and Local Utility", "Asynchronous Local Updates", "Algorithm Loading Unit"], ans: 0 },
  { q: "What is the binary equivalent of the hexadecimal character `F`?", opts: ["1110", "1011", "1111", "1000"], ans: 2 },
  { q: "A diagram shows a D-shaped gate with two inputs and one output. What logic gate is this?", opts: ["OR", "NAND", "AND", "NOT"], ans: 2 },
  { q: "What does the abbreviation RAM stand for?", opts: ["Real Allocator Memory", "Random Access Memory", "Read Access Memory", "Render Active Memory"], ans: 1 },
  { q: "Which logic gate outputs FALSE only if both inputs are FALSE, and TRUE otherwise?", opts: ["NOR", "XOR", "AND", "OR"], ans: 3 },
  { q: "Which of the following is considered volatile memory?", opts: ["Hard Disk Drive", "Solid State Drive", "RAM", "ROM"], ans: 2 },
  { q: "What is the 2's complement of the binary number `0101`?", opts: ["1010", "1011", "1101", "0011"], ans: 1 },
  { q: "If we perform a logical 'NAND' on inputs 1 and 0, the result is:", opts: ["0", "1", "Cannot be determined", "Error"], ans: 1 },
  { q: "Convert the hexadecimal sequence `2A` into decimal.", opts: ["42", "210", "32", "26"], ans: 0 },
  { q: "Which component of the CPU handles controlling the sequence of instructions?", opts: ["ALU", "Cache", "Control Unit", "Registers"], ans: 2 },
  { q: "An arrow-shaped logic gate symbol with a small circle at the end represents:", opts: ["NAND", "NOR", "XOR", "XNOR"], ans: 1 },
  { q: "How many unique values can be represented using exactly 4 bits?", opts: ["4", "8", "16", "32"], ans: 2 },
  { q: "The process of converting a digital signal into an analog signal is handled by a:", opts: ["Modem / DAC", "CPU", "Motherboard", "Logic Gate"], ans: 0 },
  { q: "Which discipline focuses almost entirely on the theory of computation, algorithms, and data structures rather than physical hardware?", opts: ["Computer Engineering", "Computer Science", "Information Technology", "Networking"], ans: 1 },
  { q: "In binary addition, what is the result of `1 + 1`?", opts: ["1", "2", "0 with a carry of 1", "1 with a carry of 1"], ans: 2 },
  { q: "A logic diagram connects the output of an AND gate feeding directly into an inverter. This forms a:", opts: ["NOR gate", "XOR gate", "NAND gate", "Buffer gate"], ans: 2 },
  { q: "Which of the following represents the largest data unit?", opts: ["Terabyte (TB)", "Gigabyte (GB)", "Petabyte (PB)", "Megabyte (MB)"], ans: 2 }
];

const multiSelects = [
  {
    q: "Which of the following numbers are correctly matched with their equivalent representations?",
    opts: [
      { text: "Binary `1100` = Decimal `12`", isCorrect: true },
      { text: "Binary `1001` = Hexadecimal `9`", isCorrect: true },
      { text: "Decimal `16` = Hexadecimal `10`", isCorrect: true },
      { text: "Hexadecimal `A` = Decimal `11`", isCorrect: false },
      { text: "Binary `111` = Decimal `8`", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Consider an XOR (Exclusive OR) gate. Which of the following input combinations yield an output state of 1 (TRUE)?",
    opts: [
      { text: "A=0, B=0", isCorrect: false },
      { text: "A=0, B=1", isCorrect: true },
      { text: "A=1, B=0", isCorrect: true },
      { text: "A=1, B=1", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Identify the primary sub-disciplines historically recognized within the ACM/IEEE Computing Curricula.",
    opts: [
      { text: "Computer Science (CS)", isCorrect: true },
      { text: "Information Systems (IS)", isCorrect: true },
      { text: "Biological Chemistry", isCorrect: false },
      { text: "Software Engineering (SE)", isCorrect: true },
      { text: "Computer Engineering (CE)", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which characteristics strictly define the Von Neumann Computer Architecture?",
    opts: [
      { text: "Memory is shared between program instructions and data.", isCorrect: true },
      { text: "It relies on a quantum superposition processing grid.", isCorrect: false },
      { text: "It consists of a CPU (ALU + Control Unit), Memory, and I/O devices.", isCorrect: true },
      { text: "Instructions are executed sequentially one by one.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Review the logic expression: Z = A + (B . C). If B=0 and C=1, what possible inputs for A will result in Z=1?",
    opts: [
      { text: "A = 1", isCorrect: true },
      { text: "A = 0", isCorrect: false },
      { text: "Requires B to be 1 to function", isCorrect: false },
      { text: "Any state where A is true natively fulfills the OR operand", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following are valid formats/standards for Data/Character Representation in systems?",
    opts: [
      { text: "ASCII", isCorrect: true },
      { text: "Unicode / UTF-8", isCorrect: true },
      { text: "NAND Logic", isCorrect: false },
      { text: "EBCDIC", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following statements about Primary versus Secondary storage are correct?",
    opts: [
      { text: "Primary storage (RAM) is generally faster than secondary storage.", isCorrect: true },
      { text: "Secondary storage (HDD/SSD) is typically non-volatile.", isCorrect: true },
      { text: "Primary storage handles permanent OS archiving.", isCorrect: false },
      { text: "Secondary storage has significantly higher capacities at lower costs.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "If you observe a Logic Diagram comprised entirely of NAND gates, you are looking at:",
    opts: [
      { text: "A Universal Gate implementation configuration.", isCorrect: true },
      { text: "A circuit that can synthesize the behavior of ANY other basic gate (AND, OR, NOT).", isCorrect: true },
      { text: "A circuit that strictly only performs subtraction.", isCorrect: false },
      { text: "A representation restricted solely to floating-point units.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Select the accurate rules of binary arithmetic (addition without multi-bit carry overflow factors):",
    opts: [
      { text: "0 + 0 = 0", isCorrect: true },
      { text: "0 + 1 = 1", isCorrect: true },
      { text: "1 + 1 = 2 (in binary digits)", isCorrect: false },
      { text: "1 + 1 = 0 with a carry of 1", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which attributes heavily apply to the 'Information Technology' (IT) computing discipline compared to traditional 'Computer Science'?",
    opts: [
      { text: "Focuses on the application and deployment of tech in organizational settings.", isCorrect: true },
      { text: "Focuses heavily on algorithm theory, discrete mathematics, and compiler design.", isCorrect: false },
      { text: "Involves managing network systems, security infrastructure, and system administration.", isCorrect: true },
      { text: "Bridges the gap between business needs and user technical support.", isCorrect: true }
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

    // Wipe previous 'FC' instances
    await Quiz.deleteMany({ title: "Fundamentals of Computing - FC" });

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
      title: "Fundamentals of Computing - FC",
      description: "A comprehensive 100-mark assessment covering Digital Logic, Data Representation (Binary/Hex), Computer Architecture, and the various Computing Disciplines.",
      course: "IT1140 - FC",
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
