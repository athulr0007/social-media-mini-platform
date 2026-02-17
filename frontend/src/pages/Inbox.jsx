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
  Stack
} from "@mui/material";

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

  if (loading) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", py: 3 }}>
        <Stack spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={80} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 3 }}>
      <Typography variant="h5" mb={3}>
        Messages
      </Typography>

      {convos.length === 0 ? (
        <Typography color="text.secondary">
          No conversations yet. Follow someone mutually to start chatting.
        </Typography>
      ) : (
<List
  sx={{
    bgcolor: "background.paper",
    borderRadius: 2
  }}
>
          {convos.map((convo) => {
            const other = convo.participants.find((p) => p._id !== user._id);

            return (
              <ListItem
                key={convo._id}
                button
                onClick={() => navigate(`/messages/${convo._id}`)}
                sx={{
borderBottom: "1px solid",
borderColor: "divider",
                  "&:last-child": { borderBottom: "none" }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={other?.avatar ? `http://localhost:5000${other.avatar}` : undefined}
                  >
                    {!other?.avatar && (other?.name?.[0] || "?")}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={other?.name || "Unknown User"}
                  secondary="Click to open conversation"
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
