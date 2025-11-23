import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

const PageNotFound = () => {
  const router = useRouter();
  return (
    <Box width={500}>
      <h1>404</h1>
      <hr />
      <h4>Oops! page not found</h4>
      <br />
      <Button variant="contained" color="primary" onClick={() => router.back()}>
        Go Back
      </Button>
    </Box>
  );
};

export default PageNotFound;
