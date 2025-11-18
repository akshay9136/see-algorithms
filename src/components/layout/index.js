import { useEffect, useRef, useState } from 'react';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import Header from '../header';
import Sider from '../sider';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';
import AlgorithmSEO from '../algorithm-seo';
import Footer from './footer';

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
      <Box className="d-flex contentRow">
        <Box className="d-none d-md-block" width="max-content" minWidth={250}>
          <Sider selected={algoId} />
        </Box>
        <Stack overflow="auto" ref={scrollRef}>
          <Box className="content" flex={1}>
            {algoId && (
              <Typography variant="h6" component="h1" fontWeight={600} mb={2}>
                {algoName}
              </Typography>
            )}
            {children}
          </Box>
          <Footer />
        </Stack>
      </Box>
    </>
  );
}

export default Layout;
