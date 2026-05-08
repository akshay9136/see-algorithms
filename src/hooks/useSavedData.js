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
      }
    } catch (err) {
      showToast({
        message: 'Failed to fetch saved data.',
        variant: 'error',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchItems();
  }, [algoId]);

  const redirectToLogin = (data) => {
    const json = JSON.stringify(data);
    const origin = window.location.origin;
    const url = encodeURIComponent(`${origin}${pathname}?skeleton=${btoa(json)}`);
    push(`/auth/signin?callbackUrl=${url}`);
  }

  const saveData = async (data) => {
    if (!session) {
      redirectToLogin(data);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algoId, type, data }),
      });
      const result = await res.json();
      if (res.ok) {
        showToast({
          message: 'Data saved successfully!',
          variant: 'success',
        });
        fetchItems();
      } else {
        showToast({
          message: result.error || 'Failed to save data.',
          variant: 'error',
        });
      }
    } catch (err) {
      showToast({ message: 'Failed to save data.', variant: 'error' });
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
      }
    } catch (err) {
      showToast({ message: 'Failed to delete item.', variant: 'error' });
    }
    setLoading(false);
  };

  return { savedItems, loading, saveData, deleteItem, fetchItems };
}
