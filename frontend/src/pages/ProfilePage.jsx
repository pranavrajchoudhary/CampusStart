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
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import { useUser } from "../context/UserContext";
import EditProfileModal from "../assets/compo/EditProfileModal";

// 🔁 Reuse PostCard (IMPORTANT)
import { motion } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TextField from "@mui/material/TextField";

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

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/user/${userId}`);
        setProfile(res.data.user);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // ---------------- FETCH USER POSTS ONLY ----------------
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await API.get(`/posts/user/${userId}`);
        const data = res.data || [];

        const normalized = data.map((p) => ({
          ...p,
          likes: Array.isArray(p.likes) ? p.likes : [],
          comments: Array.isArray(p.comments) ? p.comments : [],
        }));

        setPosts(normalized);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  // ---------------- STATE UPDATE HELPERS ----------------
  const updatePostInState = (postId, patch) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...patch } : p))
    );
  };

  // ---------------- LIKE ----------------
  const handleToggleLike = async (post) => {
    const uid = loggedInUser?._id?.toString();
    if (!uid) return;

    const originalLikes = post.likes || [];
    const isLiked = originalLikes.includes(uid);

    const updatedLikes = isLiked
      ? originalLikes.filter((id) => id !== uid)
      : [...originalLikes, uid];

    updatePostInState(post._id, { likes: updatedLikes });

    try {
      const res = await API.put(`/posts/like/${post._id}`);
      if (res.data?.post?.likes) {
        updatePostInState(post._id, { likes: res.data.post.likes });
      }
    } catch {
      updatePostInState(post._id, { likes: originalLikes });
    }
  };

  // ---------------- COMMENT ----------------
  const handleAddComment = async (
    postId,
    text,
    setLocalLoading,
    clearInput
  ) => {
    if (!text.trim()) return;

    setLocalLoading(true);
    try {
      const res = await API.post(`/posts/${postId}/comment`, { text });
      updatePostInState(postId, { comments: res.data.comments || [] });
      clearInput();
    } finally {
      setLocalLoading(false);
    }
  };

  const handleShare = (postId) => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(shareUrl).finally(() => {
      const text = encodeURIComponent(`Check this post: ${shareUrl}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    });
  };

  // ---------------- LOADING STATES ----------------
  if (loadingProfile) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Skeleton variant="text" width={200} height={30} sx={{ mt: 1 }} />
      </Box>
    );
  }

  if (!profile) return <Typography>User not found.</Typography>;

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, maxWidth: 900, mx: "auto" }}>
      {/* ---------------- PROFILE HEADER ---------------- */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={profile.dp || "/default_dp.png"}
              sx={{ width: 90, height: 90 }}
            />
          </Grid>

          <Grid item xs>
            <Typography variant="h6" fontWeight={700}>
              {profile.profileName}
            </Typography>
            <Typography color="text.secondary">{profile.headline}</Typography>

            <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
              {profile.skills?.map((s, i) => (
                <Chip key={i} label={s} size="small" />
              ))}
            </Box>

            <Box mt={1}>
            {isOwner ? (
  <Box display="flex" gap={1} mt={1}>
    <Button variant="contained" onClick={() => setOpenEdit(true)}>
      Edit Profile
    </Button>
    <Button variant="outlined" href="/">
      Create Post
    </Button>
  </Box>
) : (
  <Box display="flex" gap={1} mt={1}>
    <Button variant="outlined">Collab</Button>
    <Button variant="outlined">Inspire</Button>
  </Box>
)}

            </Box>

            <EditProfileModal
              open={openEdit}
              handleClose={() => setOpenEdit(false)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ---------------- USER POSTS ---------------- */}
      <Typography variant="h6" mb={2}>
        Posts
      </Typography>

      {loadingPosts ? (
        <Skeleton variant="rectangular" height={200} />
      ) : posts.length === 0 ? (
        <Typography color="text.secondary">No posts yet.</Typography>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={loggedInUser}
            onToggleLike={() => handleToggleLike(post)}
            onAddComment={handleAddComment}
            onShare={() => handleShare(post._id)}
          />
        ))
      )}
    </Box>
  );
};

export default ProfilePage;

/* ======================= POST CARD ======================= */

const PostCard = ({
  post,
  currentUser,
  onToggleLike,
  onAddComment,
  onShare,
}) => {
  const theme = useTheme();
  const [commentText, setCommentText] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const likesArr = post.likes || [];
  const commentsArr = post.comments || [];
  const uid = currentUser?._id?.toString();
  const isLiked = uid && likesArr.includes(uid);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography fontWeight={600}>{post.author?.profileName}</Typography>
        <Typography color="text.secondary" variant="caption">
          {new Date(post.createdAt).toLocaleString()}
        </Typography>

        <Typography mt={1}>{post.content}</Typography>

        <Box mt={1} display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onToggleLike}>
            {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography>{likesArr.length}</Typography>

          <IconButton onClick={() => setShowComments((p) => !p)}>
            <CommentIcon />
          </IconButton>
          <Typography>{commentsArr.length}</Typography>

          <Box flex={1} />

          <IconButton onClick={onShare}>
            <WhatsAppIcon />
          </IconButton>
        </Box>

        {showComments && (
          <Box mt={2}>
            {commentsArr.map((c) => (
              <Typography key={c._id} variant="body2">
                <b>{c.user?.username}:</b> {c.text}
              </Typography>
            ))}

            {currentUser && (
              <Box display="flex" gap={1} mt={1}>
                <TextField
                  size="small"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  fullWidth
                />
                <Button
                  onClick={() =>
                    onAddComment(
                      post._id,
                      commentText,
                      setLocalLoading,
                      () => setCommentText("")
                    )
                  }
                  disabled={localLoading}
                >
                  Post
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};
