import {
  Dialog,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useState, useRef } from "react";

const colors = [
  "#4f46e5",
  "#7c3aed",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#14b8a6"
];

export default function CreateStoryModal({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const [bg, setBg] = useState(colors[0]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("text"); // "text" or "image"
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setMode("image");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMode("text");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    removeImage();
    setText("");
    setBg(colors[0]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!text && !imagePreview) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("text", text);
      formData.append("background", bg);
      
      if (imageFile) {
        formData.append("media", imageFile);
      }

      await onSubmit(formData);
      handleClose();
    } catch (err) {
      console.error("Failed to create story:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(10px)"
        }
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          color: "#fff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2 }} variant="h6" fontWeight={600}>
            Create Story
          </Typography>
        </Box>
        
        {mode === "image" && imagePreview && (
          <IconButton onClick={removeImage} sx={{ color: "#fff" }}>
            <DeleteRoundedIcon />
          </IconButton>
        )}
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 400 },
            maxWidth: 400,
            height: { xs: "calc(100vh - 250px)", sm: 600 },
            maxHeight: 600,
            bgcolor: mode === "image" ? "#000" : bg,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
          }}
        >
          {/* IMAGE MODE */}
          {mode === "image" && imagePreview ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <img
                src={imagePreview}
                alt="Story preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block"
                }}
              />
              
              {/* Text overlay for image mode */}
              {text && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 500,
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            /* TEXT MODE */
            <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
              <TextField
                placeholder="What's on your mind?"
                multiline
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: 500,
                    "& textarea": {
                      textAlign: "center"
                    }
                  }
                }}
                variant="standard"
                sx={{ flex: 1 }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* CONTROLS */}
      <Box
        sx={{
          p: 3,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Box sx={{ maxWidth: 400, mx: "auto" }}>
          {/* Color Picker - Only show in text mode */}
          {mode === "text" && (
            <Stack direction="row" spacing={1.5} mb={3} justifyContent="center">
              {colors.map((c) => (
                <Box
                  key={c}
                  onClick={() => setBg(c)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: c,
                    cursor: "pointer",
                    border: bg === c ? "3px solid #fff" : "2px solid rgba(255, 255, 255, 0.3)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                    }
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Caption Input - Show in image mode */}
          {mode === "image" && (
            <TextField
              fullWidth
              placeholder="Add a caption..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)"
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea"
                  }
                }
              }}
            />
          )}

          {/* Mode Buttons */}
          <Stack direction="row" spacing={2} mb={2}>
            <Button
              fullWidth
              startIcon={<TextFieldsIcon />}
              variant="contained"
              onClick={() => {
                setMode("text");
                removeImage();
              }}
              sx={{
                bgcolor: mode === "text" ? "#fff" : "rgba(255, 255, 255, 0.2)",
                color: mode === "text" ? "#000" : "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: mode === "text" ? "#f0f0f0" : "rgba(255, 255, 255, 0.3)"
                }
              }}
            >
              Text
            </Button>
            <Button
              fullWidth
              component="label"
              startIcon={<ImageIcon />}
              variant="contained"
              sx={{
                bgcolor: mode === "image" ? "#fff" : "rgba(255, 255, 255, 0.2)",
                color: mode === "image" ? "#000" : "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: mode === "image" ? "#f0f0f0" : "rgba(255, 255, 255, 0.3)"
                }
              }}
            >
              Photo / Video
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={handleImageSelect}
              />
            </Button>
          </Stack>

          {/* Create Button */}
          <Button
            fullWidth
            size="large"
            disabled={(!text && !imagePreview) || submitting}
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.5,
              fontSize: 16,
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                boxShadow: "0 12px 28px rgba(102, 126, 234, 0.5)"
              },
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
                boxShadow: "none"
              }
            }}
          >
            {submitting ? "Sharing..." : "Share Story"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}