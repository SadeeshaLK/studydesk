const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const questions = [
  // --- SINGLE SELECT (2 Marks each) ---
  {
    q: "Which layer of the OSI model is responsible for logical addressing and packet routing across the internet?",
    opts: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"], ans: 2
  },
  {
    q: "The 'Three-way Handshake' is a mechanism utilized by which protocol to establish a reliable connection?",
    opts: ["UDP", "IP", "TCP", "HTTP"], ans: 2
  },
  {
    q: "What is the primary function of the ARP (Address Resolution Protocol)?",
    opts: ["Resolving IP to Domain name", "Resolving MAC to IP address", "Resolving IP to MAC address", "Assigning DHCP leases"], ans: 2
  },
  {
    q: "Which device operates at Layer 2 and uses a MAC address table to forward frames?",
    opts: ["Hub", "Repeater", "Switch", "Router"], ans: 2
  },
  {
    q: "In an IPv4 address, how many bits are used in total?",
    opts: ["32 bits", "48 bits", "64 bits", "128 bits"], ans: 0
  },
  {
    q: "Which protocol is considered 'connectionless' and 'unreliable'?",
    opts: ["TCP", "UDP", "FTP", "SSH"], ans: 1
  },
  {
    q: "What is the default port for HTPS?",
    opts: ["21", "25", "80", "443"], ans: 3
  },
  {
    q: "Which modulation technique represents binary data with two different frequencies?",
    opts: ["ASK", "FSK", "PSK", "QAM"], ans: 1
  },
  {
    q: "What is the maximum throughput of a standard Category 5e (Cat5e) Ethernet cable?",
    opts: ["10 Mbps", "100 Mbps", "1000 Mbps", "10 Gbps"], ans: 2
  },
  {
    q: "In the OSI model, which layer deals with encryption and data compression?",
    opts: ["Application", "Presentation", "Session", "Transport"], ans: 1
  },
  {
    q: "What is the subnet mask for a /24 network?",
    opts: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"], ans: 2
  },
  {
    q: "Which algorithm is used in CSMA/CD to determine the wait time after a collision occurs?",
    opts: ["Dijkstra's", "Bellman-Ford", "Exponential Backoff", "Sliding Window"], ans: 2
  },
  {
    q: "Which type of NAT allows multiple internal devices to share a single public IP address using different ports?",
    opts: ["Static NAT", "Dynamic NAT", "PAT (Overloading)", "Address Pooling"], ans: 2
  },
  {
    q: "What is the range of 'Well Known Ports' designated by IANA?",
    opts: ["0-1023", "1024-49151", "49152-65535", "1-65535"], ans: 0
  },
  {
    q: "Which ICMP message is sent by a host to check if a destination is reachable?",
    opts: ["Source Quench", "Time Exceeded", "Echo Request", "Redirect"], ans: 2
  },
  {
    q: "Which error-checking method uses a generator polynomial 1101 to calculate a checksum?",
    opts: ["Parity Check", "Checksum", "CRC", "Hamming Code"], ans: 2
  },
  {
    q: "In a BGP routing protocol, what determines the best path to a destination?",
    opts: ["Hop count", "Bandwidth", "Metric", "AS Path length"], ans: 3
  },
  {
    q: "Which layer of the TCP/IP model corresponds to the top three layers of the OSI model?",
    opts: ["Network Interface", "Internet", "Transport", "Application"], ans: 3
  },
  {
    q: "What is the size of a MAC address?",
    opts: ["2 bytes", "4 bytes", "6 bytes", "8 bytes"], ans: 2
  },
  {
    q: "Which protocol allows a diskless workstation to discover its IP address from a central server?",
    opts: ["DNS", "DHCP", "ICMP", "SNMP"], ans: 1
  },
  {
    q: "In asymmetrical DSL (ADSL), which direction is typically faster?",
    opts: ["Upstream", "Downstream", "Both are equal", "Depends on weather"], ans: 1
  },
  {
    q: "Which field in the IPv4 header prevents packets from looping indefinitely?",
    opts: ["Header Checksum", "TTL", "Protocol", "Version"], ans: 1
  },
  {
    q: "Which IPv6 address type is equivalent to the 'private' addresses in IPv4?",
    opts: ["Global Unicast", "Link-Local", "Unique Local", "Multicast"], ans: 2
  },
  {
    q: "What is the binary representation of the decimal number 192?",
    opts: ["11000000", "10101000", "11111111", "11001100"], ans: 0
  },
  {
    q: "Which fiber optic type is better suited for long-distance transmissions due to minimal signal dispersion?",
    opts: ["Multimode", "Single-mode", "Graded-index", "Copper-core"], ans: 1
  },
  {
    q: "Which wireless standard operates specifically in the 5GHz frequency band with higher speeds than 802.11n?",
    opts: ["802.11a", "802.11b", "802.11g", "802.11ac"], ans: 3
  },
  {
    q: "What is the purpose of a 'Default Gateway'?",
    opts: ["Connect to local hosts", "Connect to external networks", "Assign IP addresses", "Filter traffic"], ans: 1
  },
  {
    q: "Which command would you use on Windows to view the physical address of your network card?",
    opts: ["ping", "nslookup", "ipconfig /all", "netstat"], ans: 2
  },
  {
    q: "In a Sliding Window protocol, if the window size is 7, how many packets can be sent before an acknowledgment is required?",
    opts: ["1", "6", "7", "8"], ans: 2
  },
  {
    q: "What does DNS stand for?",
    opts: ["Digital Network System", "Domain Name System", "Dynamic Name Service", "Data Node Storage"], ans: 1
  },

  // --- MULTI-SELECT (4 Marks each) ---
  {
    q: "Which of the following are Dynamic Routing Protocols? (Select all that apply)",
    opts: [
      { text: "OSPF", isCorrect: true },
      { text: "RIP", isCorrect: true },
      { text: "BGP", isCorrect: true },
      { text: "DHCP", isCorrect: false },
      { text: "EIGRP", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Identify the layers of the TCP/IP model:",
    opts: [
      { text: "Application", isCorrect: true },
      { text: "Presentation", isCorrect: false },
      { text: "Transport", isCorrect: true },
      { text: "Internet", isCorrect: true },
      { text: "Network Access", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Regarding IPv6, which statements are correct?",
    opts: [
      { text: "Addresses are 128 bits long.", isCorrect: true },
      { text: "Uses hexadecimal notation.", isCorrect: true },
      { text: "Relies on ARP for resolution.", isCorrect: false },
      { text: "Uses Neighbor Discovery Protocol (NDP).", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which of the following are components of a standard IP packet?",
    opts: [
      { text: "Source IP Address", isCorrect: true },
      { text: "Destination IP Address", isCorrect: true },
      { text: "MAC Address", isCorrect: false },
      { text: "Checksum", isCorrect: true },
      { text: "TTL", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "What are valid reasons for implementing Subnetting?",
    opts: [
      { text: "Reduce network traffic congestion.", isCorrect: true },
      { text: "Increase network security.", isCorrect: true },
      { text: "Conserve IP addresses.", isCorrect: true },
      { text: "Speed up physical cable transmission.", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which of the following are application layer protocols?",
    opts: [
      { text: "HTTP", isCorrect: true },
      { text: "SMTP", isCorrect: true },
      { text: "ICMP", isCorrect: false },
      { text: "DNS", isCorrect: true },
      { text: "RIP", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Identify the standard field types in a MAC frame header:",
    opts: [
      { text: "Preamble", isCorrect: true },
      { text: "Destination Address", isCorrect: true },
      { text: "IP Version", isCorrect: false },
      { text: "Payload", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Which of these are Guided Transmission Media?",
    opts: [
      { text: "Twisted Pair", isCorrect: true },
      { text: "Fiber Optics", isCorrect: true },
      { text: "Coaxial Cable", isCorrect: true },
      { text: "Microwaves", isCorrect: false }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Common network topologies include:",
    opts: [
      { text: "Star", isCorrect: true },
      { text: "Mesh", isCorrect: true },
      { text: "Orbital", isCorrect: false },
      { text: "Bus", isCorrect: true }
    ],
    marks: 4, isMulti: true
  },
  {
    q: "Functions of a Network Interface Card (NIC) include:",
    opts: [
      { text: "Formatting frames.", isCorrect: true },
      { text: "Resolving DNS names.", isCorrect: false },
      { text: "Implementing the Physical Layer.", isCorrect: true },
      { text: "Generating electrical signals.", isCorrect: true }
    ],
    marks: 4, isMulti: true
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    await Quiz.deleteMany({ title: 'Data Communication and Networks - DCN' });

    const dbQuestions = questions.map(q => ({
        questionText: q.q,
        questionType: 'mcq',
        isMultiSelect: q.isMulti || false,
        marks: q.marks || 2,
        options: q.opts.map((opt, idx) => (
            typeof opt === 'string' 
            ? { text: opt, isCorrect: idx === q.ans }
            : { text: opt.text, isCorrect: opt.isCorrect }
        ))
    }));

    const totalMarks = dbQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await Quiz.create({
      title: 'Data Communication and Networks - DCN',
      description: 'A deep assessment of network layers, protocol architectures (OSI/TCP-IP), packet switching, address resolution, and security protocols.',
      course: 'IT2030 - DCN',
      lecturer: lecturer._id,
      duration: 120,
      passingPercentage: 55,
      pricingType: 'free',
      maxAttempts: 2,
      shuffleQuestions: true,
      category: 'final_exam',
      isPublished: true,
      totalMarks: totalMarks,
      questions: dbQuestions,
    });
    
    console.log(`Successfully created quiz: ${quiz.title} with ${dbQuestions.length} questions!`);
    console.log(`Verified Total Marks: ${totalMarks}/100`);
    process.exit(0);
  } catch (err) {
    if (err.errors) { console.error(JSON.stringify(err.errors, null, 2)); }
    else { console.error(err.message || err); }
    process.exit(1);
  }
};

run();
