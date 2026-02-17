import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Skeleton,
  Divider,
  IconButton,
  Chip,
  Paper,
  Fade,
  Grow
} from "@mui/material";
import { useActivity } from "../context/ActivityContext";
import { AuthContext } from "../context/AuthContext";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";

const labelMap = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
  message: "sent you a message"
};

const iconMap = {
  like: { icon: <FavoriteRoundedIcon sx={{ fontSize: 14 }} />, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  comment: { icon: <ChatBubbleRoundedIcon sx={{ fontSize: 14 }} />, color: "#667eea", bg: "rgba(102,126,234,0.12)" },
  follow: { icon: <PersonAddRoundedIcon sx={{ fontSize: 14 }} />, color: "#14b8a6", bg: "rgba(20,184,166,0.12)" },
  message: { icon: <MessageRoundedIcon sx={{ fontSize: 14 }} />, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" }
};

const formatTimeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const groupByDate = (activities) => {
  const groups = {};
  activities.forEach((a) => {
    const date = new Date(a.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    let label;
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Yesterday";
    else if (diffDays < 7) label = "This Week";
    else label = "Earlier";
    if (!groups[label]) groups[label] = [];
    groups[label].push(a);
  });
  return groups;
};

export default function Notifications() {
  const navigate = useNavigate();
  const { activities = [], setActivities, loadActivities } = useActivity() || {};
  const { user } = useContext(AuthContext);

  const handleClick = (activity) => {
    if (activity.type === "message") {
      navigate("/inbox");
    } else if (activity.post) {
      navigate("/");
    } else if (activity.type === "follow") {
      navigate(`/profile/${activity.actor?._id}`);
    }
  };

  const clearAll = () => setActivities([]);

  const grouped = groupByDate(activities);
  const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"];

  return (
    <Box sx={{ minHeight: "100vh", pb: 6, bgcolor: "background.default" }}>
      <Box sx={{ maxWidth: 640, width: "100%", mx: "auto", pt: 4, px: 2, boxSizing: "border-box" }}>

        {/* Header */}
        <Fade in timeout={400}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {activities.length} total · stay up to date
              </Typography>
            </Box>

            {activities.length > 0 && (
              <IconButton
                onClick={clearAll}
                sx={{
                  color: "text.secondary",
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  px: 2,
                  gap: 1,
                  "&:hover": { bgcolor: "error.main", color: "#fff" },
                  transition: "all 0.2s"
                }}
              >
                <DeleteSweepRoundedIcon fontSize="small" />
                <Typography variant="caption" fontWeight={600}>Clear all</Typography>
              </IconButton>
            )}
          </Box>
        </Fade>

        {/* Filter chips */}
        {activities.length > 0 && (
          <Fade in timeout={500}>
            <Stack direction="row" spacing={1} mb={3} sx={{ overflowX: "auto", pb: 1 }}>
              {["All", "Likes", "Comments", "Follows", "Messages"].map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    bgcolor: filter === "All" 
                      ? "linear-gradient(135deg, #667eea, #764ba2)"
                      : "action.hover",
                    background: filter === "All"
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : undefined,
                    color: filter === "All" ? "#fff" : "text.secondary",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                />
              ))}
            </Stack>
          </Fade>
        )}

        {/* Empty state */}
        {activities.length === 0 && (
          <Fade in timeout={600}>
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px dashed",
                borderColor: "divider"
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3
                }}
              >
                <NotificationsNoneRoundedIcon sx={{ fontSize: 40, color: "#667eea", opacity: 0.6 }} />
              </Box>
              <Typography variant="h6" fontWeight={700} mb={1}>
                All caught up!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No notifications yet. When someone likes, comments, or follows you, it'll show up here.
              </Typography>
            </Paper>
          </Fade>
        )}

        {/* Grouped notifications */}
        {groupOrder.map((group) => {
          if (!grouped[group]) return null;
          return (
            <Fade in timeout={600} key={group}>
              <Box mb={3}>
                {/* Group label */}
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 1.5,
                    px: 0.5
                  }}
                >
                  {group}
                </Typography>

                <Paper
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider"
                  }}
                >
                  {grouped[group].map((activity, index) => {
                    const typeStyle = iconMap[activity.type] || iconMap.like;

                    return (
                      <Grow in timeout={400 + index * 80} key={activity._id}>
                        <Box>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            onClick={() => handleClick(activity)}
                            sx={{
                              px: 2.5,
                              py: 2,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "action.hover",
                                "& .notification-arrow": { opacity: 1, transform: "translateX(0)" }
                              }
                            }}
                          >
                            {/* Avatar with type badge */}
                            <Box sx={{ position: "relative", flexShrink: 0 }}>
                              <Avatar
                                src={activity.actor?.avatar ? `http://localhost:5000${activity.actor.avatar}` : undefined}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  border: "2px solid",
                                  borderColor: typeStyle.color,
                                  boxShadow: `0 0 12px ${typeStyle.bg}`
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/profile/${activity.actor?._id}`);
                                }}
                              >
                                {!activity.actor?.avatar && (activity.actor?.name?.[0] || "?")}
                              </Avatar>

                              {/* Type icon badge */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: -4,
                                  right: -4,
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  bgcolor: typeStyle.bg,
                                  border: `2px solid`,
                                  borderColor: "background.paper",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: typeStyle.color
                                }}
                              >
                                {typeStyle.icon}
                              </Box>
                            </Box>

                            {/* Text content */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                <span style={{ fontWeight: 700 }}>
                                  {activity.actor?.name || "Unknown"}
                                </span>
                                {" "}
                                <span style={{ color: "var(--text-secondary)" }}>
                                  {labelMap[activity.type] || "interacted with you"}
                                </span>
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: typeStyle.color,
                                  fontWeight: 600,
                                  opacity: 0.8
                                }}
                              >
                                {formatTimeAgo(activity.createdAt)}
                              </Typography>
                            </Box>

                            {/* Unread dot */}
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${typeStyle.color}, #764ba2)`,
                                flexShrink: 0,
                                boxShadow: `0 0 6px ${typeStyle.color}`
                              }}
                            />
                          </Stack>

                          {/* Divider between items */}
                          {index < grouped[group].length - 1 && (
                            <Divider sx={{ mx: 2.5, opacity: 0.4 }} />
                          )}
                        </Box>
                      </Grow>
                    );
                  })}
                </Paper>
              </Box>
            </Fade>
          );
        })}
      </Box>
    </Box>
  );
}