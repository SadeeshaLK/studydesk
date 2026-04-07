const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    
    // Attempt to find and remove any quiz with 'IP' and 'Final' in the title
    const result = await Quiz.deleteMany({ 
      course: /IT1010|IP/i,
      title: /Final/i 
    });
    
    console.log(`Successfully removed ${result.deletedCount} IP final quizzes.`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
