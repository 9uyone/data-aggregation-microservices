import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface HistoryRecord {
  id: string;
  parserName: string;
  status: 'success' | 'partial' | 'failed';
  itemsCollected: number;
  duration: string;
  startedAt: string;
  completedAt: string;
  correlationId: string;
}

// Mock data for demonstration
const mockHistory: HistoryRecord[] = [
  {
    id: '1',
    parserName: 'Amazon Products',
    status: 'success',
    itemsCollected: 150,
    duration: '2m 35s',
    startedAt: '2026-01-28T10:00:00Z',
    completedAt: '2026-01-28T10:02:35Z',
    correlationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  },
  {
    id: '2',
    parserName: 'eBay Listings',
    status: 'partial',
    itemsCollected: 89,
    duration: '1m 45s',
    startedAt: '2026-01-28T09:30:00Z',
    completedAt: '2026-01-28T09:31:45Z',
    correlationId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  },
  {
    id: '3',
    parserName: 'News Articles',
    status: 'failed',
    itemsCollected: 0,
    duration: '0m 12s',
    startedAt: '2026-01-28T09:00:00Z',
    completedAt: '2026-01-28T09:00:12Z',
    correlationId: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
  },
];

const getStatusColor = (status: HistoryRecord['status']) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'partial':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: HistoryRecord['status']) => {
  switch (status) {
    case 'success':
      return 'Success';
    case 'partial':
      return 'Partial';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
};

export const HistoryDataGrid: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredHistory = mockHistory.filter((record) =>
    record.parserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Run History
        </Typography>
        <Tooltip title="Refresh">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by parser name..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Parser</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Items</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Correlation ID</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record) => (
                  <TableRow
                    key={record.id}
                    hover
                    sx={{ '&:last-child td': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {record.parserName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(record.status)}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {record.itemsCollected.toLocaleString()}
                    </TableCell>
                    <TableCell>{record.duration}</TableCell>
                    <TableCell>
                      {new Date(record.startedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={record.correlationId}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            maxWidth: 150,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {record.correlationId}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Results">
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No history records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default HistoryDataGrid;
