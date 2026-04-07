const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const fcLectureQuizzes = [
  {
    title: "FC Lec 01: Evolution and Disciplines of Computing",
    description: "Generations of computers, hardware evolution, CS vs SE vs IT.",
    questions: [
      { q: "Which generation of computers introduced Integrated Circuits (ICs)?", opts: ["1st", "2nd", "3rd", "4th"], ans: 2 },
      { q: "The 'ENIAC' belongs to which generation?", opts: ["1st", "2nd", "3rd", "4th"], ans: 0 },
      { q: "Who is responsible for the 'Stored Program Concept' architecture?", opts: ["Alan Turing", "John von Neumann", "Charles Babbage", "Bill Gates"], ans: 1 },
      { q: "Moore's Law relates to the doubling of:", opts: ["Storage", "Transistors on a chip", "Network speed", "RAM"], ans: 1 },
      { q: "Which computing discipline focuses on the theory of computation?", opts: ["IT", "SE", "CS", "IS"], ans: 2 },
      { q: "A 'Supercomputer' is primarily used for:", opts: ["Browsing", "Gaming", "Complex scientific simulations", "Word processing"], ans: 2 },
      { q: "Vacuum tubes were used in which generation?", opts: ["1st", "2nd", "3rd", "4th"], ans: 0 },
      { q: "Mainframes are designed for:", opts: ["Individuals", "High-volume business transactions", "Portable use", "None"], ans: 1 },
      { q: "Microprocessors appeared in which generation?", opts: ["2nd", "3rd", "4th", "5th"], ans: 2 },
      { q: "Artificial Intelligence is the goal of:", opts: ["3rd Gen", "4th Gen", "5th Gen", "2nd Gen"], ans: 2 },
      { q: "Identify Computing Disciplines:", opts: [{t: "Computer Science", c: true}, {t: "Software Engineering", c: true}, {t: "Information Technology", c: true}, {t: "Mechanical Eng", c: false}], isMulti: true, marks: 10 },
      { q: "Characteristics of 1st Gen Computers:", opts: [{t: "Vacuum tubes", c: true}, {t: "Machine language", c: true}, {t: "Magnetic drums", c: true}, {t: "Small size", c: false}], isMulti: true, marks: 10 },
      { q: "Von Neumann Architecture components:", opts: [{t: "CPU", c: true}, {t: "Memory", c: true}, {t: "I/O units", c: true}, {t: "Cloud", c: false}], isMulti: true, marks: 10 },
      { q: "Cloud Computing service models:", opts: [{t: "IaaS", c: true}, {t: "PaaS", c: true}, {t: "SaaS", c: true}, {t: "QaaS", c: false}], isMulti: true, marks: 10 },
      { q: "Identify 2nd Gen major technologies:", opts: [{t: "Transistors", c: true}, {t: "Assembly language", c: true}, {t: "Punch cards", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "FC Lec 02: Hardware and System Components",
    description: "CPU, Memory types, Storage hierarchy, and Peripheral devices.",
    questions: [
      { q: "Which part of the CPU performs arithmetic and logical operations?", opts: ["Control Unit", "ALU", "Registers", "Cache"], ans: 1 },
      { q: "Volatile memory that loses data on power-off:", opts: ["ROM", "RAM", "Hard Drive", "Optical Disk"], ans: 1 },
      { q: "Fastest memory in the computer hierarchy:", opts: ["Registers", "Cache", "RAM", "Virtual Memory"], ans: 0 },
      { q: "BIOS is stored in:", opts: ["RAM", "ROM", "Hard Drive", "CPU"], ans: 1 },
      { q: "Which is a 'Non-Impact' printer?", opts: ["Dot Matrix", "Laser", "Daisy Wheel", "Line Printer"], ans: 1 },
      { q: "Secondary storage is generally:", opts: ["Volatile", "Non-volatile", "Faster than RAM", "Small"], ans: 1 },
      { q: "A 'Bus' in hardware is a:", opts: ["Physical vehicle", "Set of communication wires", "CPU part", "Monitor type"], ans: 1 },
      { q: "USB stands for:", opts: ["Unique Serial Bus", "Universal Serial Bus", "Under Speed Bus", "None"], ans: 1 },
      { q: "Graphic cards use specialized processors called:", opts: ["CPUs", "GPUs", "ALUs", "CU"], ans: 1 },
      { q: "Cache memory sits between:", opts: ["CPU and RAM", "RAM and Disk", "CPU and Monitor", "Disk and Web"], ans: 0 },
      { q: "Identify Input Devices:", opts: [{t: "Mouse", c: true}, {t: "Keyboard", c: true}, {t: "Scanner", c: true}, {t: "Printer", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Output Devices:", opts: [{t: "Monitor", c: true}, {t: "Speakers", c: true}, {t: "Microphone", c: false}, {t: "Printer", c: true}], isMulti: true, marks: 10 },
      { q: "Secondary storage types:", opts: [{t: "HDD", c: true}, {t: "SSD", c: true}, {t: "SD Card", c: true}, {t: "L1 Cache", c: false}], isMulti: true, marks: 10 },
      { q: "CPU Register types:", opts: [{t: "Program Counter", c: true}, {t: "Accumulator", c: true}, {t: "Instruction Reg", c: true}], isMulti: true, marks: 10 },
      { q: "Motherboard components include:", opts: [{t: "CPU Socket", c: true}, {t: "RAM Slots", c: true}, {t: "Expansion slots", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "FC Lec 03: Data Representation I (Numbers)",
    description: "Binary, Decimal, Octal, Hexadecimal conversions and calculations.",
    questions: [
      { q: "What is the equivalent of Decimal 10 in Binary?", opts: ["1010", "1100", "1001", "1111"], ans: 0 },
      { q: "Base of Hexadecimal system is:", opts: ["2", "8", "10", "16"], ans: 3 },
      { q: "What is Hexadecimal 'A' in Decimal?", opts: ["9", "10", "11", "12"], ans: 1 },
      { q: "Binary 111 is what in Decimal?", opts: ["4", "7", "8", "11"], ans: 1 },
      { q: "How many bits in 1 Byte?", opts: ["4", "8", "16", "32"], ans: 1 },
      { q: "Octal uses digits from:", opts: ["0-1", "0-7", "0-9", "A-F"], ans: 1 },
      { q: "Shortest way to represent 1024 bytes is:", opts: ["1 MB", "1 KB", "1 GB", "1 TB"], ans: 1 },
      { q: "Which digit is NOT valid in Octal?", opts: ["0", "1", "7", "8"], ans: 3 },
      { q: "Binary 1000 converted to Hex is:", opts: ["1", "8", "A", "F"], ans: 1 },
      { q: "The value of 2^10 is:", opts: ["100", "512", "1000", "1024"], ans: 3 },
      { q: "CALCULATION: Convert Decimal 15 to Binary, Octal, and Hex:", opts: [{t: "Bin: 1111", c: true}, {t: "Oct: 17", c: true}, {t: "Hex: F", c: true}, {t: "Hex: E", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Binary numbers:", opts: [{t: "10101", c: true}, {t: "0", c: true}, {t: "202", c: false}, {t: "111", c: true}], isMulti: true, marks: 10 },
      { q: "Hexadecimal digits include:", opts: [{t: "A", c: true}, {t: "B", c: true}, {t: "G", c: false}, {t: "F", c: true}], isMulti: true, marks: 10 },
      { q: "1 Gigabyte (GB) equals:", opts: [{t: "1024 MB", c: true}, {t: "2^30 bytes", c: true}, {t: "1000 MB", c: false}], isMulti: true, marks: 10 },
      { q: "CALCULATION: Find Binary 1011 + 0001.", opts: [{t: "1100", c: true}, {t: "12 (Decimal)", c: true}, {t: "1012", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "FC Lec 04: Data Representation II (Text & Images)",
    description: "ASCII, Unicode, Bitmap vs Vector and Data compression.",
    questions: [
      { q: "Standard ASCII uses how many bits?", opts: ["7", "16", "32", "64"], ans: 0 },
      { q: "Which standard can represent almost all languages?", opts: ["ASCII", "Unicode", "EBCDIC", "Binary"], ans: 1 },
      { q: "A 'Pixel' is:", opts: ["Picture Element", "Power Level", "Point Element", "Processor Unit"], ans: 0 },
      { q: "Bitmap images are made of:", opts: ["Vectors", "Pixels/Grids", "Lines", "Equations"], ans: 1 },
      { q: "Lossy compression means:", opts: ["Data is identical after unzip", "Data is lost to save space", "No changes", "Binary only"], ans: 1 },
      { q: "Standard format for lossless web images:", opts: ["JPG", "GIF", "PNG", "BMP"], ans: 2 },
      { q: "Resolution is measured in:", opts: ["Hertz", "DPI / PPI", "Watts", "Pixels"], ans: 1 },
      { q: "Vector images use:", opts: ["Pixels", "Mathematical formulas", "Dots", "Strings"], ans: 1 },
      { q: "Number of characters in standard 7-bit ASCII?", opts: ["127", "128", "256", "1024"], ans: 1 },
      { q: "Color depth of 8 bits allows how many colors?", opts: ["16", "64", "256", "1024"], ans: 2 },
      { q: "Identify Text Encoding standards:", opts: [{t: "Unicode", c: true}, {t: "ASCII", c: true}, {t: "UTF-8", c: true}, {t: "MP3", c: false}], isMulti: true, marks: 10 },
      { q: "Image formats (Lossless):", opts: [{t: "PNG", c: true}, {t: "BMP", c: true}, {t: "JPG", c: false}, {t: "TIFF", c: true}], isMulti: true, marks: 10 },
      { q: "Identify Lossy formats:", opts: [{t: "JPEG", c: true}, {t: "MP3", c: true}, {t: "MPEG", c: true}, {t: "ZIP", c: false}], isMulti: true, marks: 10 },
      { q: "Vector image properties:", opts: [{t: "Scalable", c: true}, {t: "No pixelation", c: true}, {t: "Good for photos", c: false}], isMulti: true, marks: 10 },
      { q: "CALCULATION: 10x10 pixel image with 8-bit color. Total size in bits?", opts: [{t: "800", c: true}, {t: "100", c: false}, {t: "100 bytes", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "FC Lec 05: Digital Logic I (Gates)",
    description: "AND, OR, NOT, NAND, NOR, and XOR gates with truth tables.",
    questions: [
      { q: "Which gate outputs 1 only when BOTH inputs are 1?", opts: ["OR", "AND", "XOR", "NAND"], ans: 1 },
      { q: "Which gate is an 'Inverter'?", opts: ["AND", "OR", "NOT", "NOR"], ans: 2 },
      { q: "NAND gate is equivalent to:", opts: ["AND + NOT", "OR + NOT", "NOT + NOT", "AND + OR"], ans: 0 },
      { q: "The XOR gate outputs 1 when:", opts: ["Both are same", "Inputs are different", "Both are 0", "Both are 1"], ans: 1 },
      { q: "Which gate is called the 'Universal Gate'?", opts: ["AND", "OR", "NAND", "XOR"], ans: 2 },
      { q: "Truth table for OR gate with inputs 0 and 1 results in:", opts: ["0", "1", "Indeterminate", "Null"], ans: 1 },
      { q: "NOR gate outputs 1 only when:", opts: ["Both are 1", "Both are 0", "One is 1", "Always"], ans: 1 },
      { q: "Total rows in a truth table for 3 inputs?", opts: ["4", "6", "8", "9"], ans: 2 },
      { q: "Which gate symbol looks like a triangle with a circle?", opts: ["AND", "OR", "NOT", "NAND"], ans: 2 },
      { q: "Output of (A AND B) where A=1, B=0?", opts: ["1", "0", "A", "B"], ans: 1 },
      { q: "Identify Logic Gates:", opts: [{t: "AND", c: true}, {t: "OR", c: true}, {t: "XOR", c: true}, {t: "GATE", c: false}], isMulti: true, marks: 10 },
      { q: "DIAGRAM LOGIC: Input A=1 to a NOT gate. Output?", opts: [{t: "0", c: true}, {t: "False", c: true}, {t: "1", c: false}], isMulti: true, marks: 10 },
      { q: "Which are Universal Gates?", opts: [{t: "NAND", c: true}, {t: "NOR", c: true}, {t: "AND", c: false}, {t: "OR", c: false}], isMulti: true, marks: 10 },
      { q: "Output of XOR for inputs (0,0) and (1,1):", opts: [{t: "Both 0", c: true}, {t: "Both 1", c: false}, {t: "0 and 1", c: false}], isMulti: true, marks: 10 },
      { q: "Logic Gate Symbols:", opts: [{t: "D-shape (AND)", c: true}, {t: "Shield (OR)", c: true}, {t: "Circle dot (Inverter)", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "FC Lec 06: Digital Logic II (Circuits)",
    description: "Boolean Algebra, Combinational circuits, Adders and Multiplexers.",
    questions: [
      { q: "A + 0 = ?", opts: ["0", "A", "1", "A'"], ans: 1 },
      { q: "A . A' = ?", opts: ["A", "1", "0", "A'"], ans: 2 },
      { q: "De Morgan's Theorem: (A+B)' =", opts: ["A' + B'", "A'.B'", "A+B", "A.B"], ans: 1 },
      { q: "A Half Adder can add how many bits?", opts: ["1", "2", "3", "4"], ans: 1 },
      { q: "A Full Adder has how many inputs?", opts: ["2", "3", "4", "5"], ans: 1 },
      { q: "Which circuit selects one output from many inputs?", opts: ["Encoder", "Decoder", "Multiplexer (MUX)", "Adder"], ans: 2 },
      { q: "Result of A + A'B is:", opts: ["A", "B", "A+B", "1"], ans: 2 },
      { q: "A circuit that converts n lines to 2^n lines is a:", opts: ["Multiplexer", "Decoder", "Encoder", "Summator"], ans: 1 },
      { q: "Boolean law: A + A = ?", opts: ["2A", "A", "1", "0"], ans: 1 },
      { q: "A . 1 = ?", opts: ["1", "0", "A", "A'"], ans: 2 },
      { q: "Identify Boolean Laws:", opts: [{t: "A + 0 = A", c: true}, {t: "A . A = A", c: true}, {t: "A + A' = 1", c: true}, {t: "A + 1 = A", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Combinational Circuits:", opts: [{t: "Adder", c: true}, {t: "MUX", c: true}, {t: "Decoder", c: true}, {t: "Flip-Flop", c: false}], isMulti: true, marks: 10 },
      { q: "Half Adder outputs consist of:", opts: [{t: "Sum", c: true}, {t: "Carry", c: true}, {t: "Borrow", c: false}], isMulti: true, marks: 10 },
      { q: "Multiplexer (MUX) parts:", opts: [{t: "Inputs", c: true}, {t: "Select lines", c: true}, {t: "One Output", c: true}], isMulti: true, marks: 10 },
      { q: "Simplify A.B + A.B':", opts: [{t: "A", c: true}, {t: "B", c: false}, {t: "A(B+B')", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "FC Lec 07: Operating Systems and Software",
    description: "OS functions, Process management, GUI vs CLI, and Software types.",
    questions: [
      { q: "Which core part of OS manages CPU and Memory?", opts: ["Shell", "Kernel", "UI", "Driver"], ans: 1 },
      { q: "Interface using icons and windows is:", opts: ["CLI", "GUI", "BIOS", "DOS"], ans: 1 },
      { q: "Multitasking means:", opts: ["One task at a time", "Many tasks appearing to run at once", "Large memory", "High speed"], ans: 1 },
      { q: "Device drivers are types of:", opts: ["System software", "Application software", "Shareware", "Malware"], ans: 0 },
      { q: "An open-source OS example:", opts: ["Windows", "macOS", "Linux", "iOS"], ans: 2 },
      { q: "Virtual Memory uses...", opts: ["Registers", "Cache", "Space on Hard Drive", "No memory"], ans: 2 },
      { q: "What is 'Paging'?", opts: ["Memory management scheme", "Printing pages", "Naming files", "None"], ans: 0 },
      { q: "A 'Deadlock' occurs when:", opts: ["CPU is too fast", "Processes wait indefinitely for each other", "Virus", "RAM is full"], ans: 1 },
      { q: "Which utility cleans up fragmented files?", opts: ["Disk Cleanup", "Defragmenter", "Antivirus", "Backup"], ans: 1 },
      { q: "Primary function of a Bootloader?", opts: ["Edit text", "Load OS into RAM", "Play video", "Check email"], ans: 1 },
      { q: "Operating System Functions:", opts: [{t: "Process Mgt", c: true}, {t: "Memory Mgt", c: true}, {t: "File Mgt", c: true}, {t: "Hardware production", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Application Software:", opts: [{t: "MS Word", c: true}, {t: "Web Browser", c: true}, {t: "Windows 11", c: false}, {t: "Compiler", c: false}], isMulti: true, marks: 10 },
      { q: "Identify System Software:", opts: [{t: "Operating System", c: true}, {t: "Device Drivers", c: true}, {t: "Compiler", c: true}, {t: "Photoshop", c: false}], isMulti: true, marks: 10 },
      { q: "Proprietary OS examples:", opts: [{t: "Windows", c: true}, {t: "macOS", c: true}, {t: "Linux", c: false}], isMulti: true, marks: 10 },
      { q: "UI Types:", opts: [{t: "CLI", c: true}, {t: "GUI", c: true}, {t: "TUI", c: true}, {t: "PUI", c: false}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of fcLectureQuizzes) {
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
        course: "IT1140 - Fundamentals of Computing",
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
      console.log(`Successfully created FC quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 7 FC lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
