import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Typography } from '@mui/material';
import Header from '../header';
import Sider from '../sider';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';
import AlgorithmSEO from '../algorithm-seo';

function Layout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const algoId = router.pathname.split('/')[2];
  const { name: algoName } = algorithms.findObj('id', algoId) || {};
  const scrollRef = useRef(null);

  useEffect(() => {
    setMenuVisible(false);
    scrollRef.current.scrollTo(0, 0);
  }, [router.pathname]);

  return (
    <>
      <Header toggleMenu={() => setMenuVisible(!menuVisible)} />
      <Drawer
        anchor="left"
        open={menuVisible}
        onClose={() => setMenuVisible(false)}
        className="drawer"
        PaperProps={{ className: 'paper' }}
        slotProps={{
          backdrop: { className: 'backdrop' },
        }}
      >
        <Sider selected={algoId} />
      </Drawer>
      {algoId && <AlgorithmSEO algorithmId={algoId} />}
      <div className="d-flex contentRow">
        <div
          className="d-none d-md-block"
          style={{ width: 'max-content', minWidth: 240 }}
        >
          <Sider selected={algoId} />
        </div>
        <div className="content m-0" ref={scrollRef}>
          <div style={{ padding: '1.5rem', overflow: 'auto' }}>
            {algoId && (
              <Typography variant="h6" fontWeight={600} mb={2}>
                {algoName}
              </Typography>
            )}
            {children}
          </div>
          {/* {savedData.length > 0 && <DataItems />} */}
        </div>
      </div>
    </>
  );
}

export default Layout;
