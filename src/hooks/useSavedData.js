import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { showToast } from '@/components/toast';

export default function useSavedData() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { pathname, push } = useRouter();
  const [, category, algoId] = pathname.split('/');

  const type = category === 'graph' ? 'graph' : 'tree';

  const fetchItems = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/save-data?algoId=${algoId}`);
      if (res.ok) {
        const items = await res.json();
        setSavedItems(items);
      } else {
        showToast({
          message: (await res.text()) || 'Failed to fetch saved data.',
          variant: 'error',
        });
      }
    } catch (err) {
      showToast({ message: 'Network error', variant: 'error' });
    }
    setLoading(false);
  };

  const { email } = session?.user || {};

  useEffect(() => {
    if (algoId && email) fetchItems();
  }, [algoId, email]);

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
        showToast({
          message: 'Data saved successfully!',
          variant: 'success',
        });
        fetchItems();
      } else {
        showToast({
          message: (await res.text()) || 'Failed to save data.',
          variant: 'error',
        });
      }
    } catch (err) {
      showToast({ message: 'Network error', variant: 'error' });
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/save-data?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSavedItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        showToast({
          message: (await res.text()) || 'Failed to delete item.',
          variant: 'error',
        });
      }
    } catch (err) {
      showToast({ message: 'Network error', variant: 'error' });
    }
    setLoading(false);
  };

  return { savedItems, loading, saveData, deleteItem, fetchItems };
}
