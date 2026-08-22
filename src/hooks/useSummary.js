import {
  Box,
  IconButton,
  Link,
  Popover,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { InfoOutlined } from '@mui/icons-material';
import { marked } from 'marked';
import { logError } from '@/common/utils';
import AppContext from '@/common/context';
import useLoadingSteps from './useLoadingSteps';
import useCredits from './useCredits';
import useFeedback from './useFeedback';
import { SUMMARY_COST } from '@/utils/constants';

export default function useSummary() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryOn, setSummaryOn] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { playStatus, setContext } = useContext(AppContext);
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const { fetchCredits } = useCredits();
  const controlRef = useRef(null);
  const payloadRef = useRef(null);
  const algoId = pathname.split('/')[2];
  const loading = useLoadingSteps();

  const [feedback, setFeedback] = useFeedback({
    api: '/api/summary-feedback',
    pageId: algoId,
  });

  const explain = async (data) => {
    if (!summaryOn) return;
    const controller = new AbortController();
    const payload = JSON.stringify({ algoId, data });
    if (payloadRef.current === payload) return;

    controlRef.current?.abort();
    controlRef.current = controller;
    setError(null);
    setFeedback(null);
    loading.start();
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: controller.signal,
      });

      if (res.ok) {
        payloadRef.current = payload;
        const html = marked(await res.text());
        setContent(html);
        fetchCredits();
      } else if (res.status === 402) {
        setError(
          <p>
            Insufficient credits. Please{' '}
            <Link href="/buy-credits">buy more credits</Link> to continue using
            AI.
          </p>,
        );
      } else if (res.status === 503) {
        setError(<p>AI service is busy. Please {tryAgain(data)}.</p>);
      } else {
        setError(<p>AI request timed out. Please {tryAgain(data)}.</p>);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(<p>Connection timed out. Please {tryAgain(data)}.</p>);
      }
      logError(err, 'AI request cancelled');
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
      setContext({ signInOpen: true });
    } else {
      const { checked } = e.target;
      setSummaryOn(checked);
      window.gtag?.('event', 'ai_summary', { checked });
      if (!checked) abort();
    }
  };

  const abort = () => {
    controlRef.current?.abort();
    loading.stop();
    if (playStatus < 2) setContent('');
    setFeedback(null);
  };

  const summary = (
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
