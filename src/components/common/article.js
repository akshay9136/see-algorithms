import { Box, Container, Divider, Typography } from '@mui/material';

export default function Article({ title, summary, children }) {
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

export function Section({ title, children, variant = 'h5', sx }) {
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
}
