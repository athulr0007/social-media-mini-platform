import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, Slide } from "@mui/material";
import MediaDisplay from "../components/MediaDisplay";
import {
  Box,
  Avatar,
  Typography,
  Dialog,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  List,
  ListItem,
  Stack,
  Divider,
  Tabs,
  Tab,
  Paper,
  Fade,
  Grow,
  Button,
  TextField,
  Menu,
  MenuItem,
  InputAdornment,
  Badge,
  useMediaQuery,
  useTheme
} from "@mui/material";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DeleteRoundedIcon from "@mui/icons-material/Delete";
import CloseRoundedIcon from "@mui/icons-material/Close";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import ViewDayRoundedIcon from "@mui/icons-material/ViewDayRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import UnarchiveRoundedIcon from "@mui/icons-material/UnarchiveRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";

import { MetalButton } from "../components/ui/metal-button";
import ThemeToggle from "../components/ThemeToggle";

const formatTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

export default function Profile() {
const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [posts, setPosts] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [postMenuAnchor, setPostMenuAnchor] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [viewMode, setViewMode] = useState("posts");
  const [layoutMode, setLayoutMode] = useState("grid");

  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  type: "success"
});

  // Edit profile
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editUsername, setEditUsername] = useState(user.username);
  
  useEffect(() => {
    loadMyPosts();
    loadArchivedPosts();
    loadFollowData();
  }, []);

  const loadMyPosts = async () => {
    try {
      const res = await API.get("/users/me/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  const loadArchivedPosts = async () => {
    try {
      const res = await API.get("/users/me/archived");
      setArchivedPosts(res.data);
    } catch (err) {
      console.error("Failed to load archived posts:", err);
    }
  };

  const loadFollowData = async () => {
    try {
      const res = await API.get(`/users/${user._id}`);
      setFollowersCount(res.data.followers.length);
      setFollowingCount(res.data.following.length);

      const followersData = await Promise.all(
        res.data.followers.map((id) => API.get(`/users/${id}`))
      );
      setFollowers(followersData.map((r) => r.data));

      const followingData = await Promise.all(
        res.data.following.map((id) => API.get(`/users/${id}`))
      );
      setFollowing(followingData.map((r) => r.data));
    } catch (err) {
      console.error("Failed to load follow data:", err);
    }
  };

  const deletePost = async (id) => {
    setPosts((p) => p.filter((x) => x._id !== id));
    setArchivedPosts((p) => p.filter((x) => x._id !== id));
    await API.delete(`/posts/${id}`);
    setActivePost(null);
    setPostMenuAnchor(null);
  };

  const toggleLike = async (id) => {
    const updatePosts = (p) =>
      p.map((x) =>
        x._id === id
          ? {
              ...x,
              likes: x.likes.includes(user._id)
                ? x.likes.filter((l) => l !== user._id)
                : [...x.likes, user._id]
            }
          : x
      );

    setPosts(updatePosts);
    setArchivedPosts(updatePosts);
    await API.put(`/posts/${id}/like`);
  };

  
  const toggleArchive = async (id) => {
    try {
      const res = await API.put(`/posts/${id}/archive`);
      
      if (res.data.archived) {
        const post = posts.find((p) => p._id === id);
        setPosts((p) => p.filter((x) => x._id !== id));
        if (post) setArchivedPosts((p) => [post, ...p]);
      } else {
        const post = archivedPosts.find((p) => p._id === id);
        setArchivedPosts((p) => p.filter((x) => x._id !== id));
        if (post) setPosts((p) => [post, ...p]);
      }
 setSnackbar({
      open: true,
      message: res.data.message,
      type: "success"
    });
    setActivePost(null); 
          setPostMenuAnchor(null);
    } catch (err) {
      console.error("Failed to archive post:", err);
 setSnackbar({
      open: true,
      message: err.response?.data?.message || "Archive failed",
      type: "error"
    });
      }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

const updateProfile = async () => {
  console.log("updateProfile called");
  console.log("avatarFile:", avatarFile);
  
  try {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("bio", editBio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
      console.log("Avatar added to formData");
    }

    console.log("Sending request to /users/me/profile");
    const res = await API.put("/users/me/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    console.log("Response received:", res.data);
    
    // Merge response with existing user, preserve avatar if not in response
    const updatedUser = { 
      ...user, 
      ...res.data,
      // If avatar not in response but we have existing, keep it
      avatar: res.data.avatar !== undefined ? res.data.avatar : user.avatar
    };
    
    console.log("Updated user:", updatedUser);
    console.log("Avatar field:", updatedUser.avatar);
    
    login(updatedUser);

    setEditProfileOpen(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  } catch (err) {
    console.error("Failed to update profile:", err);
    console.error("Error response:", err.response?.data);
  }
};

  const currentPosts = viewMode === "posts" ? posts : archivedPosts;

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        pb: 6,
        pt: isMobile ? "70px" : 0
      }}
    >
      <Box sx={{ maxWidth: 935, mx: "auto", px: 3, py: isMobile ? 3 : 6 }}>
        {/* PROFILE HEADER */}
<Paper
  sx={{
    p: isMobile ? 3 : 4,
    mb: 4,
    borderRadius: 3,
    position: "relative"
  }}
  
>
 {isMobile && (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        left: 12
      }}
    >
      <ThemeToggle size="small" />
    </Box>
  )}  
  {isMobile && (
  <IconButton
    onClick={logout}
    sx={{
      position: "absolute",
      top: 12,
      right: 12,
      color: "#ef4444",
      background: "rgba(239,68,68,0.08)",
      boxShadow: "0 0 12px rgba(239,68,68,0.35)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "rgba(239,68,68,0.15)",
        boxShadow: "0 0 18px rgba(239,68,68,0.6)",
        transform: "scale(1.05)"
      }
    }}
  >
    <LogoutRoundedIcon />
  </IconButton>
)}


          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={4} 
            alignItems="center"
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.avatar ? `http://localhost:5000${user.avatar}` : undefined}
                sx={{
                  width: isMobile ? 120 : 150,
                  height: isMobile ? 120 : 150,
                  fontSize: isMobile ? "2.5rem" : "3rem",
                  fontWeight: 600,
                  bgcolor: "primary.main"
                }}
              >
                {!user.avatar && user.name[0]}
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
                  {user.name}
                </Typography>
                
<Stack
  direction={isMobile ? "column" : "row"}
  spacing={isMobile ? 1.5 : 1}
  alignItems="center"
  width={isMobile ? "100%" : "auto"}
>
  <Button
    variant="outlined"
    startIcon={<EditRoundedIcon />}
    onClick={() => setEditProfileOpen(true)}
    size={isMobile ? "small" : "medium"}
    fullWidth={isMobile}
  >
    Edit Profile
  </Button>

  {!isMobile && <ThemeToggle size="small" />}
</Stack>
              </Stack>

<Stack
  direction={isMobile ? "column" : "row"}
  spacing={isMobile ? 2 : 4}
  mb={2}
  alignItems="center"
  justifyContent={isMobile ? "center" : "flex-start"}
  width={isMobile ? "100%" : "auto"}
>

  <Box textAlign="center">
    <Typography variant="h6" fontWeight={600}>
      {posts.length}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      posts
    </Typography>
  </Box>

 <Stack
  direction={isMobile ? "column" : "row"}
  spacing={isMobile ? 1.5 : 2}
  width={isMobile ? "100%" : "auto"}
  alignItems="center"
  justifyContent={isMobile ? "center" : "flex-start"}
>

    <MetalButton
      fullWidth={isMobile}
      onClick={() => setFollowersOpen(true)}
    >
      {followersCount} Followers
    </MetalButton>

    <MetalButton
      fullWidth={isMobile}
      onClick={() => setFollowingOpen(true)}
    >
      {followingCount} Following
    </MetalButton>
  </Stack>
</Stack>


              {user.bio && (
                <Typography 
                  variant="body1" 
                  mb={1}
                  textAlign={isMobile ? "center" : "left"}
                >
                  {user.bio}
                </Typography>
              )}

              {/* <Typography 
                variant="body2" 
                color="text.secondary"
                textAlign={isMobile ? "center" : "left"}
              >
                {user.email}
              </Typography> */}
            </Box>
          </Stack>
        </Paper>

        {/* VIEW MODE TABS */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Tabs 
            value={viewMode} 
            onChange={(e, v) => setViewMode(v)}
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab
              icon={<GridOnRoundedIcon />}
              iconPosition="start"
              label="Posts"
              value="posts"
            />
            <Tab
              icon={<InventoryRoundedIcon />}
              iconPosition="start"
              label={`Archived (${archivedPosts.length})`}
              value="archived"
            />
          </Tabs>
        </Box>

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
              {currentPosts.length === 0 ? (
                <Box sx={{ gridColumn: "1 / -1", py: 8, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    {viewMode === "posts"
                      ? "No posts yet"
                      : "No archived posts"}
                  </Typography>
                </Box>
              ) : (
                currentPosts.map((post, index) => (
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
                        bgcolor: post.image || post.images?.length ? "#000" : "#fafafa",
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
    {(() => {
      const mediaUrl = post.images?.[0] || post.videos?.[0];
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);
      
      return isVideo ? (
        <video
          src={`http://localhost:5000${mediaUrl}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
          muted
        />
      ) : (
        <img
          src={`http://localhost:5000${mediaUrl}`}
          alt="post"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      );
    })()}
    {/* Video indicator badge */}
    {/\.(mp4|webm|ogg|mov)$/i.test(post.images?.[0] || post.videos?.[0] || '') && (
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
            {currentPosts.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={8}>
                {viewMode === "posts" ? "No posts yet" : "No archived posts"}
              </Typography>
            ) : (
              currentPosts.map((post, index) => {
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
                              user.avatar
                                ? `http://localhost:5000${user.avatar}`
                                : undefined
                            }
                          >
                            {!user.avatar && user.name[0]}
                          </Avatar>
                        }
                        title={
                          <Typography variant="body1" fontWeight={600}>
                            {user.name}
                          </Typography>
                        }
                        subheader={
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(post.createdAt)}
                          </Typography>
                        }
                        action={
                          <IconButton
                            onClick={(e) => {
                              setPostMenuAnchor(e.currentTarget);
                              setSelectedPost(post);
                            }}
                          >
                            <MoreVertRoundedIcon />
                          </IconButton>
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
                      user.avatar ? `http://localhost:5000${user.avatar}` : undefined
                    }
                  >
                    {!user.avatar && user.name[0]}
                  </Avatar>
                }
                title={
                  <Typography variant="body1" fontWeight={600}>
                    {user.name}
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

              <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <IconButton
                    onClick={() => toggleLike(activePost._id)}
                    size="small"
                  >
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
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <MetalButton
                    onClick={() => toggleArchive(activePost._id)}
                    startIcon={
                      viewMode === "posts" ? (
                        <ArchiveRoundedIcon />
                      ) : (
                        <UnarchiveRoundedIcon />
                      )
                    }
                  >
                    {viewMode === "posts" ? "Archive" : "Unarchive"}
                  </MetalButton>

                  <MetalButton
                    onClick={() => deletePost(activePost._id)}
                    startIcon={<DeleteRoundedIcon />}
                  >
                    Delete
                  </MetalButton>
                </Stack>
              </CardActions>
            </Card>
          )}
        </Dialog>
      )}

      {/* POST MENU */}
      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor)}
        onClose={() => setPostMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (selectedPost) toggleArchive(selectedPost._id);
          }}
        >
          {viewMode === "posts" ? (
            <>
              <ArchiveRoundedIcon sx={{ mr: 1 }} /> Archive
            </>
          ) : (
            <>
              <UnarchiveRoundedIcon sx={{ mr: 1 }} /> Unarchive
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedPost) deletePost(selectedPost._id);
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteRoundedIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* EDIT PROFILE DIALOG */}
      <Dialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Edit Profile
          </Typography>

          <Stack spacing={3}>
            {/* Avatar Upload */}
            <Box sx={{ textAlign: "center" }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    component="label"
                    sx={{
                      bgcolor: "primary.main",
                      color: "#fff",
                      "&:hover": { bgcolor: "primary.dark" }
                    }}
                  >
                    <CameraAltRoundedIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                }
              >
                <Avatar
                  src={
                    avatarPreview ||
                    (user.avatar ? `http://localhost:5000${user.avatar}` : undefined)
                  }
                  sx={{ width: 120, height: 120, mx: "auto" }}
                >
                  {!user.avatar && !avatarPreview && user.name[0]}
                </Avatar>
              </Badge>
              <Typography variant="caption" color="text.secondary" mt={1} display="block">
                Click camera to change profile picture
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              inputProps={{ maxLength: 150 }}
              helperText={`${editBio.length}/150`}
            />

            <TextField
              fullWidth
              label="Username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
              helperText="Only letters, numbers, underscores and periods"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary">@</Typography>
                  </InputAdornment>
                )
              }}
            />
            
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button fullWidth variant="contained" onClick={updateProfile}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>

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
                      src={
                        u.avatar ? `http://localhost:5000${u.avatar}` : undefined
                      }
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert
          severity={snackbar.type}
          variant="filled"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}