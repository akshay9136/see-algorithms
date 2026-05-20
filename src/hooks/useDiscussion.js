import { useState, useEffect, useCallback } from 'react';
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

  const deleteComment = async (id) => {
    const url = `/api/comments?id=${id}`;
    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        showError((await res.text()) || 'Failed to delete');
      }
    } catch {
      showError('Network error');
    }
  };

  const reportComment = async (id) => {
    const url = `/api/comments?id=${id}&action=report`;
    try {
      const res = await fetch(url, { method: 'PATCH' });
      if (res.ok) {
        showToast({ message: 'Comment reported', variant: 'success' });
      } else {
        showError((await res.text()) || 'Failed to report');
      }
    } catch {
      showError('Network error');
    }
  };

  const toggleUpvote = async (comment) => {
    const { id, upvoted } = comment;
    const url = `/api/comments?id=${id}&action=upvote`;
    try {
      const res = await fetch(url, { method: 'PATCH' });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => {
            const upvotes = c.upvotes + (upvoted ? -1 : 1);
            return c.id === id ? { ...c, upvotes, upvoted: !upvoted } : c;
          }),
        );
      } else {
        showError((await res.text()) || 'Failed to upvote');
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
    addComment: useCallback(addComment, [algoId]),
    deleteComment: useCallback(deleteComment, []),
    reportComment: useCallback(reportComment, []),
    toggleUpvote: useCallback(toggleUpvote, []),
  };
}

export default useDiscussion;
