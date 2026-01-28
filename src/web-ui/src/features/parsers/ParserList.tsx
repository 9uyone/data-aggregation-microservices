import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Grid,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useParserStore, type Parser } from '../../store/parserStore';

const getStatusColor = (status: Parser['status']) => {
  switch (status) {
    case 'running':
      return 'info';
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Parser['status']) => {
  switch (status) {
    case 'running':
      return 'Running';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Idle';
  }
};

export const ParserList: React.FC = () => {
  const { parsers, isLoading } = useParserStore();
  const [runningParsers, setRunningParsers] = useState<Set<string>>(new Set());

  const handleRunParser = async (parserId: string) => {
    setRunningParsers((prev) => new Set(prev).add(parserId));
    // TODO: Implement API call to run parser
    // Simulate running
    setTimeout(() => {
      setRunningParsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(parserId);
        return newSet;
      });
    }, 3000);
  };

  const handleStopParser = async (parserId: string) => {
    // TODO: Implement API call to stop parser
    setRunningParsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(parserId);
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Parsers
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Parser
        </Button>
      </Box>

      {/* Parser Grid */}
      <Grid container spacing={3}>
        {parsers.length === 0 ? (
          <Grid size={12}>
            <Card>
              <CardContent
                sx={{
                  textAlign: 'center',
                  py: 6,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No parsers configured
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create your first parser to start collecting data
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Add Parser
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          parsers.map((parser) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={parser.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {parser.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(parser.status)}
                      color={getStatusColor(parser.status)}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {parser.description}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Source: {parser.sourceUrl}
                  </Typography>

                  {parser.lastRunAt && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      mt={1}
                    >
                      Last run: {new Date(parser.lastRunAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>

                {/* Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    p: 2,
                    pt: 0,
                  }}
                >
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {runningParsers.has(parser.id) ? (
                    <Tooltip title="Stop">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleStopParser(parser.id)}
                      >
                        <StopIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Run">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleRunParser(parser.id)}
                      >
                        <PlayIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ParserList;
