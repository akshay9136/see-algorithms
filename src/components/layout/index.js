import { useEffect, useRef, useState } from 'react';
import { Box, Divider, Drawer, Stack, Typography } from '@mui/material';
import AlgorithmSEO from '../algorithm-seo';
import Affiliates from './affiliates';
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

  const mdBlock = { xs: 'none', md: 'block' };

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
      <Box display="flex" className="contentRow">
        <Box sx={{ display: mdBlock }}>
          <Sider selected={algoId} />
        </Box>
        <Stack overflow="auto" ref={scrollRef}>
          <Box className="content" flex={1}>
            {algoId && (
              <Typography
                variant="h5"
                component="h1"
                fontSize="1.4rem"
                fontWeight={600}
                mb={2}
              >
                {algoName}
              </Typography>
            )}
            {children}
            {algoId && (
              <>
                <Divider sx={{ my: 4 }} />
                <Affiliates />
              </>
            )}
          </Box>
          <Footer />
        </Stack>
      </Box>
    </>
  );
}

export default Layout;
