import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Fade,
  Slide,
  alpha,
  CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username.length >= 3) {
        checkUsernameAvailability();
      } else {
        setUsernameAvailable(null);
        setUsernameMessage("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const checkUsernameAvailability = async () => {
    try {
      setUsernameChecking(true);
      const res = await API.get(`/auth/check-username/${username}`);
      setUsernameAvailable(res.data.available);
      setUsernameMessage(res.data.message);
    } catch (err) {
      setUsernameAvailable(null);
      setUsernameMessage("");
    } finally {
      setUsernameChecking(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (usernameAvailable !== true) {
      setError("Please choose an available username");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", { name, username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* ANIMATED BACKGROUND ELEMENTS */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          opacity: 0.4
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)",
            top: "-10%",
            right: "-5%",
            animation: "float 25s ease-in-out infinite",
            filter: "blur(60px)"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,191,255,0.3) 0%, transparent 70%)",
            bottom: "-10%",
            left: "-5%",
            animation: "float 20s ease-in-out infinite reverse",
            filter: "blur(60px)"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,0,255,0.2) 0%, transparent 70%)",
            top: "40%",
            left: "10%",
            animation: "float 30s ease-in-out infinite",
            filter: "blur(70px)"
          }}
        />
      </Box>

      <style>
        {`
          @keyframes float {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
            }
            33% { 
              transform: translate(30px, -30px) scale(1.1); 
            }
            66% { 
              transform: translate(-20px, 20px) scale(0.9); 
            }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>

      {/* MAIN CONTAINER */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          alignItems: "center",
          px: 4,
          position: "relative",
          zIndex: 1,
          flexDirection: { xs: "column", md: "row-reverse" }
        }}
      >
        {/* RIGHT SIDE - BRANDING */}
        <Slide direction="left" in timeout={800}>
          <Box
            sx={{
              flex: 1,
              pl: 8,
              display: { xs: "none", md: "block" }
            }}
          >
            <Fade in timeout={1200}>
              <Box>
                {/* LOGO */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      boxShadow: "0 10px 30px rgba(102,126,234,0.4)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <FlashOnIcon sx={{ fontSize: 40, color: "#fff", zIndex: 2 }} />
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                        animation: "sparkle 3s ease-in-out infinite"
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      letterSpacing: "0.5px"
                    }}
                  >
                    SPARK
                  </Typography>
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { md: "2.8rem", lg: "3.5rem" },
                    lineHeight: 1.2
                  }}
                >
                  Start your journey
                  <br />
                  with{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 900
                    }}
                  >
                    SPARK
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: 500
                  }}
                >
                  Join millions of users sharing their moments and connecting worldwide.
                </Typography>

                {/* FEATURE ICONS */}
                <Stack spacing={3}>
                  {[
                    { icon: <PersonAddIcon />, text: "Create your unique profile" },
                    { icon: <ExploreIcon />, text: "Follow friends and discover content" },
                    { icon: <FavoriteIcon />, text: "Share your story with the world" }
                  ].map((feature, i) => (
                    <Fade key={i} in timeout={1500 + i * 200}>
                      <Stack direction="row" spacing={2.5} alignItems="center">
                        <Box
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff"
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography 
                          sx={{ 
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "1.05rem",
                            fontWeight: 500
                          }}
                        >
                          {feature.text}
                        </Typography>
                      </Stack>
                    </Fade>
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Box>
        </Slide>

        {/* LEFT SIDE - FORM */}
        <Slide direction="right" in timeout={800}>
          <Box sx={{ flex: { xs: 1, md: 0.8 }, maxWidth: 500 }}>
            <Card
              sx={{
                p: 5,
                borderRadius: 5,
                position: "relative",
                overflow: "visible",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "2px solid rgba(255, 255, 255, 0.18)",
                boxShadow: `
                  0 8px 32px 0 rgba(31, 38, 135, 0.37),
                  0 30px 60px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                `,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)"
                }
              }}
            >
              {/* LOGO FOR MOBILE */}
              <Box 
                sx={{ 
                  display: { xs: "flex", md: "none" }, 
                  alignItems: "center", 
                  justifyContent: "center",
                  mb: 3 
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(102,126,234,0.4)"
                  }}
                >
                  <FlashOnIcon sx={{ fontSize: 35, color: "#fff" }} />
                </Box>
              </Box>

              <Typography
                variant="h4"
                fontWeight={700}
                mb={1}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: { xs: "center", md: "left" }
                }}
              >
                Create account
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255,255,255,0.7)", 
                  mb: 4,
                  textAlign: { xs: "center", md: "left" }
                }}
              >
                Join our community today
              </Typography>

<form onSubmit={submit} autoComplete="off">
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Full name"
                    value={name}
                    autoComplete="new-name"

                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          borderWidth: "1px"
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.5)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                          borderWidth: "2px"
                        },
                        "& input": {
                          color: "#fff"
                        }
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)"
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#667eea"
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    autoComplete="new-username"

                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                    required
                    disabled={loading}
                    helperText={usernameMessage || "Only letters, numbers, underscores and periods"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          borderWidth: "1px"
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.5)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                          borderWidth: "2px"
                        },
                        "&.Mui-error fieldset": {
                          borderColor: "#ff6b6b"
                        },
                        "& input": {
                          color: "#fff"
                        }
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)"
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#667eea"
                      },
                      "& .MuiInputLabel-root.Mui-error": {
                        color: "#ff6b6b"
                      },
                      "& .MuiFormHelperText-root": {
                        color: usernameAvailable === false ? "#ff6b6b" : "rgba(255, 255, 255, 0.5)"
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>@</Typography>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {usernameChecking && <CircularProgress size={20} sx={{ color: "#667eea" }} />}
                          {!usernameChecking && usernameAvailable === true && (
                            <CheckCircleIcon sx={{ color: "#4ade80" }} />
                          )}
                          {!usernameChecking && usernameAvailable === false && (
                            <CancelIcon sx={{ color: "#ff6b6b" }} />
                          )}
                        </InputAdornment>
                      )
                    }}
                    error={usernameAvailable === false}
                  />

                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={email}
                    autoComplete="new-email"

                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          borderWidth: "1px"
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.5)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                          borderWidth: "2px"
                        },
                        "& input": {
                          color: "#fff"
                        }
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)"
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#667eea"
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="new-password"

                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          borderWidth: "1px"
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.5)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                          borderWidth: "2px"
                        },
                        "& input": {
                          color: "#fff"
                        }
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)"
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#667eea"
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                            sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  {error && (
                    <Fade in>
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{
                          bgcolor: "rgba(244, 67, 54, 0.15)",
                          backdropFilter: "blur(10px)",
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid rgba(244, 67, 54, 0.3)",
                          color: "#ff6b6b"
                        }}
                      >
                        {error}
                      </Typography>
                    </Fade>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={!usernameAvailable || loading}
                    sx={{
                      py: 1.8,
                      borderRadius: 2.5,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        transition: "left 0.5s ease"
                      },
                      "&:hover": {
                        background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.6)",
                        transform: "translateY(-2px)",
                        "&::before": {
                          left: "100%"
                        }
                      },
                      "&:active": {
                        transform: "translateY(0px)"
                      },
                      "&.Mui-disabled": {
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.3)"
                      }
                    }}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#667eea",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#764ba2"}
                    onMouseLeave={(e) => e.target.style.color = "#667eea"}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Card>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}
