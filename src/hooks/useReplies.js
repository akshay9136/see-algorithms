import { useCallback } from 'react';
import { fetcher, showError } from '@/common/utils';
import { showToast } from '@/components/toast';
import useSWR, { mutate } from 'swr';
import * as R from 'ramda';

/**
 * Lazily fetches and manages replies for a single parent comment.
 * Pass `isOpen=true` only when the reply thread is open to avoid
 * unnecessary network requests.
 */
function useReplies(parentId, isOpen = false) {
  const swrKey = isOpen ? `/api/replies?parentId=${parentId}` : null;

  const { data, isLoading } = useSWR(swrKey, fetcher, {
    dedupingInterval: 300000, // 5 minutes
    fallbackData: [],
    revalidateOnFocus: false,
    onError: () => showError('Failed to fetch replies'),
  });

  const addReply = async (text) => {
    try {
      const res = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, comment: text.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        mutate(swrKey, (prev) => (prev ? [...prev, data] : [data]), false);
        return true;
      } else {
        showError((await res.text()) || 'Failed to post reply');
      }
    } catch {
      showError('Something went wrong');
    }
    return false;
  };

  const deleteReply = async (id) => {
    try {
      const res = await fetch(`/api/replies?id=${id}&parentId=${parentId}`, {
        method: 'DELETE',
      });
      res.ok
        ? mutate(swrKey, R.reject(R.propEq(id, 'id')), false)
        : showError((await res.text()) || 'Failed to delete');
    } catch {
      showError('Something went wrong');
    }
  };

  const reportReply = async (id) => {
    const url = `/api/replies?id=${id}&parentId=${parentId}&action=report`;
    try {
      const res = await fetch(url, { method: 'PATCH' });
      res.ok
        ? showToast({ message: 'Reply reported', variant: 'success' })
        : showError((await res.text()) || 'Failed to report');
    } catch {
      showError('Something went wrong');
    }
  };

  const toggleUpvote = async (reply) => {
    const { id, upvoted } = reply;
    const url = `/api/replies?id=${id}&parentId=${parentId}&action=upvote`;
    try {
      const res = await fetch(url, { method: 'PATCH' });
      if (res.ok) {
        const resolver = R.map((r) => {
          const upvotes = (r.upvotes || 0) + (upvoted ? -1 : 1);
          return r.id === id ? { ...r, upvotes, upvoted: !upvoted } : r;
        });
        mutate(swrKey, resolver, false);
      } else {
        showError((await res.text()) || 'Failed to upvote');
      }
    } catch {
      showError('Something went wrong');
    }
  };

  return {
    replies: data,
    loading: isLoading,
    addReply: useCallback(addReply, [parentId, swrKey]),
    deleteReply: useCallback(deleteReply, [parentId, swrKey]),
    reportReply: useCallback(reportReply, [parentId, swrKey]),
    toggleUpvote: useCallback(toggleUpvote, [parentId, swrKey]),
  };
}

export default useReplies;
