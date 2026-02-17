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
  Card,
  TableContainer,
  Paper,
  Chip,
  Stack
} from "@mui/material";
import adminApi from "../services/adminApi";
import HistoryIcon from "@mui/icons-material/History";

const getActionColor = (action) => {
  const colors = {
    suspendUser: "#ff6b6b",
    unsuspendUser: "#51cf66",
    softDeleteUser: "#ff922b",
    hidePost: "#fcc419",
    unhidePost: "#51cf66",
    deletePostPermanent: "#ff6b6b",
    banUser: "#c92a2a",
    dismissReport: "#51cf66",
    actioned: "#667eea"
  };
  return colors[action] || "#a9a9a9";
};

export default function AdminLogs(){
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try{
      const res = await adminApi.getLogs({ page: page+1, limit });
      setLogs(res.data.logs);
      setTotal(res.data.total);
    }catch(err){
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, [page, limit]);

  return (
    <Box sx={{ p: 4, background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <HistoryIcon sx={{ fontSize: 32, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} />
          <Typography 
            variant="h3" 
            fontWeight={800} 
            sx={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
              backgroundClip: "text", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent"
            }}
          >
            Audit Logs
          </Typography>
        </Stack>
        <Typography sx={{ color: "#aaa" }}>Immutable record of all admin actions</Typography>
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
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Admin</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Target</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((l) => {
              const actionColor = getActionColor(l.actionType);
              return (
                <TableRow 
                  key={l._id}
                  sx={{
                    transition: "all 0.2s",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    "&:hover": {
                      background: "rgba(102, 126, 234, 0.05)",
                      transform: "scale(1.01)"
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, fontSize: "0.85rem", color: "#fff" }}>
                    {new Date(l.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                    {l.adminId?.username || l.adminId?.name || "System"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={l.actionType} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${actionColor}20`, 
                        color: actionColor,
                        fontWeight: 700,
                        fontSize: "0.75rem"
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.9rem", color: "#aaa" }}>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#aaa" }}>
                      {l.targetType}/{l.targetId?.slice(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem", maxWidth: 250 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: "monospace", 
                        color: "#777",
                        wordBreak: "break-word"
                      }}
                    >
                      {JSON.stringify(l.metadata || {}).slice(0, 50)}...
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
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
    </Box>
  );
}
