import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";

import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";

export default function CreatePost() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles).slice(0, 5 - files.length);
    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      file
    }));

    setFiles([...files, ...newFiles]);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(previews[index].url);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const submitPost = async () => {
    if (!caption.trim() && files.length === 0) return;

    try {
      setLoading(true);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("media", file); // Changed from "images" to "media"
      });
      formData.append("content", caption);

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Cleanup URLs
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));

      navigate("/");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        py: isMobile ? 2 : 3,
        pt: isMobile ? "70px" : 3,
        pb: isMobile ? 10 : 3
      }}
    >
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <IconButton onClick={() => navigate("/")}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            Create post
          </Typography>
        </Stack>

        <Card sx={{ p: isMobile ? 2 : 3, borderRadius: 3 }}>
          {/* MEDIA PREVIEWS */}
          {previews.length > 0 && (
            <Box
              sx={{
                mb: 3,
                display: "grid",
                gridTemplateColumns: previews.length === 1 ? "1fr" : "repeat(2, 1fr)",
                gap: 2
              }}
            >
              {previews.map((preview, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.default",
                    aspectRatio: previews.length === 1 ? "auto" : "1/1"
                  }}
                >
                  <IconButton
                    onClick={() => removeFile(index)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      zIndex: 2,
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" }
                    }}
                    size="small"
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>

                  {/* Video badge */}
                  {preview.type === "video" && (
                    <Chip
                      icon={<PlayCircleOutlineRoundedIcon />}
                      label="Video"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 2,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff"
                      }}
                    />
                  )}

                  {preview.type === "image" ? (
                    <img
                      src={preview.url}
                      alt={`preview-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: previews.length === 1 ? "contain" : "cover",
                        maxHeight: previews.length === 1 ? 400 : "auto"
                      }}
                    />
                  ) : (
                    <video
                      src={preview.url}
                      controls
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: previews.length === 1 ? "contain" : "cover",
                        maxHeight: previews.length === 1 ? 400 : "auto"
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* UPLOAD BUTTONS */}
          {previews.length < 5 && (
            <Stack direction={isMobile ? "column" : "row"} spacing={2} mb={3}>
              <Button
                component="label"
                fullWidth
                variant="outlined"
                startIcon={<ImageRoundedIcon />}
                sx={{
                  py: isMobile ? 2 : 3,
                  borderStyle: "dashed",
                  borderWidth: 2
                }}
              >
                Add Photo{previews.length > 0 && "s"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </Button>

              <Button
                component="label"
                fullWidth
                variant="outlined"
                startIcon={<VideoLibraryRoundedIcon />}
                sx={{
                  py: isMobile ? 2 : 3,
                  borderStyle: "dashed",
                  borderWidth: 2
                }}
              >
                Add Video{previews.length > 0 && "s"}
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </Button>
            </Stack>
          )}

          {previews.length >= 5 && (
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mb={2}>
              Maximum 5 files reached
            </Typography>
          )}

          <TextField
            placeholder="Write a caption..."
            multiline
            minRows={4}
            fullWidth
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            inputProps={{ maxLength: 2200 }}
            sx={{ mb: 1 }}
          />

          <Typography variant="caption" color="text.secondary" textAlign="right" display="block" mb={3}>
            {caption.length}/2200
          </Typography>

          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={loading || (!caption.trim() && files.length === 0)}
            onClick={submitPost}
            sx={{
              py: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)"
              }
            }}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Card>
      </Box>
    </Box>
  );
}