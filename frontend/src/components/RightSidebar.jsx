import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Stack, Skeleton, Divider } from "@mui/material";
import { useActivity } from "../context/ActivityContext";

export default function RightSidebar() {
  const navigate = useNavigate();
  const { activities = [], loading = false } = useActivity() || {};

  const handleClick = (activity) => {
    if (activity.type === "message") {
      navigate("/messages");
    } else if (activity.post) {
      // Navigate to feed where the post will be visible
      navigate("/");
    } else if (activity.type === "follow") {
      navigate(`/profile/${activity.actor._id}`);
    }
  };

  const labelMap = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    message: "sent you a message"
  };

  return (
    <Box
      sx={{
        width: 320,
        borderLeft: "1px solid",
        borderColor: "divider",
        p: 3,
        bgcolor: "background.paper",
        display: { xs: "none", lg: "block" },
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto"
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={3}>
        Recent Activity
      </Typography>

      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Stack key={i} direction="row" spacing={1.5} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton width="60%" />
                <Skeleton width="80%" />
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      ) : (
        <Stack spacing={0} divider={<Divider />}>
          {activities.slice(0, 5).map((activity) => (
            <Stack
              key={activity._id}
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                cursor: "pointer",
                py: 1.5,
                px: 1,
                mx: -1,
                borderRadius: 1.5,
                transition: "all 0.15s",
                "&:hover": { bgcolor: "action.hover" }
              }}
              onClick={() => handleClick(activity)}
            >
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={activity.actor?.avatar ? `http://localhost:5000${activity.actor.avatar}` : undefined}
              >
                {!activity.actor?.avatar && (activity.actor?.name?.[0])}
              </Avatar>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {activity.actor?.name || "Unknown"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {labelMap[activity.type]}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
