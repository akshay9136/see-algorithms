import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useSession } from 'next-auth/react';

const MAX_LENGTH = 1000;

const styles = {
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontSize: '1rem',
      bgcolor: '#fafbfc',
      '&.Mui-focused': { bgcolor: '#fff' },
    },
  },
  submitBtn: {
    px: 2,
    ml: 'auto',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
  },
};

/**
 * Comment box for writing new comments.
 */
export default function CommentBox({ topic, onSubmit }) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const remaining = MAX_LENGTH - comment.length;
  const { data: session } = useSession();
  const user = session?.user || {};

  const handleSubmit = async () => {
    if (comment?.trim()) {
      setSubmitting(true);
      const success = await onSubmit(comment.trim());
      if (success) setComment('');
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (submitting) return;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (comment.trim()) handleSubmit();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          src={user?.image}
          alt={user?.name}
          sx={{ width: 40, height: 40 }}
        >
          {(user?.name || '?').charAt(0).toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <TextField
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            placeholder={`Share a question or insight about this ${topic}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            inputProps={{ maxLength: MAX_LENGTH, id: 'compose-box' }}
            sx={styles.textField}
          />
          <Stack direction="row" sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              color={remaining < 100 ? 'error' : 'text.disabled'}
            >
              {remaining < 200 ? `${remaining} characters left` : ''}
            </Typography>
            <Button
              variant="contained"
              disableElevation
              disabled={!comment.trim() || submitting}
              onClick={handleSubmit}
              endIcon={<Send fontSize="small" />}
              sx={styles.submitBtn}
              size="small"
            >
              {submitting ? 'Posting…' : 'Post'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
