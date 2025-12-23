import React, { useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import EditProfileModal from "../assets/compo/EditProfileModal";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user, loading } = useUser();
  const [openEdit, setOpenEdit] = useState(false);

  const recentActivity = [
    {
      id: 1,
      text: "Sarah commented on your idea",
      time: "2 hours ago",
      avatar: "https://api.multiavatar.com/sarah.svg",
    },
    {
      id: 2,
      text: "New match: David (Developer)",
      time: "5 hours ago",
      avatar: "https://api.multiavatar.com/david.svg",
    },
    {
      id: 3,
      text: "Investor viewed your profile",
      time: "1 day ago",
      avatar: "https://api.multiavatar.com/investor.svg",
    },
  ];

  // ✅ 1️⃣ Wait while fetching user (prevents rendering before data arrives)
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  // ✅ 2️⃣ Guard in case user is not logged in
  if (!user)
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">
          User not found. Please <RouterLink to="/login">login</RouterLink>.
        </Typography>
      </Box>
    );

  // ✅ 3️⃣ Main dashboard content
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome back, {user?.name?.split(" ")[0] || "Innovator"}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your startup journey today.
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    icon: (
                      <TipsAndUpdatesIcon fontSize="large" color="primary" />
                    ),
                    label: "New Idea",
                    link: "/dashboard/ai-brainstormer",
                    color: "primary",
                  },
                  {
                    icon: <PeopleIcon fontSize="large" color="secondary" />,
                    label: "Find Peers",
                    link: "/dashboard/community",
                    color: "secondary",
                  },
                  {
                    icon: <TrendingUpIcon fontSize="large" color="success" />,
                    label: "Pitch Now",
                    link: "/dashboard/investor-connect",
                    color: "success",
                  },
                ].map((action, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Button
                      component={RouterLink}
                      to={action.link}
                      variant="outlined"
                      fullWidth
                      sx={{
                        py: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        borderStyle: "dashed",
                        "&:hover": {
                          borderStyle: "solid",
                          bgcolor: `${action.color}.light`,
                          color: "white",
                          borderColor: `${action.color}.main`,
                        },
                      }}
                    >
                      {action.icon}
                      <Typography variant="button">{action.label}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                textAlign: "center",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={`https://api.multiavatar.com/${user?.email || "user"}.svg`}
                  sx={{ width: 70, height: 70, mb: 1.5 }}
                />

                {/* ✅ Safe check to avoid undefined route before user is ready */}
{user?.id || user?._id ? (
  <Typography
    variant="subtitle1"
    sx={{ fontWeight: 600, cursor: "pointer", mb: 1 }}
    component={RouterLink}
    to={`/dashboard/profile/${user.id || user._id}`}
  >
    {user?.username || "Alex Johnson"}
  </Typography>
) : (
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 600,
      color: "text.secondary",
      mb: 1,
    }}
  >
    {user?.username || "Alex Johnson"}
  </Typography>
)}


                <Box
                  sx={{
                    my: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  {user.skills?.slice(0, 5).map((skill, i) => (
                    <Chip
                      key={i}
                      label={skill}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {user.skills?.length > 5 && (
                    <Chip
                      label={`+${user.skills.length - 5}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenEdit(true)}
                >
                  Edit Profile
                </Button>
                <EditProfileModal
                  open={openEdit}
                  handleClose={() => setOpenEdit(false)}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Paper
              sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden" }}
            >
              <Box sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
              </Box>
              <Divider />
              <Box>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2.5,
                      py: 1.5,
                    }}
                  >
                    <Avatar
                      src={activity.avatar}
                      sx={{ mr: 2, width: 36, height: 36 }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Divider />
              <Box sx={{ p: 1.5, textAlign: "center" }}>
                <Button size="small">View All Activity</Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard;
