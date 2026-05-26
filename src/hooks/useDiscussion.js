import { useCallback } from 'react';
import { fetcher, showError } from '@/common/utils';
import { showToast } from '@/components/toast';
import * as R from 'ramda';
import useSWR from 'swr';

function useDiscussion(pageId) {
  const {
    data: comments,
    isLoading: loading,
    mutate,
  } = useSWR(`/api/comments?pageId=${pageId}`, fetcher, {
    dedupingInterval: 300000, // 5 minutes
    revalidateOnFocus: false,
    fallbackData: [],
    onError: () => showError('Failed to fetch comments'),
  });

  const addComment = async (text) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, comment: text.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        mutate((prev) => [data, ...prev], false);
        return true;
      } else {
        showError((await res.text()) || 'Failed to post comment');
      }
    } catch {
      showError('Something went wrong');
    }
    return false;
  };

  const deleteComment = async (id) => {
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      res.ok
        ? mutate(R.reject(R.propEq(id, 'id')), false)
        : showError((await res.text()) || 'Failed to delete');
    } catch {
      showError('Something went wrong');
    }
  };

  const reportComment = async (id) => {
    const url = `/api/comments?id=${id}&action=report`;
    try {
      const res = await fetch(url, { method: 'PATCH' });
      res.ok
        ? showToast({ message: 'Comment reported', variant: 'success' })
        : showError((await res.text()) || 'Failed to report');
    } catch {
      showError('Something went wrong');
    }
  };

  const toggleUpvote = async (comment) => {
    const { id, upvoted } = comment;
    const url = `/api/comments?id=${id}&action=upvote`;
    try {
      const res = await fetch(url, { method: 'PATCH' });
      if (res.ok) {
        mutate(
          R.map((c) => {
            const upvotes = c.upvotes + (upvoted ? -1 : 1);
            return c.id === id ? { ...c, upvotes, upvoted: !upvoted } : c;
          }),
          false,
        );
      } else {
        showError((await res.text()) || 'Failed to upvote');
      }
    } catch {
      showError('Something went wrong');
    }
  };

  return {
    comments,
    loading,
    addComment: useCallback(addComment, [pageId, mutate]),
    deleteComment: useCallback(deleteComment, [mutate]),
    reportComment: useCallback(reportComment, []),
    toggleUpvote: useCallback(toggleUpvote, [mutate]),
  };
}

export default useDiscussion;
