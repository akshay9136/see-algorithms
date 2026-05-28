import { Box, IconButton } from '@mui/material';
import {
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { showToast } from '@/components/toast';
import { showError } from '@/common/utils';

function useFeedback({ api, pageId }) {
  const [feedback, setFeedback] = useState(null);

  const handleChange = async (_action) => {
    const isUndo = _action === feedback;
    const action = isUndo ? `undo_${_action}` : _action;
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, action }),
      });

      if (res.ok) {
        setFeedback(isUndo ? null : _action);
        if (!isUndo) {
          showToast({
            message: 'Thank you for the feedback!',
            type: 'success',
          });
        }
      } else {
        showError((await res.text()) || 'Failed to update feedback');
      }
    } catch (err) {
      showError('Something went wrong');
    }
  };

  const showUpvote = !feedback || feedback === 'upvote';
  const showDownvote = !feedback || feedback === 'downvote';

  const component = (
    <Box display="flex" alignItems="center" gap={1}>
      {showUpvote && (
        <IconButton
          size="small"
          color={feedback === 'upvote' ? 'primary' : 'default'}
          onClick={() => handleChange('upvote')}
          aria-label="Upvote"
          title="Helpful"
        >
          {feedback === 'upvote' ? (
            <ThumbUp fontSize="small" />
          ) : (
            <ThumbUpOutlined fontSize="small" />
          )}
        </IconButton>
      )}
      {showDownvote && (
        <IconButton
          size="small"
          color={feedback === 'downvote' ? 'primary' : 'default'}
          onClick={() => handleChange('downvote')}
          aria-label="Downvote"
          title="Not helpful"
        >
          {feedback === 'downvote' ? (
            <ThumbDown fontSize="small" />
          ) : (
            <ThumbDownOutlined fontSize="small" />
          )}
        </IconButton>
      )}
    </Box>
  );

  return [component, setFeedback];
}

export default useFeedback;
