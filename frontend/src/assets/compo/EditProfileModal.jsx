import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  MenuItem,
  CircularProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import API from "../../api/axiosConfig"; // ✅ same axios instance used in Signup

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 720,
  borderRadius: "20px",
  backdropFilter: "blur(18px)",
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
  p: 4,
  overflowY: "auto",
  maxHeight: "90vh",
};

const steps = ["Basic Info", "Academic", "Professional", "Social Links", "Finish"];

const EditProfileModal = ({ open, handleClose }) => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open) fetchUserProfile();
  }, [open]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/profile/me"); // ✅ correct API call
      setFormData(res.data.user);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      alert(error.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await API.put("/profile/update", formData); // ✅ use profile route
      setUser(res.data.user);
      handleClose();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  if (loading)
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle} display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      </Modal>
    );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
         Edit Profile
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          {/* Step 0 - Basic Info */}
          {activeStep === 0 && (
            <motion.div key="basic" {...slideVariants} transition={{ duration: 0.3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Profile Name" name="profileName" fullWidth value={formData.profileName || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" name="email" fullWidth value={formData.email || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Phone" name="phone" fullWidth value={formData.phone || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Gender" name="gender" select fullWidth value={formData.gender || "Other"} onChange={handleChange}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Date of Birth"
                    name="DOB"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.DOB ? formData.DOB.slice(0, 10) : ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Step 1 - Academic */}
          {activeStep === 1 && (
            <motion.div key="academic" {...slideVariants} transition={{ duration: 0.3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Institute" name="instituteName" fullWidth value={formData.instituteName || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Department" name="department" fullWidth value={formData.department || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Enrollment No" name="enroll" fullWidth value={formData.enroll || ""} onChange={handleChange} />
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Step 2 - Professional */}
          {activeStep === 2 && (
            <motion.div key="professional" {...slideVariants} transition={{ duration: 0.3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Headline" name="headline" fullWidth value={formData.headline || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Role" name="role" select fullWidth value={formData.role || "Other"} onChange={handleChange}>
                    {["Founder", "Developer", "Designer", "Marketer", "Researcher", "Investor", "Other"].map((r) => (
                      <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Skills (comma separated)"
                    fullWidth
                    value={formData.skills?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value.split(",").map((s) => s.trim()) })
                    }
                  />
                  <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                    {formData.skills?.map((skill, i) => <Chip key={i} label={skill} color="primary" variant="outlined" />)}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Interests (comma separated)"
                    fullWidth
                    value={formData.interests?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, interests: e.target.value.split(",").map((i) => i.trim()) })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    name="bio"
                    multiline
                    minRows={3}
                    fullWidth
                    value={formData.bio || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Step 3 - Social Links */}
          {activeStep === 3 && (
            <motion.div key="social" {...slideVariants} transition={{ duration: 0.3 }}>
              <Grid container spacing={2}>
                {["website", "linkedin", "github", "portfolio"].map((field) => (
                  <Grid item xs={12} key={field}>
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      fullWidth
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* Step 4 - Review */}
          {activeStep === 4 && (
            <motion.div key="finish" {...slideVariants} transition={{ duration: 0.3, ease: "easeInOut" }}>
              <Box textAlign="center">
                <Avatar src={formData.dp} sx={{ width: 80, height: 80, mb: 2, mx: "auto" }} />
                <Typography variant="h6">{formData.profileName || "Unnamed"}</Typography>
                <Typography variant="body2" color="text.secondary">{formData.headline}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>✅ Review your details and click Save.</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
