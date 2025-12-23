const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const aiAssistantRoutes = require('./routes/aiAssistantRoutes')
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// --- CORS Setup ---
// const allowedOrigins = [
//   'http://localhost:5173',        // your local frontend
//   'https://your-frontend-domain.com'  // your deployed frontend (replace later)
// ];

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
const matchRoutes = require("./routes/matchRoutes");

app.use("/api/match", matchRoutes);
const ideaRoutes = require("./routes/ideaRoutes");
app.use("/api/ideas", ideaRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to CampusStart Backend API',
    status: 'OK',
  });
});

app.use("/api/ai", aiAssistantRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
