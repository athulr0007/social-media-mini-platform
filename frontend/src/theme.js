import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === "light" ? "#18181b" : "#667eea",
      light: mode === "light" ? "#27272a" : "#764ba2",
      dark: mode === "light" ? "#09090b" : "#5568d3",
      contrastText: "#fafafa"
    },
    secondary: {
      main: mode === "light" ? "#71717a" : "#a1a1aa",
      light: mode === "light" ? "#a1a1aa" : "#d4d4d8",
      dark: mode === "light" ? "#52525b" : "#71717a"
    },
    background: {
      default: mode === "light" ? "#fafafa" : "#0f0f0f",
      paper: mode === "light" ? "#ffffff" : "#1a1a1a"
    },
    text: {
      primary: mode === "light" ? "#18181b" : "#fafafa",
      secondary: mode === "light" ? "#71717a" : "#a1a1aa",
      disabled: mode === "light" ? "#a1a1aa" : "#71717a"
    },
    divider: mode === "light" ? "#e4e4e7" : "#27272a",
    error: {
      main: "#dc2626"
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.02em"
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em"
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.01em"
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      letterSpacing: "0.00938em"
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.00714em"
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.02em"
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.66,
      letterSpacing: "0.03333em"
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    "none",
    mode === "light" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" : "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 25px 50px -12px rgb(0 0 0 / 0.25)" : "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" : "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 25px 50px -12px rgb(0 0 0 / 0.25)" : "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" : "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 25px 50px -12px rgb(0 0 0 / 0.25)" : "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)",
    mode === "light" ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" : "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    mode === "light" ? "0 25px 50px -12px rgb(0 0 0 / 0.25)" : "0 25px 50px -12px rgb(0 0 0 / 0.5)"
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          fontSize: "0.9375rem",
          fontWeight: 500,
          boxShadow: "none",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "none",
            transform: "translateY(-1px)"
          },
          "&:active": {
            transform: "translateY(0)"
          }
        },
        contained: {
          "&:hover": {
            boxShadow: mode === "light" 
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)"
          }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: mode === "light" ? "1px solid #f4f4f5" : "1px solid #27272a",
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "light" ? "#d4d4d8" : "#3f3f46"
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1.5px",
              borderColor: mode === "light" ? "#18181b" : "#667eea"
            }
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: mode === "light" ? "#f4f4f5" : "#27272a",
            transform: "scale(1.05)"
          },
          "&:active": {
            transform: "scale(0.95)"
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          backgroundColor: mode === "light" ? "#18181b" : "#667eea"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        },
        elevation1: {
          boxShadow: mode === "light" 
            ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            : "0 1px 2px 0 rgb(0 0 0 / 0.3)"
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mode === "light" ? "#f4f4f5" : "#27272a"
        }
      }
    }
  }
});