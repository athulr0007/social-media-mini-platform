import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
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
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Paper,
  Fade,
  Grow
} from "@mui/material";
import MediaDisplay from "../components/MediaDisplay";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

const formatTimeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export default function Explore() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [comments, setComments] = useState({});
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    loadExplorePosts();
    loadSuggestedUsers();
    loadFollowingList();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const loadFollowingList = async () => {
    if (!user?._id) {
      console.warn("User ID not available");
      return;
    }
    try {
      const res = await API.get(`/users/${user._id}`);
      setFollowingList(res.data.following || []);
    } catch (err) {
      console.error("Failed to load following list:", err);
    }
  };

  const loadExplorePosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts/explore");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load explore posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedUsers = async () => {
    try {
      const res = await API.get("/users/suggestions");
      setSuggestedUsers(res.data);
    } catch (err) {
      console.error("Failed to load suggestions:", err);
    }
  };

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      const res = await API.get(`/users/search?q=${searchQuery}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearchLoading(false);
    }
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

  const toggleFollow = async (userId) => {
    try {
      await API.put(`/users/${userId}/follow`);
      
      setFollowingList((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );

      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                followers: followingList.includes(userId)
                  ? u.followers.filter((id) => id !== user._id)
                  : [...u.followers, user._id]
              }
            : u
        )
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                followers: followingList.includes(userId)
                  ? u.followers.filter((id) => id !== user._id)
                  : [...u.followers, user._id]
              }
            : u
        )
      );
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

if (loading) {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4, px: 2 }}>
      {[1, 2].map((i) => (
        <Card
          key={i}
          sx={{
            mb: 3,
            borderRadius: 3
          }}
        >
          <CardHeader
            avatar={
              <Skeleton variant="circular" width={44} height={44} />
            }
            title={<Skeleton width="40%" />}
            subheader={<Skeleton width="25%" />}
          />

          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ bgcolor: "action.hover" }}
          />

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
<Box sx={{ minHeight: "100vh", pb: 6, bgcolor: "background.default" }}>
      <Box sx={{ maxWidth: 935, mx: "auto", px: 3, py: 4 }}>
        {/* HEADER */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              fontWeight={700}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Explore
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Discover new posts and connect with people
            </Typography>
          </Box>
        </Fade>

        {/* SEARCH BAR */}
        <Fade in timeout={800}>
          <Paper 
sx={{
  p: 2.5,
  mb: 4,
  borderRadius: 3,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider"
}}

          >
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
bgcolor: "background.default",
                  borderRadius: 2,
                  "& fieldset": { borderColor: "divider"

                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(102, 126, 234, 0.3)"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                    borderWidth: "2px"
                  }
                }
              }}
            />
          </Paper>
        </Fade>

        {/* SEARCH RESULTS */}
        {searchQuery.trim() && (
          <Fade in>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Search Results
              </Typography>

              {searchLoading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={80} sx={{ borderRadius: 2 }} />
                  ))}
                </Stack>
              ) : users.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {users.map((u, index) => {
                    const isFollowing = followingList.includes(u._id);

                    return (
                      <Grow key={u._id} in timeout={400 + index * 100}>
                        <Paper 
                          sx={{ 
                            p: 2.5,
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                              transform: "translateY(-2px)"
                            }
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              src={u.avatar ? `http://localhost:5000${u.avatar}` : undefined}
                              sx={{ 
                                width: 56, 
                                height: 56, 
                                cursor: "pointer",
                                border: "2px solid rgba(102, 126, 234, 0.2)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  borderColor: "#667eea"
                                }
                              }}
                              onClick={() => navigate(`/profile/${u._id}`)}
                            >
                              {!u.avatar && u.name[0]}
                            </Avatar>

                            <Box sx={{ flexGrow: 1 }}>
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ 
                                  cursor: "pointer",
                                  "&:hover": {
                                    color: "#667eea"
                                  }
                                }}
                                onClick={() => navigate(`/profile/${u._id}`)}
                              >
                                {u.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {u.followers.length} followers
                              </Typography>
                            </Box>

                            <Button
                              variant={isFollowing ? "outlined" : "contained"}
                              startIcon={
                                isFollowing ? (
                                  <PersonRemoveRoundedIcon />
                                ) : (
                                  <PersonAddRoundedIcon />
                                )
                              }
                              onClick={() => toggleFollow(u._id)}
                              sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                ...(isFollowing ? {} : {
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  "&:hover": {
                                    background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)"
                                  }
                                })
                              }}
                            >
                              {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                          </Stack>
                        </Paper>
                      </Grow>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Fade>
        )}

        {/* TABS */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <Paper
            sx={{
              p: "6px",
              borderRadius: "999px",
bgcolor: "background.paper",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <Tabs 
              value={tab} 
              onChange={(e, v) => setTab(v)}
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                minHeight: "auto",
                "& .MuiTab-root": {
                  minHeight: "40px",
                  px: 4,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
color: "text.secondary",
                  "&.Mui-selected": {
                    color: "#fff",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                  }
                }
              }}
            >
              <Tab icon={<ExploreRoundedIcon />} iconPosition="start" label="Posts" value="posts" />
              <Tab icon={<PeopleRoundedIcon />} iconPosition="start" label="People" value="people" />
            </Tabs>
          </Paper>
        </Box>

        {/* POSTS TAB */}
        {tab === "posts" && (
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            {posts.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <ExploreRoundedIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography color="text.secondary">
                  No posts to explore yet
                </Typography>
              </Paper>
            ) : (
              posts.map((post, index) => {
                const liked = post.likes.includes(user._id);

                return (
                  <Grow key={post._id} in timeout={400 + index * 150}>
                    <Card sx={{ mb: 3, borderRadius: 3 }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            src={post.user?.avatar ? `http://localhost:5000${post.user.avatar}` : undefined}
                            sx={{ 
                              cursor: "pointer", 
                              width: 44, 
                              height: 44,
                              border: "2px solid rgba(102, 126, 234, 0.15)"
                            }}
                            onClick={() => navigate(`/profile/${post.user?._id}`)}
                          >
                            {!post.user?.avatar && (post.user?.name?.[0] || "?")}
                          </Avatar>
                        }
                        title={
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{ 
                              cursor: "pointer",
                              "&:hover": {
                                color: "#667eea"
                              }
                            }}
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
                          <IconButton size="small">
                            <MoreHorizRoundedIcon />
                          </IconButton>
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
                        <IconButton 
                          onClick={() => toggleLike(post._id)} 
                          size="small"
                          sx={{
                            transition: "transform 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)"
                            }
                          }}
                        >
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
                          {comments[post._id]?.length || 0}
                        </Typography>
                      </CardActions>

                      <Collapse in={activeComment === post._id}>
                        <Divider />
                        <Box sx={{ p: 2, bgcolor: "background.default"
 }}>
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
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2
                                }
                              }}
                            />
                            <IconButton
                              onClick={() => submitComment(post._id)}
                              disabled={!commentText.trim()}
                              size="small"
                              sx={{
                                background: commentText.trim() 
                                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                  : "rgba(0, 0, 0, 0.1)",
                                color: "#fff",
                                "&:hover": {
                                  background: commentText.trim()
                                    ? "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)"
                                    : "rgba(0, 0, 0, 0.15)"
                                }
                              }}
                            >
                              <SendRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Collapse>
                    </Card>
                  </Grow>
                );
              })
            )}
          </Box>
        )}

        {/* PEOPLE TAB */}
        {tab === "people" && (
          <Box>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Suggested for you
            </Typography>

            {suggestedUsers.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <PeopleRoundedIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography color="text.secondary">
                  No suggestions available
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 3
                }}
              >
                {suggestedUsers.map((u, index) => {
                  const isFollowing = followingList.includes(u._id);

                  return (
                    <Grow key={u._id} in timeout={400 + index * 100}>
                      <Card 
                        sx={{ 
                          p: 3, 
                          textAlign: "center",
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                            transform: "translateY(-4px)"
                          }
                        }}
                      >
                        <Avatar
                          src={u.avatar ? `http://localhost:5000${u.avatar}` : undefined}
                          sx={{
                            width: 80,
                            height: 80,
                            mx: "auto",
                            mb: 2,
                            cursor: "pointer",
                            border: "3px solid rgba(102, 126, 234, 0.2)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.08)",
                              borderColor: "#667eea",
                              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)"
                            }
                          }}
                          onClick={() => navigate(`/profile/${u._id}`)}
                        >
                          {!u.avatar && u.name[0]}
                        </Avatar>

                        <Typography
                          variant="h6"
                          fontWeight={600}
                          mb={0.5}
                          sx={{ 
                            cursor: "pointer",
                            "&:hover": {
                              color: "#667eea"
                            }
                          }}
                          onClick={() => navigate(`/profile/${u._id}`)}
                        >
                          {u.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" mb={2} display="block">
                          {u.followers.length} followers
                        </Typography>

                        <Button
                          fullWidth
                          variant={isFollowing ? "outlined" : "contained"}
                          onClick={() => toggleFollow(u._id)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1,
                            ...(isFollowing ? {} : {
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              "&:hover": {
                                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                                transform: "scale(1.02)"
                              }
                            })
                          }}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      </Card>
                    </Grow>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}