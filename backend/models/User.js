const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
 
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
 
  profileName: { type: String, default: "Freshie" },
  instituteName: { type: String, default: "Unknown Institute" },
  department: { type: String, default: "General" },
  enroll: { type: String, default: "N/A" },
  phone: { type: String, default: "" },  
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  DOB: { type: Date },
 
  headline: { type: String, default: "Aspiring Innovator" },  
  skills: [{ type: String }],  
  interests: [{ type: String }],  
  role: { 
    type: String, 
    enum: ["Founder", "Developer", "Designer", "Marketer", "Researcher", "Investor", "Other"], 
    default: "Other" 
  }, 
  matchProfileText: { type: String },


 
  connections: [{ type: Schema.Types.ObjectId, ref: "User" }],  
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],  
  bio: { type: String, maxlength: 250, default: "Let's build something amazing together!" },
  website: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },

 
  dp: { type: String, default: "default_dp.png" },  
  banner: { type: String, default: "" },  

 
  IGA: { type: String, default: "all" },  
  ILF: { type: String, default: "all" },  

 
  verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },

 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
userSchema.pre("save", function (next) {
  if (!this.profileName) {
    this.profileName = this.username;
  }
  next();
});

 
userSchema.pre("save", function (next) {
 
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
