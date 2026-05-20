import { memo } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

function Spinner({ spinning }) {
  return (
    <Backdrop open={spinning} style={{ zIndex: 100 }}>
      <CircularProgress aria-label="Loading..." />
    </Backdrop>
  );
}

export default memo(Spinner);
