import { Box, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActivityItem = ({ activity }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (activity.post) navigate(`/post/${activity.post._id}`);
    if (activity.type === "message") navigate("/messages");
    if (activity.type === "follow") navigate(`/profile/${activity.actor._id}`);
  };

  const label = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    message: "sent you a message"
  }[activity.type];

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        gap: 1.5,
        p: 1,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#111" }
      }}
    >
      <Avatar 
        src={activity.actor?.avatar ? `http://localhost:5000${activity.actor.avatar}` : undefined}
      >
        {!activity.actor?.avatar && (activity.actor?.name?.[0] || "?")}
      </Avatar>
      <Typography variant="body2">
        <strong>{activity.actor.name}</strong> {label}
      </Typography>
    </Box>
  );
};

export default ActivityItem;
