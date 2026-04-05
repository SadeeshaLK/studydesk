const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const singleSelects = [
  { q: "Which SQL clause is strictly used to filter records after an aggregation has taken place?", opts: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], ans: 1 },
  { q: "What is the primary constraint that uniquely identifies each record in a database table?", opts: ["Foreign Key", "Unique Key", "Primary Key", "Candidate Key"], ans: 2 },
  { q: "Which property in the ACID transaction model guarantees that once a transaction is committed, it remains in the system even in the event of a system failure?", opts: ["Atomicity", "Consistency", "Isolation", "Durability"], ans: 3 },
  { q: "In an Entity-Relationship (ER) diagram, how is a weak entity visually represented?", opts: ["Single rectangle", "Double rectangle", "Dashed oval", "Diamond"], ans: 1 },
  { q: "If a database table is in 2nd Normal Form (2NF), what MUST be true about it?", opts: ["It has no multi-valued attributes.", "It has no partial dependencies.", "It has no transitive dependencies.", "It is already in BCNF."], ans: 1 },
  { q: "Which type of SQL command is `GRANT`?", opts: ["Data Manipulation Language (DML)", "Data Definition Language (DDL)", "Transaction Control Language (TCL)", "Data Control Language (DCL)"], ans: 3 },
  { q: "What does the `TRUNCATE` table command do?", opts: ["Deletes the entire table structure from the database.", "Deletes all rows without logging individual row deletions.", "Deletes specific rows based on a WHERE clause.", "Rolls back the last deleted record."], ans: 1 },
  { q: "If table A has a column linking to the Primary Key of table B, what is that column strictly called in table A?", opts: ["Foreign Key", "Composite Key", "Surrogate Key", "Alternate Key"], ans: 0 },
  { q: "Which SQL aggregate function evaluates the total number of non-null rows in a column?", opts: ["SUM()", "MAX()", "COUNT()", "AVG()"], ans: 2 },
  { q: "Review the following SQL snippet:\n```sql\nSELECT employee_name FROM employees WHERE salary BETWEEN 50000 AND 80000;\n```\nIs the range inclusive or exclusive?", opts: ["Strictly Exclusive", "Inclusive of 50000, exclusive of 80000", "Inclusive of both 50000 and 80000", "Exclusive of 50000, inclusive of 80000"], ans: 2 },
  { q: "When designing a relational schema, what relationship cardinality typically requires a junction/associative table?", opts: ["One-to-One", "One-to-Many", "Many-to-Many", "Self-Referencing Unary"], ans: 2 },
  { q: "What is the purpose of an Index in a database system?", opts: ["To enforce foreign key constraints.", "To automatically backup database tables.", "To greatly speed up the retrieval of rows.", "To prevent duplicate row insertions."], ans: 2 },
  { q: "What does an INNER JOIN perform?", opts: ["Returns all records from the left table, and matched records from the right.", "Returns only the records that have matching values in both tables.", "Returns all records when there is a match in either left or right table.", "Creates a Cartesian product of both tables."], ans: 1 },
  { q: "Which level of normalization specifically addresses the removal of transitive dependencies?", opts: ["1NF", "2NF", "3NF", "Boyce-Codd Normal Form (BCNF)"], ans: 2 },
  { q: "A `CHECK` constraint is primarily utilized to:", opts: ["Ensure uniqueness of a column row.", "Limit the value range or string formatting that can be placed in a column.", "Link a column to an external table's primary key.", "Auto-increment an integer field."], ans: 1 },
  { q: "In transaction concurrency, what is a 'Dirty Read'?", opts: ["Reading data that has been logically deleted by a trigger.", "Reading data from a heavily fragmented disk sector.", "Reading uncommitted data written by an active, concurrent transaction.", "Reading corrupted blob data."], ans: 2 },
  { q: "What does a `LEFT OUTER JOIN` guarantee?", opts: ["It guarantees all rows from the right table are returned.", "It guarantees all rows from the left table are returned, even if there's no match.", "It guarantees no null values will exist in the result set.", "It guarantees a Cartesian product."], ans: 1 },
  { q: "Which constraint completely disallows `NULL` values implicitly without needing a `NOT NULL` declaration?", opts: ["UNIQUE constraint", "CHECK constraint", "PRIMARY KEY constraint", "FOREIGN KEY constraint"], ans: 2 },
  { q: "What SQL command reverses a transaction that has not yet been committed?", opts: ["UNDO", "REVERT", "ROLLBACK", "TRUNCATE"], ans: 2 },
  { q: "Data Independence in DBMS architecture refers to:", opts: ["The ability to copy data seamlessly between different vendor databases.", "The capacity to change the schema at one level without changing the schema at the next higher level.", "The isolation of transactions from one another.", "The separation of client software from server hardware."], ans: 1 },
  { q: "Which statement properly adds a new column to an existing SQL table?", opts: ["ALTER TABLE employees ADD column_name datatype;", "MODIFY TABLE employees ADD column_name datatype;", "UPDATE employees SET column_name = datatype;", "INSERT INTO employees (column_name) VALUES (datatype);"], ans: 0 },
  { q: "Which normal form requires that every non-trivial determinant is a candidate key?", opts: ["1NF", "2NF", "3NF", "BCNF"], ans: 3 },
  { q: "What will `SELECT * FROM table_name WHERE column_name LIKE '_a%';` return?", opts: ["Values starting with 'a'.", "Values where the second letter is 'a'.", "Values containing 'a' anywhere.", "Values ending with 'a'."], ans: 1 },
  { q: "Which of the following is an example of an essentially 'schema-less' Database?", opts: ["PostgreSQL", "MySQL", "Oracle", "MongoDB"], ans: 3 },
  { q: "In the context of locking mechanisms, what does an 'Exclusive Lock' (X) indicate?", opts: ["Other transactions can read but not write.", "Other transactions can neither read nor write.", "Other transactions can both read and write.", "The row is permanently locked and archived."], ans: 1 },
  { q: "Review the snippet:\n```sql\nINSERT INTO Students (ID, Name) VALUES (1, 'John');\n```\nWhat happens to the remaining unspecified columns in the Students table?", opts: ["They cause an immediate syntax error.", "They are populated with random garbage data.", "They are populated with default values or NULL if no default exists.", "They are ignored entirely."], ans: 2 },
  { q: "A view in SQL is best described as:", opts: ["A physical backup copy of a table.", "A virtual table based on the result-set of an SQL statement.", "A clustered index structure pointing to files.", "An automated sequence generator."], ans: 1 },
  { q: "When modeling ER diagrams, a solid diamond represents:", opts: ["An Entity", "An Attribute", "A Relationship", "A Primary Key"], ans: 2 },
  { q: "What does the `DISTINCT` keyword do in a SQL `SELECT` statement?", opts: ["Sorts the output alphabetically.", "Removes duplicate rows from the final result set.", "Checks for referential integrity.", "Disables all indexes for the query."], ans: 1 },
  { q: "What does a database Trigger do?", opts: ["It acts as a manual push-button script.", "It is a stored procedure automatically executed in response to specific system events (like INSERT, UPDATE).", "It triggers the backup server to clone data.", "It automatically corrects syntactically incorrect SQL queries."], ans: 1 }
];

const multiSelects = [
  {
    q: "Which of the following are valid Data Definition Language (DDL) commands in standard SQL?",
    opts: [
      { text: "CREATE", isCorrect: true },
      { text: "DROP", isCorrect: true },
      { text: "UPDATE", isCorrect: false },
      { text: "ALTER", isCorrect: true },
      { text: "DELETE", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Review the following SQL snippet:\n```sql\nBEGIN TRANSACTION;\nUPDATE Accounts SET Balance = Balance - 100 WHERE ID = 1;\nUPDATE Accounts SET Balance = Balance + 100 WHERE ID = 2;\nCOMMIT;\n```\nWhich of the following properties of the ACID paradigm does this transaction explicitly demonstrate the goal of achieving?",
    opts: [
      { text: "Atomicity (All or Nothing completion)", isCorrect: true },
      { text: "Consistency (Maintaining valid account balances)", isCorrect: true },
      { text: "Data Independence", isCorrect: false },
      { text: "Durability (Assuming the disk flushes the commit)", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which of the following are properties strictly required for a table to be considered in First Normal Form (1NF)?",
    opts: [
      { text: "All rows must be completely unique.", isCorrect: true },
      { text: "Each column must hold atomic (indivisible) values.", isCorrect: true },
      { text: "There must be no transitive functional dependencies.", isCorrect: false },
      { text: "Each column must have a unique domain/name strictly within that table.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "When comparing the `DELETE` and `TRUNCATE` statements, which functional differences are accurate?",
    opts: [
      { text: "DELETE is a DML statement, whereas TRUNCATE is a DDL statement.", isCorrect: true },
      { text: "TRUNCATE operates significantly faster on large tables.", isCorrect: true },
      { text: "DELETE can be used cleanly with a WHERE clause; TRUNCATE cannot.", isCorrect: true },
      { text: "TRUNCATE triggers standard DELETE triggers natively per row.", isCorrect: false },
      { text: "DELETE is irreversible even before a commit.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Which structural components are inherently considered when establishing an Entity-Relationship (ER) model?",
    opts: [
      { text: "Entities (Strong or Weak)", isCorrect: true },
      { text: "Attributes (Derived, Multi-valued)", isCorrect: true },
      { text: "Stored Procedures", isCorrect: false },
      { text: "Relationships and Cardinality constraints", isCorrect: true },
      { text: "Table Spaces and Disk Quotas", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Observe the following conceptual `HAVING` statement:\n```sql\nSELECT Department, SUM(Salary) \nFROM Employees \nGROUP BY Department \nHAVING SUM(Salary) > 100000;\n```\nWhich statements are accurate interpretations?",
    opts: [
      { text: "The `HAVING` clause filters the rows BEFORE the `GROUP BY` groups them.", isCorrect: false },
      { text: "The `HAVING` clause acts as a filter on the aggregated grouped records.", isCorrect: true },
      { text: "Only Departments whose combined total cumulative salaries exceed 100,000 will be displayed in the result set.", isCorrect: true },
      { text: "The `WHERE` clause could be swapped perfectly in this query to replace `HAVING`.", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "In a relational schema, what restrictions apply dynamically to Primary Keys?",
    opts: [
      { text: "They must contain strictly unique values across the scope of the table.", isCorrect: true },
      { text: "They can contain multiple NULL values as long as they are distinct rows.", isCorrect: false },
      { text: "They cannot contain any subset of NULL values.", isCorrect: true },
      { text: "A table can theoretically have a composite primary key consisting of multiple columns.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which scenarios describe potential Concurrency problems in DBMS transaction systems?",
    opts: [
      { text: "Lost Updates", isCorrect: true },
      { text: "Uncommitted Dependency (Dirty Read)", isCorrect: true },
      { text: "Inconsistent Analysis (Phantom Read)", isCorrect: true },
      { text: "Boyce-Codd Normalization Failures", isCorrect: false },
      { text: "Data Domain Corruption via Foreign Keys", isCorrect: false }
    ],
    marks: 4
  },
  {
    q: "Regarding database indexing architectures (e.g. B-Trees), which statements are valid constraints?",
    opts: [
      { text: "Indexes dramatically speed up read operations (SELECTs).", isCorrect: true },
      { text: "Indexes generally slow down write operations (INSERTs, UPDATEs).", isCorrect: true },
      { text: "Creating an index decreases the hard storage volume required for the database.", isCorrect: false },
      { text: "A table can typically only have one Clustered Index.", isCorrect: true }
    ],
    marks: 4
  },
  {
    q: "Which attributes heavily differ when executing a `UNION` clause versus a `UNION ALL` clause?",
    opts: [
      { text: "`UNION` systematically removes duplicate rows from the final combined result set.", isCorrect: true },
      { text: "`UNION ALL` is significantly faster algorithmically because it does not attempt to search for or remove duplicates.", isCorrect: true },
      { text: "`UNION` allows combining tables with completely different column data types.", isCorrect: false },
      { text: "Only `UNION ALL` can handle subqueries.", isCorrect: false }
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

    // Wipe previous 'DDD' instances
    await Quiz.deleteMany({ title: "Database Design and Development - DDD" });

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
      title: "Database Design and Development - DDD",
      description: "An intensive 100-mark Database Design module probing sophisticated SQL commands, ACID models, strict Normalization boundaries, and ER Mapping.",
      course: "IT2140 - DDD",
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
