const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const hardMCQs = [
  // Probability & Events (Lecture 3)
  { q: "Given two independent events A and B with P(A) = 0.6 and P(B) = 0.3, what is the probability that exactly one of the events occurs?", opts: ["0.18", "0.90", "0.54", "0.72"], ans: 2 },
  { q: "At a clinic, 10% of patients have condition X. A test for X is 90% accurate (true positive) and has a 5% false positive rate. If a patient tests positive, what is the probability they actually have condition X?", opts: ["0.67", "0.90", "0.10", "0.95"], ans: 0 },
  { q: "Three balanced coins are tossed. Let A be the event of getting at least two heads. What is the value of P(A)?", opts: ["0.25", "0.50", "0.75", "0.375"], ans: 1 },
  { q: "If P(A|B) = 0.4, P(B) = 0.5, and P(A) = 0.6, find P(B|A).", opts: ["0.33", "0.20", "0.40", "0.50"], ans: 0 },
  { q: "Events A, B, and C are collectively exhaustive and mutually exclusive. If P(A) = 2P(B) and P(B) = 3P(C), find P(A).", opts: ["0.1", "0.3", "0.6", "0.9"], ans: 2 },

  // Random Variables (Lecture 4)
  { q: "A discrete random variable X has a PMF P(x) = kx for x = 1, 2, 3, 4. Find the value of k.", opts: ["0.1", "0.25", "1.0", "0.5"], ans: 0 },
  { q: "Find the expected value E(X) for a variable with PMF P(1)=0.1, P(2)=0.3, P(3)=0.6.", opts: ["2.0", "2.5", "2.8", "3.0"], ans: 1 },
  { q: "If V(X) = 4 and V(Y) = 9, and X and Y are independent, what is the standard deviation of 2X - Y?", opts: ["√25", "5", "√17", "1"], ans: 1 },
  { q: "The covariance Cov(X, Y) is defined as:", opts: ["E(XY) - E(X)E(Y)", "E(X+Y) - E(X)E(Y)", "E(X²) - [E(X)]²", "E(XY) + E(X)E(Y)"], ans: 0 },
  { q: "If X and Y are independent random variables, what is E[XY]?", opts: ["E(X) + E(Y)", "E(X)E(Y)", "0", "V(X)V(Y)"], ans: 1 },

  // Discrete Distributions (Lecture 4/5)
  { q: "A Binomial distribution has n=100 and p=0.01. What is the standard deviation?", opts: ["1.0", "0.99", "0.995", "10"], ans: 2 },
  { q: "In a Poisson distribution, if P(X=0) = 0.2, what is the mean λ? (Use ln(0.2) ≈ -1.61)", opts: ["0.2", "1.61", "5.0", "0.8"], ans: 1 },
  { q: "A Poisson approximation to Binomial is most accurate when:", opts: ["n > 20, p > 0.5", "n is small, p is large", "n > 50, p < 0.1", "n=p"], ans: 2 },
  { q: "Which distribution models a single trial with only two possible outcomes?", opts: ["Binomial", "Bernoulli", "Poisson", "Normal"], ans: 1 },
  { q: "Find P(X=2) for a Binomial distribution with n=3, p=0.5.", opts: ["0.375", "0.5", "0.25", "0.125"], ans: 0 },

  // Continuous Distributions (Lecture 6)
  { q: "For a Uniform distribution U(10, 20), what is the variance?", opts: ["8.33", "25", "10", "100"], ans: 0 },
  { q: "The Exponential distribution mean is 10. What is the probability P(X > 10)?", opts: ["0.5", "e⁻¹", "1 - e⁻¹", "0"], ans: 1 },
  { q: "If X ~ N(50, 16), find the Z-score for X=58.", opts: ["2.0", "0.5", "1.0", "8.0"], ans: 0 },
  { q: "What is the area under a Normal curve between µ - σ and µ + σ?", opts: ["0.50", "0.95", "0.68", "0.99"], ans: 2 },
  { q: "The 'memoryless property' of Exponential distribution means P(X > s+t | X > s) =", opts: ["P(X > t)", "P(X > s)", "P(X > s)P(X > t)", "0"], ans: 0 },

  // Statistical Inference (Lecture 8/9/10)
  { q: "A 95% confidence interval for the mean is [45, 55]. This means:", opts: ["There is a 95% chance the sample mean is between 45 and 55", "We are 95% confident the population mean falls in this range", "95% of data points are between 45 and 55", "The p-value is 0.05"], ans: 1 },
  { q: "If we decrease the significance level α from 0.05 to 0.01, the type II error probability (β):", opts: ["Decreases", "Increases", "Stays the same", "Becomes zero"], ans: 1 },
  { q: "The test statistic for a population mean when σ is unknown and n < 30 follows:", opts: ["Z-distribution", "T-distribution with n-1 df", "Chi-square distribution", "F-distribution"], ans: 1 },
  { q: "A p-value of 0.03 at α=0.05 significance level leads to:", opts: ["Reject H₀", "Fail to reject H₀", "Accept H₀", "Reject H₁"], ans: 0 },
  { q: "Which test is used to determine if there is a significant relationship between two categorical variables?", opts: ["Z-test", "T-test", "Chi-squared test", "Regression"], ans: 2 },
  { q: "The null hypothesis H₀ always contains which mathematical sign?", opts: ["<", ">", "=", "≠"], ans: 2 },
  { q: "What is the critical value for a two-tailed Z-test at 5% significance level?", opts: ["1.645", "1.96", "2.58", "1.28"], ans: 1 },

  // Regression Analysis (Lecture 11/12)
  { q: "In simple linear regression, if the slope b = 0, what is the correlation r?", opts: ["1", "-1", "0", "0.5"], ans: 2 },
  { q: "The Coefficient of Determination R² is 0.64. What is the magnitude of the correlation coefficient |r|?", opts: ["0.64", "0.32", "0.8", "0.4096"], ans: 2 },
  { q: "In the ANOVA table for regression, F is calculated as:", opts: ["SSR / SSE", "MSSR / MSSE", "SSE / SSR", "MSSE / MSSR"], ans: 1 },
  { q: "Which regression assumption states that the variance of error terms is constant?", opts: ["Linearity", "Independence", "Homoscedasticity", "Normality"], ans: 2 },
  { q: "If the regression equation is ŷ = 10 + 2x, what is the predicted value for x=5?", opts: ["15", "20", "22", "10"], ans: 1 },
  { q: "A correlation coefficient of r = -0.9 denotes:", opts: ["Strong positive", "Strong negative", "Weak negative", "No relationship"], ans: 1 },

  // Time Series (Lecture 13)
  { q: "Which component of time series accounts for fluctuations lasting more than one year (e.g. 2-10 years)?", opts: ["Trend", "Seasonality", "Cyclical", "Irregular"], ans: 2 },
  { q: "The 'Irregular' component of a time series represents:", opts: ["Long term growth", "Predictable cycles", "Unpredictable random noise", "Yearly peaks"], ans: 2 },
  { q: "In a Multiplicative Model, the seasonality magnitude [...] over time.", opts: ["Stays constant", "Increases or decreases", "Is always 1", "Is ignored"], ans: 1 },
  { q: "A time series is 'discrete' if:", opts: ["Observations are made continuously", "Observations are taken at specific time points", "The data is always integers", "The trend is constant"], ans: 1 },

  // Extra Challenge Questions
  { q: "In a box of 10 items, 2 are defective. If 3 items are chosen at random without replacement, what is the probability that none are defective?", opts: ["0.467", "0.512", "0.8", "0.7"], ans: 0 },
  { q: "For a standard normal distribution, find P(-1 < Z < 1) approximately.", opts: ["0.68", "0.95", "0.50", "0.34"], ans: 0 },
  { q: "If n=400 and p=0.5, using Normal approximation of Binomial, the standard deviation is:", opts: ["200", "100", "10", "14.14"], ans: 2 }
];

const run = async () => {
  try {
    await connectDB();
    
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) {
        console.error("No lecturer found!");
        process.exit(1);
    }

    // Use a unique title for this variant
    const title = "Probability & Statistics - PS (Hard MCQs)";
    await Quiz.deleteMany({ title });

    const totalQuestions = hardMCQs.length;
    const marksPerQuestion = 100 / totalQuestions;

    let dbQuestions = hardMCQs.map(q => ({
        questionText: q.q,
        questionType: "mcq",
        isMultiSelect: false,
        marks: marksPerQuestion,
        options: q.opts.map((text, idx) => ({
            text: text,
            isCorrect: idx === q.ans
        }))
    }));

    const quiz = await Quiz.create({
      title,
      description: "A specialized high-difficulty examination featuring 40 single-answer MCQs covering the entire spectrum of Probability and Statistics.",
      course: "IT2120/IT2110 - PS",
      lecturer: lecturer._id,
      duration: 90, // 1.5 hours for 40 hard MCQs
      passingPercentage: 50,
      pricingType: "free",
      maxAttempts: 1,
      shuffleQuestions: true,
      category: "final_exam",
      isPublished: true,
      totalMarks: 100,
      questions: dbQuestions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with ${dbQuestions.length} questions!`);
    console.log(`Total Marks: 100 (${marksPerQuestion.toFixed(2)} marks per question)`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
