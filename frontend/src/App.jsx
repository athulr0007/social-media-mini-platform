import { Box } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";

import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { getTheme } from "./theme";

import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import PrivateRoute from "./components/PrivateRoute";

import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import Messages from "./pages/Messages";
import Inbox from "./pages/Inbox";
import Explore from "./pages/Explore";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminReports from "./pages/AdminReports";
import AdminLayout from "./pages/AdminLayout";
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";
import AdminLogs from "./pages/AdminLogs";
import Notifications from "./pages/Notifications ";
import { ActivityProvider } from "./context/ActivityContext";
import { SocketProvider } from "./context/SocketContext";

function AppContent() {
  const location = useLocation();
  const { mode } = useContext(ThemeContext);
  const theme = getTheme(mode);
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {!isAuthPage && !isAdminPage && <Sidebar />}

        <Box sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column",
          minWidth: 0,
          overflowX: "hidden"
        }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />

            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/inbox"
              element={
                <PrivateRoute>
                  <Inbox />
                </PrivateRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />

            <Route
              path="/messages/:id"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />

            <Route path="/explore" element={<Explore />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </Box>

        {!isAuthPage && !isAdminPage && location.pathname === "/" && <RightSidebar />}
      </Box>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SocketProvider>
          <ActivityProvider>
            <AppContent />
          </ActivityProvider>
        </SocketProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;