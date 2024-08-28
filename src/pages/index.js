/* eslint-disable react/no-unescaped-entities */
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
      <h5 className="my-3">Welcome to SEE algorithms!</h5>
      <p>
        Unlock the power of understanding through <b>visualization</b>. At{' '}
        <i>see algorithms</i>, we believe that learning complex concepts should
        be as engaging and accessible as possible. Our platform offers{' '}
        <b>interactive animations</b> that bring algorithms to life,
        transforming abstract ideas into visual stories that are easy to follow
        and understand.
      </p>
      <p>
        From sorting and searching to more advanced data structures and
        algorithms, <i>see algorithms</i> provides a hands-on approach to
        learning. Each animation is carefully crafted to walk you through the
        inner workings of various algorithms, step by step. Whether you're a
        student seeking to solidify your knowledge, an educator looking for
        dynamic teaching tools, or simply someone with a passion for computer
        science, you'll find value in our extensive library of visual resources.
      </p>
      <p>
        Explore our collection, interact with the animations, and see algorithms
        in action. Discover how visual learning can deepen your understanding,
        enhance your retention, and spark your curiosity.
      </p>
    </main>
  );
}
