require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000, // ⏱️ important
    });

    console.log("✅ MongoDB connected for seeding");

    // 🔥 VERY IMPORTANT: disable buffering
    mongoose.set("bufferCommands", false);

    // await User.deleteMany();
    console.log("🧹 Old users cleared");

    const users = [
      {
        username: "Aarav Sharma",
        email: "test1@gmail.com",
        password: "1111",
        profileName: "Aarav Sharma",
        instituteName: "IIT Delhi",
        department: "CSE",
        skills: ["React", "Node.js", "MongoDB"],
        interests: ["AI", "Startups"],
        role: "Developer",
        headline: "Full-stack dev building scalable student products 🚀",
      },
      {
        username: "Riya Verma",
        email: "test2@gmail.com",
        password: "1111",
        profileName: "Riya Verma",
        instituteName: "BITS Pilani",
        department: "Design",
        skills: ["UI/UX", "Figma", "Product Design"],
        interests: ["EdTech", "Social Impact"],
        role: "Designer",
        headline: "Designing meaningful student-first experiences 🎨",
      },
      {
        username: "Kunal Mehta",
        email: "test3@gmail.com",
        password: "1111",
        profileName: "Kunal Mehta",
        instituteName: "IIM Bangalore",
        department: "Management",
        skills: ["Marketing", "Growth", "SEO"],
        interests: ["Fintech", "Startups"],
        role: "Marketer",
        headline: "Growth & GTM strategist for early-stage startups 📈",
      },
      {
        username: "Ekaashi Gupta",
        email: "test4@gmail.com",
        password: "1111",
        profileName: "Ekaashi Gupta",
        instituteName: "Delhi University",
        department: "Economics",
        skills: ["Research", "Data Analysis", "Excel"],
        interests: ["Policy", "Social Impact"],
        role: "Researcher",
        headline: "Student researcher exploring data-driven impact 📊",
      },
    ];

    await User.insertMany(users, { ordered: true });
    console.log("✅ Users seeded successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
