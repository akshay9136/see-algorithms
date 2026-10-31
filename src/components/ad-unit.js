import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

function AdUnit({ format, fullWidth = true, sx }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error('AdSense initialization failed:', error);
    }
  }, []);

  return (
    <Box sx={sx}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7905328601622622"
        data-ad-slot="5573819826"
        data-ad-format={format || 'auto'}
        data-full-width-responsive={String(fullWidth)}
      />
    </Box>
  );
}

export default AdUnit;
