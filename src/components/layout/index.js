import { useEffect, useRef, useState } from 'react';
import { Box, Container, Divider, Drawer, Typography } from '@mui/material';
import Affiliates from '../affiliates';
import AlgorithmSEO from '../algorithm-seo';
import Breadcrumbs from './breadcrumbs';
import Discussion from '../discussion';
import Footer from './footer';
import Header from './header';
import InterviewQtns from '../interview-qtns';
import Sider from './sider';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

function Layout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { pathname, query } = useRouter();
  const isEmbed = pathname.includes('/embed/');
  const pageId = isEmbed
    ? query.algorithm || query.dataStructure
    : pathname.split('/')[2];
  const { name: title, category } = algorithms.findObj('id', pageId) || {};

  const scrollRef = useRef(null);

  useEffect(() => {
    setMenuVisible(false);
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  if (isEmbed) {
    return (
      <Box height="100%" overflow="auto">
        <NextSeo
          title={`${title || 'Interactive'} Visualizer | See Algorithms`}
          noindex
          nofollow
        />
        <Box className="content" minWidth="100%">
          {title && (
            <Typography
              variant="h5"
              component="h2"
              fontWeight={600}
              color="warning.main"
              mb={2.5}
            >
              {title}
            </Typography>
          )}
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <>
      {title && <AlgorithmSEO />}
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

      <Box display="flex" className="contentRow">
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sider selected={pageId} />
        </Box>
        <Box overflow="auto" ref={scrollRef}>
          <Container maxWidth="xl" className="content">
            {title && (
              <>
                <Breadcrumbs category={category} />
                <Typography
                  variant="h4"
                  component="h1"
                  fontSize="1.65rem !important"
                  color="warning.main"
                  mb={2}
                >
                  {title} Visualization
                </Typography>
              </>
            )}
            {children}
            {title && (
              <>
                <Divider sx={{ mt: 4 }} />
                <InterviewQtns algorithmId={pageId} />
              </>
            )}
            {pageId && (
              <>
                <Divider sx={{ my: 3 }} />
                <Discussion />
                <Divider sx={{ my: 3 }} />
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
