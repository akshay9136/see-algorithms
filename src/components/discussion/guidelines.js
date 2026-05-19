import { useState } from 'react';
import { Box, Stack, Typography, Collapse, Button } from '@mui/material';
import { InfoOutlined, ExpandMore, ExpandLess } from '@mui/icons-material';

const styles = {
  container: {
    mb: 3,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: '#f8fafc',
    overflow: 'hidden',
  },
  header: {
    py: 1,
    px: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'none',
  },
  content: {
    p: 2.5,
    borderTop: '1px solid',
    borderColor: 'divider',
    bgcolor: '#fff',
  },
};

export default function Guidelines() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header} onClick={() => setExpanded(!expanded)}>
        <Stack direction="row" alignItems="center" gap={1}>
          <InfoOutlined color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={600}>
            Discussion Guidelines & Moderation
          </Typography>
        </Stack>
        <Button
          size="small"
          endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'Read'}
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box sx={styles.content}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            To keep our algorithm visualization platform a constructive,
            high-quality learning space, all comments are subject to the
            following guidelines:
          </Typography>

          <Stack gap={2}>
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                1. Be Constructive, Curious & Kind
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share valuable insights, ask precise questions, and help fellow
                learners. Maintain a positive, collaborative, and professional
                tone.
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                2. Share Contextual Questions & Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avoid posting single-word or generic reactions (e.g.{' '}
                {'"nice", "cool", "helpful"'}). When asking a question, describe
                the exact step or input values you are confused about.
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                3. Zero Tolerance for Spam & Bots
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To maintain a clean and safe learning space, commercial spam,
                off-topic self-promotion, repetitive copy-pasting, and obvious
                bot-like activity are strictly prohibited and will be
                immediately removed.
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                4. Active Moderation & Removals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To maintain an outstanding, educational resource, our moderators
                actively hide, soft-delete, or flag comments that are
                low-effort, off-topic, spammy, or violating.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
