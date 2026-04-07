const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const mcqs = [
  { q: "A sample space S is partitioned into two mutually exclusive and collectively exhaustive events A and B. If P(A) = 0.4, what is P(B)?", opts: ["0.0", "0.4", "0.6", "1.0"], ans: 2 },
  { q: "Which of the following is a condition for two events A and B to be independent?", opts: ["P(A ∩ B) = 0", "P(A ∪ B) = P(A) + P(B)", "P(A | B) = P(A)", "P(A ∩ B) = P(A) + P(B)"], ans: 2 },
  { q: "In a Poisson distribution with parameter λ, the variance is:", opts: ["√λ", "λ²", "λ", "1/λ"], ans: 2 },
  { q: "For a continuous random variable X, the probability P(X = k) for any constant k is:", opts: ["f(k)", "1.0", "0.0", "F(k)"], ans: 2 },
  { q: "Which distribution is typically used to model the 'waiting time' between independent events occurring at a constant average rate?", opts: ["Binomial", "Normal", "Exponential", "Uniform"], ans: 2 },
  { q: "A continuity correction is required when:", opts: ["Approximating a Normal distribution with a Binomial.", "Approximating a Binomial distribution with a Normal.", "Calculating the mean of a uniform distribution.", "Testing for hardware failures."], ans: 1 },
  { q: "If Z follows a Standard Normal Distribution, the value of P(Z < 0) is:", opts: ["1.0", "0.5", "-0.5", "0.0"], ans: 1 },
  { q: "In Hypothesis Testing, a Type I error occurs when:", opts: ["We fail to reject a false H₀.", "We reject a true H₀.", "We reject a false H₀.", "The p-value is greater than α."], ans: 1 },
  { q: "The R² (Coefficient of Determination) value of 0.85 means:", opts: ["85% of the variation in X is explained by Y.", "85% of the variation in Y is explained by X.", "The correlation coefficient r is exactly 0.85.", "The slope of the regression line is 0.85."], ans: 1 },
  { q: "Which component of a Time Series represents periodic variations that recur within a year?", opts: ["Trend", "Cyclical", "Seasonality", "Irregular"], ans: 2 },
  { q: "Two events A and B are mutually exclusive. If P(A) = 0.3 and P(B) = 0.5, then P(A ∪ B) is:", opts: ["0.8", "0.15", "0.2", "0.5"], ans: 0 },
  { q: "If E(X) = 5 and E(X²) = 30, the variance V(X) is:", opts: ["5", "25", "10", "30"], ans: 0 },
  { q: "The area under the entire Probability Density Function (PDF) curve is always:", opts: ["0.5", "∞", "1.0", "Dependent on the mean"], ans: 2 },
  { q: "For a Binomial distribution B(n, p), the mean is:", opts: ["np(1-p)", "√np", "np", "p/n"], ans: 2 },
  { q: "In simple linear regression, the 'Residual' is defined as:", opts: ["yᵢ - ȳ", "yᵢ - ŷᵢ", "ŷᵢ - ȳ", "xᵢ - x̄"], ans: 1 },
  { q: "A Time Series Additive Model is represented as Yt =", opts: ["T × S × C × I", "T + S + C + I", "T + S × C + I", "T × S + C + I"], ans: 1 },
  { q: "The p-value is defined as the probability of:", opts: ["H₀ being true.", "Committing a Type II error.", "Obtaining a result as extreme as the observed one, assuming H₀ is true.", "H₁ being false."], ans: 2 },
  { q: "If the correlation coefficient r = -1, the relationship between X and Y is:", opts: ["No relationship", "Weak negative linear", "Perfect negative linear", "Perfect positive linear"], ans: 2 },
  { q: "In a T-test with n=15, the degrees of freedom (df) are:", opts: ["15", "16", "14", "13"], ans: 2 },
  { q: "The 'Memoryless property' is a unique characteristic of which distribution?", opts: ["Normal", "Exponential", "Poisson", "Uniform"], ans: 1 }
];

const shortAnswers = [
  { q: "In Bayes' Theorem, P(B|A) = (P(A|B) * P(B)) / [?]", ans: "P(A)" },
  { q: "A random variable that can assume only a countable number of values is called a [...] random variable.", ans: "Discrete" },
  { q: "If X ~ N(100, 25), the Z-score for x = 110 is:", ans: "2.0" },
  { q: "The probability of committing a Type II error is denoted by the Greek letter:", ans: "Beta" },
  { q: "In the regression equation Y = α + βX + ε, β represents the:", ans: "Slope" },
  { q: "If np > 5 and n(1-p) > 5, the Binomial distribution can be approximated by the [...] distribution.", ans: "Normal" },
  { q: "The covariance of two independent random variables X and Y is always:", ans: "Zero" },
  { q: "In Time Series, the [...] component represents the long-term upward or downward movement.", ans: "Trend" },
  { q: "The significance level α is the probability of committing a [...] error.", ans: "Type I" },
  { q: "To find the probability P(X ≤ 5) for a discrete variable using Normal approximation, we calculate P(Y < [...]) using the continuity correction.", ans: "5.5" }
];

const scenarioQuestions = [
  { 
    q: "**Scenario A: Quality Control**\nA machine produces 1000 items per day. P(defective) = 0.02.\nTo find the probability that exactly 5 items are defective, we should use the:", 
    opts: ["Binomial", "Normal", "Uniform"], 
    ans: 0, 
    marks: 4, 
    type: "dropdown" 
  },
  { 
    q: "**Scenario A: Quality Control**\nThe exact value of λ if using Poisson approximation for 1000 items with p=0.02 would be:", 
    opts: ["2", "20", "0.02", "5"], 
    ans: 1, 
    marks: 5, 
    type: "dropdown" 
  },
  { 
    q: "**Scenario A: Quality Control**\nSuppose we check a sample of 100 items. The expected number of defectives is:", 
    opts: ["2", "0.02", "10", "50"], 
    ans: 0, 
    marks: 5, 
    type: "dropdown" 
  },
  { 
    q: "**Scenario B: Regression Analysis**\nΣX=50, ΣY=400, ΣXY=2100, ΣX²=300, n=10.\nThe calculated slope (b) of the regression line is:", 
    opts: ["1", "2", "4", "10"], 
    ans: 1, 
    marks: 5, 
    type: "dropdown" 
  },
  { 
    q: "**Scenario B: Regression Analysis**\nThe intercept (a) calculation using a=ȳ-bx̄ is:", 
    opts: ["10", "20", "30", "40"], 
    ans: 2, 
    marks: 5, 
    type: "dropdown" 
  },
  { 
    q: "**Scenario B: Regression Analysis**\nIf a student studies for 8 hours (x=8), their predicted score ŷ is:", 
    opts: ["46", "56", "36", "66"], 
    ans: 0, 
    marks: 6, 
    type: "dropdown" 
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

    await Quiz.deleteMany({ title: "Probability & Statistics - PS" });

    let dbQuestions = mcqs.map(q => ({
        questionText: q.q,
        questionType: "mcq",
        isMultiSelect: false,
        marks: 2,
        options: q.opts.map((text, idx) => ({
            text: text,
            isCorrect: idx === q.ans
        }))
    }));

    dbQuestions = dbQuestions.concat(shortAnswers.map(q => ({
        questionText: q.q,
        questionType: "short-answer",
        marks: 3,
        correctAnswer: q.ans
    })));

    dbQuestions = dbQuestions.concat(scenarioQuestions.map(q => ({
        questionText: q.q,
        questionType: "dropdown",
        marks: q.marks,
        options: q.opts.map((text, idx) => ({
            text: text,
            isCorrect: idx === q.ans
        }))
    })));

    let totalMarksCalculated = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: "Probability & Statistics - PS",
      description: "A high-difficulty examination covering Probability Theory, Random Variables, Statistical Inference, Hypothesis Testing, and Regression Analysis.",
      course: "IT2120 - PS",
      lecturer: lecturer._id,
      duration: 120,
      passingPercentage: 50,
      pricingType: "free",
      maxAttempts: 2,
      shuffleQuestions: false, // Keep scenarios group-friendly
      category: "final_exam",
      isPublished: true,
      totalMarks: totalMarksCalculated,
      questions: dbQuestions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with ${dbQuestions.length} questions!`);
    console.log(`Total Marks: ${totalMarksCalculated}/100`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
