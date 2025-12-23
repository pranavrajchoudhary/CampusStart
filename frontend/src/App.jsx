import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./utils/ProtectedRoute";

// Layouts
import MainLayout from './assets/compo/MainLayout';
import DashboardLayout from './assets/compo/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from './pages/ProfilePage';
import SmartMatchmaking from "./pages/SmartMatchmaking";
// Dashboard (Protected) Pages
import Dashboard from './pages/Dashboard';
import AIView from './pages/AIView';
import CommunityView from './pages/CommunityView';
import InvestorView from './pages/InvestorView';
import NewsView from './pages/NewsView';

function App() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/smart-matchmaking" element={<SmartMatchmaking />} />

        <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Single public profile route */}
      </Route>

      {/* Protected Dashboard Routes */}
      {/* Protected Dashboard Routes */}
<Route
  path="/dashboard/*"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="ai-brainstormer" element={<AIView />} />
  <Route path="community" element={<CommunityView />} />
  <Route path="investor-connect" element={<InvestorView />} />
  <Route path="news-trends" element={<NewsView />} />
          <Route path="smart-matchmaking" element={<SmartMatchmaking />} />

  {/* Nested profile page inside dashboard */}
  <Route path="profile/:userId" element={<ProfilePage />} />
</Route>


      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
