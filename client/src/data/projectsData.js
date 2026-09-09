export const projectsData = [
  {
    id: "legendsport",
    title: "LegendSport",
    subtitle: "Modern E-Commerce Platform",
    category: "E-Commerce / Full-Stack",
    color: "#38bdf8",
    gradient: "from-cyan-500 to-blue-600",
    description: "A comprehensive digital athletic apparel and equipment e-commerce platform built with responsive catalog filtering, interactive cart operations, and streamlined checkout.",
    longDescription: "LegendSport delivers a high-speed shopping experience featuring dynamic product variants, instantaneous full-text catalog search, wishlist synchronizations, and an administrative control suite for stock, coupons, and orders.",
    features: [
      "Dynamic catalog filtering by sport, size, brand, and price tier",
      "Real-time cart state management with instant quantity adjustments",
      "Secure checkout flow with order tracking and invoice generation",
      "Full administrative dashboard for inventory, sales analytics, and promotions",
      "Optimized mobile-first interface with blazing asset loading"
    ],
    techStack: ["React", "Node.js", "Express.js", "MySQL", "TailwindCSS", "REST API"],
    role: "Lead Full-Stack Developer",
    challenges: "Handling real-time inventory locking during concurrent high-traffic checkout events while maintaining sub-second catalog filter response times.",
    solutions: "Implemented database transaction isolation levels, structured indexing on product attributes, and optimistic client-side caching.",
    liveDemo: "https://legendsport.page.gd/index.html",
    gitlabUrl: "#",
    demoNote: "Production enterprise codebase with private repo access available upon request"
  },
  {
    id: "debt-management",
    title: "Debt Management System",
    subtitle: "Financial & Ledger Automation Platform",
    category: "Fintech / Business Systems",
    color: "#818cf8",
    gradient: "from-indigo-500 to-cyan-500",
    description: "An enterprise web-based debt, customer credit ledger, installment schedule, and automated payment tracking system designed for commercial business accountability.",
    longDescription: "Engineered to eliminate accounting discrepancies, this system centralizes client balances, structured installment payment terms, automated reminder alerts, and generates auditable PDF financial ledgers.",
    features: [
      "Customer credit scoring and total ledger balance auditing",
      "Automated installment scheduler with late-payment flag triggers",
      "Exportable financial statement reports (PDF & Excel formats)",
      "Role-based access control for accountants, managers, and cashiers",
      "Detailed audit logs tracking every payment, discount, and credit modification"
    ],
    techStack: ["PHP", "MySQL", "JavaScript", "HTML5/CSS3", "Bootstrap", "FPDF/ChartJS"],
    role: "Full-Stack Software Architect",
    challenges: "Ensuring zero-margin arithmetic rounding errors across multi-currency installment schedules and generating high-volume analytical reports instantaneously.",
    solutions: "Utilized precise fixed-point decimal arithmetic in MySQL, indexed customer transaction tables, and developed asynchronous reporting workers.",
    liveDemo: "#",
    gitlabUrl: "#",
    demoNote: "Designed for commercial financial operations and regulatory audit compliance"
  },
  {
    id: "pos-cashier",
    title: "POS / Cashier System",
    subtitle: "Inventory, Barcode & Invoicing Suite",
    category: "Retail / Point of Sale",
    color: "#22c55e",
    gradient: "from-emerald-500 to-teal-600",
    description: "An ultra-fast Point-of-Sale application with instant barcode scanning, stock level alerts, invoice printing, and cashier shift reconciliation.",
    longDescription: "Created to handle rapid checkout lanes with keyboard shortcuts, continuous barcode scanner input, real-time inventory deductions, multi-payment methods, and end-of-day cashier drawer balancing.",
    features: [
      "Instant barcode scanning with automatic item lookup & bulk pricing rules",
      "Thermal receipt printing & digital PDF tax invoice generation",
      "Real-time inventory deduction with low-stock replenishment warnings",
      "Cash drawer reconciliation, shift opening/closing balance verification",
      "Customer loyalty point tracking and custom invoice discounting"
    ],
    techStack: ["PHP", "MySQL", "JavaScript", "WebSocket / AJAX", "TailwindCSS"],
    role: "Backend & Systems Engineer",
    challenges: "Building a point-of-sale interface resilient to brief network drops without halting cashier transaction throughput.",
    solutions: "Engineered local browser IndexedDB transaction queuing with automatic two-way sync to the central MySQL database once connectivity resumes.",
    liveDemo: "https://7ooda-cashir.ct.ws/",
    gitlabUrl: "#",
    demoNote: "Deployed and tested in fast-paced retail and grocery sales environments"
  },
  {
    id: "microtech-isp",
    title: "MicroTech / ISP Platform",
    subtitle: "Internet Card & Bandwidth Management",
    category: "Networking / Telecom Services",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    description: "A centralized platform for Internet Service Providers to generate, sell, distribute, and track prepaid internet hotspot cards and user bandwidth quotas.",
    longDescription: "MicroTech ISP streamlines the operations of local networks and hotspot operators by automating card generation (PIN/Username), managing reseller quotas, tracking active sessions, and preventing unauthorized card reuse.",
    features: [
      "Bulk batch card generation with cryptographic PIN hashing & printable templates",
      "Reseller distribution portal with commission tracking and credit limits",
      "Live bandwidth consumption metrics and active session monitoring",
      "User portal for balance checking, card activation, and package upgrades",
      "Granular network performance statistics and revenue analytics"
    ],
    techStack: ["Node.js", "Express.js", "MySQL", "React", "TailwindCSS", "MikroTik API"],
    role: "Full-Stack Network Solutions Engineer",
    challenges: "Securely generating tens of thousands of unique card codes simultaneously while syncing authentication policies with network access controllers.",
    solutions: "Developed asynchronous batch workers with crypto-random generation, coupled with atomic database transactions and network API webhook listeners.",
    liveDemo: "http://7ooda.gt.tc",
    gitlabUrl: "#",
    demoNote: "Empowers network operators with end-to-end automation from generation to end-user login"
  }
];
