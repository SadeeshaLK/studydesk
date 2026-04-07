const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    
    const titlesToRemove = [
      "IP Lec 01: Introduction & Data Types",
      "IP Lec 02: Operators and Expressions",
      "IP Lec 03: Control Structures I (Selection)",
      "IP Lec 04: Control Structures II (Loops)",
      "IP Lec 05: Functions and Scope",
      "IP Lec 06: Arrays - 1D and 2D",
      "IP Lec 07: Pointers - Introduction",
      "IP Lec 08: Strings and String Handling",
      "IP Lec 09: Structures and Unions",
      "IP Lec 10: File Handling and Memory"
    ];

    const result = await Quiz.deleteMany({ title: { $in: titlesToRemove } });
    
    console.log(`Successfully removed ${result.deletedCount} IP lecture quizzes.`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
