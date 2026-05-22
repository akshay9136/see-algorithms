import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { fetcher, showError } from '@/common/utils';
import { showToast } from '@/components/toast';
import * as R from 'ramda';
import useSWR from 'swr';

export default function useSavedData() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { pathname, push } = useRouter();
  const [, category, algoId] = pathname.split('/');
  const { email } = session?.user || {};

  const {
    data: savedItems,
    isLoading,
    mutate,
  } = useSWR(email ? `/api/save-data?algoId=${algoId}` : null, fetcher, {
    dedupingInterval: 300000, // 5 minutes
    revalidateOnFocus: false,
    fallbackData: [],
    onError: (err) => {
      showError(`Failed to fetch saved data. ${err.message}`);
    },
  });

  const type = category === 'graph' ? 'graph' : 'tree';

  const callbackUrl = (data) => {
    const json = JSON.stringify(data);
    const url = `${pathname}?skeleton=${btoa(json)}`;
    return encodeURIComponent(url);
  };

  const saveData = async (data) => {
    if (!session) {
      push(`/auth/signin?callbackUrl=${callbackUrl(data)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algoId, type, data }),
      });

      if (res.ok) {
        const data = await res.json();
        mutate((prev) => [data, ...prev], false);
        showToast({
          message: 'Data saved successfully!',
          variant: 'success',
        });
      } else {
        showError((await res.text()) || 'Failed to save data');
      }
    } catch {
      showError('Something went wrong');
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/save-data?id=${id}`, { method: 'DELETE' });
      res.ok
        ? mutate(R.reject(R.propEq(id, 'id')), false)
        : showError((await res.text()) || 'Failed to delete item');
    } catch {
      showError('Something went wrong');
    }
    setLoading(false);
  };

  return {
    savedItems,
    loading: loading || isLoading,
    saveData,
    deleteItem
  };
}
