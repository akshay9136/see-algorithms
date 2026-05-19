import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { showToast } from '@/components/toast';
import { showError } from '@/common/utils';

function useDiscussion(algoId) {
  const { data: session, status } = useSession();
  const { isAdmin } = session?.user || {};
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const signedIn = status === 'authenticated';

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?algoId=${algoId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        showError((await res.text()) || 'Failed to fetch comments');
      }
    } catch {
      showError('Network error');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (algoId) fetchComments();
  }, [algoId]);

  const addComment = async (text) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algoId, comment: text.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data, ...prev]);
        showToast({ message: 'Comment posted', variant: 'success' });
        return true;
      } else {
        showError((await res.text()) || 'Failed to post comment');
      }
    } catch {
      showError('Network error');
    }
    return false;
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        showError((await res.text()) || 'Failed to delete');
      }
    } catch {
      showError('Network error');
    }
  };

  const toggleUpvote = async (comment) => {
    const { upvoted } = comment;
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id, action: 'upvote' }),
      });

      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => {
            const upvotes = c.upvotes + (upvoted ? -1 : 1);
            return c.id === comment.id
              ? { ...c, upvotes, upvoted: !upvoted }
              : c;
          }),
        );
      } else {
        showError((await res.text()) || 'Failed to upvote');
      }
    } catch {
      showError('Network error');
    }
  };

  const reportComment = async (commentId) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, action: 'report' }),
      });

      if (res.ok) {
        showToast({ message: 'Comment reported', variant: 'success' });
      } else {
        showError((await res.text()) || 'Failed to report');
      }
    } catch {
      showError('Network error');
    }
  };

  return {
    comments,
    loading,
    signedIn,
    isAdmin,
    addComment,
    deleteComment,
    toggleUpvote,
    reportComment,
  };
}

export default useDiscussion;
