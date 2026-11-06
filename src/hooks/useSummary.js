import { useContext, useEffect, useId, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  IconButton,
  Link,
  Popover,
  Switch,
  Typography,
} from '@mui/material';
import { AutoAwesome, InfoOutlined } from '@mui/icons-material';
import AppContext from '@/common/context';
import useCredits from './useCredits';
import useFeedback from './useFeedback';
import useLoadingSteps from './useLoadingSteps';
import { logError } from '@/common/utils';
import { trackEvent } from '@/common/analytics';
import { marked } from 'marked';
import { readStream } from '@/utils/summary';
import { SUMMARY_COST } from '@/utils/constants';

export default function useSummary() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryOn, setSummaryOn] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { playStatus, setContext } = useContext(AppContext);
  const { pathname, query } = useRouter();
  const { data: session } = useSession();
  const { fetchCredits } = useCredits();
  const controlRef = useRef(null);
  const payloadRef = useRef(null);
  const loading = useLoadingSteps();
  const placeholderId = useId();

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
    payloadRef.current = null;
    controlRef.current?.abort();
    controlRef.current = controller;
    loading.start();
  
    setContent('');
    setCompleted(false);
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
      signal.throwIfAborted();

      if (res.ok) {
        let markdown = '';
        await readStream(res.body, (chunk) => {
          signal.throwIfAborted();
          markdown += chunk;
          setContent(marked(markdown));
        });
        signal.throwIfAborted();
        payloadRef.current = payload;
        setCompleted(true);
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
      if (err.status === 503) {
        reason = 'service_busy';
        setError(<p>AI service is busy. Please {tryAgain(data)}.</p>);
      } else {
        reason = 'network_error';
        setError(<p>Summary interrupted. Please {tryAgain(data)}.</p>);
      }
      logError(err, 'AI request failed');
    } finally {
      if (controlRef.current === controller) loading.stop();
    }

    if (reason) {
      trackEvent('ai_summary_failed', { reason });
    }
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
      setContent('');
    }
  };

  const abort = () => {
    payloadRef.current = null;
    controlRef.current?.abort();
    loading.stop();
    if (playStatus < 2) setContent('');
    setError(null);
    setCompleted(false);
    setFeedback(null);
  };

  const showFeedback = completed && !loading.isLoading && !error;
  const showPlaceholder =
    !content && !completed && !loading.isLoading && !error;

  const summary = isEmbed ? null : (
    <Box width={500} sx={{ maxWidth: '100%', minHeight: 200 }}>
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
          slotProps={{
            input: {
              'aria-label': 'AI Summary Toggle',
              'aria-describedby': showPlaceholder ? placeholderId : undefined,
            },
          }}
        />

        <Typography variant="body2" color="text.secondary">
          ({SUMMARY_COST[algoId] || 3} credits)
        </Typography>
      </Box>

      {showPlaceholder && (
        <Box
          id={placeholderId}
          display="flex"
          gap={1.5}
          sx={{
            mt: 2,
            p: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'action.hover',
          }}
        >
          <AutoAwesome color="primary" fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              See what happens with your input
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get a short, step-by-step explanation of this visualization. Turn
              on AI Summary, then start a fresh run with your input.
            </Typography>
          </Box>
        </Box>
      )}

      <Typography
        variant="body2"
        component={Box}
        lineHeight={1.6}
        aria-busy={loading.isLoading}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {loading.isLoading && (
        <Typography
          variant="body2"
          component={Box}
          color="text.secondary"
          role="status"
        >
          <p>{content ? 'Writing summary...' : loading.message}</p>
        </Typography>
      )}
      {error && (
        <Typography
          variant="body2"
          component={Box}
          color="text.secondary"
          role="alert"
        >
          {error}
        </Typography>
      )}
      {showFeedback && content.length > 100 && feedback}
    </Box>
  );

  return [summary, explain, abort];
}
