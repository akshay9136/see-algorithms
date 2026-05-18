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

const styles = {
  root: { borderTop: '1px solid', borderColor: 'divider', py: 2 },
  ownChip: { height: 22, fontSize: '0.75rem', fontWeight: 600 },
  commentText: { color: 'text.secondary', wordBreak: 'break-word', my: 1 },
  iconSize: { fontSize: 20 },
  reportBtn: { color: 'text.disabled', '&:hover': { color: 'warning.main' } },
  deleteBtn: { color: 'text.disabled', '&:hover': { color: 'error.main' } },
  confirmBtn: { textTransform: 'none', fontSize: '0.9rem' },
};

/**
 * Individual comment card with upvote, report, delete, and admin actions.
 */
const CommentCard = memo(function CommentCard({
  comment,
  isAdmin,
  onUpvote,
  onDelete,
  onReport,
}) {
  return (
    <Stack
      direction="row"
      spacing={2}
      id={`comment-${comment.id}`}
      sx={styles.root}
    >
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
              sx={styles.ownChip}
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
            onClick={() => onUpvote(comment)}
          >
            {comment.upvoted ? (
              <ThumbUpAlt sx={styles.iconSize} />
            ) : (
              <ThumbUpAltOutlined sx={styles.iconSize} />
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
              onClick={() => {
                if (confirm(`Are you sure you want to report this comment?`)) {
                  onReport(comment.id);
                }
              }}
              sx={styles.reportBtn}
            >
              <Report sx={styles.iconSize} />
            </IconButton>
          )}

          {(comment.isAuthor || isAdmin) && (
            <IconButton
              size="small"
              title="Delete comment"
              onClick={() => {
                if (confirm(`Are you sure you want to delete this comment?`)) {
                  onDelete(comment.id);
                }
              }}
              sx={styles.deleteBtn}
            >
              <DeleteOutline sx={styles.iconSize} />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Stack>
  );
});

export default CommentCard;
