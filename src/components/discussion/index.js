import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useComments from '@/hooks/useComments';
import Comment from './comment';
import CommentBox from './comment-box';
import Guidelines from './guidelines';
import Link from 'next/link';

const styles = {
  count: { height: 22, fontWeight: 600 },
  prompt: {
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

export default function Discussion() {
  const { asPath, pathname } = useRouter();
  const { data: session, status } = useSession();
  const { isAdmin } = session?.user || {};
  const {
    comments,
    loading,
    addComment,
    deleteComment,
    toggleUpvote,
    reportComment,
  } = useComments(pathname);

  const signedIn = status === 'authenticated';

  const getTopic = () => {
    const category = pathname.split('/')[1];
    if (category === 'data-structures') return 'data structure';
    if (category === 'articles') return 'article';
    return 'algorithm';
  };

  return (
    <Box component="section" sx={{ maxWidth: 700 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2.5 }}>
        <Typography variant="h6">
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
          <Typography color="text.secondary">
            <Link href={`/auth/signin?callbackUrl=${asPath}`}>Sign in</Link> to
            join the discussion
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
          <Typography fontWeight={500}>No comments yet</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Be the first to share your thoughts on this {getTopic()}.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/**
 * Loading skeleton placeholder for comments.
 */
function CommentLoading() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Box key={i} display="flex" gap={2} py={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box flex={1}>
            <Skeleton width="30%" height={20} sx={{ mb: 1 }} />
            <Skeleton width="90%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton width="60%" height={20} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};
