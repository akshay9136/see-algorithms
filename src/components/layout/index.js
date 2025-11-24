import { useEffect, useRef, useState } from 'react';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import AlgorithmSEO from '../algorithm-seo';
import Sider from './sider';
import Header from './header';
import Footer from './footer';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';

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
        <Box className="d-none d-lg-block" minWidth={250}>
          <Sider selected={algoId} />
        </Box>
        <Stack overflow="auto" ref={scrollRef}>
          <Box className="content" flex={1}>
            {algoId && (
              <Typography
                variant="h5"
                component="h1"
                fontSize={22}
                fontWeight="bold"
                mb={2}
              >
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
