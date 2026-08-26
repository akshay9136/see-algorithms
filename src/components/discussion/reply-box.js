import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';

const MAX_LENGTH = 500;

const styles = {
  root: { mt: 2, pl: 1.5 },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.95rem',
      bgcolor: '#fafbfc',
      '&.Mui-focused': { bgcolor: '#fff' },
    },
  },
};

/**
 * Compact inline reply composer.
 * Props:
 *   onSubmit(text): async → boolean (true on success)
 *   onCancel(): void
 */
export default function ReplyBox({ onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();
  const user = session?.user || {};
  const remaining = MAX_LENGTH - text.length;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    const success = await onSubmit(text.trim());
    if (success) setText('');
    setSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (submitting) return;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (text.trim()) handleSubmit();
    }
  };

  return (
    <Box sx={styles.root}>
      <Box display="flex" gap={1.5} alignItems="flex-start">
        <Avatar
          src={user?.image}
          alt={user?.name}
          sx={{ width: 32, height: 32, mt: 0.5 }}
        >
          {(user?.name || '?').charAt(0).toUpperCase()}
        </Avatar>

        <Box flex={1}>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            autoFocus
            placeholder="Write a reply..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            inputProps={{ maxLength: MAX_LENGTH, id: 'reply-box' }}
            sx={styles.textField}
            // size="small"
          />

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1.5 }}
          >
            <Typography
              variant="body2"
              color={remaining < 50 ? 'error.main' : 'text.secondary'}
            >
              {remaining < 100 ? `${remaining} characters left` : ''}
            </Typography>

            <Box display="flex" gap={1}>
              <Button
                size="small"
                onClick={onCancel}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>

              <Button
                size="small"
                variant="contained"
                disableElevation
                disabled={!text.trim() || submitting}
                onClick={handleSubmit}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {submitting ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
