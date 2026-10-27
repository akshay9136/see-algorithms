import { useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  IconButton,
  Link,
  Popover,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import AppContext from '@/common/context';
import useCredits from './useCredits';
import useFeedback from './useFeedback';
import useLoadingSteps from './useLoadingSteps';
import { logError } from '@/common/utils';
import { trackEvent } from '@/common/analytics';
import { marked } from 'marked';
import { SUMMARY_COST } from '@/utils/constants';

export default function useSummary() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryOn, setSummaryOn] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { playStatus, setContext } = useContext(AppContext);
  const { pathname, query } = useRouter();
  const { data: session } = useSession();
  const { fetchCredits } = useCredits();
  const controlRef = useRef(null);
  const payloadRef = useRef(null);
  const loading = useLoadingSteps();

  useEffect(() => {
    return () => controlRef.current?.abort();
  }, [pathname]);

  const isEmbed = pathname.includes('/embed/');
  const algoId = isEmbed
    ? query.algorithm || query.dataStructure
    : pathname.split('/')[2];

  const [feedback, setFeedback] = useFeedback({
    api: '/api/summary-feedback',
    pageId: algoId,
  });

  const explain = async (data) => {
    if (!summaryOn) return;
    const controller = new AbortController();
    const { signal } = controller;
    const payload = JSON.stringify({ algoId, data });
    if (payloadRef.current === payload) return;

    controlRef.current?.abort();
    controlRef.current = controller;
    loading.start();
    setError(null);
    setFeedback(null);
    trackEvent('ai_summary_requested');
    let reason = '';
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal,
      });
      const text = res.ok ? await res.text() : '';
      signal.throwIfAborted();

      if (res.ok) {
        payloadRef.current = payload;
        setContent(marked(text));
        trackEvent('ai_summary_succeeded');
        fetchCredits();
      } else if (res.status === 402) {
        reason = 'insufficient_credits';
        trackEvent('feature_blocked', { feature: 'ai_summary', reason });
        setError(
          <p>
            Insufficient credits. Please{' '}
            <Link href="/buy-credits">buy more credits</Link> to continue using
            AI.
          </p>,
        );
      } else if (res.status === 503) {
        reason = 'service_busy';
        setError(<p>AI service is busy. Please {tryAgain(data)}.</p>);
      } else {
        reason = 'http_error';
        setError(<p>AI request timed out. Please {tryAgain(data)}.</p>);
      }
    } catch (err) {
      if (signal.aborted || err.name === 'AbortError') return;
      reason = 'network_error';
      setError(<p>Connection timed out. Please {tryAgain(data)}.</p>);
      logError(err, 'AI request failed');
    }
    if (reason) {
      trackEvent('ai_summary_failed', { reason });
    }
    loading.stop();
  };

  const tryAgain = (data) => (
    <Link component="button" onClick={() => explain(data)}>
      try again
    </Link>
  );

  const toggle = (e) => {
    if (!session) {
      trackEvent('feature_blocked', {
        feature: 'ai_summary',
        reason: 'sign_in_required',
      });
      setContext({ signInOpen: true });
    } else {
      const { checked } = e.target;
      setSummaryOn(checked);
      trackEvent('ai_summary_toggled', { enabled: checked });
      if (!checked) abort();
    }
  };

  const abort = () => {
    controlRef.current?.abort();
    payloadRef.current = null;
    loading.stop();
    if (playStatus < 2) setContent('');
    setError(null);
    setFeedback(null);
  };

  const summary = isEmbed ? null : (
    <Stack width={500} minHeight={200}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" component="h2">
          AI Summary
        </Typography>

        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="AI summary info"
          sx={{ p: 0 }}
        >
          <InfoOutlined fontSize="small" color="warning" />
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: { sx: { mt: 1, borderRadius: 2, bgcolor: '#fff9c4' } },
          }}
        >
          <Typography sx={{ px: 1.5, py: 1 }} variant="body2">
            Get an AI-powered explanation tailored to this visualization.
            Accuracy may vary.
          </Typography>
        </Popover>

        <Switch
          size="small"
          checked={summaryOn}
          onChange={toggle}
          inputProps={{ 'aria-label': 'AI Summary Toggle' }}
        />

        <Typography variant="body2" color="text.secondary">
          ({SUMMARY_COST[algoId] || 3} credits)
        </Typography>
      </Box>

      {loading.isLoading ? (
        <Typography variant="body2" component={Box} color="text.secondary">
          <p>{loading.message}</p>
        </Typography>
      ) : error ? (
        <Typography variant="body2" component={Box} color="text.secondary">
          {error}
        </Typography>
      ) : (
        <>
          <Typography
            variant="body2"
            component={Box}
            lineHeight={1.6}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {content.length > 100 && feedback}
        </>
      )}
    </Stack>
  );

  return [summary, explain, abort];
}
