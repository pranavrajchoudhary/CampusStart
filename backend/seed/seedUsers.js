const mongoose = require("mongoose");
const User = require("../models/User");

// 🔗 DB CONNECT
mongoose.connect("mongodb://127.0.0.1:27017/campusStart", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const skillsPool = [
  ["React", "Node", "MongoDB"],
  ["Python", "ML", "AI"],
  ["UI/UX", "Figma"],
  ["Marketing", "SEO", "Growth"],
  ["Data Science", "Python"],
  ["Next.js", "TypeScript"],
];

const interestsPool = [
  ["AI", "EdTech"],
  ["Fintech", "Startups"],
  ["Social Impact"],
  ["Web3"],
  ["HealthTech"],
];

const roles = [
  "Developer",
  "Designer",
  "Marketer",
  "Researcher",
  "Founder",
];

const createUsers = async () => {
  try {
    await User.deleteMany(); // ❗ optional: clears old users
    console.log("Old users cleared");

    const users = [];

    for (let i = 1; i <= 20; i++) {
      const skills = skillsPool[i % skillsPool.length];
      const interests = interestsPool[i % interestsPool.length];
      const role = roles[i % roles.length];

      const matchProfileText = `
        ${skills.join(" ")}
        ${interests.join(" ")}
        ${role}
        Aspiring Innovator CampusStart
      `;

      users.push({
        username: `testuser${i}`,
        email: `test${i}@gmail.com`,
        password: "1111", // 🔐 auto-hashed by schema
        profileName: `Test User ${i}`,
        instituteName: "CampusStart University",
        department: "CSE",
        skills,
        interests,
        role,
        headline: "Building the future with CampusStart 🚀",
        matchProfileText,
      });
    }

    await User.insertMany(users);
    console.log("✅ 20 Dummy Users Inserted Successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

createUsers();
