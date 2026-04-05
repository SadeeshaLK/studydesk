const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const singleSelects = [
  { q: "What is the time complexity of searching for an element in an unsorted array?", opts: ["O(log n)", "O(1)", "O(n)", "O(n log n)"], ans: 2 },
  { q: "Which data structure operates on a Last In First Out (LIFO) principle?", opts: ["Queue", "Tree", "Graph", "Stack"], ans: 3 },
  { q: "What is the worst-case time complexity of Quick Sort?", opts: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], ans: 1 },
  { q: "In a binary search tree, where is the smallest element located?", opts: ["Root", "Leftmost node", "Rightmost node", "Any leaf node"], ans: 1 },
  { q: "Which data structure is primarily used for breadth-first search on a graph?", opts: ["Stack", "Queue", "Heap", "Hash Table"], ans: 1 },
  { q: "What is the main advantage of a linked list over an array?", opts: ["Random access to elements", "Dynamic size", "Less memory usage", "Faster searching"], ans: 1 },
  { q: "Which sorting algorithm is heavily utilized in the Merge Sort strategy?", opts: ["Divide and conquer", "Dynamic programming", "Greedy approach", "Backtracking"], ans: 0 },
  { q: "What is the time complexity of pushing an element onto a stack?", opts: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], ans: 2 },
  { q: "A graph with no cycles is known as a:", opts: ["Tree", "Complete graph", "Bipartite graph", "Directed acyclic graph"], ans: 3 },
  { q: "What is the space complexity of an adjacency matrix for a graph with V vertices?", opts: ["O(V)", "O(V + E)", "O(V^2)", "O(E^2)"], ans: 2 },
  { q: "In an AVL tree, what is the maximum permitted height difference between left and right subtrees?", opts: ["0", "1", "2", "log n"], ans: 1 },
  { q: "Which data structure uses the First In First Out (FIFO) principle?", opts: ["Stack", "Hash Map", "Array", "Queue"], ans: 3 },
  { q: "Which algorithm finds the shortest path from a source to all other vertices in a weighted graph?", opts: ["Kruskal's", "Dijkstra's", "Prim's", "Floyd-Warshall"], ans: 1 },
  { q: "What is the primary function of a Hash Table?", opts: ["Fast data retrieval", "Sorting elements in place", "Balancing a tree", "Finding the minimum element"], ans: 0 },
  { q: "Which of the following sorting algorithms is inherently stable?", opts: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], ans: 2 },
  { q: "Review this snippet:\n```javascript\nfunction fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}\n```\nWhat is the time complexity?", opts: ["O(n)", "O(2^n)", "O(n^2)", "O(log n)"], ans: 1 },
  { q: "In a min-heap, the parent node is always:", opts: ["Greater than its children", "Less than or equal to its children", "Equal to its left child", "The maximum element"], ans: 1 },
  { q: "Which data structure is best suited to implement a priority queue?", opts: ["Linked List", "Array", "Stack", "Heap"], ans: 3 },
  { q: "What traversal of a BST visits nodes in ascending order?", opts: ["Pre-order", "In-order", "Post-order", "Level-order"], ans: 1 },
  { q: "The worst-case time complexity of retrieving a value from a well-distributed Hash Map is:", opts: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], ans: 2 },
  { q: "Which of the following is NOT an application of a Stack data structure?", opts: ["Undo mechanism", "Expression evaluation", "CPU Task Scheduling", "Syntax parsing"], ans: 2 },
  { q: "What is the main drawback of a standard binary search tree compared to a balanced one?", opts: ["Uses more memory", "It cannot store duplicate keys", "It can degenerate into a linked list", "Insertion is O(1)"], ans: 2 },
  { q: "How many edges are present in a tree with N vertices?", opts: ["N", "N+1", "N-1", "2N"], ans: 2 },
  { q: "Which algorithm would best detect a cycle in a directed graph?", opts: ["Depth First Search (DFS)", "Dijkstra's Algorithm", "Binary Search", "Kruskal's Algorithm"], ans: 0 },
  { q: "What is the average time complexity of building a heap from an array iteratively?", opts: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], ans: 2 },
  { q: "In a doubly linked list, each node contains:", opts: ["Data and a pointer to the next node", "Data, pointer to next, pointer to previous", "Multiple pointers to children", "Only pointers, no data"], ans: 1 },
  { q: "What does Kruskal's algorithm find?", opts: ["Shortest path", "Maximum flow", "Minimum Spanning Tree", "Topological Sort"], ans: 2 },
  { q: "Binary search requires the array to be:", opts: ["Sorted", "Unsorted", "Reversed", "Positive numbers only"], ans: 0 },
  { q: "The Floyd-Warshall algorithm is used for:", opts: ["Single-source shortest path", "All-pairs shortest path", "Minimum spanning tree", "Bipartite matching"], ans: 1 },
  { q: "Which characteristic makes a greedy algorithm different from dynamic programming?", opts: ["Makes locally optimal choices", "Reuses overlapping subproblems", "Always finds the globally optimal solution", "Uses exponential time"], ans: 0 }
];

const multiSelects = [
  {
    q: "Which of the following statements about Binary Search Trees (BST) are true?",
    opts: [
      { text: "The left child must be smaller than the parent node.", isCorrect: true },
      { text: "The right child must be greater than the parent node.", isCorrect: true },
      { text: "A pre-order traversal produces elements in sorted order.", isCorrect: false },
      { text: "Searching takes O(n) time in the absolute worst-case scenario.", isCorrect: true },
      { text: "They are inherently self-balancing.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Consider the Quick Sort algorithm. Which of the following statements apply to it?",
    opts: [
      { text: "It employs a divide-and-conquer strategy.", isCorrect: true },
      { text: "Its average-case time complexity is O(n log n).", isCorrect: true },
      { text: "It requires O(n) auxiliary space for arrays.", isCorrect: false },
      { text: "It is technically an unstable sorting algorithm by default.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which data structures provide O(1) average time complexity for both insertion and lookup operations?",
    opts: [
      { text: "Hash Tables", isCorrect: true },
      { text: "Balanced Binary Search Trees", isCorrect: false },
      { text: "Arrays", isCorrect: false },
      { text: "Unordered Sets (backed by hashing)", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Review the following Javascript graph representation:\n```javascript\nconst adjList = {\n  A: ['B', 'C'],\n  B: ['A', 'D', 'E'],\n  C: ['A', 'F']\n};\n```\nWhich statements are correct assuming a standard BFS from node 'A'?",
    opts: [
      { text: "Nodes B and C are discovered before Node D.", isCorrect: true },
      { text: "The graph is fundamentally directed.", isCorrect: false },
      { text: "BFS guarantees finding the shortest path in unweighted networks.", isCorrect: true },
      { text: "BFS requires a Queue to maintain traversal state.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following are valid applications for a Stack data structure?",
    opts: [
      { text: "Evaluating Postfix mathematical expressions.", isCorrect: true },
      { text: "Browser history (Back/Forward).", isCorrect: true },
      { text: "Operating System process scheduling (Round Robin).", isCorrect: false },
      { text: "Tracking the Call Stack for recursive function calls.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "In Big-O Notation analysis, which of the following comparative inequalities are strictly true for extremely large values of n?",
    opts: [
      { text: "O(n log n) is more efficient than O(n^2)", isCorrect: true },
      { text: "O(2^n) is more efficient than O(n!)", isCorrect: true },
      { text: "O(log n) is less efficient than O(1)", isCorrect: true },
      { text: "O(n^3) is more efficient than O(n log n)", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Identify the algorithms that utilize the Dynamic Programming paradigm:",
    opts: [
      { text: "Dijkstra's Algorithm", isCorrect: false },
      { text: "Floyd-Warshall Algorithm", isCorrect: true },
      { text: "The 0/1 Knapsack Problem", isCorrect: true },
      { text: "Depth First Search", isCorrect: false },
      { text: "Fibonacci Sequence using Memoization", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "What defines an optimal Minimum Spanning Tree (MST)?",
    opts: [
      { text: "It connects all vertices in the graph.", isCorrect: true },
      { text: "It contains exactly exactly one cycle.", isCorrect: false },
      { text: "The sum of edge weights is minimized.", isCorrect: true },
      { text: "It can theoretically be found using Prim's algorithm.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following operations cost exactly O(1) time in a perfectly implemented Doubly Linked List?",
    opts: [
      { text: "Finding the absolute middle element.", isCorrect: false },
      { text: "Inserting an element at the head.", isCorrect: true },
      { text: "Deleting the tail element (if tail pointer is known).", isCorrect: true },
      { text: "Searching for a specific string value.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "What are the common collision resolution techniques utilized in Hash Tables?",
    opts: [
      { text: "Separate Chaining (using Linked Lists)", isCorrect: true },
      { text: "Linear Probing", isCorrect: true },
      { text: "Quadratic Probing", isCorrect: true },
      { text: "Matrix Inversion", isCorrect: false }
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

    // Wipe previous 'DSA' instances
    await Quiz.deleteMany({ title: "Data Structures & Algorithms - DSA" });

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
      title: "Data Structures & Algorithms - DSA",
      description: "A grueling 100-mark comprehensive Data Structures and Algorithms examination built upon the IT1170 Lecture curriculum.",
      course: "IT1170 - DSA",
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
