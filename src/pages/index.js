import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppContext from '@/common/context';

export default function Home() {
  const router = useRouter();
  const { userAuth } = useContext(AppContext);

  useEffect(() => {
    const token = router.query['token'];
    if (token) {
      // verifyEmail(token);
      router.replace(router.pathname);
    }
  }, []);

  return (
    <main>
      {userAuth ? (
        <h5>Hello {userAuth.displayName}!</h5>
      ) : (
        <h5>Hello World!</h5>
      )}
    </main>
  );
}
