const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const singleSelects = [
  { q: "What is the primary goal of Supervised Learning?", opts: ["Finding hidden structures in unlabeled data", "Predicting an output variable based on known input-output pairs", "Reinforcing positive actions through a reward system", "Clustering similar data points together"], ans: 1 },
  { q: "Which algorithm is best suited for a continuous value prediction problem?", opts: ["Logistic Regression", "K-Means Clustering", "Linear Regression", "Naive Bayes"], ans: 2 },
  { q: "What does the 'K' in K-Means clustering represent?", opts: ["The number of features", "The constant rate of learning", "The number of predefined clusters", "The dimension of the dataset"], ans: 2 },
  { q: "In a Convolutional Neural Network (CNN), what is the function of the pooling layer?", opts: ["To calculate the loss function", "To reduce the spatial dimensions (downsampling)", "To introduce non-linearity", "To fully connect all neurons"], ans: 1 },
  { q: "What problem does the 'Dropout' technique in Neural Networks address?", opts: ["Underfitting", "Vanishing Gradients", "Exploding Gradients", "Overfitting"], ans: 3 },
  { q: "Which metric is most appropriate when evaluating a classification model on a highly imbalanced dataset?", opts: ["Accuracy", "F1-Score", "Mean Squared Error", "Absolute Error"], ans: 1 },
  { q: "What is the purpose of an activation function in an Artificial Neural Network?", opts: ["To initialize weights", "To calculate the error derivative", "To introduce non-linearity into the network", "To normalize input data"], ans: 2 },
  { q: "Which of the following is an example of Unsupervised Learning?", opts: ["Spam Email Detection", "House Price Prediction", "Customer Segmentation", "Handwritten Digit Recognition"], ans: 2 },
  { q: "What is the phenomenon where a model performs extremely well on training data but poorly on unseen test data?", opts: ["Underfitting", "Overfitting", "Bias", "Generalization"], ans: 1 },
  { q: "In decision trees, what metric is commonly used to determine the best split at a node?", opts: ["Mean Absolute Error", "Information Gain (Entropy)", "Cosine Similarity", "Euclidean Distance"], ans: 1 },
  { q: "What role does the learning rate play in Gradient Descent?", opts: ["It determines the number of layers in a network", "It controls the size of the steps taken towards the minimum of the loss function", "It sets the batch size for training", "It initializes the minimum threshold"], ans: 1 },
  { q: "A confusion matrix for a binary classifier has how many quadrants/outcomes?", opts: ["Two (True/False)", "Four (TP, TN, FP, FN)", "Three (Positive, Negative, Neutral)", "Depends on the dataset size"], ans: 1 },
  { q: "What is a major ethical concern when deploying AI in automated hiring systems?", opts: ["High CPU usage", "Algorithmic Bias against certain demographics", "Gradient vanishing", "Data redundancy"], ans: 1 },
  { q: "Which algorithm relies heavily on Bayes' Theorem?", opts: ["Support Vector Machines", "Naive Bayes Classifier", "Principal Component Analysis", "Random Forest"], ans: 1 },
  { q: "What is the primary purpose of Principal Component Analysis (PCA)?", opts: ["Classification", "Feature Engineering and Dimensionality Reduction", "Reinforcement Learning", "Calculating loss"], ans: 1 },
  { q: "In Reinforcement Learning, the entity making decisions is called the:", opts: ["Environment", "State", "Agent", "Reward"], ans: 2 },
  { q: "Which of the following activation functions outputs a value strictly between 0 and 1?", opts: ["ReLU", "Tanh", "Sigmoid", "Leaky ReLU"], ans: 2 },
  { q: "An ensemble learning method that builds multiple decision trees sequentially to correct errors of the previous ones is called:", opts: ["Random Forest", "Bagging", "Gradient Boosting", "K-Nearest Neighbors"], ans: 2 },
  { q: "Review this Python snippet:\n```python\nfrom sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\n```\nWhat kind of task is this code preparing for?", opts: ["Clustering", "Continuous Regression", "Categorical Classification", "Dimensionality Reduction"], ans: 2 },
  { q: "Which of these is a typical symptom of a High Bias model?", opts: ["Excellent performance on test data but poor on training", "Poor performance on both training and test data (Underfitting)", "Excellent performance on training but poor on test (Overfitting)", "Low training error"], ans: 1 },
  { q: "What algorithm separates classes by finding a hyperplane with the maximum margin?", opts: ["Decision Trees", "K-Means", "Support Vector Machines (SVM)", "Logistic Regression"], ans: 2 },
  { q: "What is 'Backpropagation'?", opts: ["Propagating data from input to output layers", "The algorithm used to calculate gradients of the loss function with respect to the weights", "A method for unsupervised clustering", "A technique for deleting old data"], ans: 1 },
  { q: "True Positive (TP) = 90, False Positive (FP) = 10. What is the Precision?", opts: ["90%", "10%", "100%", "80%"], ans: 0 },
  { q: "What is 'Data Leakage' in Machine Learning?", opts: ["Losing data due to a database crash", "When information from outside the training dataset is used to create the model", "When a neural network has too many layers", "When variables are dropped accidentally during cleaning"], ans: 1 },
  { q: "In Natural Language Processing (NLP), what does TF-IDF stand for?", opts: ["Text Formatting - Internal Document File", "Term Frequency - Inverse Document Frequency", "Token Finding - Individual Data Format", "Total Frequency - Inverse Data Flow"], ans: 1 },
  { q: "Which of the following relies on analyzing the 'k' closest training examples in the feature space?", opts: ["K-Means", "K-Nearest Neighbors (KNN)", "K-Fold Cross Validation", "Support Vector Machines"], ans: 1 },
  { q: "In the context of ANNs, an 'epoch' is defined as:", opts: ["A single update of the weights", "One complete pass of the entire training dataset through the algorithm", "The time it takes to compile the model", "Passing a single batch of data"], ans: 1 },
  { q: "What does One-Hot Encoding achieve?", opts: ["Converts categorical variables into a binary matrix representation", "Normalizes numerical arrays between 0 and 1", "Encodes images into pixel arrays", "Reduces the number of dimensions via linear algebra"], ans: 0 },
  { q: "What is typically the final layer activation function for a multi-class categorization neural network?", opts: ["Linear", "Sigmoid", "Softmax", "ReLU"], ans: 2 },
  { q: "Which statement best describes Deep Learning?", opts: ["Learning rules manually programmed by a developer", "A subset of ML based on artificial neural networks with multiple layers", "A technique only used for structured tabular data", "A statistical method that does not require training data"], ans: 1 }
];

const multiSelects = [
  {
    q: "Which of the following techniques can help prevent Overfitting in Artificial Neural Networks?",
    opts: [
      { text: "Adding L1 or L2 Regularization", isCorrect: true },
      { text: "Implementing Dropout layers", isCorrect: true },
      { text: "Increasing the complexity of the model heavily", isCorrect: false },
      { text: "Early Stopping during training", isCorrect: true },
      { text: "Training on a smaller dataset", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Consider a Random Forest Classifier. Which statements accurately describe how it operates?",
    opts: [
      { text: "It builds multiple decision trees during training.", isCorrect: true },
      { text: "Each tree is trained on the exact same identical subset of data.", isCorrect: false },
      { text: "It merges predictions of multiple trees (e.g., via majority voting).", isCorrect: true },
      { text: "It is an example of an 'Ensemble' method.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following are Unsupervised Learning algorithms?",
    opts: [
      { text: "K-Means Clustering", isCorrect: true },
      { text: "Principal Component Analysis (PCA)", isCorrect: true },
      { text: "Linear Regression", isCorrect: false },
      { text: "Hierarchical Clustering", isCorrect: true },
      { text: "Support Vector Machines", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Review the following Python snippet:\n```python\nmodel.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])\n```\nWhich of the following are true about this Keras/TensorFlow model configuration?",
    opts: [
      { text: "It is configured for a multi-class classification problem.", isCorrect: true },
      { text: "It uses an adaptive learning rate optimization algorithm (Adam).", isCorrect: true },
      { text: "It is configured for predicting continuous numerical values (Regression).", isCorrect: false },
      { text: "The primary evaluation metric printed during training will be accuracy.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "In the context of Algorithmic Bias and Ethics in AI, which of the following scenarios are historically documented concerns?",
    opts: [
      { text: "Facial recognition systems demonstrating lower accuracy on minority demographics.", isCorrect: true },
      { text: "Recruitment AIs learning to penalize resumes containing specific gendered keywords.", isCorrect: true },
      { text: "AI models becoming completely autonomous and refusing to shut down.", isCorrect: false },
      { text: "Natural Language Models generating toxic or biased text based on their training corpus.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Identify the hyper-parameters from the following list (parameters defined BEFORE training begins):",
    opts: [
      { text: "The Learning Rate of Gradient Descent", isCorrect: true },
      { text: "The Weights connecting neurons in hidden layers", isCorrect: false },
      { text: "The Bias value learned by an output neuron", isCorrect: false },
      { text: "The number of hidden layers (Network Depth)", isCorrect: true },
      { text: "The 'k' value in K-Nearest Neighbors", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which statements regarding Gradient Descent are true?",
    opts: [
      { text: "It calculates the gradient of the loss function to update model weights.", isCorrect: true },
      { text: "Stochastic Gradient Descent (SGD) updates parameters using a single randomly chosen data point.", isCorrect: true },
      { text: "Setting the learning rate too high guarantees finding the global minimum faster.", isCorrect: false },
      { text: "It can sometimes get stuck in local minima in non-convex functions.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "If an AI model has High Bias and Low Variance, what does this indicate?",
    opts: [
      { text: "The model is likely underfitting the data.", isCorrect: true },
      { text: "The model is too simplistic to capture complex patterns.", isCorrect: true },
      { text: "The model is heavily overfitting to the training noise.", isCorrect: false },
      { text: "The model performs very consistently, although potentially inaccurate.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following are valid activation functions utilized in Deep Learning?",
    opts: [
      { text: "Rectified Linear Unit (ReLU)", isCorrect: true },
      { text: "Softmax", isCorrect: true },
      { text: "Euclidean Transform", isCorrect: false },
      { text: "Sigmoid", isCorrect: true },
      { text: "Matrix Inversion", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Regarding K-Fold Cross-Validation, which statements are accurate?",
    opts: [
      { text: "It partitions the dataset into 'K' completely separate subsets.", isCorrect: true },
      { text: "It evaluates the model K times, each time using a different subset as the test set.", isCorrect: true },
      { text: "It uses 100% of the dataset purely for testing simultaneously.", isCorrect: false },
      { text: "It provides a more robust estimate of model performance than a single Train/Test split.", isCorrect: true }
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

    // Wipe previous 'AIML' instances
    await Quiz.deleteMany({ title: "Artificial Intelligence and Machine Learning - AIML" });

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
      title: "Artificial Intelligence and Machine Learning - AIML",
      description: "An incredibly difficult, 100-mark assessment spanning Artificial Neural Networks, Unsupervised Algorithms, Ethics, and Python Model implementations.",
      course: "IT2011 - AIML",
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
