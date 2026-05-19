import { memo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  ThumbUpAltOutlined,
  ThumbUpAlt,
  DeleteOutline,
  Report,
} from '@mui/icons-material';
import { timeAgo } from '@/common/utils';
import { showToast } from '../toast';

const styles = {
  root: { borderTop: '1px solid', borderColor: 'divider', pt: 2.5, pb: 2 },
  authorChip: { height: 22, fontWeight: 600 },
  commentText: { color: 'text.secondary', wordBreak: 'break-word', my: 1 },
  reportBtn: { color: 'text.disabled', '&:hover': { color: 'warning.main' } },
  deleteBtn: { color: 'text.disabled', '&:hover': { color: 'error.main' } },
};

/**
 * Individual comment with upvote, report, and delete actions.
 */
const Comment = memo(function ({
  comment,
  isAdmin,
  signedIn,
  onUpvote,
  onDelete,
  onReport,
}) {
  const handleReport = () => {
    if (signedIn) {
      if (confirm('Are you sure you want to report this comment?'))
        onReport(comment.id);
    } else {
      showToast({
        message: 'Sign in to report this comment',
        variant: 'warning',
      });
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={styles.root}>
      <Avatar
        src={comment.authorImage}
        alt={comment.authorName}
        sx={{ width: 40, height: 40 }}
      >
        {(comment.authorName || '?').charAt(0).toUpperCase()}
      </Avatar>

      <Box flex={1}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="body1" fontWeight={600}>
            {comment.authorName}
          </Typography>
          {comment.isAuthor && (
            <Chip
              label="You"
              size="small"
              color="primary"
              variant="outlined"
              sx={styles.authorChip}
            />
          )}
          <Typography variant="body2" color="text.disabled">
            {timeAgo(comment.createdAt)}
          </Typography>
        </Stack>

        <Typography variant="body1" sx={styles.commentText}>
          {comment.text}
        </Typography>

        <Stack direction="row" gap={0.5} alignItems="center">
          <IconButton
            size="small"
            title={comment.upvoted ? 'Remove upvote' : 'Upvote comment'}
            color={comment.upvoted ? 'primary' : 'default'}
            onClick={() => {
              signedIn
                ? onUpvote(comment)
                : showToast({
                    message: 'Sign in to upvote this comment',
                    variant: 'warning',
                  });
            }}
          >
            {comment.upvoted ? (
              <ThumbUpAlt fontSize="small" />
            ) : (
              <ThumbUpAltOutlined fontSize="small" />
            )}
          </IconButton>

          {comment.upvotes > 0 && (
            <Typography
              variant="body2"
              color={comment.upvoted ? 'primary' : 'text.disabled'}
              fontWeight={600}
              sx={{ mr: 0.5 }}
            >
              {comment.upvotes}
            </Typography>
          )}

          {!comment.isAuthor && (
            <IconButton
              size="small"
              title="Report comment"
              onClick={handleReport}
              sx={styles.reportBtn}
            >
              <Report fontSize="small" />
            </IconButton>
          )}

          {(comment.isAuthor || isAdmin) && (
            <IconButton
              size="small"
              title="Delete comment"
              onClick={() => {
                if (confirm(`Are you sure you want to delete this comment?`))
                  onDelete(comment.id);
              }}
              sx={styles.deleteBtn}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Stack>
  );
});

export default Comment;
