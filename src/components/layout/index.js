import { useEffect, useRef, useState } from 'react';
import { Box, Container, Divider, Drawer, Typography } from '@mui/material';
import AlgorithmSEO from '../algorithm-seo';
import Affiliates from './affiliates';
import Sider from './sider';
import Header from './header';
import Footer from './footer';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';

function Layout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { pathname } = useRouter();
  const algoId = pathname.split('/')[2];
  const { name: algoName } = algorithms.findObj('id', algoId) || {};
  const scrollRef = useRef(null);

  useEffect(() => {
    setMenuVisible(false);
    scrollRef.current.scrollTo(0, 0);
  }, [pathname]);

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
      {algoName && <AlgorithmSEO />}

      <Box display="flex" className="contentRow">
        <Box sx={{ display: mdBlock }}>
          <Sider selected={algoId} />
        </Box>
        <Box overflow="auto" ref={scrollRef}>
          <Container maxWidth="xl" className="content">
            {algoName && (
              <Typography
                variant="h5"
                component="h1"
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
          </Container>
          <Footer />
        </Box>
      </Box>
    </>
  );
}

export default Layout;
