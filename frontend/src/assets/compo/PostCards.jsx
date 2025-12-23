import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  Grid,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import API from "../../api/axiosConfig";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const PostCards = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const dataPosts = res.data.posts || res.data || [];

      const normalized = dataPosts.map((p) => ({
        ...p,
        likes: Array.isArray(p.likes) ? p.likes : [],
        comments: Array.isArray(p.comments) ? p.comments : [],
      }));

      setPosts(normalized);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const updatePostInState = (postId, patch) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...patch } : p))
    );
  };

  // ---- LIKE FUNCTION ----
  const handleToggleLike = async (post) => {
  const token = localStorage.getItem("token");
  const uid = user?._id?.toString();
  if (!uid) return;

  const originalLikes = post.likes || [];
  const isLiked = originalLikes.includes(uid);

  const updatedLikes = isLiked
    ? originalLikes.filter((id) => id !== uid)
    : [...originalLikes, uid];

  // optimistic UI
  updatePostInState(post._id, { likes: updatedLikes });

  try {
    const res = await API.put(
      `/posts/like/${post._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // sync with backend truth
    if (res.data?.post?.likes) {
      updatePostInState(post._id, { likes: res.data.post.likes });
    }
  } catch (err) {
    console.error("Like error:", err);
    updatePostInState(post._id, { likes: originalLikes });
  }
 };


  // ---- COMMENT FUNCTION ----
  const handleAddComment = async (
    postId,
    text,
    setLocalLoading,
    clearInput
  ) => {
    if (!text.trim()) return;

    setLocalLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await API.post(
        `/posts/${postId}/comment`,
        { text },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      const returnedComments = res.data.comments || [];
      updatePostInState(postId, { comments: returnedComments });
      clearInput();
    } catch (err) {
      console.error("Add comment error:", err);
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

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!posts.length)
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        No posts yet.
      </Typography>
    );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 1, sm: 2, md: 6 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onToggleLike={() => handleToggleLike(post)}
            onAddComment={handleAddComment}
            onShare={() => handleShare(post._id)}
            currentUser={user}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PostCards;

/* ----------------------- PostCard ----------------------- */

const PostCard = ({
  post,
  currentUser,
  onToggleLike,
  onAddComment,
  onShare,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [commentText, setCommentText] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showComments, setShowComments] = useState(false); // ⭐ NEW STATE FOR TOGGLE

  const likesArr = post.likes || [];
  const commentsArr = post.comments || [];

  const uid = (currentUser?._id || currentUser?.id)?.toString();
// const uid = currentUser?._id?.toString();
const isLiked = uid && likesArr.includes(uid);


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ marginBottom: 16 }}
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.25, sm: 1.5 },
        }}
      >
        {/* ---------------- Header ---------------- */}
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Avatar
              src={post.author?.dp || "/default_dp.png"}
              sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
            />
          </Grid>

          <Grid item xs>
            <Typography
              component={RouterLink}
              to={`/profile/${post.author?._id}`}
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontWeight: 700,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {post.author?.username}
            </Typography>
|
            <Typography variant="caption" color="text.secondary">
            
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item>
            <Tooltip title="Open post link">
              <IconButton
                size="small"
                onClick={() =>
                  window.open(
                    `${window.location.origin}/posts/${post._id}`,
                    "_blank"
                  )
                }
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        {/* ---------------- Content ---------------- */}
        <Box mt={1}>
          <Typography variant="body1">{post.content}</Typography>

          {post.media?.map((m, i) =>
            m.type === "image" ? (
              <Box
                key={i}
                component="img"
                src={m.url}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  mt: 1,
                  maxHeight: 600,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                key={i}
                component="video"
                src={m.url}
                controls
                sx={{ width: "100%", borderRadius: 2, mt: 1 }}
              />
            )
          )}
        </Box>

        {/* ---------------- Actions ---------------- */}
        <Box mt={1} display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onToggleLike}>
            {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography>{likesArr.length}</Typography>

          {/* ⭐ COMMENT TOGGLE BUTTON */}
          <IconButton onClick={() => setShowComments((prev) => !prev)}>
            <CommentIcon />
          </IconButton>
          <Typography>{commentsArr.length}</Typography>

          <Box flex={1} />

          <Tooltip title="Share to WhatsApp">
            <IconButton onClick={onShare}>
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ---------------- Comments Section (toggleable) ---------------- */}
        {showComments && (
          <Box mt={2} borderTop={`1px solid ${theme.palette.divider}`} pt={1}>
            {commentsArr.length === 0 ? (
              <Typography color="text.secondary">No comments yet</Typography>
            ) : (
              <Box
                maxHeight={220}
                sx={{ overflowY: "auto", pr: 1 }}
                display="flex"
                flexDirection="column"
                gap={1}
              >
                {commentsArr.map((c) => (
                  <Box key={c._id} display="flex" gap={1}>
                    <Avatar
                      src={c.user?.dp || "/default_dp.png"}
                      sx={{ width: 34, height: 34 }}
                    />
                    <Box
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "grey.100",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.75,
                        flex: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        {c.user?.username}
                      </Typography>
                      <Typography variant="body2">{c.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {currentUser ? (
              <Box display="flex" gap={1} mt={1}>
                <Avatar
                  src={currentUser.dp || "/default_dp.png"}
                  sx={{ width: 36, height: 36 }}
                />

                <TextField
                  size="small"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  fullWidth
                />

                <Button
                  variant="contained"
                  disabled={localLoading}
                  onClick={() =>
                    onAddComment(
                      post._id,
                      commentText,
                      setLocalLoading,
                      () => setCommentText("")
                    )
                  }
                >
                  {localLoading ? "..." : "Post"}
                </Button>
              </Box>
            ) : (
              <Typography mt={1} color="text.secondary">
                Login to comment
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};
