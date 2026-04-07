const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const dsaLectureQuizzes = [
  {
    title: "DSA Lec 01: Complexity Analysis (Big O)",
    description: "Time and Space complexity, asymptotic notations, and calculation rules.",
    questions: [
      { q: "What does O(1) represent?", opts: ["Linear time", "Constant time", "Logarithmic", "Exponential"], ans: 1 },
      { q: "Complexity of accessing an element in an array by index?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2 },
      { q: "Which notation represents the tight upper bound?", opts: ["Omega", "Theta", "Big O", "Small o"], ans: 2 },
      { q: "Complexity of a nested loop (i to n, j to n)?", opts: ["O(n)", "O(n²)", "O(log n)", "O(2ⁿ)"], ans: 1 },
      { q: "Best case complexity of Linear Search?", opts: ["O(n)", "O(1)", "O(log n)", "O(0)"], ans: 1 },
      { q: "Space complexity of an iterative loop (no extra storage)?", opts: ["O(n)", "O(1)", "O(n²)", "O(log n)"], ans: 1 },
      { q: "What is the order from fastest to slowest?", opts: ["1 < log n < n < n²", "n < 1 < log n", "log n < 1 < n", "n² < n < 1"], ans: 0 },
      { q: "Binary search time complexity?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 1 },
      { q: "Which notation is used for the average case?", opts: ["Big O", "Theta", "Omega", "None"], ans: 1 },
      { q: "Complexity of a for-loop from 1 to n/2?", opts: ["O(n/2)", "O(log n)", "O(n)", "O(1)"], ans: 2 },
      { q: "Identify O(n log n) algorithms:", opts: [{t: "Merge Sort", c: true}, {t: "Quick Sort (Avg)", c: true}, {t: "Heap Sort", c: true}, {t: "Bubble Sort", c: false}], isMulti: true, marks: 10 },
      { q: "Asymptotic notation properties:", opts: [{t: "O is upper bound", c: true}, {t: "Ω is lower bound", c: true}, {t: "Θ is tight bound", c: true}], isMulti: true, marks: 10 },
      { q: "Which affects Big O?", opts: [{t: "Number of operations", c: true}, {t: "Input size n", c: true}, {t: "CPU speed", c: false}, {t: "Memory size", c: false}], isMulti: true, marks: 10 },
      { q: "Select True statements:", opts: [{t: "O(n) implies O(n²)", c: true}, {t: "O(log n) is faster than O(n)", c: true}, {t: "O(n!) is fast", c: false}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nfor(i=0; i<n; i++) { \n  for(j=i; j<n; j++) { ... } \n} \nWhat is the Big O?", opts: [{t: "O(n²)", c: true}, {t: "O(n)", c: false}, {t: "O(n log n)", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 02: Array & Linked List Fundamentals",
    description: "Contiguous vs Non-contiguous storage, operations, and efficiency.",
    questions: [
      { q: "Linked List nodes consist of Data and...", opts: ["Index", "Pointer/Next", "Previous only", "Key"], ans: 1 },
      { q: "Array elements are stored in memory...", opts: ["Randomly", "Contiguously", "Singly", "Varies"], ans: 1 },
      { q: "Insertion at the end of a Linked List (if tail pointer exists) is:", opts: ["O(n)", "O(1)", "O(log n)", "O(n²)"], ans: 1 },
      { q: "Search complexity in a sorted array (non-binary)?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 0 },
      { q: "Binary search works on which structure?", opts: ["Unsorted Array", "Sorted Array", "Linked List", "Stack"], ans: 1 },
      { q: "Doubly Linked List nodes record...", opts: ["Next only", "Prev only", "Both Next and Prev", "Index"], ans: 2 },
      { q: "Circular Linked List features:", opts: ["No NULL pointer", "Last node points to first", "Infinite loop potential", "All of above"], ans: 3 },
      { q: "Benefit of Linked List over Array?", opts: ["Faster access", "Dynamic size", "Cache efficient", "Uses less memory/node"], ans: 1 },
      { q: "Complexity to delete a middle node in Singly Linked List (with pointer to head)?", opts: ["O(1)", "O(n)", "O(log n)", "O(2)"], ans: 1 },
      { q: "Static arrays have...", opts: ["Fixed size", "Dynamic size", "No size", "Pointer size"], ans: 0 },
      { q: "Identify Linked List types:", opts: [{t: "Singly", c: true}, {t: "Doubly", c: true}, {t: "Circular", c: true}, {t: "Linear Array", c: false}], isMulti: true, marks: 10 },
      { q: "Array characteristics:", opts: [{t: "Random access", c: true}, {t: "Contiguous memeory", c: true}, {t: "Insertions are O(n)", c: true}], isMulti: true, marks: 10 },
      { q: "Why use Doubly Linked List?", opts: [{t: "Reverse traversal", c: true}, {t: "Delete a node with only its pointer", c: true}, {t: "Uses less memory", c: false}], isMulti: true, marks: 10 },
      { q: "Linked List operations and complexity:", opts: [{t: "Insert head: O(1)", c: true}, {t: "Traversal: O(n)", c: true}, {t: "Search: O(n)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nvoid insert(Node* head, int value) { \n  Node* temp = head; \n  while(temp->next != NULL) temp = temp->next; \n  temp->next = new Node(value); \n} \nWhat is the time complexity of this insertion?", opts: [{t: "O(n)", c: true}, {t: "O(1)", c: false}, {t: "O(log n)", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 03: Stacks & Queues",
    description: "LIFO vs FIFO, implementations, and use cases.",
    questions: [
      { q: "Stack follows which principle?", opts: ["FIFO", "LIFO", "LILO", "None"], ans: 1 },
      { q: "Queue follows which principle?", opts: ["FIFO", "LIFO", "Priority", "Random"], ans: 0 },
      { q: "Operation to add to a stack:", opts: ["Enqueue", "Push", "Pop", "Top"], ans: 1 },
      { q: "Operation to remove from a queue:", opts: ["Push", "Pop", "Dequeue", "Front"], ans: 2 },
      { q: "In a circular queue, when queue is full?", opts: ["Rear=Front", "(Rear+1)%Size == Front", "Rear=Size", "Front=Rear+1"], ans: 1 },
      { q: "Reverse a string using which structure?", opts: ["Queue", "Stack", "Tree", "Graph"], ans: 1 },
      { q: "DFS uses which internal structure?", opts: ["Queue", "Stack", "Deque", "Array"], ans: 1 },
      { q: "BFS uses which internal structure?", opts: ["Stack", "Queue", "Priority", "Node"], ans: 1 },
      { q: "Condition indicating Stack Empty in array impl (top init as -1)?", opts: ["top == -1", "top == 0", "top == n", "top == NULL"], ans: 0 },
      { q: "Double-ended queue is known as:", opts: ["Stack", "Deque", "Pri-Queue", "Enque"], ans: 1 },
      { q: "Stack Use Cases:", opts: [{t: "Recursion/Function calls", c: true}, {t: "Undo functionality", c: true}, {t: "Expression evaluation", c: true}, {t: "Print buffer", c: false}], isMulti: true, marks: 10 },
      { q: "Queue Use Cases:", opts: [{t: "CPU Scheduling", c: true}, {t: "Print spoolers", c: true}, {t: "BFS traversal", c: true}, {t: "Undo", c: false}], isMulti: true, marks: 10 },
      { q: "Queue implementation variations:", opts: [{t: "Simple Queue", c: true}, {t: "Circular Queue", c: true}, {t: "Priority Queue", c: true}, {t: "Deque", c: true}], isMulti: true, marks: 10 },
      { q: "Stack operations and complexity:", opts: [{t: "Push: O(1)", c: true}, {t: "Pop: O(1)", c: true}, {t: "Peek: O(1)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nchar pop() { \n  if(top < 0) return 'e'; \n  char x = stack[top--]; \n  return x; \n} \nIf top is 5, what is top after call?", opts: [{t: "4", c: true}, {t: "5", c: false}, {t: "6", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 04: Recursion & Backtracking",
    description: "Recursive calls, base cases, and solving complex search problems.",
    questions: [
      { q: "Essential component to prevent infinite recursion?", opts: ["Recursive call", "Base case", "Local variable", "Parameter"], ans: 1 },
      { q: "Factorial(n) recursive formula:", opts: ["n + Fac(n-1)", "n * Fac(n-1)", "n * Fac(n)", "Fac(n/2)"], ans: 1 },
      { q: "Fibonacci recursive complexity?", opts: ["O(n)", "O(2ⁿ)", "O(log n)", "O(n³)"], ans: 1 },
      { q: "Recursion uses which area of memory for tracking?", opts: ["Heap", "Stack", "Global", "Code"], ans: 1 },
      { q: "Backtracking is an improvement over:", opts: ["Linear search", "Brute Force/Exhaustive Search", "Greedy", "Sorting"], ans: 1 },
      { q: "N-Queens problem is solved using:", opts: ["Queue", "Backtracking", "BFS", "Linear"], ans: 1 },
      { q: "When a function calls itself, it is:", opts: ["Iterative", "Recursive", "Stateless", "Overloaded"], ans: 1 },
      { q: "Tail recursion optimization happens when:", opts: ["Call is in middle", "Call is the last operation", "No base case", "None"], ans: 1 },
      { q: "Tower of Hanoi moves for 3 disks?", opts: ["3", "7", "8", "4"], ans: 1 },
      { q: "Indirect recursion involves:", opts: ["A calls B, B calls A", "A calls A", "No calls", "Loops"], ans: 0 },
      { q: "Common recursive problems:", opts: [{t: "Factorial", c: true}, {t: "Fibonacci", c: true}, {t: "Binary Search", c: true}, {t: "Iterative Sort", c: false}], isMulti: true, marks: 10 },
      { q: "Backtracking characteristics:", opts: [{t: "Pruning search space", c: true}, {t: "Undo moves", c: true}, {t: "Depth-first approach", c: true}], isMulti: true, marks: 10 },
      { q: "Identify N-Queens properties:", opts: [{t: "Backtracking", c: true}, {t: "Explores paths", c: true}, {t: "Optimal path search", c: false}], isMulti: true, marks: 10 },
      { q: "Types of Recursion:", opts: [{t: "Direct", c: true}, {t: "Indirect", c: true}, {t: "Tail", c: true}, {t: "Head", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nint f(int n) { \n  if(n <= 1) return n; \n  return f(n-1) + f(n-2); \n} \nWhat value does f(3) return?", opts: [{t: "2", c: true}, {t: "1", c: false}, {t: "3", c: false}, {t: "5", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 05: Sorting Algorithms I (Simple)",
    description: "Bubble, Selection, and Insertion Sort: logic and analysis.",
    questions: [
      { q: "Complexity of Bubble Sort (Average)?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: 2 },
      { q: "Which sort finds the minimum and places at start in each pass?", opts: ["Bubble", "Selection", "Insertion", "Merge"], ans: 1 },
      { q: "Complexity of Insertion Sort in nearly sorted data (Best case)?", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 0 },
      { q: "Bubble sort primary mechanism?", opts: ["Splitting", "Swapping adjacent elements", "Selecting min", "Merging"], ans: 1 },
      { q: "In Selection Sort, if n=10, how many swaps occur at most?", opts: ["10", "9", "100", "0"], ans: 1 },
      { q: "Which sort is used when small part of data is unsorted?", opts: ["Insertion", "Quick", "Selection", "Heap"], ans: 0 },
      { q: "Stable sort means:", opts: ["Always fast", "Maintains relative order of equal keys", "No extra memory", "Reliable"], ans: 1 },
      { q: "In-place sort means:", opts: ["O(1) extra space", "Fast sort", "Original array used", "Both 1 & 3"], ans: 3 },
      { q: "Selection sort worst case complexity?", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 1 },
      { q: "Insertion sort primary mechanism?", opts: ["Swapping", "Inserting into sorted sub-array", "Splitting", "Random"], ans: 1 },
      { q: "Identify Quadratic sorts:", opts: [{t: "Bubble Sort", c: true}, {t: "Selection Sort", c: true}, {t: "Insertion Sort", c: true}, {t: "Merge Sort", c: false}], isMulti: true, marks: 10 },
      { q: "Algorithm properties of Selection Sort:", opts: [{t: "O(n²) time", c: true}, {t: "In-place", c: true}, {t: "Not Stable (usually)", c: true}, {t: "Adaptive", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Stable sorts:", opts: [{t: "Bubble Sort", c: true}, {t: "Insertion Sort", c: true}, {t: "Merge Sort", c: true}, {t: "Selection Sort", c: false}], isMulti: true, marks: 10 },
      { q: "Insertion Sort features:", opts: [{t: "Adaptive", c: true}, {t: "Stable", c: true}, {t: "Fast for small n", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nfor(i=1; i<n; i++) { \n  key = a[i]; j = i-1; \n  while(j>=0 && a[j]>key) { a[j+1]=a[j]; j--; } \n  a[j+1]=key; \n} \nWhich algorithm is this?", opts: [{t: "Insertion Sort", c: true}, {t: "Selection Sort", c: false}, {t: "Bubble Sort", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 06: Searching Algorithms & Hashing",
    description: "Binary Search, Hash Tables, Collisions, and Hashing functions.",
    questions: [
      { q: "Binary search prerequisite:", opts: ["Sorted data", "Unsorted data", "No order", "Linked list"], ans: 0 },
      { q: "Hash function converts key into:", opts: ["Key store", "Index/Hash code", "Large number", "Pointer"], ans: 1 },
      { q: "Collision occurs when:", opts: ["Key is missing", "Two keys map to same index", "Memory is full", "CPU error"], ans: 1 },
      { q: "Chaining collision technique uses:", opts: ["Linked lists at each index", "Searching next index", "Re-hashing", "Double hashing"], ans: 0 },
      { q: "Open addressing technique seeking next empty slot?", opts: ["Separate Chaining", "Linear Probing", "Quadratic Probing", "None"], ans: 1 },
      { q: "Complexity of successful hash search (Avg)?", opts: ["O(log n)", "O(1)", "O(n)", "O(n²)"], ans: 1 },
      { q: "Binary search middle index formula:", opts: ["(low + high) / 2", "low + (high-low)/2", "high - low", "Both 1 & 2 (ignoring overflow for 1)"], ans: 3 },
      { q: "Worst case hash search complexity?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], ans: 2 },
      { q: "Complexity of Binary search?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 1 },
      { q: "Hash Load Factor (α) is:", opts: ["Sum of keys", "n/m (items / slots)", "m/n", "Size of keys"], ans: 1 },
      { q: "Collision Resolution Strategies:", opts: [{t: "Chaining", c: true}, {t: "Linear Probing", c: true}, {t: "Quadratic Probing", c: true}, {t: "Double Hashing", c: true}], isMulti: true, marks: 10 },
      { q: "Properties of a good Hash Function:", opts: [{t: "Deterministic", c: true}, {t: "Uniform distribution", c: true}, {t: "Fast calculation", c: true}, {t: "Reversible", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Search complexities:", opts: [{t: "Linear: O(n)", c: true}, {t: "Binary: O(log n)", c: true}, {t: "Hash: O(1)", c: true}], isMulti: true, marks: 10 },
      { q: "Binary Search properties:", opts: [{t: "Divide and Conquer", c: true}, {t: "Sorted input", c: true}, {t: "Iterative or Recursive", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nint h = key % tableSize; \nIf key=25 and tableSize=10, what is the index?", opts: [{t: "5", c: true}, {t: "2", c: false}, {t: "25", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 07: Tree Fundamentals & Binary Trees",
    description: "Hierarchical storage, Binary Tree properties, and Traversals.",
    questions: [
      { q: "Maximum children for a node in a Binary Tree?", opts: ["1", "2", "Unlimited", "0"], ans: 1 },
      { q: "Node with no children is called:", opts: ["Root", "Internal Node", "Leaf Node", "Branch"], ans: 2 },
      { q: "Traveral order: Root -> Left -> Right is:", opts: ["In-order", "Pre-order", "Post-order", "Level-order"], ans: 1 },
      { q: "In-order traversal of a BST results in:", opts: ["Random order", "Descending order", "Sorted ascending order", "Pre-order"], ans: 2 },
      { q: "Depth of root node is:", opts: ["1", "0", "Height - 1", "Log n"], ans: 1 },
      { q: "Maximum nodes at level h in binary tree?", opts: ["2h", "2^h", "2^(h+1)-1", "h²"], ans: 1 },
      { q: "Strict Binary Tree means:", opts: ["Every node has 0 or 2 children", "Every node has 2 children", "Fully balanced", "None"], ans: 0 },
      { q: "Total nodes in a complete binary tree of height h?", opts: ["2^h", "2^(h+1)-1", "h!", "2h"], ans: 1 },
      { q: "Traversal order: Left -> Right -> Root is:", opts: ["Pre-order", "Post-order", "In-order", "Level-order"], ans: 1 },
      { q: "Degree of a node is:", opts: ["Path length", "Number of children", "Total nodes", "Depth"], ans: 1 },
      { q: "Binary Tree Traversals:", opts: [{t: "Pre-order", c: true}, {t: "In-order", c: true}, {t: "Post-order", c: true}, {t: "Breadth-first", c: true}], isMulti: true, marks: 10 },
      { q: "Attributes of Binary Search Tree (BST):", opts: [{t: "Left < Root", c: true}, {t: "Right > Root", c: true}, {t: "Unique keys", c: true}], isMulti: true, marks: 10 },
      { q: "Identify Tree Types:", opts: [{t: "Binary Tree", c: true}, {t: "AVL Tree", c: true}, {t: "Heaps", c: true}, {t: "LinkedList", c: false}], isMulti: true, marks: 10 },
      { q: "Tree Terminology:", opts: [{t: "Root", c: true}, {t: "Leaf", c: true}, {t: "Level", c: true}, {t: "Height", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nvoid traverse(Node* r) { \n  if(r==NULL) return; \n  traverse(r->left); \n  cout << r->data; \n  traverse(r->right); \n} \nWhat type of traversal is this?", opts: [{t: "In-order", c: true}, {t: "Pre-order", c: false}, {t: "Post-order", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 08: Binary Search Trees (BST) & Heaps",
    description: "Search, Insertion, Deletion in BST and Priority Queue heaps.",
    questions: [
      { q: "Worst case search complexity in BST (unbalanced)?", opts: ["O(log n)", "O(1)", "O(n)", "O(n²)"], ans: 2 },
      { q: "Binary Heap is which type of data structure?", opts: ["Graph", "Complete Binary Tree", "Sorted Tree", "Linked List"], ans: 1 },
      { q: "In a Max-Heap, the largest element is at:", opts: ["Leaf", "Root", "Middle", "Leftmost"], ans: 1 },
      { q: "Insertion complexity in a Binary Heap?", opts: ["O(1)", "O(n)", "O(log n)", "O(n!)"], ans: 2 },
      { q: "Deletion in BST (node with 2 children) usually involves...", opts: ["Deleting root", "Replacing with In-order successor/predecessor", "Deleting leaf", "Error"], ans: 1 },
      { q: "Heapify operation complexity?", opts: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], ans: 1 },
      { q: "BST Average search complexity?", opts: ["O(n)", "O(log n)", "O(√n)", "O(n²)"], ans: 1 },
      { q: "Child nodes of node at index i in array-impl heap (1-based)?", opts: ["2i and 2i+1", "i+1 and i+2", "i/2", "i²"], ans: 0 },
      { q: "Min-Heap property:", opts: ["Parent <= Children", "Parent >= Children", "Left < Right", "Random"], ans: 0 },
      { q: "Building a heap from n elements (bottom-up)?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 1 },
      { q: "Operations on BST:", opts: [{t: "Search", c: true}, {t: "Insert", c: true}, {t: "Delete", c: true}, {t: "Sort", c: true}], isMulti: true, marks: 10 },
      { q: "Max-Heap characteristics:", opts: [{t: "Root is Max", c: true}, {t: "Complete binary tree", c: true}, {t: "Parent >= Child", c: true}], isMulti: true, marks: 10 },
      { q: "Identify balanced trees:", opts: [{t: "AVL Tree", c: true}, {t: "Red-Black Tree", c: true}, {t: "B-Tree", c: true}, {t: "Singly List", c: false}], isMulti: true, marks: 10 },
      { q: "Heap Applications:", opts: [{t: "Priority Queues", c: true}, {t: "Heapsort", c: true}, {t: "Dijkstra's Algo", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nwhile (curr != NULL && curr->data != key) { \n  if (key < curr->data) curr = curr->left; \n  else curr = curr->right; \n} \nWhat is being performed?", opts: [{t: "BST Search", c: true}, {t: "AVL Rotation", c: false}, {t: "Heapify", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 09: Complexity - Divide & Conquer",
    description: "Paradigm logic, master theorem, and efficient sorting.",
    questions: [
      { q: "Divide and Conquer involves how many main steps?", opts: ["1", "2", "3", "4"], ans: 2 },
      { q: "The 'Merge' operation in Merge Sort is performed after:", opts: ["Dividing", "Recursive calls return", "Initialization", "Comparison"], ans: 1 },
      { q: "Complexity of Binary search using D&C?", opts: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], ans: 1 },
      { q: "Which sort uses a 'Pivot' element?", opts: ["Merge Sort", "Quick Sort", "Insertion Sort", "Heap Sort"], ans: 1 },
      { q: "Merge Sort complexity (All cases)?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], ans: 0 },
      { q: "Quick Sort worst case complexity?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(2ⁿ)"], ans: 2 },
      { q: "The 'Conquer' step in D&C usually means:", opts: ["Splitting problem", "Solving subproblems recursively", "Combining results", "None"], ans: 1 },
      { q: "Recurrence for Binary Search?", opts: ["T(n) = T(n/2) + O(1)", "T(n) = 2T(n/2) + n", "T(n) = T(n-1) + n", "None"], ans: 0 },
      { q: "Pivot selection in Quick Sort affects:", opts: ["Correctness", "Performance/Complexity", "Memory", "Storage"], ans: 1 },
      { q: "Space complexity of Merge Sort?", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], ans: 1 },
      { q: "Divide & Conquer Algorithms:", opts: [{t: "Merge Sort", c: true}, {t: "Quick Sort", c: true}, {t: "Binary Search", c: true}, {t: "Strassen's Matrix", c: true}], isMulti: true, marks: 10 },
      { q: "Merge Sort vs Quick Sort:", opts: [{t: "Merge is stable", c: true}, {t: "Merge uses more space", c: true}, {t: "Quick is faster avg", c: true}], isMulti: true, marks: 10 },
      { q: "Master Theorem applies to:", opts: [{t: "T(n) = aT(n/b) + f(n)", c: true}, {t: "Recursive relations", c: true}, {t: "Linear loops", c: false}], isMulti: true, marks: 10 },
      { q: "Quick Sort Pivot strategies:", opts: [{t: "First element", c: true}, {t: "Last element", c: true}, {t: "Median-of-three", c: true}, {t: "Random", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nvoid sort(int a[], int l, int r) { \n  if (l < r) { \n    int m = l+(r-l)/2; \n    sort(a, l, m); \n    sort(a, m+1, r); \n    merge(a, l, m, r); \n  } \n} \nWhich algorithm?", opts: [{t: "Merge Sort", c: true}, {t: "Quick Sort", c: false}, {t: "Heap Sort", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 10: Advanced Sorting (Merge Sort)",
    description: "Deep dive into Merge sort, stability, and external sorting.",
    questions: [
      { q: "Auxiliary space complexity of standard Merge Sort?", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], ans: 1 },
      { q: "Is typical Merge Sort stable?", opts: ["Yes", "No", "Depends on data", "Sometimes"], ans: 0 },
      { q: "Primary advantage of Merge Sort?", opts: ["No extra space", "Consistent O(n log n) performance", "High speed for small arrays", "In-place"], ans: 1 },
      { q: "Merge sort is which type of algorithm?", opts: ["Greedy", "Dynamic", "Divide & Conquer", "Backtracking"], ans: 2 },
      { q: "Merging two sorted arrays of size n and m takes:", opts: ["O(n+m)", "O(n*m)", "O(log(n+m))", "O(1)"], ans: 0 },
      { q: "Which data structure is Merge sort highly efficient for?", opts: ["Arrays", "Linked Lists", "Stacks", "Queues"], ans: 1 },
      { q: "In Merge Sort, 'p' is start, 'r' is end. Mid 'q' is:", opts: ["(p+r)/2", "p+(r-p)/2", "r-p", "Both 1 & 2"], ans: 3 },
      { q: "External sorting uses which algorithm as a base?", opts: ["Quick Sort", "Insertion Sort", "Merge Sort", "Bubble Sort"], ans: 2 },
      { q: "Complexity of the 'Combine' (Merge) step?", opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 2 },
      { q: "Which sorting is generally used in Java's Collections.sort() for objects?", opts: ["Quick Sort", "Merge Sort (TimSort)", "Heap Sort", "Bubble"], ans: 1 },
      { q: "Merge Sort Attributes:", opts: [{t: "Stable", c: true}, {t: "O(n log n)", c: true}, {t: "Out-of-place", c: true}, {t: "Adaptive", c: false}], isMulti: true, marks: 10 },
      { q: "Merging Steps:", opts: [{t: "Divide into halves", c: true}, {t: "Solve subproblems", c: true}, {t: "Combine (Merge)", c: true}], isMulti: true, marks: 10 },
      { q: "Recursive depth of Merge Sort?", opts: [{t: "O(log n)", c: true}, {t: "O(n)", c: false}, {t: "O(1)", c: false}], isMulti: true, marks: 10 },
      { q: "Applications of Merge Sort:", opts: [{t: "External Sorting", c: true}, {t: "Linked List Sorting", c: true}, {t: "Inversion Count", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nwhile(i<n1 && j<n2) { \n  if(L[i] <= R[j]) arr[k++] = L[i++]; \n  else arr[k++] = R[j++]; \n} \nWhat does this part do?", opts: [{t: "Merging sub-arrays", c: true}, {t: "Partitioning", c: false}, {t: "Hashing", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 11: Graphs & Graph Algorithms I",
    description: "Representation (Matrix/List) and Traversals (BFS/DFS).",
    questions: [
      { q: "Graph G = (V, E). What is E?", opts: ["Vertices", "Edges", "Energy", "Elements"], ans: 1 },
      { q: "Graph with edges having direction is:", opts: ["Undirected", "Directed (Di-graph)", "Weighted", "Connected"], ans: 1 },
      { q: "Space complexity of Adjacency Matrix (V vertices)?", opts: ["O(V)", "O(E)", "O(V²)", "O(V+E)"], ans: 2 },
      { q: "Space complexity of Adjacency List?", opts: ["O(V²)", "O(V+E)", "O(E²)", "O(V)"], ans: 1 },
      { q: "BFS uses which data structure?", opts: ["Stack", "Queue", "Priority Queue", "Tree"], ans: 1 },
      { q: "DFS uses which mechanism?", opts: ["Queue", "Recursion/Stack", "Iterative choice", "None"], ans: 1 },
      { q: "Traversal that visits all neighbors before moving deeper?", opts: ["DFS", "BFS", "Topological", "Dijkstra"], ans: 1 },
      { q: "Adjacency Matrix entry [i][j] is 1 if:", opts: ["i=j", "Edge exists between V_i and V_j", "V_i is root", "None"], ans: 1 },
      { q: "Connected graph means:", opts: ["All vertices have degree > 0", "Path exists between any two vertices", "No cycles", "Full matrix"], ans: 1 },
      { q: "Degree of a vertex in undirected graph:", opts: ["Edges incident to it", "Edges outgoing", "Total vertices", "Self loops"], ans: 0 },
      { q: "Graph Representations:", opts: [{t: "Adjacency Matrix", c: true}, {t: "Adjacency List", c: true}, {t: "Incidence Matrix", c: true}, {t: "Stack", c: false}], isMulti: true, marks: 10 },
      { q: "Identify Graph types:", opts: [{t: "Directed", c: true}, {t: "Acyclic (DAG)", c: true}, {t: "Weighted", c: true}, {t: "Bipartite", c: true}], isMulti: true, marks: 10 },
      { q: "BFS Properties:", opts: [{t: "Queue based", c: true}, {t: "Finds shortest path in unweighted G", c: true}, {t: "Level-order", c: true}], isMulti: true, marks: 10 },
      { q: "DFS Properties:", opts: [{t: "Stack based", c: true}, {t: "Uses recursion", c: true}, {t: "Finds cycles", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nvisited[s] = true; \nq.push(s); \nwhile(!q.empty()) { ... } \nWhich traversal?", opts: [{t: "BFS", c: true}, {t: "DFS", c: false}, {t: "Pre-order", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DSA Lec 12: Graphs Algorithms II (Spanning Trees & Shortest Path)",
    description: "Kruskal's, Prim's, and Dijkstra's algorithms.",
    questions: [
      { q: "A Minimum Spanning Tree (MST) connects all vertices with:", opts: ["Max weight", "Min total edge weight", "No edges", "Cycles"], ans: 1 },
      { q: "Kruskal's algorithm uses which strategy?", opts: ["Divide & Conquer", "Greedy", "Dynamic Programming", "Backtracking"], ans: 1 },
      { q: "Prim's algorithm starts from:", opts: ["Smallest edge in graph", "A starting vertex", "Largest weight", "Random edge"], ans: 1 },
      { q: "Complexity of Kruskal's using Union-Find?", opts: ["O(V²)", "O(E log E)", "O(E+V)", "O(log V)"], ans: 1 },
      { q: "Dijkstra's algorithm finds:", opts: ["MST", "Shortest path from single source", "All-pairs shortest path", "DFS tree"], ans: 1 },
      { q: "Can Dijkstra's handle negative edge weights?", opts: ["Yes", "No", "Only if cycles exist", "Always"], ans: 1 },
      { q: "Number of edges in MST for V vertices?", opts: ["V", "V-1", "V+1", "E/2"], ans: 1 },
      { q: "Kruskal's sorts edges by:", opts: ["Vertex name", "Weight", "Length", "Creation time"], ans: 1 },
      { q: "Prim's algorithm is efficient for:", opts: ["Sparse graphs", "Dense graphs", "Directed graphs only", "Binary trees"], ans: 1 },
      { q: "Bellman-Ford is used when:", opts: ["Weights are positive", "Weights can be negative", "Graph is tree", "No cycles"], ans: 1 },
      { q: "Greedy Graph Algorithms:", opts: [{t: "Kruskal's", c: true}, {t: "Prim's", c: true}, {t: "Dijkstra's", c: true}, {t: "Floyd-Warshall", c: false}], isMulti: true, marks: 10 },
      { q: "Prim vs Kruskal:", opts: [{t: "Prim is vertex-based", c: true}, {t: "Kruskal is edge-based", c: true}, {t: "Both find MST", c: true}], isMulti: true, marks: 10 },
      { q: "Identify MST Properties:", opts: [{t: "Connects all nodes", c: true}, {t: "No cycles", c: true}, {t: "Min total weight", c: true}], isMulti: true, marks: 10 },
      { q: "Shortest Path Algorithms:", opts: [{t: "Dijkstra", c: true}, {t: "Bellman-Ford", c: true}, {t: "BFS (unweighted)", c: true}], isMulti: true, marks: 10 },
      { q: "CODE ANALYSIS: \nfor each edge (u, v) in sorted_edges: \n  if (find(u) != find(v)) { \n    union(u, v); \n    mst.push(edge); \n  } \nWhich algorithm?", opts: [{t: "Kruskal's", c: true}, {t: "Prim's", c: false}, {t: "Dijkstra", c: false}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of dsaLectureQuizzes) {
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
        course: "IT1170 - Data Structures & Algorithms",
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
      console.log(`Successfully created DSA quiz: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 12 DSA lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
