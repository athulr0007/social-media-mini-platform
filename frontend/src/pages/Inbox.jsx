import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Skeleton,
  Stack,
  Paper,
  Chip,
  Fade,
  IconButton
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";

export default function Inbox() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await API.get("/conversations");
      setConvos(res.data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const startBotChat = async () => {
    try {
      const bot = await API.get("/users/bot");
      const res = await API.post(`/conversations/${bot.data._id}`);
      navigate(`/messages/${res.data._id}`);
    } catch (err) {
      console.error("Failed to start bot chat:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", py: 3, px: 2 }}>
        <Stack spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={80} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 720, 
      mx: "auto", 
      px: 2, 
      py: 4,
      minHeight: "100vh",
      bgcolor: "background.default"
    }}>
      {/* Header */}
      <Fade in timeout={400}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            Messages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {convos.length} conversation{convos.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Fade>

      {/* AI Bot Card */}
      <Fade in timeout={500}>
        <Paper
          onClick={startBotChat}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)"
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
              opacity: 0,
              transition: "opacity 0.3s",
            },
            "&:hover::before": {
              opacity: 1
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "relative", zIndex: 1 }}>
            {/* AI Avatar with glow */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                }}
              >
                <SmartToyIcon sx={{ fontSize: 32, color: "#fff" }} />
              </Avatar>
              
              {/* Pulsing glow effect */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                  filter: "blur(20px)",
                  animation: "pulse 2s ease-in-out infinite",
                  zIndex: -1
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
                  Spark AI Assistant
                </Typography>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: 14, color: "#fff !important" }} />}
                  label="AI"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 22,
                    "& .MuiChip-icon": { ml: 0.5 }
                  }}
                />
              </Box>
              
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mb: 1 }}>
                Ask me anything! I'm here to help 24/7
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {["General Help", "Tips & Tricks", "Features"].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: 24,
                      fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}
                  />
                ))}
              </Box>
            </Box>

            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)",
                  transform: "scale(1.1)"
                }
              }}
            >
              <ChatBubbleRoundedIcon />
            </IconButton>
          </Box>

          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent)",
              filter: "blur(30px)"
            }}
          />
        </Paper>
      </Fade>

      {/* Conversations List */}
      {convos.length === 0 ? (
        <Fade in timeout={600}>
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider"
            }}
          >
            <ChatBubbleRoundedIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" fontWeight={600} mb={1}>
              No conversations yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Follow someone mutually to start chatting or chat with Spark AI above!
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <List disablePadding>
{convos
  .filter(convo => {
    const other = convo.participants.find(p => p._id !== user._id);
    return other?.name !== "Spark AI";
  })
  .map((convo, index) => {
              const other = convo.participants.find((p) => p._id !== user._id);

              return (
                <Fade in timeout={600 + index * 100} key={convo._id}>
                  <ListItem
                    button
                    onClick={() => navigate(`/messages/${convo._id}`)}
                    sx={{
                      py: 2,
                      px: 2.5,
                      borderBottom: index < convos.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateX(4px)"
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={other?.avatar ? `http://localhost:5000${other.avatar}` : undefined}
                        sx={{
                          width: 52,
                          height: 52,
                          border: "2px solid",
                          borderColor: "divider"
                        }}
                      >
                        {!other?.avatar && (other?.name?.[0] || "?")}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={600}>
                          {other?.name || "Unknown User"}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Click to open conversation
                        </Typography>
                      }
                    />
                  </ListItem>
                </Fade>
              );
            })}
          </List>
        </Paper>
      )}

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }
        `}
      </style>
    </Box>
  );
}