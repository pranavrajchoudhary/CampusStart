// src/pages/PostView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import API from "../api/axiosConfig";
import PostCards from "../assets/compo/PostCards"; // PostCards file exports PostCard internally; we'll fetch single and render same layout

import { useUser } from "../context/UserContext";
import PostCardOnly from "../assets/compo/PostCardOnly"; // optional (see note)

const PostView = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOne = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/posts/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      setPost(res.data.post || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
  }, [id]);

  if (loading) return <Box textAlign="center" py={6}><CircularProgress /></Box>;
  if (!post) return <Typography textAlign="center">Post not found</Typography>;

  // We don't have a separate exported PostCard component in this RTP, so render a minimal post view using same structure:
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* You can either render a PostCard re-used (if you extract the subcomponent),
          or simple markup using the same layout. For speed, let's reuse the PostCard
          subcomponent from PostCards file if you export it there. */}
      <Box>
        {/* If you exported a named PostCard component, import and use it:
            <PostCard post={post} currentUser={user} onToggleLike={...} onAddComment={...} onShare={...} />
            For brevity here, show single post JSON fallback */}
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(post, null, 2)}</pre>
      </Box>
    </Container>
  );
};

export default PostView;
