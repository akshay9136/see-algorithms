import { memo } from 'react';
import { Box, Skeleton } from '@mui/material';
import CommentItem from './comment-item';
import useReplies from '@/hooks/useReplies';

const styles = {
  thread: { mt: 1.5, pl: 1.5 },
};

/**
 * Flat, indented list of replies for a parent comment.
 * Fetching is deferred until `open` is true.
 */
function ReplyThread({ parentId, isAdmin, signedIn, onDelete }) {
  const { replies, loading, toggleUpvote, reportReply, deleteReply } =
    useReplies(parentId, true);

  const handleDelete = onDelete || deleteReply;

  if (loading) {
    return (
      <Box sx={styles.thread}>
        {[1, 2].map((i) => (
          <Box key={i} display="flex" gap={1.5} py={1.5}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box flex={1}>
              <Skeleton width="30%" height={16} />
              <Skeleton width="80%" height={16} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (replies.length === 0) return null;

  return (
    <Box sx={styles.thread}>
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          item={reply}
          type="reply"
          isAdmin={isAdmin}
          signedIn={signedIn}
          onUpvote={toggleUpvote}
          onReport={reportReply}
          onDelete={handleDelete}
        />
      ))}
    </Box>
  );
}

export default memo(ReplyThread);

