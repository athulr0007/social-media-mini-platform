import { useContext } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle({ size = "medium" }) {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="left">
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "relative",
        width:
  size === "large" ? 56 :
  size === "medium" ? 44 :
  36,

height:
  size === "large" ? 56 :
  size === "medium" ? 44 :
  36,

          background: isDark
            ? "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: isDark
            ? "1.5px solid rgba(102, 126, 234, 0.3)"
            : "1.5px solid rgba(255, 193, 7, 0.3)",
          boxShadow: isDark
            ? "0 4px 16px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            : "0 4px 16px rgba(255, 193, 7, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transition: "left 0.6s ease"
          },
          "&:hover": {
            transform: "scale(1.08) rotate(10deg)",
            boxShadow: isDark
              ? "0 8px 24px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              : "0 8px 24px rgba(255, 193, 7, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            border: isDark
              ? "1.5px solid rgba(102, 126, 234, 0.5)"
              : "1.5px solid rgba(255, 193, 7, 0.5)",
            background: isDark
              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
              : "linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%)",
            "&::before": {
              left: "100%"
            }
          },
          "&:active": {
            transform: "scale(0.95) rotate(0deg)"
          }
        }}
      >
        {/* Background glow effect */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, transparent 70%)",
            filter: "blur(10px)",
            animation: "pulse 2s ease-in-out infinite"
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDark ? "#667eea" : "#ff9800",
            transition: "all 0.4s ease",
            animation: isDark ? "rotate 20s linear infinite" : "none"
          }}
        >
          {isDark ? (
            <DarkModeRoundedIcon
  sx={{
    fontSize:
      size === "large" ? 26 :
      size === "medium" ? 22 :
      18
  }}
/>

          ) : (
<DarkModeRoundedIcon
  sx={{
    fontSize:
      size === "large" ? 26 :
      size === "medium" ? 22 :
      18
  }}
/>
          )}
        </Box>

        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.1); }
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </IconButton>
    </Tooltip>
  );
}