import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
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
  InputAdornment,
  Paper
} from "@mui/material";
import adminApi from "../services/adminApi";
import BlockIcon from "@mui/icons-material/Block";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listUsers({ page: page + 1, limit, q });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch {
      setToast({ type: "error", msg: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, limit]);

  const suspend = async (id) => {
    await adminApi.suspendUser(id);
    setToast({ type: "success", msg: "User suspended" });
    load();
  };

  const unsuspend = async (id) => {
    await adminApi.unsuspendUser(id);
    setToast({ type: "success", msg: "User unsuspended" });
    load();
  };

  const softDelete = async (id) => {
    await adminApi.softDeleteUser(id);
    setToast({ type: "success", msg: "User deleted" });
    load();
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23, #1a1a2e)" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            mb: 1,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Users Management
        </Typography>
        <Typography sx={{ color: "#aaa" }}>
          Manage user accounts and permissions
        </Typography>
      </Box>

      {/* Search */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "rgba(20,20,40,0.75)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(102,126,234,0.25)"
        }}
      >
        <Stack direction="row" gap={2}>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Search by name, username, or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(0);
                load();
              }
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9aa7ff" }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiFilledInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(102,126,234,0.35)",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.16)",
                  borderColor: "rgba(102,126,234,0.6)"
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255,255,255,0.18)",
                  borderColor: "#667eea",
                  boxShadow: "0 0 0 2px rgba(102,126,234,0.25)"
                }
              },
              "& input::placeholder": {
                color: "#9aa7ff",
                opacity: 1
              }
            }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={() => { setPage(0); load(); }}
            sx={{
              borderRadius: 2,
              minWidth: 120,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              boxShadow: "0 8px 24px rgba(102,126,234,0.35)"
            }}
          >
            Search
          </Button>
        </Stack>
      </Card>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["Name", "Username", "Email", "Status", "Actions"].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, color: "#fff" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(u => (
              <TableRow key={u._id} hover>
                <TableCell
  sx={{
    color: "#fff",
    fontWeight: 600
  }}
>
  {u.name}
</TableCell>

                <TableCell
  sx={{
    color: "#9aa7ff",
    fontWeight: 500
  }}
>
  @{u.username}
</TableCell>

                <TableCell sx={{ color: "#aaa" }}>{u.email}</TableCell>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    {u.isBanned && <Chip label="BANNED" size="small" color="error" />}
                    {!u.isBanned && <Chip label="ACTIVE" size="small" sx={{ bgcolor: "#51cf6620", color: "#51cf66" }} />}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    {u.isBanned ? (
                      <Button size="small" variant="outlined" onClick={() => setConfirm({ type: "unsuspend", id: u._id })}>
                        Unsuspend
                      </Button>
                    ) : (
                      <Button size="small" variant="outlined" color="error" onClick={() => setConfirm({ type: "suspend", id: u._id })}>
                        Suspend
                      </Button>
                    )}
                    <Button size="small" variant="outlined" color="error" onClick={() => setConfirm({ type: "delete", id: u._id })}>
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
        rowsPerPage={limit}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Dialog */}
      <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (confirm.type === "suspend") await suspend(confirm.id);
              if (confirm.type === "unsuspend") await unsuspend(confirm.id);
              if (confirm.type === "delete") await softDelete(confirm.id);
              setConfirm(null);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        <Alert severity={toast?.type}>{toast?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
