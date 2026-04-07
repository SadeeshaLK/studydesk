const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const aimlLectureQuizzes = [
  {
    title: "AI/ML Lec 01: Introduction to AI & ML",
    description: "Foundations, History, AI Types, and ML Paradigms.",
    questions: [
      { q: "Who is known as the father of AI?", opts: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Geoffrey Hinton"], ans: 1 },
      { q: "Which AI type can solve tasks it wasn't specifically programmed for?", opts: ["Narrow AI", "General AI", "Super AI", "Reactive AI"], ans: 1 },
      { q: "Machine Learning is a subset of:", opts: ["Deep Learning", "Artificial Intelligence", "Data Science", "Big Data"], ans: 1 },
      { q: "Training with labeled data is:", opts: ["Unsupervised", "Supervised", "Reinforcement", "Clustering"], ans: 1 },
      { q: "The 'Turing Test' measures:", opts: ["Hardware speed", "Intelligent behavior", "Storage", "Network delay"], ans: 1 },
      { q: "Goal of AI is to simulate human:", opts: ["Movement", "Intelligence", "Circulation", "Sight only"], ans: 1 },
      { q: "Categorizing emails as 'Spam' or 'Ham' is:", opts: ["Regression", "Classification", "Clustering", "Association"], ans: 1 },
      { q: "Predicting house prices (continuous value) is:", opts: ["Regression", "Classification", "Clustering", "PCA"], ans: 0 },
      { q: "Which type uses 'Rewards' and 'Punishments'?", opts: ["Supervised", "Unsupervised", "Reinforcement", "Static"], ans: 2 },
      { q: "AlphaGo is an example of:", opts: ["Narrow AI", "General AI", "History", "Robot"], ans: 0 },
      { q: "Identify ML Paradigms:", opts: [{t: "Supervised", c: true}, {t: "Unsupervised", c: true}, {t: "Reinforcement", c: true}, {t: "Scripted", c: false}], isMulti: true, marks: 10 },
      { q: "Which are Unsupervised tasks?", opts: [{t: "Clustering", c: true}, {t: "Association", c: true}, {t: "Regression", c: false}, {t: "Classification", c: false}], isMulti: true, marks: 10 },
      { q: "Core components of AI include:", opts: [{t: "Learning", c: true}, {t: "Reasoning", c: true}, {t: "Self-correction", c: true}, {t: "Manual labor", c: false}], isMulti: true, marks: 10 },
      { q: "AI Applications in industry:", opts: [{t: "Healthcare", c: true}, {t: "Finance", c: true}, {t: "Transportation", c: true}, {t: "Astrology", c: false}], isMulti: true, marks: 10 },
      { q: "Select True statements:", opts: [{t: "DL is a subset of ML", c: true}, {t: "ML is a subset of AI", c: true}, {t: "AI is a subset of ML", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 02: Searching Strategies in AI",
    description: "Uninformed vs Informed search, DFS, BFS, and A* algorithms.",
    questions: [
      { q: "Which search uses a heuristic function h(n)?", opts: ["BFS", "DFS", "Greedy Best-First", "UCS"], ans: 2 },
      { q: "BFS is implemented using...", opts: ["Stack", "Queue", "Priority Queue", "Tree"], ans: 1 },
      { q: "A* search formula is:", opts: ["f(n)=g(n)", "f(n)=h(n)", "f(n)=g(n)+h(n)", "f(n)=g(n)-h(n)"], ans: 2 },
      { q: "Breadth-First Search (BFS) is optimal if:", opts: ["Heuristic is consistent", "Edge costs are equal", "Heuristic is 0", "Always optimal"], ans: 1 },
      { q: "DFS uses which data structure?", opts: ["Queue", "Stack", "List", "Graph"], ans: 1 },
      { q: "Informed search is also known as:", opts: ["Blind search", "Heuristic search", "Random search", "Brute force"], ans: 1 },
      { q: "Complexity of BFS with branch factor b and depth d?", opts: ["O(bd)", "O(b^d)", "O(d^b)", "O(b+d)"], ans: 1 },
      { q: "Which search always finds the shallowest goal?", opts: ["BFS", "DFS", "LDS", "UCS"], ans: 0 },
      { q: "Heuristic h(n) is 'Admissible' if:", opts: ["h(n) > cost", "h(n) < cost", "h(n) never overestimates", "h(n)=0"], ans: 2 },
      { q: "Search space is represented as a:", opts: ["Matrix", "Graph/Tree", "Table", "Queue"], ans: 1 },
      { q: "Uninformed Search algorithms:", opts: [{t: "BFS", c: true}, {t: "DFS", c: true}, {t: "UCS", c: true}, {t: "A*", c: false}], isMulti: true, marks: 10 },
      { q: "CALCULATION: For A* search, if g(n)=10 and h(n)=5, what is f(n)?", opts: [{t: "15", c: true}, {t: "50", c: false}, {t: "2", c: false}, {t: "5", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Optimal Searches:", opts: [{t: "BFS (unit cost)", c: true}, {t: "A* (admissible)", c: true}, {t: "UCS", c: true}, {t: "DFS", c: false}], isMulti: true, marks: 10 },
      { q: "Properties of A* search:", opts: [{t: "Optimal", c: true}, {t: "Complete", c: true}, {t: "Memory efficient", c: false}], isMulti: true, marks: 10 },
      { q: "Space complexity of BFS:", opts: [{t: "Exponential", c: true}, {t: "Linear", c: false}, {t: "Same as DFS", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 03: Knowledge Representation & Logic",
    description: "Propositional logic, Predicate logic (FOPL), and Resolution.",
    questions: [
      { q: "Logic dealing with symbols and operators (AND, OR):", opts: ["FOPL", "Propositional Logic", "Fuzzy Logic", "Meta Logic"], ans: 1 },
      { q: "Atomic sentence in FOPL contains:", opts: ["Connectives", "Predicates and Terms", "Quantifiers", "Nothing"], ans: 1 },
      { q: "Resolution is a technique for:", opts: ["Proving theorems", "Calculating speed", "Clustering", "Searching"], ans: 0 },
      { q: "∀x (Man(x) → Mortal(x)) is in:", opts: ["Prop Logic", "Predicate Logic", "Boolean Logic", "Wait"], ans: 1 },
      { q: "Negation of P ∧ Q is:", opts: ["¬P ∧ ¬Q", "¬P ∨ ¬Q", "P ∨ Q", "¬(P)"], ans: 1 },
      { q: "Which symbol means 'For all'?", opts: ["∃", "∀", "∈", "⊆"], ans: 1 },
      { q: "Knowledge Base (KB) contains:", opts: ["Hardware", "Set of sentences", "Only data", "User names"], ans: 1 },
      { q: "Resolution rule: (A ∨ B) ∧ (¬B ∨ C) ⇒ ?", opts: ["A ∨ C", "A ∧ C", "B ∨ C", "A"], ans: 0 },
      { q: "Wumpus World is an example of a:", opts: ["Search problem", "Logic environment", "Cluster", "Robot"], ans: 1 },
      { q: "Entailment KB |= α means:", opts: ["α is false", "α is true whenever KB is true", "KB is α", "None"], ans: 1 },
      { q: "Types of Logic:", opts: [{t: "Propositional", c: true}, {t: "First-order", c: true}, {t: "Higher-order", c: true}, {t: "Binary", c: false}], isMulti: true, marks: 10 },
      { q: "Logical Connectives include:", opts: [{t: "∧ (AND)", c: true}, {t: "∨ (OR)", c: true}, {t: "¬ (NOT)", c: true}, {t: "⇒ (Implies)", c: true}], isMulti: true, marks: 10 },
      { q: "CALCULATION: If P is True and Q is False, P → Q value is?", opts: [{t: "False", c: true}, {t: "True", c: false}, {t: "0", c: true}, {t: "1", c: false}], isMulti: true, marks: 10 },
      { q: "Sentence parts in Predicate logic:", opts: [{t: "Term", c: true}, {t: "Predicate", c: true}, {t: "Quantifier", c: true}], isMulti: true, marks: 10 },
      { q: "CNF (Conjunctive Normal Form) is a conjunction of:", opts: [{t: "Disjunctions", c: true}, {t: "Clauses", c: true}, {t: "Atmoms", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 04: Machine Learning Fundamentals",
    description: "Regression, Correlation, and Evaluation Metrics.",
    questions: [
      { q: "Equation of simple linear regression:", opts: ["y = mx + c", "y = x²", "y = ax³", "y = log x"], ans: 0 },
      { q: "Correlation coefficient (r) range is:", opts: ["0 to 1", "-1 to 1", "-∞ to ∞", "0 to ∞"], ans: 1 },
      { q: "Target variable in Regression is:", opts: ["Discrete", "Continuous", "Boolean", "String"], ans: 1 },
      { q: "R-squared (Coefficient of Determination) value of 1 means:", opts: ["No fit", "Perfect fit", "Error", "Random"], ans: 1 },
      { q: "Loss function in Linear Regression is typically:", opts: ["Mean Absolute Error", "Mean Squared Error", "Cross Entropy", "Hinge Loss"], ans: 1 },
      { q: "Negative correlation means:", opts: ["Both increase", "One increases, other decreases", "Both decrease", "No relation"], ans: 1 },
      { q: "X is the independent variable, Y is...", opts: ["Independent", "Dependent", "Constant", "Slope"], ans: 1 },
      { q: "Standard Deviation measures:", opts: ["Average", "Dispersion", "Total", "Center"], ans: 1 },
      { q: "Ordinary Least Squares (OLS) minimizes:", opts: ["Mean", "Sum of squared residuals", "Sum of absolute errors", "Max error"], ans: 1 },
      { q: "Gradient Descent is used for:", opts: ["Optimization", "Clustering", "Sorting", "Networking"], ans: 0 },
      { q: "Evaluation Metrics for Regression:", opts: [{t: "MSE", c: true}, {t: "RMSE", c: true}, {t: "MAE", c: true}, {t: "Accuracy", c: false}], isMulti: true, marks: 10 },
      { q: "CALCULATION: For a line y=2x+5, if x=3 what is y?", opts: [{t: "11", c: true}, {t: "10", c: false}, {t: "6", c: false}], isMulti: true, marks: 10 },
      { q: "Correlation (r) values and meaning:", opts: [{t: "1: Perfect Positive", c: true}, {t: "-1: Perfect Negative", c: true}, {t: "0: No Linear Correlation", c: true}], isMulti: true, marks: 10 },
      { q: "ML process steps:", opts: [{t: "Data Collection", c: true}, {t: "Feature Eng", c: true}, {t: "Training", c: true}, {t: "Testing", c: true}], isMulti: true, marks: 10 },
      { q: "Overfitting occurs when model is too:", opts: [{t: "Complex", c: true}, {t: "Simple", c: false}, {t: "Flexible", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 05: Probability and Bayes Classifiers",
    description: "Bayes Theorem, Naive Bayes, and Classification performance.",
    questions: [
      { q: "P(A|B) = [P(B|A) * P(A)] / ?", opts: ["P(A)", "P(B)", "P(A∩B)", "P(A+B)"], ans: 1 },
      { q: "In Naive Bayes, features are assumed to be:", opts: ["Dependent", "Independent", "Linear", "Continuous"], ans: 1 },
      { q: "Precision formula:", opts: ["TP / (TP+FP)", "TP / (TP+FN)", "TN / (TN+FP)", "None"], ans: 0 },
      { q: "Recall (Sensitivity) formula:", opts: ["TP / (TP+FP)", "TP / (TP+FN)", "Accuracy", "F1"], ans: 1 },
      { q: "F1 Score is the harmonic mean of:", opts: ["Error & Bias", "Precision & Recall", "Mean & Median", "TP & TN"], ans: 1 },
      { q: "Naive Bayes is best for:", opts: ["Image gen", "Text classification/Spam", "Clustering", "Video"], ans: 1 },
      { q: "Base Rate Fallacy relates to:", opts: ["Linearity", "Conditional Probability", "Logic", "Search"], ans: 1 },
      { q: "Posterior probability P(c|x) is:", opts: ["Prob of class given features", "Prob of features", "Prob of class", "Error"], ans: 0 },
      { q: "Confusion Matrix 2x2 has how many components?", opts: ["2", "3", "4", "5"], ans: 2 },
      { q: "Likelihood in Bayes is:", opts: ["P(x|c)", "P(c|x)", "P(x)", "P(c)"], ans: 0 },
      { q: "Components of Confusion Matrix:", opts: [{t: "True Positives", c: true}, {t: "False Positives", c: true}, {t: "True Negatives", c: true}, {t: "False Negatives", c: true}], isMulti: true, marks: 10 },
      { q: "CALCULATION: 100 people tested. 10 had disease. Test caught 9. TP is?", opts: [{t: "9", c: true}, {t: "1", c: false}, {t: "90", c: false}], isMulti: true, marks: 10 },
      { q: "Metrics from Confusion Matrix:", opts: [{t: "Accuracy", c: true}, {t: "Precision", c: true}, {t: "Recall", c: true}, {t: "F1-Score", c: true}], isMulti: true, marks: 10 },
      { q: "Naive Bayes variations:", opts: [{t: "Gaussian", c: true}, {t: "Multinomial", c: true}, {t: "Bernoulli", c: true}], isMulti: true, marks: 10 },
      { q: "Pros of Naive Bayes:", opts: [{t: "Fast", c: true}, {t: "Scalable", c: true}, {t: "Handles high dim", c: true}, {t: "Good for small data", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 06: Clustering & Decision Trees",
    description: "K-Means, Hierarchical Clustering, and Decision Trees.",
    questions: [
      { q: "K-Means is which type of learning?", opts: ["Supervised", "Unsupervised", "Reinforcement", "Deep"], ans: 1 },
      { q: "In K-Means, 'K' stands for:", opts: ["Knowledge", "Number of clusters", "Kilometers", "Constant"], ans: 1 },
      { q: "Decision Tree splits are chosen based on:", opts: ["Random", "Information Gain / Gini Impurity", "Distance", "Size"], ans: 1 },
      { q: "Entropy of a perfectly balanced binary class is:", opts: ["0", "0.5", "1", "∞"], ans: 2 },
      { q: "Entropy of a single-class dataset (pure) is:", opts: ["0", "0.5", "1", "-1"], ans: 0 },
      { q: "Hierarchical clustering 'Dendrogram' is used for:", opts: ["Prediction", "Visualizing clusters", "Testing", "Cleaning"], ans: 1 },
      { q: "K-Means algorithm is:", opts: ["Sequential", "Iterative", "Recursive", "Static"], ans: 1 },
      { q: "Centroid is the...", opts: ["Edge", "Geometric center of a cluster", "Input", "Weight"], ans: 1 },
      { q: "Decision Tree 'Leaf' represents:", opts: ["Decision node", "Final Class/Value", "Root", "Path"], ans: 1 },
      { q: "Main goal of Clustering:", opts: ["Predicting labels", "Finding patterns in unlabeled data", "Sorting", "Calculations"], ans: 1 },
      { q: "Clustering Algorithms:", opts: [{t: "K-Means", c: true}, {t: "DBSCAN", c: true}, {t: "Hierarchical", c: true}, {t: "Linear Reg", c: false}], isMulti: true, marks: 10 },
      { q: "CALCULATION: For a cluster with points [2, 4, 6], what is the centroid?", opts: [{t: "4", c: true}, {t: "12", c: false}, {t: "0", c: false}], isMulti: true, marks: 10 },
      { q: "Selection criteria for Decision Trees:", opts: [{t: "Shannon Entropy", c: true}, {t: "Gini Impurity", c: true}, {t: "Variance Reduction", c: true}], isMulti: true, marks: 10 },
      { q: "K-Means challenges:", opts: [{t: "Choosing K", c: true}, {t: "Init sensitivity", c: true}, {t: "Outliers", c: true}], isMulti: true, marks: 10 },
      { q: "Clustering linkage types:", opts: [{t: "Single", c: true}, {t: "Complete", c: true}, {t: "Average", c: true}, {t: "Ward's", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 07: Artificial Neural Networks (ANN)",
    description: "Perceptrons, Multilayer Perceptrons (MLP), and Backpropagation.",
    questions: [
      { q: "Basic unit of a Neural Network is:", opts: ["Neuron / Perceptron", "Bit", "Gate", "Layer"], ans: 0 },
      { q: "ANN is inspired by:", opts: ["Computer chips", "Internal combustion", "Human brain", "Calculators"], ans: 2 },
      { q: "Activation function for binary classification output:", opts: ["Linear", "ReLU", "Sigmoid", "Tanh"], ans: 2 },
      { q: "Backpropagation is used for:", opts: ["Forward pass", "Weight update / Training", "Storage", "Input"], ans: 1 },
      { q: "The 'Learning Rate' determines:", opts: ["Input size", "Step size in weight update", "Error amount", "Layers"], ans: 1 },
      { q: "ReLU function outputs:", opts: ["(-∞, ∞)", "[0, ∞)", "(-1, 1)", "[0, 1]"], ans: 1 },
      { q: "Hidden layers are found in:", opts: ["Single Perceptron", "Multilayer Perceptron", "Linear Reg", "Logic Gates"], ans: 1 },
      { q: "ANN input x weights + bias results in:", opts: ["Activation", "Net Sum", "Error", "Label"], ans: 1 },
      { q: "Deep Learning usually refers to ANNs with:", opts: ["One layer", "Many hidden layers", "No weights", "Pure logic"], ans: 1 },
      { q: "Weights in ANN represent:", opts: ["Input value", "Importance of feature", "Bias", "Error"], ans: 1 },
      { q: "Common Activation Functions:", opts: [{t: "ReLU", c: true}, {t: "Sigmoid", c: true}, {t: "Tanh", c: true}, {t: "Softmax", c: true}], isMulti: true, marks: 10 },
      { q: "CALCULATION: Neuraon: w=[2, 3], x=[1, 2], b=1. What is sum (w*x + b)?", opts: [{t: "9", c: true}, {t: "8", c: false}, {t: "6", c: false}], isMulti: true, marks: 10 },
      { q: "Layers in MLP:", opts: [{t: "Input Layer", c: true}, {t: "Hidden Layer", c: true}, {t: "Output Layer", c: true}, {t: "Back Layer", c: false}], isMulti: true, marks: 10 },
      { q: "Optimizer types for ANN:", opts: [{t: "SGD", c: true}, {t: "Adam", c: true}, {t: "RMSprop", c: true}], isMulti: true, marks: 10 },
      { q: "Epoch in training means:", opts: [{t: "One full pass over dataset", c: true}, {t: "One batch", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "AI/ML Lec 08: Bias & Ethics in AI",
    description: "Fairness, transparency, and ethical challenges in AI systems.",
    questions: [
      { q: "AI Bias comes from:", opts: ["Only developers", "Training data / Human design", "Solar flare", "Pure luck"], ans: 1 },
      { q: "Transparency in AI refers to:", opts: ["Clear code", "Explaining model decisions (XAI)", "Hardware", "Public data"], ans: 1 },
      { q: "The 'Black Box' problem refers to:", opts: ["Colors", "Inability to explain internal logic", "Deleted code", "Secure servers"], ans: 1 },
      { q: "Data bias where certain groups are underrepresented:", opts: ["Algorithmic bias", "Sample/Representation bias", "Logic bias", "None"], ans: 1 },
      { q: "GDPR provides 'Right to Explanation' for:", opts: ["Manual work", "Automated decisions", "Only banking", "None"], ans: 1 },
      { q: "Autonomous weapons ethics concern:", opts: ["Cost", "Accountability/Lethality", "Speed", "Colors"], ans: 1 },
      { q: "Technological Unemployment is a concern about:", opts: ["Too many jobs", "AI replacing human labor", "Internet speed", "Price"], ans: 1 },
      { q: "Fairness in AI means:", opts: ["Highest accuracy", "Unbiased treatment of groups", "Fastest speed", "Cheap"], ans: 1 },
      { q: "AI Policy/Regulation example:", opts: ["EU AI Act", "HTTP", "TCP", "OSI"], ans: 0 },
      { q: "Privacy in AI involves protecting:", opts: ["Code", "User Data", "Servers", "Prices"], ans: 1 },
      { q: "Types of AI Bias:", opts: [{t: "Data bias", c: true}, {t: "Algorithmic bias", c: true}, {t: "Cognitive bias", c: true}], isMulti: true, marks: 10 },
      { q: "CALCULATION: 80% accuracy for Group A, 40% for Group B. Disparity is?", opts: [{t: "40%", c: true}, {t: "120%", c: false}, {t: "2", c: false}], isMulti: true, marks: 10 },
      { q: "XAI (Explainable AI) goals:", opts: [{t: "Trust", c: true}, {t: "Interpretability", c: true}, {t: "Legal compliance", c: true}, {t: "Speed", c: false}], isMulti: true, marks: 10 },
      { q: "AI Ethics Pillars:", opts: [{t: "Transparency", c: true}, {t: "Accountability", c: true}, {t: "Fairness", c: true}, {t: "Privacy", c: true}], isMulti: true, marks: 10 },
      { q: "Biometric AI concerns:", opts: [{t: "Surveillance", c: true}, {t: "Consent", c: true}, {t: "Accuracy disparity", c: true}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of aimlLectureQuizzes) {
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
        course: "IT2011 - Artificial Intelligence & Machine Learning",
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
      console.log(`Successfully created AIML quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 8 AIML lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
