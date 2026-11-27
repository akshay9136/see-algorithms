import { Fragment, useCallback, useState } from 'react';
import { Box, Card, Typography, useMediaQuery } from '@mui/material';
import Carousel from '@/components/carousel';

const previews = [
  {
    id: 'quick-sort',
    label: 'Quick Sort',
    href: '/sorting/QuickSort',
    ratio: 1.75,
    videoSrc: '/videos/quick-sort.mp4',
    posterSrc: '/videos/quick-sort.webp',
    description: 'Follow each pivot as values move into their partitions.',
  },
  {
    id: 'depth-first-search',
    label: 'DFS',
    href: '/graph/DFS',
    ratio: 1.5,
    videoSrc: '/videos/depth-first-search.mp4',
    posterSrc: '/videos/depth-first-search.webp',
    description:
      'Watch Depth-First Search follow a branch before backtracking.',
  },
  {
    id: 'avl-tree',
    label: 'AVL Tree',
    href: '/data-structures/AVL',
    ratio: 1.5,
    videoSrc: '/videos/avl-tree.mp4',
    posterSrc: '/videos/avl-tree.webp',
    description: 'Watch the tree rebalance itself with rotations when needed.',
  },
];

const previewLabels = previews.map(({ label }) => label);

const mediaSx = ({ ratio }) => ({
  display: 'block',
  width: '100%',
  height: 'auto',
  aspectRatio: ratio,
  objectFit: 'cover',
  objectPosition: 'left top',
  bgcolor: 'background.default',
  borderTop: 1,
  borderBottom: 1,
  borderColor: 'divider',
});

function PreviewMedia({ preview, playing }) {
  if (playing) {
    return (
      <Box
        component="video"
        aria-label={preview.description}
        poster={preview.posterSrc}
        preload="metadata"
        sx={mediaSx(preview)}
        autoPlay
        playsInline
        muted
        loop
      >
        <source src={preview.videoSrc} type="video/mp4" />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={preview.posterSrc}
      alt={preview.description}
      sx={mediaSx(preview)}
    />
  );
}

export default function Previews() {
  const [{ selected, previous }, setSelection] = useState({
    selected: 0,
    previous: null,
  });
  const rmQuery = '(prefers-reduced-motion: reduce)';
  const reduceMotion = useMediaQuery(rmQuery, { defaultMatches: true });
  const preview = previews[selected];
  const name = previewLabels[selected];

  const selectPreview = useCallback((index) => {
    setSelection(({ selected }) => ({ selected: index, previous: selected }));
  }, []);

  return (
    <Card elevation={3} sx={{ borderRadius: 2, pt: 1.5 }}>
      <Box px={2} mb={1.5}>
        <Typography variant="h6" component="h2">
          Preview - {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {preview.description}
        </Typography>
      </Box>

      <Carousel
        activeStep={selected}
        label="Visualization previews"
        slideLabels={previewLabels}
        autoAdvanceMs={reduceMotion ? undefined : 20000}
        onChange={selectPreview}
      >
        {previews.map((item, index) => (
          <Fragment key={item.id}>
            {(index === selected || index === previous) && (
              <PreviewMedia
                preview={item}
                playing={index === selected && !reduceMotion}
              />
            )}
            {index === 0 && (
              <Typography
                color="text.secondary"
                sx={{
                  px: 2,
                  mt: 1.5,
                  typography: { xs: 'caption', sm: 'body2' },
                }}
              >
                Use the controls to play or pause animations
                <Box
                  component="span"
                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                >
                  , tweak inputs, or generate a shareable URL for the current
                  graph or tree
                </Box>
                .
              </Typography>
            )}
          </Fragment>
        ))}
      </Carousel>
    </Card>
  );
}
