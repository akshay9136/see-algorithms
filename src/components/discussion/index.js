import { useRouter } from 'next/router';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import useDiscussion from '@/hooks/useDiscussion';
import CommentBox from './comment-box';
import CommentLoading from './comment-loading';
import Comment from './comment';
import Guidelines from './guidelines';
import Link from 'next/link';

const styles = {
  count: { height: 22, fontWeight: 600 },
  prompt: {
    py: 2,
    px: 2.5,
    mb: 2,
    border: '1.5px dashed',
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: '#f8fafc',
  },
  empty: { textAlign: 'center', py: 5, color: 'text.disabled' },
};

export default function Discussion({ algoId }) {
  const { asPath, pathname } = useRouter();
  const {
    comments,
    loading,
    signedIn,
    isAdmin,
    addComment,
    deleteComment,
    toggleUpvote,
    reportComment,
  } = useDiscussion(algoId);

  const getTopic = () => {
    const category = pathname.split('/')[1];
    if (category === 'data-structures') return 'data structure';
    if (category === 'articles') return 'article';
    return 'algorithm';
  };

  return (
    <Box component="section" sx={{ maxWidth: 700 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2.5 }}>
        <Typography variant="h6" fontWeight={700}>
          💬 &nbsp;Discussion
        </Typography>
        {comments.length > 0 && (
          <Chip label={comments.length} size="small" sx={styles.count} />
        )}
      </Stack>
      {signedIn ? (
        <>
          <Guidelines />
          <CommentBox topic={getTopic()} onSubmit={addComment} />
        </>
      ) : (
        <Stack sx={styles.prompt}>
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
        <CommentLoading />
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            isAdmin={isAdmin}
            signedIn={signedIn}
            onUpvote={toggleUpvote}
            onDelete={deleteComment}
            onReport={reportComment}
          />
        ))
      ) : (
        <Box sx={styles.empty}>
          <ChatBubbleOutline sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body1" fontWeight={500}>
            No comments yet
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Be the first to share your thoughts on this {getTopic()}.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
