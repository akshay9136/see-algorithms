import { useSession } from 'next-auth/react';
import { fetcher } from '@/common/utils';
import useSWR from 'swr';

export default function useCredits() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const { data, mutate } = useSWR(email ? '/api/credits' : null, fetcher, {
    revalidateOnFocus: false,
  });

  return { credits: data || null, fetchCredits: mutate };
}
