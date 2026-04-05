const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const Payment = require('../models/Payment');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Lecturer only
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, course, duration, passingPercentage, startDate, endDate, questions, pricingType, price, maxAttempts, shuffleQuestions, category, lessonReference } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      course,
      lecturer: req.user._id,
      duration,
      passingPercentage: passingPercentage || 50,
      startDate,
      endDate,
      pricingType: pricingType || 'free',
      price: pricingType === 'paid' ? (price || 0) : 0,
      maxAttempts: maxAttempts || 1,
      shuffleQuestions: shuffleQuestions !== undefined ? shuffleQuestions : true,
      category: category || 'general',
      lessonReference: category === 'lesson_based' ? lessonReference : '',
      questions: questions || []
    });

    res.status(201).json({ message: 'Quiz created successfully!', quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Failed to create quiz.' });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Lecturer only
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, lecturer: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const { title, description, course, duration, passingPercentage, startDate, endDate, questions, isPublished, pricingType, price, maxAttempts, shuffleQuestions, category, lessonReference } = req.body;

    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (course !== undefined) quiz.course = course;
    if (duration !== undefined) quiz.duration = duration;
    if (passingPercentage !== undefined) quiz.passingPercentage = passingPercentage;
    if (startDate !== undefined) quiz.startDate = startDate;
    if (endDate !== undefined) quiz.endDate = endDate;
    if (questions !== undefined) quiz.questions = questions;
    if (isPublished !== undefined) quiz.isPublished = isPublished;
    if (pricingType !== undefined) quiz.pricingType = pricingType;
    if (price !== undefined) quiz.price = price;
    if (maxAttempts !== undefined) quiz.maxAttempts = maxAttempts;
    if (shuffleQuestions !== undefined) quiz.shuffleQuestions = shuffleQuestions;
    if (category !== undefined) quiz.category = category;
    if (lessonReference !== undefined) quiz.lessonReference = lessonReference;

    // cleanup lessonReference if category changed off lesson_based
    if (quiz.category !== 'lesson_based') quiz.lessonReference = '';

    await quiz.save();

    res.json({ message: 'Quiz updated successfully!', quiz });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Failed to update quiz.' });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Lecturer only
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, lecturer: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Also delete all submissions and payments for this quiz
    await Submission.deleteMany({ quiz: req.params.id });
    await Payment.deleteMany({ quiz: req.params.id });

    res.json({ message: 'Quiz deleted successfully!' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Failed to delete quiz.' });
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/quizzes/:id/publish
// @access  Lecturer only
exports.togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, lecturer: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (!quiz.isPublished && quiz.questions.length === 0) {
      return res.status(400).json({ message: 'Cannot publish a quiz with no questions.' });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.json({ 
      message: quiz.isPublished ? 'Quiz published!' : 'Quiz unpublished!', 
      quiz 
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ message: 'Failed to update publish status.' });
  }
};

// @desc    Get lecturer's quizzes
// @route   GET /api/quizzes/my-quizzes
// @access  Lecturer only
exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ lecturer: req.user._id })
      .sort({ createdAt: -1 })
      .select('-questions.options.isCorrect -questions.correctAnswer');

    // Get submission counts for each quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const submissionCount = await Submission.countDocuments({ quiz: quiz._id });
        return { ...quiz.toObject(), submissionCount };
      })
    );

    res.json({ quizzes: quizzesWithStats });
  } catch (error) {
    console.error('Get my quizzes error:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
};

// @desc    Get single quiz (full details for lecturer)
// @route   GET /api/quizzes/:id
// @access  Lecturer only
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, lecturer: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz.' });
  }
};

// @desc    Get available quizzes for students
// @route   GET /api/quizzes/student/available
// @access  Student only
exports.getAvailableQuizzes = async (req, res) => {
  try {
    const now = new Date();
    const quizzes = await Quiz.find({
      isPublished: true,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] }
      ]
    })
    .populate('lecturer', 'name')
    .select('title description course duration totalMarks passingPercentage startDate endDate lecturer createdAt pricingType price maxAttempts shuffleQuestions category lessonReference questions._id')
    .sort({ createdAt: -1 });

    // Get attempt counts and purchase status for each quiz
    const studentId = req.user._id;
    const [submissions, purchases] = await Promise.all([
      Submission.find({ student: studentId }).select('quiz'),
      Payment.find({ student: studentId, type: 'purchase', status: 'completed' }).select('quiz')
    ]);

    const attemptCountMap = {};
    submissions.forEach(s => {
      const qid = s.quiz.toString();
      attemptCountMap[qid] = (attemptCountMap[qid] || 0) + 1;
    });

    const paidQuizIds = new Set(purchases.map(p => p.quiz.toString()));

    const quizzesWithStatus = quizzes.map(q => {
      const qid = q._id.toString();
      const attemptCount = attemptCountMap[qid] || 0;
      const hasPaid = paidQuizIds.has(qid);
      const canAttempt = attemptCount < q.maxAttempts;
      const needsPayment = q.pricingType === 'paid' && !hasPaid;

      return {
        ...q.toObject(),
        attemptCount,
        hasPaid,
        canAttempt,
        needsPayment
      };
    });

    res.json({ quizzes: quizzesWithStatus });
  } catch (error) {
    console.error('Get available quizzes error:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
};

// @desc    Get quiz for attempt (randomized, no answers)
// @route   GET /api/quizzes/student/:id/attempt
// @access  Student only
exports.getQuizForAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, isPublished: true })
      .populate('lecturer', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or not available.' });
    }

    // Check attempt limit
    const attemptCount = await Submission.countDocuments({ 
      student: req.user._id, 
      quiz: req.params.id 
    });
    if (attemptCount >= quiz.maxAttempts) {
      return res.status(400).json({ message: `Maximum attempts (${quiz.maxAttempts}) reached for this quiz.` });
    }

    // Check purchase for paid quizzes
    if (quiz.pricingType === 'paid') {
      const purchase = await Payment.findOne({ 
        student: req.user._id, 
        quiz: req.params.id, 
        type: 'purchase',
        status: 'completed' 
      });
      if (!purchase) {
        return res.status(403).json({ message: 'You need to purchase this quiz first.' });
      }
    }

    // Build questions — shuffle if enabled
    let processedQuestions = [...quiz.questions];
    
    if (quiz.shuffleQuestions) {
      // Shuffle question order
      for (let i = processedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [processedQuestions[i], processedQuestions[j]] = [processedQuestions[j], processedQuestions[i]];
      }
    }

    const randomizedQuestions = processedQuestions.map(q => {
      const question = {
        _id: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        isMultiSelect: q.isMultiSelect,
        marks: q.marks
      };

      if (q.questionType === 'mcq' || q.questionType === 'true-false') {
        let options = q.options.map(opt => ({ _id: opt._id, text: opt.text }));
        // Shuffle MCQ options when shuffle is enabled (not true-false)
        if (quiz.shuffleQuestions && q.questionType === 'mcq') {
          for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
          }
        }
        question.options = options;
      }

      return question;
    });

    res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        course: quiz.course,
        duration: quiz.duration,
        totalMarks: quiz.totalMarks,
        lecturer: quiz.lecturer,
        category: quiz.category,
        lessonReference: quiz.lessonReference,
        maxAttempts: quiz.maxAttempts,
        attemptNumber: attemptCount + 1,
        questions: randomizedQuestions
      }
    });
  } catch (error) {
    console.error('Get quiz for attempt error:', error);
    res.status(500).json({ message: 'Failed to load quiz.' });
  }
};

// @desc    Get all students (lecturer only)
// @route   GET /api/quizzes/students
// @access  Lecturer only
exports.getStudents = async (req, res) => {
  try {
    const User = require('../models/User');
    const students = await User.find({ role: 'student' }).select('name email createdAt');

    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const submissions = await Submission.find({ student: student._id });
        const quizzesTaken = submissions.length;
        const avgScore = quizzesTaken > 0
          ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / quizzesTaken)
          : 0;
        return {
          ...student.toObject(),
          quizzesTaken,
          avgScore
        };
      })
    );

    res.json({ students: studentsWithStats });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
};
