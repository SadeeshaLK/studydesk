const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const dcnLectureQuizzes = [
  {
    title: "DCN Lec 01: Introduction to Data Communication",
    description: "Fundamentals of data communication, components, and transmission modes.",
    questions: [
      { q: "What are the five components of data communication?", opts: ["Message, Sender, Receiver, Medium, Protocol", "Computer, Data, Person, Cable, Software", "Source, Path, Dest, Bits, Waves", "None of above"], ans: 0 },
      { q: "Which transmission mode allows simultaneous bidirectional communication?", opts: ["Simplex", "Half-Duplex", "Full-Duplex", "Reverse-Mode"], ans: 2 },
      { q: "What type of connection is a point-to-point link?", opts: ["Mesh", "Dedicated", "Multipoint", "Bus"], ans: 1 },
      { q: "Define 'Throughput' in network performance.", opts: ["Data rate actually achieved", "Maximum possible speed", "Signal propagation time", "Error rate"], ans: 0 },
      { q: "In a STAR topology, devices connect to a central:", opts: ["Router", "Bridge", "Hub/Switch", "Repeater"], ans: 2 },
      { q: "Which topology requires a terminator at each end?", opts: ["Star", "Bus", "Ring", "Mesh"], ans: 1 },
      { q: "Physical or logical arrangement of network is called:", opts: ["Protocol", "Topology", "Architecture", "Pathway"], ans: 1 },
      { q: "In simplex mode, communication is:", opts: ["Bidirectional", "Unidirectional", "Multidirectional", "Simultaneous"], ans: 1 },
      { q: "A keyboard to computer connection is typically:", opts: ["Full-duplex", "Simplex", "Half-duplex", "Multipoint"], ans: 1 },
      { q: "WAN stands for:", opts: ["World Area Net", "Wide Area Network", "Wireless Area Net", "Wait Always Net"], ans: 1 },
      { q: "Which are types of network topolgies?", opts: [{t: "Star", c: true}, {t: "Mesh", c: true}, {t: "Tree", c: true}, {t: "Chain", c: false}], isMulti: true, marks: 10 },
      { q: "Select performance criteria for networks:", opts: [{t: "Throughput", c: true}, {t: "Delay", c: true}, {t: "Security", c: true}, {t: "Cost", c: false}], isMulti: true, marks: 10 },
      { q: "Which are data flow modes?", opts: [{t: "Simplex", c: true}, {t: "Duplex", c: true}, {t: "Triplex", c: false}, {t: "Half-duplex", c: true}], isMulti: true, marks: 10 },
      { q: "Standard organizations for networks include:", opts: [{t: "ISO", c: true}, {t: "IEEE", c: true}, {t: "ITU-T", c: true}, {t: "NBA", c: false}], isMulti: true, marks: 10 },
      { q: "Transmission media types include:", opts: [{t: "Guided", c: true}, {t: "Unguided", c: true}, {t: "Mental", c: false}, {t: "Visual", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 02: Protocol Architecture (OSI & TCP/IP)",
    description: "Layered architectures, OSI 7-layer model, and TCP/IP protocol suite mapping.",
    questions: [
      { q: "Which OSI layer is responsible for process-to-process delivery?", opts: ["Network", "Data Link", "Transport", "Session"], ans: 2 },
      { q: "Encryption and Decryption are functions of which layer?", opts: ["Application", "Presentation", "Session", "Transport"], ans: 1 },
      { q: "Which layer handles electrical and mechanical specifications?", opts: ["Data Link", "Link", "Physical", "Network"], ans: 2 },
      { q: "IP Protocol resides in which TCP/IP layer?", opts: ["Process", "Host-to-host", "Internet", "Network Access"], ans: 2 },
      { q: "How many layers are in the OSI model?", opts: ["4", "5", "7", "8"], ans: 2 },
      { q: "Datalink layer data units are called:", opts: ["Packets", "Segments", "Frames", "Datagrams"], ans: 2 },
      { q: "The application layer in TCP/IP combines which OSI layers?", opts: ["Top 3", "Top 2", "Bottom 3", "All 7"], ans: 0 },
      { q: "Router works at which OSI layer?", opts: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], ans: 2 },
      { q: "Switch works at which OSI layer?", opts: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], ans: 1 },
      { q: "Dialogue control is a function of:", opts: ["Presentation", "Session", "Application", "Transport"], ans: 1 },
      { q: "Which are layers of the TCP/IP model?", opts: [{t: "Application", c: true}, {t: "Transport", c: true}, {t: "Internet", c: true}, {t: "Network Access", c: true}], isMulti: true, marks: 10 },
      { q: "Identify Layer 2 (Data Link) functions:", opts: [{t: "Framing", c: true}, {t: "Error Control", c: true}, {t: "Flow Control", c: true}, {t: "Routing", c: false}], isMulti: true, marks: 10 },
      { q: "Select Upper Layer protocols:", opts: [{t: "HTTP", c: true}, {t: "SMTP", c: true}, {t: "FTP", c: true}, {t: "IP", c: false}], isMulti: true, marks: 10 },
      { q: "Network Layer concerns include:", opts: [{t: "Logical Addressing", c: true}, {t: "Routing", c: true}, {t: "Physical cabling", c: false}], isMulti: true, marks: 10 },
      { q: "Encapsulation happens at which layers?", opts: [{t: "Transport", c: true}, {t: "Network", c: true}, {t: "Data Link", c: true}, {t: "Physical", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 03: Physical Layer and Signaling",
    description: "Analog vs Digital signals, impairments, and bandwidth characteristics.",
    questions: [
      { q: "Unit of frequency is:", opts: ["Watt", "Hertz", "Volt", "Ampere"], ans: 1 },
      { q: "Signal attenuation means:", opts: ["Loss of energy", "Increase in speed", "Change in frequency", "Phase shift"], ans: 0 },
      { q: "Baud rate is defined as:", opts: ["Bits per second", "Signal elements per second", "Bytes per second", "Clock speed"], ans: 1 },
      { q: "Which impairment is caused by signal frequency components traveling at different speeds?", opts: ["Attenuation", "Distortion", "Noise", "Crosstalk"], ans: 1 },
      { q: "Thermal noise is also known as:", opts: ["Crosstalk", "White noise", "Impulse noise", "Induced noise"], ans: 1 },
      { q: "Signal-to-Noise Ratio (SNR) is measured in:", opts: ["Hz", "dB", "Watts", "ms"], ans: 1 },
      { q: "Shannon Capacity formula relates bandwidth and:", opts: ["Latency", "SNR", "Power", "Error"], ans: 1 },
      { q: "A sine wave is defined by: Amplitude, Frequency and...", opts: ["Velocity", "Phase", "Length", "Width"], ans: 1 },
      { q: "Bit rate is the number of:", opts: ["Signals per second", "Bits per second", "Frames per second", "Pulse per second"], ans: 1 },
      { q: "Composite signal consists of:", opts: ["One frequency", "Multiple sine waves", "Zero waves", "Digital pulses"], ans: 1 },
      { q: "Identify transmission impairments:", opts: [{t: "Attenuation", c: true}, {t: "Distortion", c: true}, {t: "Noise", c: true}, {t: "Modulation", c: false}], isMulti: true, marks: 10 },
      { q: "Types of noise include:", opts: [{t: "Thermal", c: true}, {t: "Induced", c: true}, {t: "Crosstalk", c: true}, {t: "Impulse", c: true}], isMulti: true, marks: 10 },
      { q: "Nyquist Bit Rate depends on:", opts: [{t: "Bandwidth", c: true}, {t: "Signal levels", c: true}, {t: "SNR", c: false}, {t: "Noise", c: false}], isMulti: true, marks: 10 },
      { q: "Analog signals can be described by:", opts: [{t: "Period", c: true}, {t: "Phase", c: true}, {t: "Amplitude", c: true}, {t: "Binary", c: false}], isMulti: true, marks: 10 },
      { q: "Data rate limits are defined by:", opts: [{t: "Nyquist Theorem", c: true}, {t: "Shannon Theorem", c: true}, {t: "Pythagoras Theorem", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 04: Data Link Layer & LANs",
    description: "Flow control, error detection, Ethernet standards and switching.",
    questions: [
      { q: "Which error detection method uses a generator polynomial?", opts: ["Checksum", "Parity", "CRC", "LRC"], ans: 2 },
      { q: "What is framing?", opts: ["Encapsulating IP packets", "Dividing stream into frames", "Adding MAC address", "All of above"], ans: 3 },
      { q: "Standard Ethernet speed is:", opts: ["10 Mbps", "100 Mbps", "1 Gbps", "10 Gbps"], ans: 0 },
      { q: "MAC address length is:", opts: ["32 bits", "48 bits", "64 bits", "128 bits"], ans: 1 },
      { q: "Flow control technique where sender waits for ACK:", opts: ["Stop-and-wait", "Sliding window", "ALOHA", "CSMA"], ans: 0 },
      { q: "Access method for Ethernet (802.3):", opts: ["CSMA/CA", "CSMA/CD", "Polling", "Token passing"], ans: 1 },
      { q: "Switch learns MAC addresses from:", opts: ["Source address in frames", "Destination address", "DNS", "DHCP"], ans: 0 },
      { q: "VLAN is used for:", opts: ["Increasing speed", "Logical segmentation", "Physical cabling", "Encryption"], ans: 1 },
      { q: "Minimum Ethernet frame size:", opts: ["32 bytes", "64 bytes", "128 bytes", "1518 bytes"], ans: 1 },
      { q: "Which bit in MAC address indicates Global/Local?", opts: ["1st", "2nd", "7th", "8th"], ans: 1 },
      { q: "Data Link sublayers include:", opts: [{t: "LLC", c: true}, {t: "MAC", c: true}, {t: "TCP", c: false}, {t: "IP", c: false}], isMulti: true, marks: 10 },
      { q: "Flow control methods include:", opts: [{t: "Stop-and-Wait", c: true}, {t: "Sliding Window", c: true}, {t: "Back pressure", c: false}], isMulti: true, marks: 10 },
      { q: "Identify error detection codes:", opts: [{t: "Parity", c: true}, {t: "CRC", c: true}, {t: "Checksum", c: true}, {t: "Encrypt", c: false}], isMulti: true, marks: 10 },
      { q: "Ethernet Frame fields include:", opts: [{t: "Preamble", c: true}, {t: "Dest MAC", c: true}, {t: "Source MAC", c: true}, {t: "FCS", c: true}], isMulti: true, marks: 10 },
      { q: "Media Access Control types:", opts: [{t: "Random Access", c: true}, {t: "Controlled Access", c: true}, {t: "Channelization", c: true}, {t: "Direct Access", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 05: Network Layer - Routing & Addressing",
    description: "IP addressing (v4/v6), subnetting, and basic routing concepts.",
    questions: [
      { q: "Network layer primary unit:", opts: ["Frame", "Segment", "Packet", "Bit"], ans: 2 },
      { q: "Private IP range for Class C?", opts: ["10.0.0.0", "172.16.0.0", "192.168.0.0", "127.0.0.0"], ans: 2 },
      { q: "Slash notation /24 corresponds to mask:", opts: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"], ans: 2 },
      { q: "NAT stands for:", opts: ["Net Address Trans", "Net Access Time", "Node Address Tool", "None of above"], ans: 0 },
      { q: "How many bits in IPv6?", opts: ["32", "64", "128", "256"], ans: 2 },
      { q: "Default gateway address is usually:", opts: ["1st usable IP", "Last usable IP", "Random IP", "Broadcast IP"], ans: 0 },
      { q: "Loopback address is:", opts: ["127.0.0.1", "0.0.0.0", "255.255.255.255", "192.168.1.1"], ans: 0 },
      { q: "Routing protocol for Internet (Inter-AS):", opts: ["OSPF", "RIP", "BGP", "EIGRP"], ans: 2 },
      { q: "ARP is used to find:", opts: ["IP from MAC", "MAC from IP", "Port from IP", "Host from Name"], ans: 1 },
      { q: "DHCP provides:", opts: ["IP address", "Subnet mask", "Gateway", "All of above"], ans: 3 },
      { q: "Identify Classes of IPv4:", opts: [{t: "Class A", c: true}, {t: "Class B", c: true}, {t: "Class F", c: false}, {t: "Class E", c: true}], isMulti: true, marks: 10 },
      { q: "IPv6 Header improvements:", opts: [{t: "Fixed length", c: true}, {t: "No checksum", c: true}, {t: "Flow labeling", c: true}, {t: "Larger size", c: true}], isMulti: true, marks: 10 },
      { q: "Dynamic routing protocols include:", opts: [{t: "RIP", c: true}, {t: "OSPF", c: true}, {t: "Static", c: false}, {t: "EIGRP", c: true}], isMulti: true, marks: 10 },
      { q: "Components of a router:", opts: [{t: "Input ports", c: true}, {t: "Switching fabric", c: true}, {t: "Output ports", c: true}, {t: "Monitor", c: false}], isMulti: true, marks: 10 },
      { q: "Subnetting benefits:", opts: [{t: "Reduced traffic", c: true}, {t: "Security", c: true}, {t: "Conservation", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 06: Advanced Network Layer Protocols",
    description: "ICMP, IPv6 transition, and complex subnetting scenarios.",
    questions: [
      { q: "ICMP 'Type 0' is:", opts: ["Echo Request", "Echo Reply", "Dest Unreachable", "Time Exceeded"], ans: 1 },
      { q: "Which IPv6 transition method uses IPv4 as a link layer?", opts: ["Dual Stack", "Tunneling", "Translation", "None"], ans: 1 },
      { q: "TTL in IPv4 is equivalent to what in IPv6?", opts: ["Hop Limit", "Traffic Class", "Payload Length", "Version"], ans: 0 },
      { q: "ICMP message for Path MTU discovery?", opts: ["Source Quench", "Router Solicitation", "Packet Too Big", "Echo"], ans: 2 },
      { q: "Ping command uses which protocol?", opts: ["TCP", "UDP", "ICMP", "ARP"], ans: 2 },
      { q: "Traceroute uses ICMP and which field?", opts: ["Checksum", "TTL", "Length", "Option"], ans: 1 },
      { q: "NAT address type for internet facing router interface:", opts: ["Internal Local", "External Local", "Internal Global", "External Global"], ans: 2 },
      { q: "IPv6 '::1/128' is:", opts: ["Anycast", "Loopback", "Multicast", "Link-local"], ans: 1 },
      { q: "IPv6 prefix for Link-local addresses?", opts: ["FE80::/10", "FF00::/8", "2000::/3", "FC00::/7"], ans: 0 },
      { q: "Distance Vector protocol example?", opts: ["OSPF", "IS-IS", "RIP", "BGP"], ans: 2 },
      { q: "Identify ICMP message types:", opts: [{t: "Error Messages", c: true}, {t: "Query Messages", c: true}, {t: "Data Messages", c: false}, {t: "Security Messages", c: false}], isMulti: true, marks: 10 },
      { q: "IPv6 transition strategies:", opts: [{t: "Dual stack", c: true}, {t: "Tunneling", c: true}, {t: "Header translation", c: true}, {t: "NAT64", c: true}], isMulti: true, marks: 10 },
      { q: "NAT disadvantages:", opts: [{t: "Processing delay", c: true}, {t: "Broken end-to-end", c: true}, {t: "Hidden IP", c: false}], isMulti: true, marks: 10 },
      { q: "ICMP error messages includes:", opts: [{t: "Dest Unreachable", c: true}, {t: "Source Quench", c: true}, {t: "Time Exceeded", c: true}, {t: "Echo", c: false}], isMulti: true, marks: 10 },
      { q: "Classless Inter-Domain Routing (CIDR) uses:", opts: [{t: "Variable length masks", c: true}, {t: "Aggregation", c: true}, {t: "Fixed Class A", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 07: Internetworking & Autonomous Systems",
    description: "BGP, AS paths, Internet hierarchy and global routing.",
    questions: [
      { q: "AS stands for:", opts: ["Automatic System", "Autonomous System", "Advanced Shield", "Active Server"], ans: 1 },
      { q: "Internet core uses which protocol?", opts: ["RIP", "OSPF", "BGP", "STP"], ans: 2 },
      { q: "BGP is a...", opts: ["Link State", "Distance Vector", "Path Vector", "Hybrid"], ans: 2 },
      { q: "Which BGP session is within an AS?", opts: ["eBGP", "iBGP", "nBGP", "sBGP"], ans: 1 },
      { q: "What is an ISP?", opts: ["Internet Service Provider", "Internal Signal Port", "Internet Speed Port", "None"], ans: 0 },
      { q: "Port used by BGP?", opts: ["80", "443", "179", "25"], ans: 2 },
      { q: "Standard BGP 'OPEN' message contains:", opts: ["Routes", "AS number", "Error log", "Password"], ans: 1 },
      { q: "AS Number size (modern)?", opts: ["16-bit", "32-bit", "64-bit", "128-bit"], ans: 1 },
      { q: "Logical separation of Internet is done by:", opts: ["IP", "AS", "MAC", "Port"], ans: 1 },
      { q: "Default route is represented as:", opts: ["0.0.0.0/0", "255.255.255.255", "127.0.0.1", "1.1.1.1"], ans: 0 },
      { q: "BGP attributes include:", opts: [{t: "AS-PATH", c: true}, {t: "NEXT-HOP", c: true}, {t: "Bandwidth", c: false}, {t: "Origin", c: true}], isMulti: true, marks: 10 },
      { q: "Types of AS:", opts: [{t: "Stub", c: true}, {t: "Multihomed", c: true}, {t: "Transit", c: true}, {t: "Mobile", c: false}], isMulti: true, marks: 10 },
      { q: "Hierarchical routing benefits:", opts: [{t: "Smaller tables", c: true}, {t: "Faster lookups", c: true}, {t: "More CPU", c: false}], isMulti: true, marks: 10 },
      { q: "BGP connection is over:", opts: [{t: "TCP", c: true}, {t: "Port 179", c: true}, {t: "UDP", c: false}], isMulti: true, marks: 10 },
      { q: "Internet hierarchy layers:", opts: [{t: "Tier 1", c: true}, {t: "Tier 2", c: true}, {t: "Tier 3", c: true}, {t: "Tier 4", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 08: Transport Layer Fundamentals",
    description: "Segmentation, reliability (TCP), congestion control and flow control.",
    questions: [
      { q: "Transport layer data unit:", opts: ["Packet", "Frame", "Segment", "Datagram (UDP)"], ans: 2 },
      { q: "TCP is...", opts: ["Connection-oriented", "Connectionless", "Best-effort", "Hardware-based"], ans: 0 },
      { q: "Which field in TCP ensures reliability?", opts: ["Checksum", "Seq Number", "Window", "URG"], ans: 1 },
      { q: "TCP Three-way Handshake order?", opts: ["SYN, ACK, SYN-ACK", "SYN, SYN-ACK, ACK", "ACK, SYN, SYN-ACK", "SYN, ACK"], ans: 1 },
      { q: "UDP is suitable for:", opts: ["File transfer", "Email", "Streaming/VoIP", "Banking"], ans: 2 },
      { q: "Max TCP header size (bytes)?", opts: ["20", "40", "60", "64"], ans: 2 },
      { q: "TCP Congestion Window (cwnd) is used for:", opts: ["Flow control", "Error control", "Congestion control", "Routing"], ans: 2 },
      { q: "Algorithm for TCP slow start involves:", opts: ["Linear increase", "Exponential increase", "Infinite buffer", "None"], ans: 1 },
      { q: "TCP Port for SMTP?", opts: ["21", "25", "80", "110"], ans: 1 },
      { q: "UDP Header contains how many fields?", opts: ["4", "8", "10", "20"], ans: 0 },
      { q: "Identify TCP flags:", opts: [{t: "SYN", c: true}, {t: "FIN", c: true}, {t: "RST", c: true}, {t: "ERR", c: false}], isMulti: true, marks: 10 },
      { q: "UDP features include:", opts: [{t: "Low overhead", c: true}, {t: "Fast", c: true}, {t: "Reliable", c: false}, {t: "Connectionless", c: true}], isMulti: true, marks: 10 },
      { q: "Transport Layer Services:", opts: [{t: "Segmentation", c: true}, {t: "Port addressing", c: true}, {t: "Error recovery", c: true}, {t: "IP routing", c: false}], isMulti: true, marks: 10 },
      { q: "Flow control techniques (Transport):", opts: [{t: "Sliding Window", c: true}, {t: "Leaky bucket", c: false}], isMulti: true, marks: 10 },
      { q: "Ports for Well-Known services:", opts: [{t: "80 (HTTP)", c: true}, {t: "443 (HTTPS)", c: true}, {t: "21 (FTP)", c: true}, {t: "25 (SMTP)", c: true}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 09: Service Protocols & Application Layer",
    description: "HTTP, DNS, Email (SMTP/POP/IMAP) and Web protocols.",
    questions: [
      { q: "HTTP request message start line:", opts: ["Method URI Version", "Status Code", "Host Name", "Cookie"], ans: 0 },
      { q: "Persistent HTTP uses:", opts: ["One TCP per object", "One TCP for multiple objects", "UDP", "IP"], ans: 1 },
      { q: "DNS recursive query is done by:", opts: ["Authoritative server", "Local resolver", "Root server", "None"], ans: 1 },
      { q: "SMTP uses which transport protocol?", opts: ["UDP", "TCP", "SCTP", "IP"], ans: 1 },
      { q: "Which protocol is used to fetch email from server?", opts: ["SMTP", "POP3", "HTTP", "FTP"], ans: 1 },
      { q: "The port for DNS is:", opts: ["53", "80", "443", "25"], ans: 0 },
      { q: "HTTP Status Code 404 means:", opts: ["Internal Server Error", "Forbidden", "Not Found", "Redirect"], ans: 2 },
      { q: "HTTPS uses which layer for security?", opts: ["Transport (TLS)", "Network (IPsec)", "Datalink", "Application"], ans: 0 },
      { q: "Which DNS record maps name to IPv4 address?", opts: ["A", "AAAA", "MX", "NS"], ans: 0 },
      { q: "Cookie is stored at:", opts: ["Server side", "Client side", "Proxy", "Gateway"], ans: 1 },
      { q: "Identify Application Layer Protocols:", opts: [{t: "HTTP", c: true}, {t: "DNS", c: true}, {t: "SMTP", c: true}, {t: "TCP", c: false}], isMulti: true, marks: 10 },
      { q: "HTTP methods include:", opts: [{t: "GET", c: true}, {t: "POST", c: true}, {t: "PUT", c: true}, {t: "PUSH", c: false}], isMulti: true, marks: 10 },
      { q: "DNS server hierarchy consists of:", opts: [{t: "Root", c: true}, {t: "TLD", c: true}, {t: "Authoritative", c: true}, {t: "Recursive", c: false}], isMulti: true, marks: 10 },
      { q: "Email architecture involves:", opts: [{t: "UA", c: true}, {t: "MTA", c: true}, {t: "MDA", c: true}], isMulti: true, marks: 10 },
      { q: "Web caching (Proxy) benefits:", opts: [{t: "Reduced response time", c: true}, {t: "Reduced BW", c: true}, {t: "More secure", c: false}], isMulti: true, marks: 10 }
    ]
  },
  {
    title: "DCN Lec 10: Network Security Fundamentals",
    description: "Cryptography, Firewalls, IPsec, and network-based attacks.",
    questions: [
      { q: "Encryption before key exchange is called:", opts: ["Symmetric", "Asymmetric", "Public Key", "None"], ans: 0 },
      { q: "Which protocol provides security at the IP layer?", opts: ["SSL", "IPsec", "HTTPS", "SSH"], ans: 1 },
      { q: "A 'Firewall' at Layer 3/4 filters based on:", opts: ["Payload text", "Port/IP", "Username", "URL"], ans: 1 },
      { q: "In Asymmetric encryption, you encrypt with recipient's:", opts: ["Private Key", "Public Key", "Shared Key", "Secret Key"], ans: 1 },
      { q: "Digital Signature provides:", opts: ["Authenticity", "Integriy", "Non-repudiation", "All of above"], ans: 3 },
      { q: "DoS stands for:", opts: ["Data on Service", "Denial of Service", "Dynamic of Server", "None"], ans: 1 },
      { q: "VPN creates an encrypted...", opts: ["Route", "Protocol", "Tunnel", "Host"], ans: 2 },
      { q: "Hashing is a one-way function used for:", opts: ["Encryption", "Integrity", "Speed", "Encoding"], ans: 1 },
      { q: "Phishing is an example of:", opts: ["Technical attack", "Social engineering", "Physical theft", "Protocol bug"], ans: 1 },
      { q: "IDS stands for:", opts: ["Intrusion Detection System", "Internal Data Shield", "Internet Discovery System", "None"], ans: 0 },
      { q: "Network security goals (CIA):", opts: [{t: "Confidentiality", c: true}, {t: "Integrity", c: true}, {t: "Availability", c: true}, {t: "Authorization", c: false}], isMulti: true, marks: 10 },
      { q: "Symmetric encryption algorithms:", opts: [{t: "AES", c: true}, {t: "DES", c: true}, {t: "RSA", c: false}, {t: "3DES", c: true}], isMulti: true, marks: 10 },
      { q: "Firewall types:", opts: [{t: "Packet filtering", c: true}, {t: "Circuit level", c: true}, {t: "Application level", c: true}, {t: "Host based", c: true}], isMulti: true, marks: 10 },
      { q: "IPsec sub-protocols:", opts: [{t: "AH", c: true}, {t: "ESP", c: true}, {t: "TCP", c: false}], isMulti: true, marks: 10 },
      { q: "Common cyber attacks:", opts: [{t: "Spoofing", c: true}, {t: "Sniffing", c: true}, {t: "Spamming", c: true}, {t: "Saving", c: false}], isMulti: true, marks: 10 }
    ]
  }
];

const run = async () => {
  try {
    await connectDB();
    const lecturer = await User.findOne({ role: 'lecturer' });
    if (!lecturer) { console.error('No lecturer found!'); process.exit(1); }

    for (const lqz of dcnLectureQuizzes) {
      // Re-create each quiz separately
      await Quiz.deleteMany({ title: lqz.title });

      const dbQuestions = lqz.questions.map(q => ({
        questionText: q.q,
        questionType: 'mcq',
        isMultiSelect: q.isMulti || false,
        marks: q.marks || 4, // 10 Single * 4 = 40. 5 Multi * 12? Let me adjust to 100.
      }));
      
      // Let's manually balance to 100 marks: 10 Single (4 marks) + 5 Multi (12 marks) = 40 + 60 = 100.
      const quizQuestions = lqz.questions.map((q, idx) => ({
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
        course: "IT2030 - DCN",
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
      console.log(`Successfully created: ${lqz.title} (Marks: ${totalMarks})`);
    }

    console.log(`All 10 DCN lecture quizzes deployed!`);
    process.exit(0);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

run();
