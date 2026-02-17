import { 
  Box, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  AppBar, 
  Typography, 
  Avatar, 
  IconButton,
  Divider,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ReportIcon from "@mui/icons-material/Report";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminRoute from "../components/AdminRoute";
import AdminDashboard from "./AdminDashboard";
import AdminReports from "./AdminReports";
import AdminUsers from "./AdminUsers";
import AdminPosts from "./AdminPosts";
import AdminLogs from "./AdminLogs";

const drawerWidth = 260;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: DashboardIcon },
    { path: "/admin/users", label: "Users", icon: PeopleIcon },
    { path: "/admin/posts", label: "Posts", icon: PostAddIcon },
    { path: "/admin/reports", label: "Reports", icon: ReportIcon },
    { path: "/admin/logs", label: "Audit Logs", icon: ListAltIcon }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar />
      
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <AdminPanelSettingsIcon 
          sx={{ 
            fontSize: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        />
        <Typography 
          variant="body2" 
          fontWeight={700}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          ADMIN PANEL
        </Typography>
      </Box>
      
      <Divider sx={{ opacity: 0.1 }} />

      <List sx={{ p: 1 }}>
        {menuItems.map(({ path, label, icon: Icon }) => (
          <ListItemButton
            key={path}
            onClick={() => {
              navigate(path);
              if (isMobile) setMobileOpen(false);
            }}
            selected={isActive(path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: "all 0.2s",
              color: isActive(path) ? "#667eea" : "inherit",
              background: isActive(path) 
                ? "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)"
                : "transparent",
              border: isActive(path) ? "1px solid rgba(102, 126, 234, 0.3)" : "1px solid transparent",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                transform: "translateX(4px)"
              },
              "& .MuiListItemIcon-root": {
                color: isActive(path) ? "#667eea" : "inherit",
                transition: "all 0.2s"
              }
            }}
          >
            <ListItemIcon><Icon /></ListItemIcon>
            <ListItemText 
              primary={label}
              primaryTypographyProps={{ fontWeight: isActive(path) ? 700 : 500, fontSize: "0.95rem", color: "#fff" }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <AdminRoute>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            ml: { md: drawerWidth },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            background: "linear-gradient(135deg, rgba(31, 31, 63, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(102, 126, 234, 0.2)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <AdminPanelSettingsIcon 
                sx={{ 
                  fontSize: { xs: 24, md: 28 },
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              />
              <Typography 
                variant="h6" 
                fontWeight={700}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1rem", md: "1.25rem" }
                }}
              >
                Admin Console
              </Typography>
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
              {!isMobile && (
                <Typography sx={{ fontSize: "0.95rem", color: "#fff" }}>
                  {user?.name}
                </Typography>
              )}
              <Avatar 
                src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
                sx={{
                  width: { xs: 32, md: 36 },
                  height: { xs: 32, md: 36 },
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 700
                }}
              >
                {!user?.avatar && (user?.name?.[0] || "A")}
              </Avatar>
              <IconButton 
                color="inherit" 
                onClick={logout}
                sx={{
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(255, 107, 107, 0.1)"
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  background: "linear-gradient(180deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
                  border: "none",
                  borderRight: "1px solid rgba(102, 126, 234, 0.2)"
                }
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  background: "linear-gradient(180deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
                  border: "none",
                  borderRight: "1px solid rgba(102, 126, 234, 0.2)"
                }
              }}
              open
            >
              {drawerContent}
            </Drawer>
          )}
        </Box>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            mt: "64px",
            width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` }
          }}
        >
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="logs" element={<AdminLogs />} />
          </Routes>
        </Box>
      </Box>
    </AdminRoute>
  );
}