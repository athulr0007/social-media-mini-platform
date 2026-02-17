import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Paper,
  useMediaQuery,
  useTheme
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const socket = io("http://localhost:5000");

export default function Messages() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversation();
    loadMessages();

    socket.emit("join:conversation", id);

    socket.on("message:new", (msg) => {
      setMessages((m) => [...m, msg]);
    });

    return () => {
      socket.off("message:new");
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const res = await API.get("/conversations");
      const convo = res.data.find((c) => c._id === id);
      if (convo) {
        const other = convo.participants.find((p) => p._id !== user._id);
        setOtherUser(other);
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await API.get(`/messages/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("message:send", {
      conversationId: id,
      senderId: user._id,
      text
    });

    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box 
      sx={{ 
        height: isMobile ? "calc(100vh - 70px)" : "100vh",
        display: "flex", 
        flexDirection: "column",
bgcolor: "background.default"
      }}
    >
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{ 
          p: 2, 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
bgcolor: "background.paper",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
borderBottom: "1px solid",
borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}
      >
        <IconButton 
          onClick={() => navigate("/inbox")}
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "rgba(102, 126, 234, 0.1)",
              transform: "scale(1.05)"
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Avatar
          src={otherUser?.avatar ? `http://localhost:5000${otherUser.avatar}` : undefined}
          sx={{ 
            width: 44, 
            height: 44,
            border: "2px solid rgba(102, 126, 234, 0.2)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
        >
          {!otherUser?.avatar && (otherUser?.name?.[0] || "?")}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {otherUser?.name || "Loading..."}
          </Typography>
          {otherUser?.username && (
            <Typography variant="caption" color="text.secondary">
              @{otherUser.username}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* MESSAGES */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: "auto", 
          p: 3,
bgcolor: "background.default"
        }}
      >
        {messages.length === 0 ? (
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              height: "100%"
            }}
          >
            <Typography color="text.secondary" textAlign="center">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === user._id || msg.sender._id === user._id;

            return (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  mb: 1.5,
                  animation: "fadeIn 0.3s ease-in"
                }}
              >
                {!isMe && (
                  <Avatar
                    src={otherUser?.avatar ? `http://localhost:5000${otherUser.avatar}` : undefined}
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      mt: "auto"
                    }}
                  >
                    {!otherUser?.avatar && (otherUser?.name?.[0] || "?")}
                  </Avatar>
                )}
                
                <Paper
                  sx={{
                    p: 1.5,
                    px: 2,
                    maxWidth: "70%",
                   background: isMe
  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  : theme.palette.mode === "dark"
    ? "rgba(255,255,255,0.06)"
    : theme.palette.background.paper,

                    backdropFilter: "blur(10px)",
color: isMe ? "#fff" : theme.palette.text.primary,
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    boxShadow: isMe
                      ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                      : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    wordBreak: "break-word",
                    position: "relative",
border: isMe ? "none" : "1px solid",
borderColor: isMe ? "transparent" : "divider"
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      color: isMe ? "#fff" : "text.primary"
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Paper>

                {isMe && (
                  <Avatar
                    src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      ml: 1,
                      mt: "auto"
                    }}
                  >
                    {!user?.avatar && (user?.name?.[0] || "U")}
                  </Avatar>
                )}
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
bgcolor: "background.paper",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
borderTop: "1px solid",
borderColor: "divider",
          boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.04)"
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
  "& .MuiOutlinedInput-root": {
    bgcolor: "background.default",
    borderRadius: 3,
    transition: "all 0.3s ease",
    color: "text.primary",
    "& fieldset": {
      borderColor: "divider"
    },
    "&:hover fieldset": {
      borderColor: "primary.main"
    },
    "&.Mui-focused": {
      bgcolor: "background.paper",
      "& fieldset": {
        borderColor: "primary.main"
      }
    }
  },
  "& .MuiInputBase-input": {
    color: "text.primary"
  },
  "& .MuiInputBase-input::placeholder": {
    color: "text.secondary",
    opacity: 1
  }
}}

          />
          <IconButton
            onClick={sendMessage}
            disabled={!text.trim()}
            sx={{
              width: 48,
              height: 48,
              background: text.trim() 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "rgba(0, 0, 0, 0.1)",
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                background: text.trim()
                  ? "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)"
                  : "rgba(0, 0, 0, 0.15)",
                transform: text.trim() ? "scale(1.05)" : "none",
                boxShadow: text.trim() ? "0 6px 16px rgba(102, 126, 234, 0.4)" : "none"
              },
              "&:disabled": {
                background: "rgba(0, 0, 0, 0.1)",
                color: "rgba(255, 255, 255, 0.5)"
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Paper>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
}