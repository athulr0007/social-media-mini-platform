import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography } from "@mui/material";

export default function OAuthSuccess() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { search } = useLocation();

 useEffect(() => {
  const params = new URLSearchParams(search);
  const token = params.get("token");

  if (!token) {
    navigate("/login");
    return;
  }

  const user = {
    _id: params.get("id"),
    username: params.get("username"),
    name: params.get("name"),
    email: params.get("email"),
    avatar: params.get("avatar"),
    token
  };

  login(user);
  navigate("/");
}, []); 

  return (
    <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h6">Signing you in…</Typography>
    </Box>
  );
}
