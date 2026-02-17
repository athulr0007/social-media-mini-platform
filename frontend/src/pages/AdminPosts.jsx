import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TablePagination, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert,
  Card,
  Stack,
  Chip,
  TableContainer,
  Paper
} from "@mui/material";
import adminApi from "../services/adminApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminPosts(){
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try{
      const res = await adminApi.listPosts({ page: page+1, limit });
      setPosts(res.data.posts);
      setTotal(res.data.total);
    }catch(err){
      console.error(err);
      setToast({ type: "error", msg: "Failed to load posts" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, [page, limit]);

  const hide = async (id) => { 
    try {
      await adminApi.hidePost(id);
      setToast({ type: "success", msg: "Post hidden" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to hide post" });
    }
  };

  const unhide = async (id) => { 
    try {
      await adminApi.unhidePost(id);
      setToast({ type: "success", msg: "Post unhidden" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to unhide post" });
    }
  };

  const del = async (id) => { 
    try {
      await adminApi.deletePostPermanent(id);
      setToast({ type: "success", msg: "Post permanently deleted" });
      load();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Failed to delete post" });
    }
  };

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
          Posts Management
        </Typography>
        <Typography sx={{ color: "#aaa" }}>Review and moderate posted content</Typography>
      </Box>

      {/* Table */}
      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
              borderBottom: "2px solid rgba(102, 126, 234, 0.2)"
            }}>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Content</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map(p=> (
              <TableRow 
                key={p._id}
                sx={{
                  transition: "all 0.2s",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.05)",
                    transform: "scale(1.01)"
                  }
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>
                  <Stack>
                    <Typography sx={{ fontWeight: 600, color: "#fff" }}>
                      {p.user?.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "#aaa" }}>
                      @{p.user?.username}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "#fff" }}>
                    {p.content?.slice(0, 120)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  {p.archived ? (
                    <Chip label="HIDDEN" size="small" color="error" variant="filled" sx={{ fontWeight: 700 }} />
                  ) : (
                    <Chip label="VISIBLE" size="small" sx={{ bgcolor: "#51cf6620", color: "#51cf66", fontWeight: 700 }} />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    {p.archived ? (
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setConfirm({ type: 'unhide', id: p._id, label: `Unhide this post?` })}
                        sx={{ borderRadius: 2 }}
                      >
                        Unhide
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="warning"
                        startIcon={<VisibilityOffIcon />}
                        onClick={() => setConfirm({ type: 'hide', id: p._id, label: `Hide this post?` })}
                        sx={{ borderRadius: 2 }}
                      >
                        Hide
                      </Button>
                    )}
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setConfirm({ type: 'delete', id: p._id, label: `Permanently delete this post? This is IRREVERSIBLE.` })}
                      sx={{ borderRadius: 2 }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination 
        component="div" 
        count={total} 
        page={page} 
        onPageChange={(e,newPage)=>setPage(newPage)} 
        rowsPerPage={limit} 
        onRowsPerPageChange={(e)=>{ setLimit(parseInt(e.target.value,10)); setPage(0); }}
        sx={{
          "& .MuiTablePagination-root": {
            background: "rgba(255, 255, 255, 0.02)"
          }
        }}
      />

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
            onClick={async ()=>{ 
              setConfirm(null);
              if(confirm.type==='hide'){ await hide(confirm.id); }
              else if(confirm.type==='unhide'){ await unhide(confirm.id); }
              else if(confirm.type==='delete'){ await del(confirm.id); }
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
