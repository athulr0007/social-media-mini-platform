import { Box, IconButton, Tooltip, Avatar, useMediaQuery, useTheme } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const { activities = [] } = useActivity() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = (path) => location.pathname === path;

  const unreadCount = activities.length;

  const navItems = [
    { icon: <HomeRoundedIcon />, path: "/", label: "Home" },
    { icon: <ExploreRoundedIcon />, path: "/explore", label: "Explore" },
    { icon: <AddCircleOutlineRoundedIcon />, path: "/create", label: "Create" },
    { 
      icon: <ChatBubbleOutlineRoundedIcon />, 
      path: "/inbox", 
      label: "Messages",
      isActiveCheck: (pathname) => pathname === "/inbox" || pathname.startsWith("/messages")
    },
    {
      icon: <NotificationsNoneRoundedIcon />,
      path: "/notifications",
      label: "Notifications",
      badge: unreadCount > 0 ? unreadCount : null
    }
  ];

// MOBILE BOTTOM NAVBAR
if (isMobile) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        zIndex: 1100,
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        px: 1
      }}
    >
      {/* Only 4 core nav items - no notifications icon */}
      {navItems.filter(item => item.path !== "/notifications").map((item) => {
        const active = item.isActiveCheck
          ? item.isActiveCheck(location.pathname)
          : isActive(item.path);

        return (
          <IconButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              position: "relative",
              color: active ? "#667eea" : "rgba(0, 0, 0, 0.6)",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#667eea",
                bgcolor: "rgba(102, 126, 234, 0.08)"
              },
              "&::after": active
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60%",
                    height: "3px",
                    borderRadius: "0 0 3px 3px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)"
                  }
                : {}
            }}
          >
            {item.icon}
          </IconButton>
        );
      })}

      {user?.isAdmin && (
        <IconButton
          onClick={() => navigate("/admin")}
          sx={{
            color: isActive("/admin") ? "#667eea" : "rgba(0, 0, 0, 0.6)"
          }}
        >
          <AdminPanelSettingsIcon />
        </IconButton>
      )}

      {/* PROFILE AVATAR - tapping navigates to profile, badge shows unread notifications */}
      <Box sx={{ position: "relative" }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            cursor: "pointer",
            border: "2px solid",
            borderColor: isActive("/profile") || isActive("/notifications")
              ? "#667eea"
              : "transparent",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#667eea",
              transform: "scale(1.05)"
            }
          }}
          src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
          onClick={() => navigate("/profile")}
        >
          {!user?.avatar && (user?.name?.[0] || "U")}
        </Avatar>

        {/* Notification badge dot on avatar */}
        {unreadCount > 0 && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              navigate("/notifications");
            }}
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 18,
              height: 18,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.55rem",
              fontWeight: 700,
              color: "#fff",
              border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(102,126,234,0.6)",
              cursor: "pointer",
              zIndex: 1
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Box>
        )}
      </Box>
    </Box>
  );
}

  // DESKTOP SIDEBAR
  return (
    <Box
      sx={{
        width: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        position: "sticky",
        top: 0,
        height: "100vh",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderRight: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.04)"
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(102,126,234,0.4)",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 8px 20px rgba(102,126,234,0.5)"
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            transition: "left 0.5s ease"
          },
          "&:hover::before": {
            left: "100%"
          }
        }}
        onClick={() => navigate("/")}
      >
        <FlashOnIcon sx={{ fontSize: 28, color: "#fff", zIndex: 2 }} />
      </Box>

      {/* NAV ITEMS */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        {navItems.map((item) => {
          const active = item.isActiveCheck
            ? item.isActiveCheck(location.pathname)
            : isActive(item.path);

          return (
            <Tooltip key={item.path} title={item.label} placement="right">
              <IconButton
                onClick={() => navigate(item.path)}
                sx={{
                  position: "relative",
                  color: active ? "#667eea" : "rgba(0, 0, 0, 0.6)",
                  bgcolor: active ? "rgba(102, 126, 234, 0.1)" : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#667eea",
                    bgcolor: "rgba(102, 126, 234, 0.12)",
                    transform: "scale(1.1)"
                  },
                  "&::before": active ? {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "60%",
                    borderRadius: "0 3px 3px 0",
                    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "2px 0 8px rgba(102, 126, 234, 0.4)"
                  } : {}
                }}
              >
                {item.icon}

                {/* Badge */}
                {item.badge && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      minWidth: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(102,126,234,0.6)",
                      border: "1.5px solid #fff"
                    }}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </Box>
                )}
              </IconButton>
            </Tooltip>
          );
        })}

        {user?.isAdmin && (
          <Tooltip title="Admin" placement="right">
            <IconButton
              onClick={() => navigate("/admin")}
              sx={{
                position: "relative",
                color: isActive("/admin") ? "#667eea" : "rgba(0, 0, 0, 0.6)",
                bgcolor: isActive("/admin") ? "rgba(102, 126, 234, 0.1)" : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#667eea",
                  bgcolor: "rgba(102, 126, 234, 0.12)",
                  transform: "scale(1.1)"
                }
              }}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* PROFILE AVATAR */}
      <Tooltip title="Profile" placement="right">
        <Avatar
          sx={{
            width: 44,
            height: 44,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            border: "2px solid",
            borderColor: isActive("/profile") ? "#667eea" : "transparent",
            transition: "all 0.3s ease",
            boxShadow: isActive("/profile")
              ? "0 4px 12px rgba(102, 126, 234, 0.3)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              borderColor: "#667eea",
              transform: "scale(1.1)",
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)"
            }
          }}
          src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
          onClick={() => navigate("/profile")}
        >
          {!user?.avatar && (user?.name?.[0] || "U")}
        </Avatar>
      </Tooltip>

      {/* LOGOUT */}
      <Box sx={{ mt: "auto" }}>
        <Tooltip title="Logout" placement="right">
          <IconButton
            onClick={logout}
            sx={{
              color: "rgba(0, 0, 0, 0.6)",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#dc2626",
                bgcolor: "rgba(220, 38, 38, 0.08)",
                transform: "scale(1.1)"
              }
            }}
          >
            <LogoutRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}