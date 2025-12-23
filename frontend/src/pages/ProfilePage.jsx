import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  Grid,
  Button,
  Skeleton,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { useUser } from "../context/UserContext";
import EditProfileModal from "../assets/compo/EditProfileModal";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: loggedInUser } = useUser();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  const isOwner = loggedInUser?._id === userId;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await API.get(`/profile/user/${userId}`);
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await API.get(`/posts/user/${userId}`);
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [userId]);

  if (loadingProfile) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Skeleton variant="text" width={150} height={30} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!profile) return <Typography>User not found.</Typography>;

  const displayedSkills = profile.skills?.slice(0, 5) || [];
  const remainingSkills = (profile.skills?.length || 0) - displayedSkills.length;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, maxWidth: 900, mx: "auto" }}>
      {/* Profile Header */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={profile.dp || "/default_dp.png"}
              sx={{ width: isMobile ? 70 : 100, height: isMobile ? 70 : 100 }}
            />
          </Grid>

          <Grid item xs>
            <Typography variant="h6" fontWeight={600}>
              {profile.profileName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {profile.headline}
            </Typography>

            {/* Skills */}
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {displayedSkills.map((skill, i) => (
                <Chip key={i} label={skill} size="small" variant="outlined" />
              ))}
              {remainingSkills > 0 && (
                <Chip label={`+${remainingSkills}`} size="small" variant="outlined" />
              )}
            </Box>

            {profile.bio && <Typography sx={{ mt: 1 }}>{profile.bio}</Typography>}

            {/* Links */}
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {profile.website && <Button href={profile.website} target="_blank" size="small">Website</Button>}
              {profile.linkedin && <Button href={profile.linkedin} target="_blank" size="small">LinkedIn</Button>}
              {profile.github && <Button href={profile.github} target="_blank" size="small">GitHub</Button>}
              {profile.portfolio && <Button href={profile.portfolio} target="_blank" size="small">Portfolio</Button>}
            </Box>

            {/* Buttons */}
            <Box sx={{ mt: 1 }}>
              {isOwner ? (
                <Button variant="contained" onClick={() => setOpenEdit(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined">Collab</Button>
                  <Button variant="outlined">Inspire</Button>
                </Box>
              )}
              <EditProfileModal open={openEdit} handleClose={() => setOpenEdit(false)} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Posts */}
      <Box>
        {loadingPosts ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={isMobile ? 200 : 300}
              sx={{ mb: 3, borderRadius: 2 }}
            />
          ))
        ) : posts.length === 0 ? (
          <Typography>No posts yet.</Typography>
        ) : (
          posts.map((post) => {
            const likes = Array.isArray(post.likes) ? post.likes : [];
            const comments = Array.isArray(post.comments) ? post.comments : [];
            const isLiked = loggedInUser && likes.includes(loggedInUser._id);

            return (
              <Paper key={post._id} sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Avatar src={post.author?.dp || "/default_dp.png"} />
                  </Grid>

                  <Grid item xs>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {post.author?.profileName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleString()}
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>{post.content}</Typography>

                    {post.media?.map((m, i) =>
                      m.type === "image" ? (
                        <Box key={i} component="img" src={m.url} sx={{ width: "100%", mt: 1, borderRadius: 2 }} />
                      ) : (
                        <Box key={i} component="video" controls src={m.url} sx={{ width: "100%", mt: 1, borderRadius: 2 }} />
                      )
                    )}

                    {/* Likes / Comments */}
                    <Box sx={{ mt: 1, display: "flex", gap: 1, alignItems: "center" }}>
                      <IconButton>
                        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <Typography>{likes.length}</Typography>

                      <IconButton>
                        <CommentIcon />
                      </IconButton>
                      <Typography>{comments.length}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
