import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

function AdUnit({ format, fullWidth = 'false', sx }) {
  const initialized = useRef(false);
  const adRef = useRef(null);

  useEffect(() => {
    const ad = adRef.current;
    if (!ad || initialized.current) return;

    const initialize = () => {
      // Hidden or still-settling layouts cannot size a responsive ad yet.
      if (!ad.isConnected || initialized.current || ad.clientWidth <= 0) return;

      initialized.current = true;
      observer.disconnect();
      if (ad.hasAttribute('data-ad-status')) return;

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('AdSense initialization failed:', error);
      }
    };

    const observer = new ResizeObserver(initialize);
    observer.observe(ad);
    initialize();

    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={sx} width="100%" minWidth="160px">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7905328601622622"
        data-ad-slot="5573819826"
        data-ad-format={format || 'auto'}
        data-full-width-responsive={fullWidth}
      />
    </Box>
  );
}

export default AdUnit;
