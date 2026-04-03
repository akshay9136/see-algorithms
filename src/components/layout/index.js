import { useEffect, useRef, useState } from 'react';
import { Box, Container, Divider, Drawer, Typography } from '@mui/material';
import AlgorithmSEO from '../algorithm-seo';
import Affiliates from '../affiliates';
import Sider from './sider';
import Header from './header';
import Footer from './footer';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';

function Layout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { pathname, query } = useRouter();
  const isEmbed = pathname.includes('/embed/');
  const pageId = isEmbed ? query.algorithm : pathname.split('/')[2];
  const { name: title } = algorithms.findObj('id', pageId) || {};
  const scrollRef = useRef(null);

  useEffect(() => {
    setMenuVisible(false);
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  if (isEmbed) {
    return (
      <Box overflow="auto" width={900} border="1px solid #e0e0e0">
        {pageId && <AlgorithmSEO />}
        <Box className="content" minWidth="100%">
          {title && (
            <Typography
              variant="h6"
              component="h2"
              fontWeight={600}
              color="warning.main"
              mb={2.5}
            >
              {title} Visualizer
            </Typography>
          )}
          {children}
        </Box>
      </Box>
    );
  }

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
        <Sider selected={pageId} />
      </Drawer>
      {(pageId || pathname === '/articles') && <AlgorithmSEO />}

      <Box display="flex" className="contentRow">
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sider selected={pageId} />
        </Box>
        <Box overflow="auto" ref={scrollRef}>
          <Container maxWidth="xl" className="content">
            {title && (
              <Typography
                variant="h5"
                component="h1"
                fontWeight={600}
                color="warning.main"
                mb={2}
              >
                {title}
              </Typography>
            )}
            {children}
            {pageId && (
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
