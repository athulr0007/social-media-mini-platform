import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

import {
  Box,
  Avatar,
  Typography,
  Button,
  Dialog,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  List,
  ListItem,
  IconButton,
  TextField,
  Stack,
  Divider,
  Tabs,
  Tab,
  Paper,
  Fade,
  Grow,
  useMediaQuery,
  useTheme
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import ViewDayRoundedIcon from "@mui/icons-material/ViewDayRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import MediaDisplay from "../components/MediaDisplay";

import { MetalButton } from "../components/ui/metal-button";

const formatTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [canMessage, setCanMessage] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const [layoutMode, setLayoutMode] = useState("grid");

  const loadProfile = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setProfileUser(res.data);
      setIsFollowing(res.data.followers.includes(user._id));

      // Load followers
      const followersData = await Promise.all(
        res.data.followers.map((fid) => API.get(`/users/${fid}`))
      );
      setFollowers(followersData.map((r) => r.data));

      // Load following
      const followingData = await Promise.all(
        res.data.following.map((fid) => API.get(`/users/${fid}`))
      );
      setFollowing(followingData.map((r) => r.data));
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${id}`);
      setPosts(res.data || []);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  const checkMutual = async () => {
    try {
      const res = await API.get(`/users/${id}/mutual`);
      setCanMessage(res.data.mutual || false);
    } catch (err) {
      console.error("Error checking mutual follow:", err);
      setCanMessage(false);
    }
  };

  const toggleFollow = async () => {
    try {
      await API.put(`/users/${id}/follow`);
      await loadProfile();
      await checkMutual();
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const startConversation = async () => {
    try {
      const res = await API.post(`/conversations/${id}`);
      navigate(`/messages/${res.data._id}`);
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert(err.response?.data?.message || "Failed to start conversation");
    }
  };

  const toggleLike = async (postId) => {
    const updatePosts = (p) =>
      p.map((x) =>
        x._id === postId
          ? {
              ...x,
              likes: x.likes.includes(user._id)
                ? x.likes.filter((l) => l !== user._id)
                : [...x.likes, user._id]
            }
          : x
      );

    setPosts(updatePosts);
    await API.put(`/posts/${postId}/like`);
  };

  useEffect(() => {
    if (id && user) {
      setLoading(true);
      Promise.all([loadProfile(), loadPosts(), checkMutual()]).finally(() =>
        setLoading(false)
      );
    }
  }, [id, user._id]);

  if (loading || !profileUser) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        pb: isMobile ? 10 : 6,
        pt: isMobile ? "70px" : 0
      }}
    >
      <Box sx={{ maxWidth: 935, mx: "auto", px: 3, py: isMobile ? 3 : 6 }}>
        {/* PROFILE HEADER */}
        <Paper sx={{ p: isMobile ? 3 : 4, mb: 4, borderRadius: 3 }}>
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={4} 
            alignItems="center"
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={
                  profileUser.avatar
                    ? `http://localhost:5000${profileUser.avatar}`
                    : undefined
                }
                sx={{
                  width: isMobile ? 120 : 150,
                  height: isMobile ? 120 : 150,
                  fontSize: isMobile ? "2.5rem" : "3rem",
                  fontWeight: 600,
                  bgcolor: "primary.main"
                }}
              >
                {!profileUser.avatar && profileUser.name[0]}
              </Avatar>
            </Box>

            <Box sx={{ flexGrow: 1, width: isMobile ? "100%" : "auto" }}>
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                alignItems={isMobile ? "center" : "center"} 
                mb={2}
              >
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight={600}
                  textAlign={isMobile ? "center" : "left"}
                >
                  {profileUser.name}
                </Typography>
                {id !== user._id && (
                  <Stack 
                    direction={isMobile ? "column" : "row"} 
                    spacing={1}
                    width={isMobile ? "100%" : "auto"}
                  >
                    <Button
                      variant={isFollowing ? "outlined" : "contained"}
                      onClick={toggleFollow}
                      sx={{ textTransform: "none" }}
                      fullWidth={isMobile}
                      size={isMobile ? "medium" : "medium"}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    {canMessage && (
                      <Button
                        variant="outlined"
                        startIcon={<MessageRoundedIcon />}
                        onClick={startConversation}
                        sx={{ textTransform: "none" }}
                        fullWidth={isMobile}
                        size={isMobile ? "medium" : "medium"}
                      >
                        Message
                      </Button>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => setReportOpen(true)}
                      sx={{ 
                        ml: isMobile ? 0 : 1,
                        width: isMobile ? "100%" : "auto"
                      }}
                    >
                      <ReportRoundedIcon />
                    </IconButton>
                  </Stack>
                )}
              </Stack>

{isMobile ? (
  <Stack
    direction="column"
    spacing={2}
    alignItems="center"
    width="100%"
    mb={2}
  >
    <Box textAlign="center">
      <Typography variant="h6" fontWeight={600}>
        {posts.length}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        posts
      </Typography>
    </Box>

    <Stack direction="column" spacing={1.5} width="100%" alignItems="center">
      <MetalButton
        fullWidth
        sx={{ maxWidth: 220 }}
        onClick={() => setFollowersOpen(true)}
      >
        {profileUser.followers.length} Followers
      </MetalButton>

      <MetalButton
        fullWidth
        sx={{ maxWidth: 220 }}
        onClick={() => setFollowingOpen(true)}
      >
        {profileUser.following.length} Following
      </MetalButton>
    </Stack>
  </Stack>
) : (
  <Stack direction="row" spacing={4} mb={2} alignItems="center">
    <Box textAlign="center">
      <Typography variant="h6" fontWeight={600}>
        {posts.length}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        posts
      </Typography>
    </Box>

    <MetalButton onClick={() => setFollowersOpen(true)}>
      {profileUser.followers.length} Followers
    </MetalButton>

    <MetalButton onClick={() => setFollowingOpen(true)}>
      {profileUser.following.length} Following
    </MetalButton>
  </Stack>
)}


              {profileUser.bio && (
                <Typography 
                  variant="body1" 
                  mb={1}
                  textAlign={isMobile ? "center" : "left"}
                >
                  {profileUser.bio}
                </Typography>
              )}

              {/* <Typography 
                variant="body2" 
                color="text.secondary"
                textAlign={isMobile ? "center" : "left"}
              >
                {profileUser.email}
              </Typography> */}
            </Box>
          </Stack>
        </Paper>

        {/* LAYOUT TOGGLE */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              position: "relative",
              p: "6px",
              borderRadius: "999px",
              backdropFilter: "blur(18px)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.9), 0 10px 30px rgba(0,0,0,0.15)"
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 6,
                left: layoutMode === "grid" ? 6 : "50%",
                width: "50%",
                height: "calc(100% - 12px)",
                borderRadius: "999px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.65))",
                boxShadow:
                  "inset 0 1px 2px rgba(255,255,255,1), 0 8px 20px rgba(0,0,0,0.25)",
                transition: "left 520ms cubic-bezier(0.22, 1, 0.36, 1)",
                filter: "blur(0.2px)"
              }}
            />

            <Tabs
              value={layoutMode}
              onChange={(e, v) => setLayoutMode(v)}
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                position: "relative",
                zIndex: 1,
                minHeight: "auto",
                "& .MuiTab-root": {
                  minHeight: "36px",
                  px: isMobile ? 2 : 3,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "color 300ms ease",
                  color: "rgba(0,0,0,0.55)",
                  fontSize: isMobile ? "0.875rem" : "1rem"
                },
                "& .Mui-selected": {
                  color: "#000"
                }
              }}
            >
              <Tab
                icon={<GridOnRoundedIcon />}
                iconPosition="start"
                label="Grid"
                value="grid"
              />
              <Tab
                icon={<ViewDayRoundedIcon />}
                iconPosition="start"
                label="Feed"
                value="feed"
              />
            </Tabs>
          </Box>
        </Box>

        {/* GRID VIEW */}
        {layoutMode === "grid" && (
          <Fade in timeout={600}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                gap: 1
              }}
            >
              {posts.length === 0 ? (
                <Box sx={{ gridColumn: "1 / -1", py: 8, textAlign: "center" }}>
                  <Typography color="text.secondary">No posts yet</Typography>
                </Box>
              ) : (
                posts.map((post, index) => (
                  <Grow
                    key={post._id}
                    in
                    timeout={400 + index * 100}
                    style={{ transformOrigin: "center" }}
                  >
                    <Box
                      sx={{
                        aspectRatio: "1/1",
                        cursor: "pointer",
                        overflow: "hidden",
                        bgcolor:
                          post.image || post.images?.length ? "#000" : "background.paper",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        borderRadius: 1,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.03)",
                          zIndex: 1,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                          "& .overlay": {
                            opacity: 1
                          }
                        }
                      }}
                      onClick={() => setActivePost(post)}
                    >
                    {(post.images?.length || post.videos?.length) ? (
  <>
    <img
      src={`http://localhost:5000${post.images?.[0] || post.videos?.[0]}`}
      alt="post"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
    />
    {/* Video indicator badge */}
    {post.videos?.length > 0 && (
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          zIndex: 1
        }}
      >
        ▶ Video
      </Box>
    )}
  </>
) : (
  <Typography
    sx={{
      px: 2,
      textAlign: "center",
      fontWeight: 500,
      color: "text.primary",
      fontSize: isMobile ? "0.875rem" : "1rem"
    }}
  >
    {post.content}
  </Typography>
)}

                      <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: isMobile ? 2 : 3,
                          opacity: 0,
                          transition: "opacity 0.3s"
                        }}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <FavoriteRoundedIcon sx={{ color: "#fff", fontSize: isMobile ? 18 : 24 }} />
                          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                            {post.likes.length}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <ChatBubbleOutlineRoundedIcon sx={{ color: "#fff", fontSize: isMobile ? 18 : 24 }} />
                          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                            {post.comments.length}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Grow>
                ))
              )}
            </Box>
          </Fade>
        )}

        {/* FEED VIEW */}
        {layoutMode === "feed" && (
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            {posts.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={8}>
                No posts yet
              </Typography>
            ) : (
              posts.map((post, index) => {
                const liked = post.likes.includes(user._id);

                return (
                  <Grow
                    key={post._id}
                    in
                    timeout={400 + index * 150}
                    style={{ transformOrigin: "top" }}
                  >
                    <Card sx={{ mb: 3, borderRadius: 3 }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            src={
                              profileUser.avatar
                                ? `http://localhost:5000${profileUser.avatar}`
                                : undefined
                            }
                          >
                            {!profileUser.avatar && profileUser.name[0]}
                          </Avatar>
                        }
                        title={
                          <Typography variant="body1" fontWeight={600}>
                            {profileUser.name}
                          </Typography>
                        }
                        subheader={
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(post.createdAt)}
                          </Typography>
                        }
                      />

 <MediaDisplay post={post} maxHeight={500} />

                      {post.content && (
                        <CardContent>
                          <Typography variant="body1">{post.content}</Typography>
                        </CardContent>
                      )}

                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <IconButton onClick={() => toggleLike(post._id)} size="small">
                          {liked ? (
                            <FavoriteRoundedIcon sx={{ color: "#dc2626" }} />
                          ) : (
                            <FavoriteBorderRoundedIcon />
                          )}
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                          {post.likes.length}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grow>
                );
              })
            )}
          </Box>
        )}
      </Box>

      {/* POST DETAIL DIALOG */}
      {layoutMode === "grid" && (
        <Dialog
          open={Boolean(activePost)}
          onClose={() => setActivePost(null)}
          maxWidth="md"
          fullWidth
        >
          {activePost && (
            <Card>
              <CardHeader
                avatar={
                  <Avatar
                    src={
                      profileUser.avatar
                        ? `http://localhost:5000${profileUser.avatar}`
                        : undefined
                    }
                  >
                    {!profileUser.avatar && profileUser.name[0]}
                  </Avatar>
                }
                title={
                  <Typography variant="body1" fontWeight={600}>
                    {profileUser.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(activePost.createdAt)}
                  </Typography>
                }
                action={
                  <IconButton onClick={() => setActivePost(null)}>
                    <CloseRoundedIcon />
                  </IconButton>
                }
              />

<MediaDisplay post={activePost} maxHeight={500} />

              {activePost.content && (
                <CardContent>
                  <Typography variant="body1">{activePost.content}</Typography>
                </CardContent>
              )}

              <CardActions sx={{ px: 2, pb: 2 }}>
                <IconButton onClick={() => toggleLike(activePost._id)} size="small">
                  {activePost.likes.includes(user._id) ? (
                    <FavoriteRoundedIcon sx={{ color: "#dc2626" }} />
                  ) : (
                    <FavoriteBorderRoundedIcon />
                  )}
                </IconButton>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  ml={1}
                >
                  {activePost.likes.length} likes
                </Typography>
              </CardActions>
            </Card>
          )}
        </Dialog>
      )}

      {/* FOLLOWERS DIALOG */}
      <Dialog
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Followers
            </Typography>
            <IconButton onClick={() => setFollowersOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {followers.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No followers yet
            </Typography>
          ) : (
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {followers.map((follower) => (
                <ListItem
                  key={follower._id}
                  sx={{
                    borderRadius: 2,
                    mb: 2,
                    flexDirection: "column",
                    alignItems: "stretch",
                    p: 2,
                    bgcolor: "background.default"
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                    <Avatar
                      src={
                        follower.avatar
                          ? `http://localhost:5000${follower.avatar}`
                          : undefined
                      }
                      sx={{ width: 48, height: 48 }}
                    >
                      {!follower.avatar && follower.name[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600}>{follower.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {follower.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <MetalButton
                    fullWidth
                    onClick={() => {
                      setFollowersOpen(false);
                      navigate(`/profile/${follower._id}`);
                    }}
                  >
                    View Profile
                  </MetalButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Dialog>

      {/* FOLLOWING DIALOG */}
      <Dialog
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Following
            </Typography>
            <IconButton onClick={() => setFollowingOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {following.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              Not following anyone yet
            </Typography>
          ) : (
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {following.map((u) => (
                <ListItem
                  key={u._id}
                  sx={{
                    borderRadius: 2,
                    mb: 2,
                    flexDirection: "column",
                    alignItems: "stretch",
                    p: 2,
                    bgcolor: "background.default"
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                    <Avatar
                      src={u.avatar ? `http://localhost:5000${u.avatar}` : undefined}
                      sx={{ width: 48, height: 48 }}
                    >
                      {!u.avatar && u.name[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600}>{u.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {u.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <MetalButton
                    fullWidth
                    onClick={() => {
                      setFollowingOpen(false);
                      navigate(`/profile/${u._id}`);
                    }}
                  >
                    View Profile
                  </MetalButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Dialog>

      {/* REPORT DIALOG */}
      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Report User
            </Typography>
            <IconButton onClick={() => setReportOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description (optional)"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setReportOpen(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={async () => {
                  if (!reportReason) return;
                  try {
                    await (
                      await import("../services/reportApi")
                    ).default.createReport({
                      type: "user",
                      targetId: id,
                      reason: reportReason,
                      description: reportDescription
                    });
                    setReportOpen(false);
                    setReportReason("");
                    setReportDescription("");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to report user");
                  }
                }}
              >
                Submit Report
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}