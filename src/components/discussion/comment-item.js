import { memo } from 'react';
import { Avatar, Box, Chip, IconButton, Typography } from '@mui/material';
import {
  DeleteOutline,
  Report,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { timeAgo } from '@/common/utils';
import { showToast } from '../toast';
import CommentText from './comment-text';

const styles = {
  comment: {
    borderTop: '1px solid',
    borderColor: 'divider',
    pt: 2.5,
    pb: 2,
  },
  reply: {
    pt: 2.5,
    pb: 2,
    '&:not(:last-child)': {
      borderBottom: '1px solid',
      borderColor: 'divider',
    },
  },
  authorChip: { height: 20, lineHeight: 1.4, fontWeight: 600 },
  deleteBtn: { '&:hover': { color: 'error.main' } },
  reportBtn: {
    color: 'text.disabled',
    '&:hover': { color: 'warning.main' },
  },
};

/**
 * Shared base component for comments and replies.
 */
function CommentItem({
  item,
  type = 'comment',
  isAdmin,
  signedIn,
  onUpvote,
  onReport,
  onDelete,
  actions,
  children,
}) {
  const isReply = type === 'reply';

  const handleReport = () => {
    if (signedIn) {
      if (confirm('Are you sure you want to report this comment?')) {
        onReport(item.id);
      }
    } else {
      showToast({
        message: 'Sign in to report comment',
        variant: 'warning',
      });
    }
  };

  const handleUpvote = () => {
    if (signedIn) {
      onUpvote(item);
    } else {
      showToast({
        message: 'Sign in to upvote comment',
        variant: 'warning',
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      onDelete(item.id);
    }
  };

  return (
    <Box display="flex" gap={2} sx={isReply ? styles.reply : styles.comment}>
      <Avatar
        src={item.authorImage}
        alt={item.authorName}
        sx={{ width: 32, height: 32 }}
      >
        {(item.authorName || '?').charAt(0).toUpperCase()}
      </Avatar>

      <Box flex={1}>
        {/* Author + timestamp */}
        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Typography variant="subtitle1" fontWeight={600}>
            {item.authorName}
          </Typography>

          {item.isAuthor && (
            <Chip
              label="You"
              size="small"
              color="primary"
              variant="outlined"
              sx={styles.authorChip}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            {timeAgo(item.createdAt)}
          </Typography>
        </Box>

        {/* Formatted body */}
        <CommentText text={item.text} />

        {/* Action bar */}
        <Box display="flex" gap={0.5} alignItems="center">
          {/* Upvote */}
          <IconButton
            size="small"
            title={item.upvoted ? 'Remove upvote' : 'Upvote comment'}
            color={item.upvoted ? 'primary' : 'default'}
            onClick={handleUpvote}
          >
            {item.upvoted ? (
              <ThumbUpAlt fontSize="1rem" />
            ) : (
              <ThumbUpAltOutlined fontSize="1rem" />
            )}
          </IconButton>

          {item.upvotes > 0 && (
            <Typography
              variant="body2"
              color={item.upvoted ? 'primary' : 'text.secondary'}
              fontWeight={600}
              sx={{ mr: 0.5 }}
            >
              {item.upvotes}
            </Typography>
          )}

          {/* Report */}
          {!item.isAuthor && (
            <IconButton
              size="small"
              title={'Report comment'}
              onClick={handleReport}
              sx={styles.reportBtn}
            >
              <Report fontSize="1rem" />
            </IconButton>
          )}

          {/* Delete */}
          {(item.isAuthor || isAdmin) && (
            <IconButton
              size="small"
              title={'Delete comment'}
              onClick={handleDelete}
              sx={styles.deleteBtn}
            >
              <DeleteOutline fontSize="1rem" />
            </IconButton>
          )}

          {/* Extra slot actions (e.g. Reply button, Show replies toggle) */}
          {actions}
        </Box>

        {/* Nested content (e.g. ReplyThread, ReplyBox) */}
        {children}
      </Box>
    </Box>
  );
}

export default memo(CommentItem);
