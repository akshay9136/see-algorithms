import { Box, Container, Divider, Typography } from '@mui/material';

export default function Article({ title, summary, children }) {
  return (
    <Container maxWidth="md" sx={{ p: 0 }} className="article">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="warning.main"
      >
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

export function Section({ title, children }) {
  return (
    <Box mb={4}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>

      {children}
    </Box>
  );
}
