import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';

const MAX_LENGTH = 500;

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
    fontWeight: 600,
  },
};

/**
 * Comment box for writing new comments.
 */
export default function CommentBox({ topic, onSubmit }) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: session } = useSession();
  const user = session?.user || {};
  const remaining = MAX_LENGTH - comment.length;

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

      <Box display="flex" alignItems="center" sx={{ mt: 1.5 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Tip: use `code` for inline code.
          </Typography>

          <Typography
            variant="body2"
            color={remaining < 100 ? 'error' : 'text.disabled'}
          >
            {remaining < 200 ? `${remaining} characters left` : ''}
          </Typography>
        </Box>

        <Button
          variant="contained"
          disableElevation
          disabled={!comment.trim() || submitting}
          onClick={handleSubmit}
          endIcon={<Send fontSize="small" />}
          sx={styles.submitBtn}
          size="small"
        >
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </Box>
    </Box>
  );
}
