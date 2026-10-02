/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ALL SITE TEXT LIVES HERE. Edit this file to update the website.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Formatting tips
 *  • Wrap a word or two in *asterisks* inside a heading to set it in the
 *    elegant italic serif, e.g. "Let's work *together*".
 *  • Anything written as [PLACEHOLDER ...] is shown with a dashed yellow outline
 *    so you can spot it. Replace it with real text before you share the site.
 *  • Images are referenced by their path inside /assets without the extension,
 *    e.g. "photo" → /assets/photo.jpeg, "activities/wtisd-2025/cover".
 *  • Facts here come only from the brief and the resume. Never add made-up
 *    numbers or results.
 */

// ───────────────────────────── Personal details ─────────────────────────────
export const site = {
  name: "Fitri Johan",
  fullName: "Fitri Johan Bin Shahrul Mazli",
  initials: "FJ",
  title: "Final-year IT student | Aspiring Junior Data Analyst",
  url: "https://yohuan21.github.io",
  description:
    "Fitri Johan is a final-year Information Technology student at UiTM and an aspiring Junior Data Analyst working with Python, SQL, Power BI, Hadoop and Hive.",
  university: "Universiti Teknologi MARA (UiTM)",
  email: "[PLACEHOLDER]", // e.g. "name@example.com"
  github: "https://github.com/YoHuan21",
  linkedin: "https://www.linkedin.com/in/fitri-johan/",
  resume: "/resume.pdf", // copied automatically from /assets/resume.pdf
  resumeDownloadName: "Fitri-Johan-Resume.pdf",
  copyrightYear: 2026,
  keywords: [
    "Fitri Johan",
    "Junior Data Analyst",
    "Data Analyst portfolio",
    "UiTM",
    "Power BI",
    "SQL",
    "Python",
    "Hadoop",
    "Hive",
  ],
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Activities", href: "/#activities" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

// ───────────────────────────────── Hero ─────────────────────────────────
export const hero = {
  eyebrow: "Portfolio · 2026",
  headline:
    "Hi, I'm Fitri. I turn data into *clear decisions*, and build things that connect hardware to people.",
  subline: "Final-year IT student at UiTM · Aspiring Junior Data Analyst",
  intro:
    "I'm a final-year Information Technology student with hands-on experience in data analysis, visualization and database technologies. From querying 25,000 student records in Hive to building an IoT medication dispenser with its own Android app, I like work that ends in something people can actually use.",
  image: "photo",
  imageAlt: "Fitri Johan smiling beside the MediTap poster, the dispenser prototype and the Android app on a tablet",
  imageCaption: "With MediTap, my Final Year Project",
  primaryCta: { label: "View selected work", href: "/#work" },
  secondaryCta: { label: "Get in touch", href: "/#contact" },
};

// ─────────────────────────────── Skills marquee ───────────────────────────────
export const marquee = ["Python", "SQL", "Power BI", "pandas", "Hadoop", "Hive", "Java", "Firebase", "ESP32", "MySQL"];

// ─────────────────────────────── Selected work ───────────────────────────────
export const work = {
  eyebrow: "Selected work",
  heading: "From raw data to *clear answers*, and working systems.",
  intro:
    "Four projects across big data, HR analytics, IoT and web development. Each card cycles through the problem, what I did and the result.",
};

export type ProjectIcon = "chart" | "users" | "pill" | "hospital";
export type ProjectVisual = "student-performance" | "hr-analysis" | "meditap" | "healthcare-system";

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: ProjectIcon;
  /** Shown under the title, e.g. "Team project · 4 members". Group work is always labelled as a team project. */
  type: string;
  context: string;
  role: string;
  stack: string[];
  summary: string;
  /** Folder inside /assets. Any images you drop in here appear in the case study gallery. */
  imagesFolder: string;
  galleryTitle: string;
  galleryCaption: string;
  /** The generated SVG/CSS visual used when the folder has no photos (and always for charts). */
  visual: ProjectVisual;
  /** If true and the folder has photos, the first photo replaces the generated visual on the home page card. */
  preferPhotoOnCard: boolean;
  /** Optional photo (by /assets key) used at the top of the case study instead of the generated visual. */
  heroImage?: { key: string; alt: string; caption?: string };
  /** The three items on the home page card. Keep each to 1–3 sentences. */
  story: { problem: string; whatIDid: string; result: string };
  /** Longer versions used on the case study page. */
  detail: {
    overview: string;
    problem: string[];
    whatIDid: string[];
    result: string[];
  };
  seoDescription: string;
};

export const projects: Project[] = [
  {
    slug: "student-performance",
    title: "Student Performance Big Data Analysis",
    shortTitle: "Student Performance",
    icon: "chart",
    type: "Team project · 4 members",
    context: "DSC650 · Data Analytics Project",
    role: "[PLACEHOLDER: my specific role]",
    stack: ["Hadoop", "HDFS", "Hive", "HiveQL", "Power BI"],
    summary: "Which habits actually move exam results? A 25,000-record big data analysis, from HDFS to a Power BI dashboard.",
    imagesFolder: "projects/student-performance",
    galleryTitle: "Original dashboard",
    galleryCaption: "The Power BI visuals from the original project.",
    visual: "student-performance",
    preferPhotoOnCard: false,
    story: {
      problem:
        "Educators lacked clear evidence of which factors (attendance, study hours, study method, internet access) actually influence student results.",
      whatIDid:
        "Loaded a 25,000-record, 16-attribute dataset into Hadoop HDFS, built a Hive table, wrote 10 HiveQL queries (aggregations, CASE-based grouping, filtering), and visualized the results in an interactive Power BI dashboard.",
      result:
        "Study time had the strongest effect: average scores rose from 39.8 (under 2 hours/day) to 77.9 (over 4 hours/day). High attendance (>85%) averaged 70.4 versus 58.0 for low attendance.",
    },
    detail: {
      overview:
        "A four-member team project for DSC650. We took a 25,000-record student performance dataset through a complete big data workflow, from storage in Hadoop HDFS, to analysis with HiveQL, to an interactive Power BI dashboard, to find out which factors really influence student results.",
      problem: [
        "Educators lacked clear evidence of which factors (attendance, study hours, study method, internet access) actually influence student results.",
        "Without that evidence, it is hard to decide where support and interventions will make the biggest difference.",
      ],
      whatIDid: [
        "Loaded and managed a structured CSV dataset of 25,000 records and 16 attributes in Hadoop HDFS.",
        "Built a Hive table and wrote 10 HiveQL queries using aggregations, CASE-based grouping and filtering.",
        "Performed aggregation and comparative analysis on subject scores, attendance levels, grade distributions and performance patterns.",
        "Visualized the results in an interactive Power BI dashboard highlighting key performance indicators.",
        "[PLACEHOLDER: my specific role]",
      ],
      result: [
        "Study time had the strongest effect. Average scores rose from 39.8 (under 2 hours/day) to 77.9 (over 4 hours/day).",
        "High attendance (>85%) averaged 70.4, versus 58.0 for low attendance (<70%).",
        "Internet access, school type and gender each made less than a 1-point difference.",
        "Even among students scoring 80+, Science was the most common weak subject.",
      ],
    },
    seoDescription:
      "Case study: a 25,000-record student performance analysis with Hadoop HDFS, Hive, HiveQL and Power BI. Study time had the strongest effect on results.",
  },
  {
    slug: "hr-analysis",
    title: "HR Data Analysis for Employee Retention",
    shortTitle: "HR Analysis",
    icon: "users",
    type: "Team project · 5 members",
    context: "ICT550 · Data Management Project",
    role: "[PLACEHOLDER: my specific role]",
    stack: ["Python", "Kaggle datasets", "Dashboard"],
    summary: "Why do good employees leave? Two HR datasets, a 5 Whys root-cause analysis and a clear look at attrition.",
    imagesFolder: "projects/hr-analysis",
    galleryTitle: "Project gallery",
    galleryCaption: "Screens and visuals from the project.",
    visual: "hr-analysis",
    preferPhotoOnCard: true,
    story: {
      problem:
        "Companies lose good employees without understanding why, and HR teams lack data-driven tools to spot problems early.",
      whatIDid:
        "Used a 5 Whys root-cause analysis to frame the problem, then combined two Kaggle datasets (IBM HR Analytics Employee Attrition & Performance, and Employee Productivity & Satisfaction HR Data) to analyze attrition by department, job role, age and overtime.",
      result:
        "Sales and Research & Development had the highest attrition, and age group, job role and overtime emerged as key factors, pointing HR teams toward workload balance and job satisfaction as retention levers.",
    },
    detail: {
      overview:
        "A five-member team project for ICT550. We analyzed HR data to evaluate employee attrition, job satisfaction, productivity and workforce retention patterns, and to give HR teams a clearer, data-driven picture of why people leave.",
      problem: [
        "Companies lose good employees without understanding why.",
        "HR teams lack data-driven tools to spot retention problems early.",
      ],
      whatIDid: [
        "Framed the problem with a 5 Whys root-cause analysis.",
        "Combined insights from two Kaggle datasets: IBM HR Analytics Employee Attrition & Performance, and Employee Productivity & Satisfaction HR Data.",
        "Examined department, job role, age, overtime, productivity and satisfaction to identify factors associated with attrition.",
        "Presented workforce trends and retention patterns through data analysis and visualization.",
        "[PLACEHOLDER: my specific role]",
      ],
      result: [
        "Sales and Research & Development had the highest attrition.",
        "Age group, job role and overtime emerged as key factors.",
        "The findings point HR teams toward workload balance and job satisfaction as retention levers.",
      ],
    },
    seoDescription:
      "Case study: HR data analysis for employee retention using two Kaggle datasets and a 5 Whys root-cause analysis. Team project for ICT550.",
  },
  {
    slug: "meditap",
    title: "MediTap: Caregiver-Assisted IoT Medication Dispenser",
    shortTitle: "MediTap",
    icon: "pill",
    type: "Final Year Project",
    context: "Android app + IoT device",
    role: "Design, development and deployment of the app and the device",
    stack: ["Java", "Android Studio", "Firebase Realtime Database", "ESP32", "DS3231 RTC", "Servo motor", "Buzzer", "Push button"],
    summary: "An ESP32 medication dispenser and an Android app that help caregivers make sure doses are taken on time.",
    imagesFolder: "projects/meditap",
    galleryTitle: "Project gallery",
    galleryCaption: "The prototype, the app and the build.",
    visual: "meditap",
    preferPhotoOnCard: true,
    heroImage: {
      key: "photo",
      alt: "Fitri Johan beside the MediTap poster, the dispenser prototype and the Android app on a tablet",
      caption: "The MediTap poster, dispenser prototype and Android app",
    },
    story: {
      problem: "Caregivers need a reliable way to manage medication schedules and confirm doses are taken on time.",
      whatIDid:
        "Designed, developed and deployed an IoT medication dispenser integrated with an Android app for scheduling, notifications, user management and medication logs, with an ESP32, DS3231 RTC, servo motor, buzzer and push button for automated time-based dispensing.",
      result:
        "Completed a working prototype validated through functional testing of dispensing accuracy, compartment selection, response time and medication logging.",
    },
    detail: {
      overview:
        "MediTap pairs an ESP32-based medication dispenser with an Android app for caregivers. The device releases doses on schedule; the app is where caregivers manage schedules, notifications, users and medication logs, all kept in sync through Firebase Realtime Database.",
      problem: [
        "Caregivers need a reliable way to manage medication schedules.",
        "They also need to confirm that each dose is actually taken on time.",
      ],
      whatIDid: [
        "Designed, developed and deployed a functional IoT medication dispensing system integrated with an Android application.",
        "Developed the mobile app in Java with Android Studio and Firebase Realtime Database for scheduling, notifications, user management and medication logs.",
        "Integrated an ESP32, DS3231 RTC, servo motor, buzzer and push button for automated time-based dispensing and medication status tracking.",
      ],
      result: [
        "Completed a working prototype.",
        "Validated it through functional testing of dispensing accuracy, compartment selection, response time and medication logging.",
      ],
    },
    seoDescription:
      "Case study: MediTap, a caregiver-assisted IoT medication dispenser built with ESP32, DS3231 RTC, Firebase and a Java Android app. Final Year Project.",
  },
  {
    slug: "healthcare-system",
    title: "Healthcare Equipment Management System",
    shortTitle: "Healthcare System",
    icon: "hospital",
    type: "Web application project",
    context: "Academic project",
    role: "Developer",
    stack: ["Java", "JSP", "Servlets", "JDBC", "MySQL", "Apache NetBeans"],
    summary: "A Java web application that brings equipment records, maintenance and reservations into one place.",
    imagesFolder: "projects/healthcare-system",
    galleryTitle: "Project gallery",
    galleryCaption: "Screens from the application.",
    visual: "healthcare-system",
    preferPhotoOnCard: true,
    story: {
      problem: "Healthcare equipment, maintenance and reservations are hard to track without a central system.",
      whatIDid:
        "Built a Java web application with login and registration, equipment and maintenance records, and reservations, using CRUD operations and JDBC database connectivity.",
      result: "A working academic system demonstrating web development, database management and system flow design.",
    },
    detail: {
      overview:
        "A Java-based web application to manage healthcare equipment records, maintenance records, reservations, user login and registration, built with JSP, Servlets, JDBC and MySQL in Apache NetBeans.",
      problem: [
        "Healthcare equipment, maintenance and reservations are hard to track without a central system.",
      ],
      whatIDid: [
        "Built login and registration for users.",
        "Implemented CRUD operations for equipment records, maintenance records and reservations.",
        "Connected the application to MySQL with JDBC, using JSP and Servlets in Apache NetBeans.",
      ],
      result: [
        "A working academic system.",
        "Practice in web application development, database management and system flow design.",
      ],
    },
    seoDescription:
      "Case study: a Java web application (JSP, Servlets, JDBC, MySQL) for managing healthcare equipment, maintenance and reservations.",
  },
];

// ───────────────── Real data for the Student Performance charts ─────────────────
export const studentPerformanceData = {
  stats: [
    { value: 25000, label: "records" },
    { value: 16, label: "attributes" },
    { value: 10, label: "HiveQL queries" },
  ],
  scoreByStudyHours: {
    title: "Average overall score by daily study hours",
    xLabel: "Study hours per day",
    yLabel: "Avg overall score",
    points: [
      { label: "0", value: 36 },
      { label: "1", value: 41 },
      { label: "2", value: 50 },
      { label: "3", value: 58 },
      { label: "4", value: 66 },
      { label: "5", value: 73 },
      { label: "6", value: 81 },
      { label: "7", value: 89 },
      { label: "8", value: 94 },
    ],
  },
  scoreByAttendance: {
    title: "Average score by attendance",
    bars: [
      { label: "High", sublabel: ">85%", value: 70.4 },
      { label: "Medium", sublabel: "70–85%", value: 65.6 },
      { label: "Low", sublabel: "<70%", value: 58.0 },
    ],
  },
  gradeDistribution: {
    title: "Grade distribution",
    total: 25000,
    segments: [
      { label: "A", value: 1205 },
      { label: "B", value: 2696 },
      { label: "C", value: 6161 },
      { label: "D", value: 6311 },
      { label: "E", value: 5672 },
      { label: "F", value: 2955 },
    ],
  },
  weakSubjectHighScorers: {
    title: "High scorers (80+) weak in a subject",
    bars: [
      { label: "Science", value: 47 },
      { label: "Math", value: 34 },
      { label: "English", value: 28 },
    ],
  },
  query: `SELECT CASE
  WHEN study_hours < 2 THEN 'Low Study'
  WHEN study_hours BETWEEN 2 AND 4 THEN 'Medium Study'
  ELSE 'High Study' END AS study_level,
  AVG(overall_score) AS avg_score
FROM student_performance_final
GROUP BY CASE
  WHEN study_hours < 2 THEN 'Low Study'
  WHEN study_hours BETWEEN 2 AND 4 THEN 'Medium Study'
  ELSE 'High Study' END;`,
};

// Illustrative code for the HR project card. Replace with your real code when you can.
export const hrCodeSnippet = `# [PLACEHOLDER] Illustrative snippet, replace with real project code
import pandas as pd

ibm = pd.read_csv("ibm_hr_attrition.csv")

attrition_by_dept = (
    ibm.groupby("Department")["Attrition"]
       .apply(lambda s: (s == "Yes").mean())
       .sort_values(ascending=False)
)

overtime = pd.crosstab(ibm["OverTime"], ibm["Attrition"],
                       normalize="index")`;

// ───────────────────────────────── About ─────────────────────────────────
export const about = {
  eyebrow: "About",
  heading: "Curious about the *story* inside the numbers.",
  image: "photo", // change to any image key, e.g. "activities/uitm-ustar/cover"
  imageAlt: "Portrait of Fitri Johan",
  paragraphs: [
    "I'm Fitri Johan, a final-year Information Technology student at Universiti Teknologi MARA (UiTM). I have hands-on experience in data analysis, visualization and database technologies, and I work with Python, SQL, Power BI, pandas, Hadoop and Hive.",
    "My projects range from analyzing 25,000 student records with Hadoop and Hive, to studying employee attrition with Python, to building MediTap, an IoT medication dispenser with its own Android app. I'm now looking for a Junior Data Analyst or related entry-level role.",
  ],
  stats: [
    { value: 25000, prefix: "", suffix: "", label: "records analyzed" },
    { value: 4, prefix: "", suffix: "", label: "projects" },
    { value: 2, prefix: "×", suffix: "", label: "Dean's List" },
  ],
};

// ───────────────────────── Beyond the Classroom ─────────────────────────
export type ActivityIcon = "signal" | "star" | "users" | "leaf" | "award";

export type Activity = {
  slug: string;
  title: string;
  location?: string;
  role: string;
  date: string;
  description?: string;
  /** Folder inside /assets. cover.jpg (or .jpeg/.png) is the main image. Empty folder = text-only card. */
  folder: string;
  icon: ActivityIcon;
  /** Which part of the cover photo to keep when it is cropped, e.g. "50% 20%" (x y). */
  coverPosition?: string;
};

export const activitiesSection = {
  eyebrow: "Beyond the classroom",
  heading: "Leadership, volunteering and *the people* behind the work.",
  intro: "Click a photo card to open the full gallery.",
};

export const activities: Activity[] = [
  {
    slug: "wtisd-2025",
    title: "World Telecommunication and Information Society Day (WTISD) 2025",
    role: "Participant",
    date: "17 May 2025",
    description: "[PLACEHOLDER: details]",
    folder: "activities/wtisd-2025",
    icon: "signal",
    coverPosition: "50% 58%",
  },
  {
    slug: "uitm-ustar",
    title: "UiTM U-STAR",
    role: "Volunteer",
    date: "[PLACEHOLDER]",
    folder: "activities/uitm-ustar",
    icon: "star",
    coverPosition: "50% 16%",
  },
  {
    slug: "it-club-exco",
    title: "Information Technology Club, UiTM",
    role: "Academic Exco",
    date: "Dec 2024 – Dec 2025",
    description: "Coordinated academic activities and student engagement initiatives.",
    folder: "activities/it-club-exco",
    icon: "users",
  },
  {
    slug: "setiu-wetland-2024",
    title: "Modul Kepimpinan Profesional",
    location: "Setiu Wetland, Terengganu",
    role: "Faculty Representative",
    date: "April 2024",
    description: "Leadership programme with a group case study on community and eco-tourism.",
    folder: "activities/setiu-wetland-2024",
    icon: "leaf",
  },
  {
    slug: "irise-2025",
    title: "IRISE Programme",
    role: "Participant",
    date: "Oct 2024 – Feb 2025",
    description: "Recognised for contribution in teamwork, communication and idea development.",
    folder: "activities/irise-2025",
    icon: "award",
  },
];

// ─────────────────────────────── Education ───────────────────────────────
export const education = {
  eyebrow: "Education",
  heading: "Building the *foundations*.",
  items: [
    {
      degree: "Bachelor of Information Technology (Hons.)",
      school: "Universiti Teknologi MARA (UiTM)",
      dates: "Oct 2023 – Present",
      highlights: ["Dean's List · Semester 1, 2023/2024", "Dean's List · Semester 6, 2026"],
      details: ["CGPA 3.39 / 4.00", "MUET Band 4"],
    },
  ],
};

// ───────────────────────────────── Skills ─────────────────────────────────
export type SkillIcon = "code" | "chart" | "database" | "chip" | "globe" | "server" | "tool";

export const skillsSection = {
  eyebrow: "Skills",
  heading: "The *toolkit*.",
  groups: [
    { name: "Programming", icon: "code" as SkillIcon, items: ["Java", "Python", "C++", "PHP", "SQL"] },
    {
      name: "Data & Visualization",
      icon: "chart" as SkillIcon,
      items: ["pandas", "NumPy", "Matplotlib", "Seaborn", "Power BI"],
    },
    { name: "Big Data", icon: "server" as SkillIcon, items: ["Apache Hadoop", "HDFS", "Apache Hive", "HiveQL"] },
    { name: "Mobile & IoT", icon: "chip" as SkillIcon, items: ["Android Studio", "ESP32", "Arduino IDE"] },
    { name: "Web", icon: "globe" as SkillIcon, items: ["HTML", "CSS", "JSP", "Servlets", "JDBC", "XAMPP"] },
    { name: "Database", icon: "database" as SkillIcon, items: ["MySQL", "phpMyAdmin", "Firebase"] },
    {
      name: "Tools",
      icon: "tool" as SkillIcon,
      items: ["Jupyter Notebook", "GitHub", "VS Code", "Apache NetBeans", "WinSCP", "Linux/Ubuntu"],
    },
  ],
};

// ────────────────────────────────── CTA ──────────────────────────────────
export const cta = {
  eyebrow: "Contact",
  heading: "Let's work *together*",
  text: "Open to Junior Data Analyst and related entry-level roles.",
  buttonLabel: "Email me",
  secondaryLabel: "LinkedIn",
  // Background photo (blurred and darkened). Any image key works.
  image: "activities/uitm-ustar/photos-1",
  imagePosition: "50% 0%",
};

// ───────────────────────────────── Footer ─────────────────────────────────
export const footerLinks = [
  { label: "LinkedIn", href: site.linkedin, external: true },
  { label: "GitHub", href: site.github, external: true },
  { label: "Email", href: `mailto:${site.email}`, external: false },
];
