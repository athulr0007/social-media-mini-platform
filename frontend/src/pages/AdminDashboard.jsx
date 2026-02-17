import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Select,
  MenuItem,
  Divider,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Fade,
  Grow
} from "@mui/material";
import adminApi from "../services/adminApi";
import reportApi from "../services/reportApi";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";

const StatCard = ({ label, value, icon: Icon, color, gradient, delay = 0 }) => (
  <Grow in timeout={600 + delay}>
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        background: gradient || `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
        border: `2px solid ${color}40`,
        borderRadius: 4,
        height: "100%",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -20,
          right: -40,
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          background: `radial-gradient(circle, ${color}25, transparent)`,
          borderRadius: "50%",
          transition: "all 0.4s"
        },
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 20px 40px ${color}30`,
          border: `2px solid ${color}80`,
          "&::before": {
            transform: "scale(1.3)",
            opacity: 0.6
          },
          "& .stat-icon": {
            transform: "scale(1.15) rotate(10deg)"
          }
        }
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box sx={{ zIndex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mb: { xs: 0.5, md: 1 }, 
              textTransform: "uppercase", 
              letterSpacing: 1.5, 
              fontWeight: 700, 
              fontSize: { xs: "0.65rem", md: "0.75rem" },
              opacity: 0.8
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="h2" 
            fontWeight={900} 
            sx={{ 
              color, 
              lineHeight: 1,
              fontSize: { xs: "2rem", md: "2.5rem" },
              textShadow: `0 2px 8px ${color}40`
            }}
          >
            {value}
          </Typography>
        </Box>
        {Icon && (
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              width: { xs: 48, md: 56 },
              height: { xs: 48, md: 56 }
            }}
          >
            <Icon 
              className="stat-icon" 
              sx={{ 
                fontSize: { xs: 28, md: 32 }, 
                color, 
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }} 
            />
          </Avatar>
        )}
      </Stack>
    </Card>
  </Grow>
);

const ReportItem = ({ report }) => {
  const statusColor = {
    open: "#ff6b6b",
    actioned: "#51cf66",
    dismissed: "#a9a9a9"
  }[report.status];

  return (
    <ListItem
      divider
      sx={{
        p: { xs: 1.5, md: 2 },
        borderLeft: `4px solid ${statusColor}`,
        transition: "all 0.3s ease",
        borderRadius: 1,
        mb: 0.5,
        "&:hover": { 
          bgcolor: "rgba(255,255,255,0.05)",
          transform: "translateX(6px)",
          boxShadow: `0 4px 12px ${statusColor}25`
        }
      }}
    >
      <ListItemText
        primary={
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            alignItems={{ xs: "flex-start", sm: "center" }} 
            gap={1}
          >
            <Typography 
              fontWeight={600} 
              sx={{ 
                fontSize: { xs: "0.85rem", md: "0.95rem" }, 
                color: "#fff" 
              }}
            >
              {report.type.toUpperCase()} — {report.reason}
            </Typography>
            <Chip 
              label={report.status} 
              size="small" 
              sx={{ 
                bgcolor: `${statusColor}20`, 
                color: statusColor,
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 24,
                textTransform: "uppercase",
                letterSpacing: 0.5
              }} 
            />
          </Stack>
        }
        secondary={
          <Typography 
            sx={{ 
              color: "#aaa", 
              fontSize: { xs: "0.75rem", md: "0.875rem" },
              mt: 0.5
            }}
          >
            {report.description || report.reporter?.username || "—"}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const load = async () => {
    try {
      const [dashboardRes, reportsRes] = await Promise.all([
        adminApi.getDashboard(),
        reportApi.getReports()
      ]);
      setStats(dashboardRes.data);
      setReports(reportsRes.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)"
        }}
      >
        <Typography variant="h5" sx={{ color: "#667eea" }}>Loading dashboard…</Typography>
      </Box>
    );
  }

  const filteredReports =
    filter === "all"
      ? stats.recentReports
      : stats.recentReports.filter(r => r.status === filter);

  const reportsByType = reports.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const totalReports = reports.length || 1;

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)", 
        minHeight: "100vh",
        pt: { xs: "80px", md: 4 }
      }}
    >
      {/* Header */}
      <Fade in timeout={800}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={{ xs: 2, md: 0 }}
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"}
              fontWeight={900} 
              sx={{ 
                mb: 1, 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                backgroundClip: "text", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                letterSpacing: -1
              }}
            >
              Dashboard
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: "0.85rem", md: "0.95rem" }, 
                color: "#aaa" 
              }}
            >
              System overview & quick actions
            </Typography>
          </Box>

          <Stack direction="row" gap={1.5}>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: "rgba(102, 126, 234, 0.1)",
                border: "1px solid rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.2)"
                }
              }}
            >
              <RefreshIcon 
                sx={{ 
                  color: "#667eea",
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" }
                  }
                }} 
              />
            </IconButton>

            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/admin/reports")}
              fullWidth={isMobile}
              sx={{ 
                borderRadius: 2.5, 
                textTransform: "none", 
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 700,
                px: { xs: 2, md: 3 },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)"
                }
              }}
            >
              Manage Reports
            </Button>
          </Stack>
        </Stack>
      </Fade>

      {/* Stats Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Total Users"
            value={stats.usersCount}
            icon={PeopleIcon}
            color="#667eea"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Total Posts"
            value={stats.postsCount}
            icon={PostAddIcon}
            color="#764ba2"
            delay={100}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatCard
            label="Open Reports"
            value={stats.pendingReports}
            icon={WarningIcon}
            color="#ff6b6b"
            delay={200}
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
        <Grid item xs={12} md={6}>
          <Grow in timeout={900}>
            <Card 
              sx={{ 
                p: { xs: 2.5, md: 3 }, 
                borderRadius: 4, 
                background: "linear-gradient(135deg, #51cf6620 0%, #51cf6605 100%)", 
                border: "2px solid #51cf6640",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(81, 207, 102, 0.2)",
                  transform: "translateY(-4px)"
                }
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 0.5, 
                      textTransform: "uppercase", 
                      letterSpacing: 1.5, 
                      fontWeight: 700, 
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      opacity: 0.8
                    }}
                  >
                    Active Users (7 Days)
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h4" : "h3"} 
                    fontWeight={900} 
                    sx={{ 
                      color: "#51cf66",
                      textShadow: "0 2px 8px rgba(81, 207, 102, 0.4)"
                    }}
                  >
                    {stats.activeUsersCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#51cf6615", width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ color: "#51cf66", fontSize: 32 }} />
                </Avatar>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={(stats.activeUsersCount / stats.usersCount) * 100} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5, 
                  bgcolor: "#51cf6620", 
                  "& .MuiLinearProgress-bar": { 
                    background: "linear-gradient(90deg, #51cf66, #37b24d)",
                    borderRadius: 5
                  } 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  display: "block", 
                  color: "#51cf66",
                  fontWeight: 600
                }}
              >
                {((stats.activeUsersCount / stats.usersCount) * 100).toFixed(1)}% of total users
              </Typography>
            </Card>
          </Grow>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grow in timeout={1000}>
            <Card 
              sx={{ 
                p: { xs: 2.5, md: 3 }, 
                borderRadius: 4, 
                background: "linear-gradient(135deg, #fcc41920 0%, #fcc41905 100%)", 
                border: "2px solid #fcc41940",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(252, 196, 25, 0.2)",
                  transform: "translateY(-4px)"
                }
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 0.5, 
                      textTransform: "uppercase", 
                      letterSpacing: 1.5, 
                      fontWeight: 700, 
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      opacity: 0.8
                    }}
                  >
                    Hidden Posts
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h4" : "h3"} 
                    fontWeight={900} 
                    sx={{ 
                      color: "#fcc419",
                      textShadow: "0 2px 8px rgba(252, 196, 25, 0.4)"
                    }}
                  >
                    {stats.hiddenPosts}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#fcc41915", width: 56, height: 56 }}>
                  <VisibilityOffIcon sx={{ color: "#fcc419", fontSize: 32 }} />
                </Avatar>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={(stats.hiddenPosts / stats.postsCount) * 100} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5, 
                  bgcolor: "#fcc41920", 
                  "& .MuiLinearProgress-bar": { 
                    background: "linear-gradient(90deg, #fcc419, #f08c00)",
                    borderRadius: 5
                  } 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  display: "block", 
                  color: "#fcc419",
                  fontWeight: 600
                }}
              >
                {((stats.hiddenPosts / stats.postsCount) * 100).toFixed(1)}% of total posts
              </Typography>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Recent Reports */}
        <Grid item xs={12} lg={6}>
          <Fade in timeout={1100}>
            <Card 
              sx={{ 
                p: { xs: 2.5, md: 3 }, 
                borderRadius: 4, 
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.3s"
              }}
            >
              <Stack 
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between" 
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={{ xs: 1.5, sm: 0 }}
                sx={{ mb: 2.5 }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight={800} 
                  sx={{ 
                    color: "#fff",
                    fontSize: { xs: "1.1rem", md: "1.25rem" }
                  }}
                >
                  Recent Reports
                </Typography>

                <Select
                  size="small"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  fullWidth={isMobile}
                  sx={{ 
                    borderRadius: 2, 
                    minWidth: { xs: "100%", sm: 140 },
                    bgcolor: "rgba(255,255,255,0.05)",
                    "& .MuiSelect-select": {
                      py: 1
                    },
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.08)"
                    }
                  }}
                >
                  <MenuItem value="all">All Reports</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="actioned">Actioned</MenuItem>
                  <MenuItem value="dismissed">Dismissed</MenuItem>
                </Select>
              </Stack>

              <Divider sx={{ mb: 2, opacity: 0.2 }} />

              <List 
                disablePadding 
                sx={{ 
                  maxHeight: { xs: 400, md: 500 }, 
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: 8
                  },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 4
                  },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "rgba(102, 126, 234, 0.5)",
                    borderRadius: 4,
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.7)"
                    }
                  }
                }}
              >
                {filteredReports.length === 0 && (
                  <Typography
                    sx={{ 
                      p: { xs: 3, md: 4 }, 
                      textAlign: "center", 
                      color: "#888",
                      fontSize: { xs: "0.9rem", md: "1rem" }
                    }}
                  >
                    No reports found
                  </Typography>
                )}

                {filteredReports.map((r, idx) => (
                  <Fade in key={r._id} timeout={400 + idx * 100}>
                    <div>
                      <ReportItem report={r} />
                    </div>
                  </Fade>
                ))}
              </List>
            </Card>
          </Fade>
        </Grid>

        {/* Reports by Type */}
        <Grid item xs={12} lg={6}>
          <Fade in timeout={1200}>
            <Card 
              sx={{ 
                p: { xs: 2.5, md: 3 }, 
                borderRadius: 4, 
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)"
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={800} 
                sx={{ 
                  mb: 3, 
                  color: "#fff",
                  fontSize: { xs: "1.1rem", md: "1.25rem" }
                }}
              >
                Reports by Type
              </Typography>

              {Object.keys(reportsByType).length === 0 && (
                <Typography 
                  sx={{ 
                    textAlign: "center", 
                    p: { xs: 3, md: 4 }, 
                    color: "#888",
                    fontSize: { xs: "0.9rem", md: "1rem" }
                  }}
                >
                  No reports yet
                </Typography>
              )}

              {Object.entries(reportsByType).map(([type, count], idx) => {
                const color = type === "post" ? "#667eea" : "#ff6b6b";
                const percentage = (count / totalReports) * 100;
                return (
                  <Grow in key={type} timeout={800 + idx * 200}>
                    <Box sx={{ mb: 3 }}>
                      <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center"
                        sx={{ mb: 1.5 }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textTransform: "capitalize", 
                            fontWeight: 700, 
                            color: "#fff",
                            fontSize: { xs: "0.9rem", md: "1rem" }
                          }}
                        >
                          {type} Reports
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: "#888",
                              fontSize: { xs: "0.75rem", md: "0.85rem" }
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </Typography>
                          <Chip 
                            label={count} 
                            size="small" 
                            sx={{ 
                              bgcolor: `${color}20`, 
                              color,
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              height: 28,
                              minWidth: 45
                            }} 
                          />
                        </Stack>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          bgcolor: `${color}10`,
                          "& .MuiLinearProgress-bar": { 
                            background: `linear-gradient(90deg, ${color}, ${color}dd)`, 
                            borderRadius: 6,
                            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: `0 2px 8px ${color}40`
                          }
                        }}
                      />
                    </Box>
                  </Grow>
                );
              })}
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}