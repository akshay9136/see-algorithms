import { Box } from '@mui/material';
import { useContext, useEffect, useRef } from 'react';
import AppContext from '@/common/context';

function AdUnit({ format, fullWidth = 'false', sx }) {
  const { adsReady } = useContext(AppContext);
  const initialized = useRef(false);
  const adRef = useRef(null);

  useEffect(() => {
    const ad = adRef.current;
    if (!adsReady || !ad || initialized.current) return;

    const initialize = () => {
      // Hidden or still-settling layouts cannot size a responsive ad yet.
      if (!ad.isConnected || initialized.current || ad.clientWidth <= 0) return;

      initialized.current = true;
      observer.disconnect();
      if (ad.hasAttribute('data-ad-status')) return;

      try {
        // The push is page-wide. Expose this slot only when it can be sized.
        ad.classList.add('adsbygoogle');
        window.adsbygoogle.push({});
      } catch (error) {
        ad.classList.remove('adsbygoogle');
        console.error('AdSense initialization failed:', error);
      }
    };

    const observer = new ResizeObserver(initialize);
    observer.observe(ad);
    initialize();

    return () => observer.disconnect();
  }, [adsReady]);

  return (
    <Box sx={sx} width="100%" minWidth="160px">
      <ins
        ref={adRef}
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
