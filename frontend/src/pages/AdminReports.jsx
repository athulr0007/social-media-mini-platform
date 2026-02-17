import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Divider, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert,
  Card,
  Stack,
  Paper
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import HideImageIcon from "@mui/icons-material/HideImage";
import reportApi from "../services/reportApi";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await reportApi.getReports();
      setReports(res.data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "Failed to load reports" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const dismiss = async (r) => {
    try {
      await reportApi.updateReport(r._id, { action: "dismiss" });
      setToast({ type: "success", msg: "Report dismissed" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to dismiss report" });
    }
  };

  const ban = async (r) => {
    try {
      await reportApi.updateReport(r._id, { action: "banUser" });
      setToast({ type: "success", msg: "User banned" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to ban user" });
    }
  };

  const hidePost = async (r) => {
    try {
      await reportApi.updateReport(r._id, { action: "hidePost" });
      setToast({ type: "success", msg: "Post hidden" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to hide post" });
    }
  };

  const delPost = async (r) => {
    try {
      await reportApi.updateReport(r._id, { action: "deletePost" });
      setToast({ type: "success", msg: "Post deleted" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to delete post" });
    }
  };

  const statusColor = {
    open: "#ff6b6b",
    actioned: "#51cf66",
    dismissed: "#a9a9a9"
  };

  if (loading) 
    return (
      <Box sx={{ p: 4, background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)", minHeight: "100vh" }}>
        <Typography>Loading reports…</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4, background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight={800} 
          sx={{ 
            mb: 1, 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            backgroundClip: "text", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent"
          }}
        >
          Reports Management
        </Typography>
        <Typography sx={{ color: "#aaa" }}>Review and action on user and post reports</Typography>
      </Box>

      {/* Reports List */}
      <Stack spacing={2}>
        {reports.length === 0 && (
          <Paper 
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <Typography sx={{ color: "#aaa" }}>No reports found</Typography>
          </Paper>
        )}
        
        {reports.map((r) => {
          const statusCol = statusColor[r.status];
          return (
            <Card
              key={r._id}
              sx={{
                p: 3,
                borderRadius: 3,
                borderLeft: `5px solid ${statusCol}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${statusCol}40`,
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateX(4px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={700}
                      sx={{
                        background: `linear-gradient(135deg, ${statusCol}, ${statusCol}dd)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {r.type.toUpperCase()} REPORT
                    </Typography>
                    <Chip 
                      label={r.reason} 
                      size="small" 
                      sx={{ bgcolor: `${statusCol}20`, color: statusCol, fontWeight: 700 }}
                    />
                    <Chip 
                      label={r.status.toUpperCase()} 
                      size="small" 
                      sx={{ bgcolor: `${statusCol}30`, color: statusCol, fontWeight: 700 }}
                    />
                  </Stack>
                  
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {r.description}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ color: "#aaa" }}>
                    Reported by: <strong style={{ color: "#fff" }}>{r.reporter?.username || r.reporter?.email}</strong>
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2, opacity: 0.3 }} />

              {/* Actions */}
              <Stack direction="row" gap={1} flexWrap="wrap">
               <Button
  size="small"
  variant="contained"
  onClick={() => setConfirm({ type: 'dismiss', r, label: `Dismiss this report?` })}
  startIcon={<CancelRoundedIcon />}
  sx={{
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "rgba(102,126,234,0.15)",
    color: "#9aa7ff",
    "&:hover": {
      bgcolor: "rgba(102,126,234,0.25)"
    }
  }}
>
  Dismiss
</Button>


                {r.type === "user" && (
                  <Button 
                    size="small" 
                    variant="outlined"
                    color="error" 
                    onClick={() => setConfirm({ type: 'ban', r, label: `Ban user ${r.targetUser?.username}? This is IRREVERSIBLE.` })} 
                    startIcon={<BlockRoundedIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Ban User
                  </Button>
                )}

                {r.type === "post" && (
                  <>
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="warning"
                      onClick={() => setConfirm({ type: 'hidePost', r, label: `Hide post from ${r.targetPost?.user?.username}?` })} 
                      startIcon={<HideImageIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Hide Post
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="error" 
                      onClick={() => setConfirm({ type: 'delPost', r, label: `Permanently delete this post? This is IRREVERSIBLE.` })} 
                      startIcon={<DeleteRoundedIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Delete Post
                    </Button>
                  </>
                )}
              </Stack>
            </Card>
          );
        })}
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog 
        open={Boolean(confirm)} 
        onClose={() => setConfirm(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
            border: "1px solid rgba(102, 126, 234, 0.2)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Action</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>{confirm?.label}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirm(null)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={async () => { 
              setConfirm(null);
              if (confirm.type === 'dismiss') { 
                await dismiss(confirm.r); 
              } else if (confirm.type === 'ban') { 
                await ban(confirm.r); 
              } else if (confirm.type === 'hidePost') { 
                await hidePost(confirm.r); 
              } else if (confirm.type === 'delPost') { 
                await delPost(confirm.r); 
              }
            }}
            sx={{ borderRadius: 2 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notifications */}
      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        <Alert severity={toast?.type || "info"} sx={{ borderRadius: 2 }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
