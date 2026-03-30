export const profileData = {
  name: "Lakshya Gupta",
  role: "Developer / Data Science",
  tagline: "Building innovative solutions with code",
  email: "glakshya42@gmail.com",
  github: "2005lakshya",
  linkedin: "lakshya-gupta2005",
  stats: {
    repos: 24,
    contributions: 847,
    followers: 156,
    stars: 89,
  },
};

export const aboutData = {
  bio: `const lakshya = {
  role: "Developer / Data Science",
  interests: ["AppDev", "AI", "Web Dev"],
  lookingFor: "Summer Internship",
  education: "B.Tech Computer Science (Data Science0",
  location: "India"
}`,
  skills: [
    "React", "TypeScript", "Python", "Java", "Kotlin",
    "Flutter", "Node.js", "Machine Learning", "Data Science",
    "Firebase", "MongoDB", "Git"
  ],
};

export const skillsData = [
  { name: "JavaScript", percentage: 85, color: "lang-javascript" },
  { name: "TypeScript", percentage: 75, color: "lang-typescript" },
  { name: "Python", percentage: 80, color: "lang-python" },
  { name: "Java", percentage: 70, color: "lang-java" },
  { name: "Kotlin", percentage: 65, color: "lang-kotlin" },
  { name: "Dart/Flutter", percentage: 60, color: "lang-dart" },
  { name: "HTML/CSS", percentage: 90, color: "lang-html" },
  { name: "React", percentage: 85, color: "lang-typescript" },
];

export const projectsData = [
  {
    name: "MessIT",
    description: "Developed MessIT, a menu app with 40K+ downloads for VIT students on Android and iOS. Integrated a redesigned UI with backend data and local storage for offline access, while optimizing the menu loading process to reduce load times by 40% for a smoother experience.",
    techStack: ["Flutter", "Firebase", "Android", "iOS"],
    github: "",
    demo: "https://play.google.com/store/apps/details?id=com.vinnovateit.messit&hl=en_IN",
  },
  {
    name: "RoboWars App",
    description: "Developed the Robowars app for graVITas VIT’s tech fest, building intuitive features for team listings, match scheduling, and real-time updates. Designed the UI to ensure efficient navigation of team profiles and schedules for all event participants.",
    techStack: ["React", "TypeScript", "TailwindCSS"],
    github: "http://github.com/2005lakshya/RoboVITics_Robowars_2025",
    demo: "https://play.google.com/store/apps/details?id=robowars.com.robowars_app&pcampaignid=web_share",
  },
  {
    name: "HackXpertise 2.0",
    description: "Built and deployed the HackXpertise 2.0 portal for participant registration, team formation, and event coordination. Successfully managed seamless onboarding and live management for over 200+ participants during the entire hackathon event.",
    techStack: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/2005lakshya/HackXpertise",
    demo: "https://hackxpertise20.vercel.app/",
  },
  {
    name: "Verimind AI",
    description: "Developed Verimind AI, a 'Context Engine' unifying verification data into actionable risk scores. Built an ML pipeline for failure prediction and automated plan generation, while prioritizing coverage through RTL cross-referencing. Used TF-IDF similarity to group failures, drastically reducing debug time by identifying core root causes.",
    techStack: ["Python", "Machine Learning", "AI"],
    github: "https://github.com/2005lakshya/verimind-ai",
    demo: "",
  },
  {
    name: "Plant Care",
    description: "Flask app that detects plant diseases from leaf images using MobileNetV2 and Gemini AI for treatment recommendations.",
    techStack: ["Python", "Flask", "TensorFlow", "Gemini AI"],
    github: "https://github.com/2005lakshya/PlantCare",
    demo: "",
  },
  {
    name: "BunkBuddies",
    description: "Developed BunkBuddies, a room counseling and roommate-finding platform for VIT students. Scaled the system to handle 2.8K active users and 3.4K group requests, streamlining the complex room selection process through integrated messaging and real-time group formation tools.",
    techStack: ["React", "TypeScript", "Firebase", "TailwindCSS"],
    github: "https://github.com/2005lakshya/BunkBuddies-Frontend",
    demo: "https://bunkbuddies.vinnovateit.com/",
  },
];

export const contributionData = generateContributions();

function generateContributions() {
  const weeks = 52;
  const days = 7;
  const contributions: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      // Generate realistic-looking contribution pattern
      const random = Math.random();
      if (random < 0.3) week.push(0);
      else if (random < 0.5) week.push(1);
      else if (random < 0.7) week.push(2);
      else if (random < 0.9) week.push(3);
      else week.push(4);
    }
    contributions.push(week);
  }
  return contributions;
}

export const experienceData = [
  {
    hash: "8e2a1b4",
    title: "Secretary @ IEEE TEMS, VIT",
    date: "August 2024 - Present",
    type: "feat",
    description: "Led a 100+ member chapter, overseeing multiple technical initiatives and driving a 20% increase in engagement through a mentorship program. Coordinated cross-team efforts and helped organize CodeRush 3.0 and HackXpertise 2.0 at graVITas’25, attracting 250+ participants.",
  },
  {
    hash: "7b2d4e9",
    title: "Summer Intern @ Havells India Limited",
    date: "May 2024 - July 2024",
    type: "feat",
    description: "Developed a Student Data Management System using ASP.NET MVC (C#) and PostgreSQL. Built secure authentication with role-based access. Completed independently with weekly mentor reviews.",
  },
];

export const achievementsData = [
  {
    version: "v4.0",
    title: "Events Coordinator @ Riviera'26",
    date: "Feb 2026",
    description: "Coordinated cultural events and managed promotion for Riviera'26, VIT's flagship cultural fest with over 150 events.",
  },
  {
    version: "v3.5",
    title: "1st Prize - Cluminati (Gravitas'23)",
    date: "2023",
    description: "Won first prize in the Cluminati event during graVITas'23, VIT's flagship Tech Fest.",
  },
  {
    version: "v3.0",
    title: "Educational Outreach & Teaching",
    date: "2025",
    description: "Conducted coding and cyber security outreach sessions at Takshilah Global School to empower students.",
  },
  {
    version: "v2.5",
    title: "Certified Flutter & Python Developer",
    date: "",
    description: "Certifications: Complete Flutter Development Bootcamp (Udemy) and Simply Coding Python (Summer Camp).",
  },
  {
    version: "v1.2",
    title: "Science Creativity Certificate",
    date: "",
    description: "Awarded the Science Creativity Certificate for exceptional innovation in high school science projects.",
  },
];

export const contactData = {
  email: "glakshya42@gmail.com",
  phone: "+91 8529075860",
  location: "Gurgaon, India",
  github: "2005lakshya",
  linkedin: "lakshya-gupta2005",
};
