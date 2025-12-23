const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
 /// Basic Info
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
// Profile Details
  profileName: { type: String, default: "Freshie" },
  instituteName: { type: String, default: "Unknown Institute" },
  department: { type: String, default: "General" },
  enroll: { type: String, default: "N/A" },
  phone: { type: String, default: "" }, // phone should be string to preserve leading 0s
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  DOB: { type: Date },
//Professional Info
  headline: { type: String, default: "Aspiring Innovator" }, // small tagline under name
  skills: [{ type: String }], // array of strings (["UI/UX", "Node.js", "Marketing"])
  interests: [{ type: String }], // e.g., ["AI", "Fintech", "Social Impact"]
  role: { 
    type: String, 
    enum: ["Founder", "Developer", "Designer", "Marketer", "Researcher", "Investor", "Other"], 
    default: "Other" 
  },
  //ML NEED:
  matchProfileText: { type: String },


//  Social / Collaboration
  connections: [{ type: Schema.Types.ObjectId, ref: "User" }], // following or teammates
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }], // link to their startup ideas
  bio: { type: String, maxlength: 250, default: "Let's build something amazing together!" },
  website: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },

 
  dp: { type: String, default: "default_dp.png" }, // profile pic
  banner: { type: String, default: "" }, // cover image (optional)

 //  Platform Specific
  IGA: { type: String, default: "all" }, // unclear field, maybe “Interest Group Area”? Rename accordingly
  ILF: { type: String, default: "all" }, // maybe “I’m Looking For”? keep if used

 
  verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },

 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
// 🔹 Auto-generate matchProfileText for ML & matchmaking
userSchema.pre("save", function (next) {
  // Only update if relevant fields changed OR new user
  if (
    this.isNew ||
    this.isModified("skills") ||
    this.isModified("interests") ||
    this.isModified("role") ||
    this.isModified("headline")
  ) {
    const skillsText = (this.skills || []).join(" ");
    const interestsText = (this.interests || []).join(" ");

    this.matchProfileText = `
      ${skillsText}
      ${interestsText}
      ${this.role || ""}
      ${this.headline || ""}
    `.trim();
  }

  next();
});

userSchema.pre("save", async function (next) {
  const user = this;

 
  if (!user.isModified("password")) return next();

 
  const salt = await bcrypt.genSalt(10);

 
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

 
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);
