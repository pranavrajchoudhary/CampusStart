import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";

import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axiosConfig";
import { useUser } from "../../context/UserContext";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const [mediaFiles, setMediaFiles] = useState([]);       // Cloudinary URLs
  const [mediaPreview, setMediaPreview] = useState([]);   // Local previews

  const [uploading, setUploading] = useState(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  // ----------------------------------------------------
  // RESET FORM
  // ----------------------------------------------------
  const reset = () => {
    setContent("");
    setMediaFiles([]);
    setMediaPreview([]);
    setUploading(false);
    setOpen(false);
  };

  // ----------------------------------------------------
  // CLOUDINARY UPLOAD
  // ----------------------------------------------------
  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedMedia = [];
      const previews = [];

      for (let file of files) {
        previews.push(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_preset_here");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload",
          { method: "POST", body: formData }
        );

        const data = await res.json();

        uploadedMedia.push({
          url: data.secure_url,
          type: data.resource_type,
        });
      }

      setMediaPreview((prev) => [...prev, ...previews]);
      setMediaFiles((prev) => [...prev, ...uploadedMedia]);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    setUploading(false);
  };

  // ----------------------------------------------------
  // CREATE POST
  // ----------------------------------------------------
  const handleCreatePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/posts/create",
        {
          content,
          media: mediaFiles,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onPostCreated();
      reset();
    } catch (err) {
      console.error("Post create error:", err);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{ borderRadius: 3, p: 2, mb: 3 }}
    >
      {/* --------- Collapsed Bar --------- */}
      {!open && (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={user?.dp} />

          <Paper
            elevation={1}
            onClick={toggleOpen}
            sx={{
              flex: 1,
              p: 1.3,
              borderRadius: 3,
              cursor: "pointer",
              color: "text.secondary",
            }}
          >
            Start a post…
          </Paper>
        </Box>
      )}

      {/* --------- Expanded Composer --------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
              <Avatar src={user?.dp} />

              <Box flex={1}>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                {/* -------- Previews -------- */}
                {mediaPreview.length > 0 && (
                  <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                    {mediaPreview.map((src, i) => (
                      <Box
                        key={i}
                        sx={{
                          position: "relative",
                          width: 120,
                          height: 120,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={src}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        <IconButton
                          size="small"
                          onClick={() => {
                            const newPreview = [...mediaPreview];
                            newPreview.splice(i, 1);
                            setMediaPreview(newPreview);

                            const newFiles = [...mediaFiles];
                            newFiles.splice(i, 1);
                            setMediaFiles(newFiles);
                          }}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(0,0,0,0.5)",
                            color: "white",
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* -------- Buttons -------- */}
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {/* Upload */}
                  <Box>
                    <input
                      type="file"
                      hidden
                      id="upload-media"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                    />

                    <label htmlFor="upload-media">
                      <IconButton component="span">
                        <ImageIcon />
                      </IconButton>
                    </label>
                  </Box>

                  {/* Post / Cancel */}
                  <Box display="flex" gap={1}>
                    <Button color="error" onClick={reset}>
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      disabled={uploading}
                      onClick={handleCreatePost}
                    >
                      {uploading ? <CircularProgress size={20} /> : "Post"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

export default CreatePost;
