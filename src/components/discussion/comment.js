import { memo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button, IconButton } from '@mui/material';
import {
  ReplyOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { showToast } from '../toast';
import CommentItem from './comment-item';
import ReplyThread from './reply-thread';
import ReplyBox from './reply-box';
import useReplies from '@/hooks/useReplies';

const styles = {
  repliesBtn: {
    textTransform: 'none',
    fontWeight: 600,
    color: 'text.secondary',
    py: 0,
    minWidth: 0,
    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
  },
};

const collapseMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  style: { overflow: 'hidden' },
};

/**
 * Individual comment with upvote, report, delete, and reply thread.
 */
const Comment = memo(function Comment({
  comment,
  isAdmin,
  signedIn,
  onUpvote,
  onDelete,
  onReport,
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [threadOpen, setThreadOpen] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.replyCount ?? 0);

  // useReplies for add / delete inside the thread — shared state via parentId key
  const { addReply, deleteReply } = useReplies(comment.id, threadOpen);

  const replyHandlers = {
    click: () => {
      if (!signedIn) {
        showToast({ message: 'Sign in to reply', variant: 'warning' });
        return;
      }
      setReplyOpen((v) => !v);
    },
    submit: async (text) => {
      const success = await addReply(text);
      if (success) {
        setReplyCount((n) => n + 1);
        setReplyOpen(false);
        setThreadOpen(true); // reveal thread so the new reply is visible
      }
      return success;
    },
    delete: async (replyId) => {
      await deleteReply(replyId);
      setReplyCount((n) => Math.max(0, n - 1));
    },
  };

  return (
    <CommentItem
      item={comment}
      type="comment"
      isAdmin={isAdmin}
      signedIn={signedIn}
      onUpvote={onUpvote}
      onReport={onReport}
      onDelete={onDelete}
      actions={
        <>
          {/* Reply button */}
          <IconButton
            size="small"
            title="Reply"
            onClick={replyHandlers.click}
            color={replyOpen ? 'primary' : 'default'}
          >
            <ReplyOutlined fontSize="1rem" />
          </IconButton>

          {/* Show / Hide replies toggle */}
          {replyCount > 0 && (
            <Button
              disableRipple
              endIcon={
                threadOpen ? (
                  <KeyboardArrowUp fontSize="1rem" />
                ) : (
                  <KeyboardArrowDown fontSize="1rem" />
                )
              }
              onClick={() => setThreadOpen((v) => !v)}
              sx={styles.repliesBtn}
            >
              {threadOpen
                ? 'Hide'
                : `${replyCount} ${replyCount > 1 ? 'replies' : 'reply'}`}
            </Button>
          )}
        </>
      }
    >
      {/* Flat reply thread (lazy-loaded) */}
      <AnimatePresence initial={false}>
        {threadOpen && (
          <motion.div key="reply-thread" {...collapseMotion}>
            <ReplyThread
              parentId={comment.id}
              isAdmin={isAdmin}
              signedIn={signedIn}
              onDelete={replyHandlers.delete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline reply composer */}
      <AnimatePresence initial={false}>
        {replyOpen && (
          <motion.div key="reply-box" {...collapseMotion}>
            <ReplyBox
              onSubmit={replyHandlers.submit}
              onCancel={() => setReplyOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </CommentItem>
  );
});

export default Comment;
