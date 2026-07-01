import { Box, Container, Divider, Typography } from '@mui/material';
import { memo } from 'react';

function Article({ title, summary, children }) {
  return (
    <Container maxWidth="md" sx={{ p: 0 }} className="article">
      <Typography variant="h4" component="h1" gutterBottom color="warning.main">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        {summary}
      </Typography>
      <Divider sx={{ my: 3 }} />
      {children}
    </Container>
  );
}

export default memo(Article);

export const Section = memo(function (props) {
  const { title, children, variant = 'h5', sx } = props;
  return (
    <Box
      component="section"
      textAlign="justify"
      minWidth={300}
      mb={variant === 'h5' ? 4 : 3}
      sx={{ flex: 1, ...sx }}
    >
      <Typography variant={variant} component="h2" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
});

export const ListItems = memo(function (props) {
  return (
    <Typography paragraph component="ul" sx={{ '& li': { mb: 1 } }}>
      {props.children}
    </Typography>
  )
});
