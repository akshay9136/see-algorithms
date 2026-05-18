import { useRouter } from 'next/router';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import useDiscussion from '@/hooks/useDiscussion';
import CommentBox from './comment-box';
import CommentCard from './comment-card';
import CommentSkeleton from './comment-skeleton';
import Link from 'next/link';

const styles = {
  chip: { height: 24, fontWeight: 600 },
  toggleBtn: { textTransform: 'none', fontSize: '0.9rem', py: 0.5, px: 2 },
  signInPrompt: {
    py: 2,
    px: 2.5,
    mb: 3,
    border: '1.5px dashed',
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: '#f8fafc',
  },
  empty: { textAlign: 'center', py: 5, color: 'text.disabled' },
};

export default function Discussion({ algoId }) {
  const { asPath } = useRouter();
  const {
    comments,
    loading,
    signedIn,
    isAdmin,
    addComment,
    deleteComment,
    toggleUpvote,
    reportComment,
    toggleHide,
  } = useDiscussion(algoId);

  return (
    <Box component="section" sx={{ maxWidth: 700 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2.5 }}>
        <Typography variant="h6" fontWeight={700}>
          💬 &nbsp;Discussion
        </Typography>
        {comments.length > 0 && (
          <Chip label={comments.length} size="small" sx={styles.chip} />
        )}
      </Stack>

      {signedIn ? (
        <CommentBox onSubmit={addComment} />
      ) : (
        <Stack sx={styles.signInPrompt}>
          <Typography variant="body1" color="text.secondary">
            <Link
              href={`/auth/signin?callbackUrl=${asPath}`}
              style={{ fontWeight: 600 }}
            >
              Sign in
            </Link>{' '}
            to join the discussion
          </Typography>
        </Stack>
      )}

      {loading ? (
        <CommentSkeleton />
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isAdmin={isAdmin}
            onUpvote={toggleUpvote}
            onDelete={deleteComment}
            onReport={reportComment}
            onToggleHide={toggleHide}
          />
        ))
      ) : (
        <Box sx={styles.empty}>
          <ChatBubbleOutline sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body1" fontWeight={500}>
            No comments yet
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Be the first to share your thoughts on this algorithm
          </Typography>
        </Box>
      )}
    </Box>
  );
}
