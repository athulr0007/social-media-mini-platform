import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Skeleton,
  Stack,
  Collapse,
  Divider,
  Button,
  Dialog,
  LinearProgress,
  Paper,
  Menu,
  MenuItem
} from "@mui/material";
import MediaDisplay from "../components/MediaDisplay";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";

const formatTimeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

const STORY_COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#14b8a6"
];

export default function Feed() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedStories, setViewedStories] = useState(new Set());

  const [comments, setComments] = useState({});
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [openStory, setOpenStory] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPost, setMenuPost] = useState(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storyBg, setStoryBg] = useState(STORY_COLORS[0]);
  const [storyFile, setStoryFile] = useState(null);
  const [storyPreview, setStoryPreview] = useState(null);

  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef();

  useEffect(() => {
    loadPosts();
    loadStories();
    const viewed = localStorage.getItem('viewedStories');
    if (viewed) {
      setViewedStories(new Set(JSON.parse(viewed)));
    }
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts/feed");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStories = async () => {
    try {
      const res = await API.get("/stories");
      setStories(res.data);
    } catch (err) {
      console.error("Failed to load stories:", err);
    }
  };

  const markStoryAsViewed = (storyId) => {
    const newViewed = new Set(viewedStories);
    newViewed.add(storyId);
    setViewedStories(newViewed);
    localStorage.setItem('viewedStories', JSON.stringify([...newViewed]));
  };

  const toggleLike = async (id) => {
    setPosts((p) =>
      p.map((x) =>
        x._id === id
          ? {
              ...x,
              likes: x.likes.includes(user._id)
                ? x.likes.filter((l) => l !== user._id)
                : [...x.likes, user._id]
            }
          : x
      )
    );
    await API.put(`/posts/${id}/like`);
  };

  const loadComments = async (id) => {
    if (comments[id]) {
      setActiveComment(activeComment === id ? null : id);
      return;
    }
    const res = await API.get(`/posts/${id}/comments`);
    setComments((c) => ({ ...c, [id]: res.data }));
    setActiveComment(id);
  };

  const submitComment = async (id) => {
    if (!commentText.trim()) return;

    setComments((c) => ({
      ...c,
      [id]: [...(c[id] || []), { text: commentText, user: { name: user.name } }]
    }));

    setCommentText("");
    await API.post(`/posts/${id}/comment`, { text: commentText });
  };

  const submitStory = async () => {
    if (!storyText.trim() && !storyFile) return;

    try {
      const formData = new FormData();
      formData.append("text", storyText);
      formData.append("background", storyBg);
      if (storyFile) formData.append("media", storyFile);

      await API.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await loadStories();
      setOpenStory(false);
      setStoryText("");
      setStoryFile(null);
      setStoryPreview(null);
      setStoryBg(STORY_COLORS[0]);
    } catch (err) {
      console.error("Failed to create story:", err);
    }
  };

  useEffect(() => {
    if (activeStoryIndex === null) return;

    if (stories[activeStoryIndex]) {
      markStoryAsViewed(stories[activeStoryIndex]._id);
    }

    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextStory();
          return 0;
        }
        return p + 1;
      });
    }, 50);

    return () => clearInterval(progressRef.current);
  }, [activeStoryIndex]);

  const nextStory = () => {
    clearInterval(progressRef.current);
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const deleteStory = async (id) => {
    try {
      await API.delete(`/stories/${id}`);
      setStories((s) => s.filter((x) => x._id !== id));
      setActiveStoryIndex(null);
    } catch (err) {
      console.error("Failed to delete story:", err);
    }
  };

  const openPostMenu = (e, post) => {
    setAnchorEl(e.currentTarget);
    setMenuPost(post);
  };

  const closePostMenu = () => {
    setAnchorEl(null);
    setMenuPost(null);
  };

  const startReportPost = (post) => {
    setReportTarget({ type: "post", id: post._id });
    setReportReason("");
    setReportDescription("");
    setReportOpen(true);
    closePostMenu();
  };

  const submitReport = async () => {
    if (!reportReason) return;
    try {
      await (await import("../services/reportApi")).default.createReport({
        type: reportTarget.type,
        targetId: reportTarget.id,
        reason: reportReason,
        description: reportDescription
      });
      setReportOpen(false);
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert(err.response?.data?.message || "Failed to report");
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        maxWidth: 600, 
        width: "100%",
        mx: "auto", 
        py: 4, 
        px: 2,
        boxSizing: "border-box"
      }}>
        {[1, 2].map((i) => (
          <Card key={i} sx={{ mb: 3, borderRadius: 3 }}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton width="35%" />}
              subheader={<Skeleton width="20%" />}
            />
            <Skeleton variant="rectangular" height={400} sx={{ bgcolor: "action.hover" }} />
            <CardContent>
              <Skeleton />
              <Skeleton width="60%" />
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton width={30} sx={{ ml: 1 }} />
              <Skeleton variant="circular" width={28} height={28} sx={{ ml: 3 }} />
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  }

      
  return (
    <Box sx={{ 
      minHeight: "100vh", 
      pb: 6, 
      bgcolor: "background.default",
      overflowX: "hidden"
    }}>
      <Box sx={{ 
        maxWidth: 600, 
        width: "100%", 
        mx: "auto", 
        pt: 4, 
        px: 2, 
        boxSizing: "border-box",
        overflowX: "hidden"
      }}>
{/* STORIES SECTION */}
<Box
  sx={{
    display: "flex",
    gap: 2,
    mb: 4,
    overflowX: "auto",
    overflowY: "hidden",
    pb: 1,
    width: "100%",
    minWidth: 0,
    flexShrink: 0,
    "&::-webkit-scrollbar": { height: 6 },
    "&::-webkit-scrollbar-thumb": { bgcolor: "#e4e4e7", borderRadius: 3 },
    "& > *": { flexShrink: 0 }
  }}
>
        <Paper
          onClick={() => setOpenStory(true)}
          sx={{
            minWidth: 100,
            width: 100,
            height: 160,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 3
            }
          }}
        >
          <Avatar sx={{ width: 48, height: 48, mb: 1, bgcolor: "primary.main" }}>
            <AddRoundedIcon />
          </Avatar>
          <Typography variant="caption" fontWeight={500}>
            Create
          </Typography>
        </Paper>

        {stories.map((story, i) => {
          const isViewed = viewedStories.has(story._id);

          return (
            <Box
              key={story._id}
              sx={{
                minWidth: 100,
                width: 100,
                height: 160,
                p: "3px",
                borderRadius: 3,
                background: isViewed 
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" 
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)"
                }
              }}
            >
              <Box
                onClick={() => setActiveStoryIndex(i)}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  bgcolor: story.background || "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}
              >
                {story.media ? (
                  <Box
                    component="img"
                    src={`http://localhost:5000${story.media}`}
                    sx={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      filter: isViewed ? "grayscale(30%) brightness(0.85)" : "none"
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      px: 1,
                      color: "#fff",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      opacity: isViewed ? 0.6 : 1
                    }}
                  >
                    {story.text}
                  </Typography>
                )}

                <Avatar
                  src={story.user?.avatar ? `http://localhost:5000${story.user.avatar}` : undefined}
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                    border: "2px solid white",
                    boxShadow: isViewed 
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 0 12px rgba(102, 126, 234, 0.6)"
                  }}
                >
                  {!story.user?.avatar && (story.user?.name?.[0] || "?")}
                </Avatar>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)"
                    }}
                  >
                    {story.user?.name || "Unknown"}
                  </Typography>
                </Box>

                {isViewed && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor: "rgba(156, 163, 175, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontSize: "0.65rem" }}>✓</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* POSTS SECTION */}
      {posts.map((post) => {
        const liked = post.likes.includes(user._id);

        return (
          <Card key={post._id} sx={{ mb: 3 }}>
            <CardHeader
              avatar={
                <Avatar
                  src={post.user?.avatar ? `http://localhost:5000${post.user.avatar}` : undefined}
                  sx={{ cursor: "pointer", width: 40, height: 40 }}
                  onClick={() => navigate(`/profile/${post.user?._id}`)}
                >
                  {!post.user?.avatar && (post.user?.name?.[0] || "?")}
                </Avatar>
              }
              title={
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/profile/${post.user?._id}`)}
                >
                  {post.user?.name || "Unknown"}
                </Typography>
              }
              subheader={
                <Typography variant="caption" color="text.secondary">
                  {formatTimeAgo(post.createdAt)}
                </Typography>
              }
              action={
                <>
                  <IconButton size="small" onClick={(e) => openPostMenu(e, post)}>
                    <MoreHorizRoundedIcon />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && menuPost?._id === post._id} onClose={closePostMenu}>
                    {post.user?._id === user._id ? (
                      <MenuItem onClick={async () => { await API.delete(`/posts/${post._id}`); setPosts((p)=>p.filter(x=>x._id!==post._id)); closePostMenu(); }}>Delete</MenuItem>
                    ) : (
                      <MenuItem onClick={() => startReportPost(post)}>
                        <FlagRoundedIcon sx={{ mr: 1 }} /> Report
                      </MenuItem>
                    )}
                  </Menu>
                </>
              }
            />

            <MediaDisplay post={post} maxHeight={500} />

            {post.content && (
              <CardContent>
                <Typography variant="body1" color="text.primary">
                  {post.content}
                </Typography>
              </CardContent>
            )}

            <CardActions sx={{ px: 2, pb: 2 }}>
              <IconButton onClick={() => toggleLike(post._id)} size="small">
                {liked ? (
                  <FavoriteRoundedIcon sx={{ color: "#dc2626" }} fontSize="small" />
                ) : (
                  <FavoriteBorderRoundedIcon fontSize="small" />
                )}
              </IconButton>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {post.likes.length}
              </Typography>

              <IconButton onClick={() => loadComments(post._id)} size="small">
                <ChatBubbleOutlineRoundedIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {comments[post._id]?.length ?? post.comments?.length ?? 0}
              </Typography>
            </CardActions>

            <Collapse in={activeComment === post._id}>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Stack spacing={2} sx={{ mb: 2, maxHeight: 200, overflow: "auto" }}>
                  {comments[post._id]?.map((c, i) => (
                    <Box key={i}>
                      <Typography variant="body2" fontWeight={600}>
                        {c.user?.name || "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {c.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        submitComment(post._id);
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => submitComment(post._id)}
                    disabled={!commentText.trim()}
                    size="small"
                  >
                    <SendRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Collapse>
          </Card>
        );
      })}

      {/* STORY VIEWER DIALOG */}
      <Dialog open={activeStoryIndex !== null} fullScreen>
        {activeStoryIndex !== null && stories[activeStoryIndex] && (
          <Box
            sx={{
              height: "100%",
              bgcolor: "#000",
              color: "#fff",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <LinearProgress
              value={progress}
              variant="determinate"
              sx={{
                bgcolor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": { bgcolor: "#fff" }
              }}
            />

            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={stories[activeStoryIndex].user?.avatar ? `http://localhost:5000${stories[activeStoryIndex].user.avatar}` : undefined}
                  sx={{ width: 36, height: 36 }}
                >
                  {!stories[activeStoryIndex].user?.avatar && (stories[activeStoryIndex].user?.name?.[0] || "?")}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {stories[activeStoryIndex].user?.name || "Unknown"}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {formatTimeAgo(stories[activeStoryIndex].createdAt)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                {stories[activeStoryIndex].user?._id === user._id && (
                  <IconButton
                    onClick={() => deleteStory(stories[activeStoryIndex]._id)}
                    sx={{ color: "#fff" }}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => setActiveStoryIndex(null)} sx={{ color: "#fff" }}>
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2
              }}
              onClick={nextStory}
            >
              {stories[activeStoryIndex].media ? (
                <img
                  src={`http://localhost:5000${stories[activeStoryIndex].media}`}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  alt="Story"
                />
              ) : (
                <Box
                  sx={{
                    maxWidth: 500,
                    p: 4,
                    bgcolor: stories[activeStoryIndex].background,
                    borderRadius: 3,
                    textAlign: "center"
                  }}
                >
                  <Typography variant="h5">{stories[activeStoryIndex].text}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Dialog>

      {/* CREATE STORY DIALOG */}
      <Dialog open={openStory} fullScreen>
        <Box
          sx={{
            height: "100%",
            bgcolor: storyBg,
            display: "flex",
            flexDirection: "column",
            p: 2
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <IconButton onClick={() => setOpenStory(false)} sx={{ color: "#fff" }}>
              <CloseRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Create Story
            </Typography>
            <Box sx={{ width: 40 }} />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              {storyPreview ? (
                <Box sx={{ position: "relative", mb: 3 }}>
                  <img
                    src={storyPreview}
                    style={{
                      width: "100%",
                      borderRadius: 16,
                      maxHeight: 500,
                      objectFit: "contain"
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setStoryFile(null);
                      setStoryPreview(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.5)",
                      color: "#fff"
                    }}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
              ) : (
                <TextField
                  placeholder="What's on your mind?"
                  fullWidth
                  multiline
                  minRows={6}
                  variant="standard"
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    sx: { color: "#fff", fontSize: "1.5rem", fontWeight: 500 }
                  }}
                  sx={{ mb: 3 }}
                />
              )}

              <Stack direction="row" spacing={1} mb={3} justifyContent="center">
                {STORY_COLORS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setStoryBg(color)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      border: storyBg === color ? "3px solid #fff" : "none",
                      transition: "all 0.2s",
                      "&:hover": { transform: "scale(1.1)" }
                    }}
                  />
                ))}
              </Stack>

              <Stack spacing={2}>
                <Button
                  component="label"
                  fullWidth
                  variant="contained"
                  startIcon={<ImageRoundedIcon />}
                  sx={{ bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#f0f0f0" } }}
                >
                  Upload Media
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setStoryFile(file);
                        setStoryPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={submitStory}
                  disabled={!storyText.trim() && !storyFile}
                  sx={{ bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#f0f0f0" } }}
                >
                  Share Story
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* REPORT DIALOG */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Report {reportTarget?.type}</Typography>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Reason"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            sx={{ mt: 2 }}
            label="Description (optional)"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={submitReport} disabled={!reportReason}>Submit</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
    </Box>
  );
}