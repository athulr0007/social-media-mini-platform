import { useState, useContext } from "react";
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
  Divider
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PeopleIcon from "@mui/icons-material/People";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOtp("");
    try {
      const res = await API.post("/auth/login", { email, password });
      setShowOtpForm(true);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/verify-login-otp", { email, otp });
      console.log("Login response:", res.data);  // ADD THIS
console.log("Avatar in login:", res.data.avatar);  // ADD THIS
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowOtpForm(false);
    setOtp("");
    setError("");
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    try {
      await API.post("/auth/resend-login-otp", { email });
      alert("OTP resent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
            left: "-5%",
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
            right: "-5%",
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
            right: "10%",
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
          zIndex: 1
        }}
      >
        {/* LEFT SIDE - BRANDING */}
        <Slide direction="right" in timeout={800}>
          <Box
            sx={{
              flex: 1,
              pr: 8,
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
                  Welcome back to
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 900
                    }}
                  >
                    your community
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
                  Connect with friends, share your moments, and discover what's happening around the world.
                </Typography>

                {/* FEATURE ICONS */}
                <Stack spacing={3}>
                  {[
                    { icon: <PhotoCameraIcon />, text: "Share photos and stories" },
                    { icon: <PeopleIcon />, text: "Connect with friends globally" },
                    { icon: <ChatBubbleIcon />, text: "Real-time messaging" }
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

        {/* RIGHT SIDE - FORM */}
        <Slide direction="left" in timeout={800}>
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
                {showOtpForm ? "Verify OTP" : "Sign in"}
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255,255,255,0.7)", 
                  mb: 4,
                  textAlign: { xs: "center", md: "left" }
                }}
              >
                {showOtpForm ? "Enter the OTP sent to your email" : "Enter your credentials to continue"}
              </Typography>

              {!showOtpForm ? (
                // LOGIN FORM
                <>
<form onSubmit={handleLogin} autoComplete="off">
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Email address"
                        type="email"
                        autoComplete="new-email"
                        value={email}
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
                        disabled={loading}
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
                          }
                        }}
                      >
                        {loading ? "Sending OTP..." : "Sign in"}
                      </Button>

                      <Divider 
                        sx={{ 
                          my: 2,
                          "&::before, &::after": {
                            borderColor: "rgba(255, 255, 255, 0.2)"
                          }
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "rgba(255, 255, 255, 0.5)",
                            px: 2
                          }}
                        >
                          or
                        </Typography>
                      </Divider>

                      <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        disabled={loading}
                        sx={{
                          py: 1.8,
                          borderRadius: 2.5,
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          color: "#fff",
                          textTransform: "none",
                          fontWeight: 600,
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "rgba(255, 255, 255, 0.4)",
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 20px rgba(255, 255, 255, 0.1)"
                          }
                        }}
                        onClick={() => {
                          const backend = (window.__ENV && window.__ENV.BACKEND_URL) || "http://localhost:5000";
                          window.location.href = `${backend}/api/auth/google`;
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continue with Google
                        </Box>
                      </Button>
                    </Stack>
                  </form>

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        style={{
                          color: "#667eea",
                          fontWeight: 600,
                          textDecoration: "none",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#764ba2"}
                        onMouseLeave={(e) => e.target.style.color = "#667eea"}
                      >
                        Create account
                      </Link>
                    </Typography>
                  </Box>
                </>
              ) : (
                // OTP VERIFICATION FORM
                <form onSubmit={handleVerifyOtp}>
                  <Stack spacing={3}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "rgba(255, 255, 255, 0.7)",
                        mb: 1,
                        textAlign: "center"
                      }}
                    >
                      OTP has been sent to <strong style={{ color: "#667eea" }}>{email}</strong>
                    </Typography>

                    <TextField
                      fullWidth
                      label="Enter 6-digit OTP"
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      required
                      disabled={loading}
                      placeholder="AB1234"
                      inputProps={{ maxLength: 6, inputMode: "text" }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px)",
                          borderRadius: 2,
                          fontSize: "1.2rem",
                          letterSpacing: "0.5em",
                          textAlign: "center",
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
                            color: "#fff",
                            textAlign: "center"
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
                      disabled={loading || otp.length !== 6}
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
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <Button
                      fullWidth
                      variant="text"
                      disabled={loading}
                      onClick={handleBackToLogin}
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          color: "#fff"
                        }
                      }}
                    >
                      ← Back to Login
                    </Button>

                    <Button
                      fullWidth
                      size="small"
                      variant="text"
                      disabled={loading || resendLoading}
                      onClick={handleResendOTP}
                      sx={{ 
                        color: "#667eea",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "rgba(102, 126, 234, 0.1)",
                          color: "#764ba2"
                        }
                      }}
                    >
                      {resendLoading ? "Resending..." : "Didn't receive code? Resend OTP"}
                    </Button>
                  </Stack>
                </form>
              )}
            </Card>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}
