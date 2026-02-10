 
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import API from "../api/axiosConfig";
import PostCards from "../assets/compo/PostCards";  

import { useUser } from "../context/UserContext";
import PostCardOnly from "../assets/compo/PostCardOnly";  

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
 
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
     
      <Box>
       
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(post, null, 2)}</pre>
      </Box>
    </Container>
  );
};

export default PostView;
