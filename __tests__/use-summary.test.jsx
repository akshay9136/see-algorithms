import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ReadableStream } from 'stream/web';
import { TextEncoder, TextDecoder } from 'util';
import AppContext from '@/common/context';
import useSummary from '@/hooks/useSummary';
import useCredits from '@/hooks/useCredits';
import { trackEvent } from '@/common/analytics';
import { useRouter } from 'next/router';

jest.mock('marked', () => ({ marked: (text) => `<p>${text}</p>` }));
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: {} } }),
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/common/analytics', () => ({ trackEvent: jest.fn() }));
jest.mock('@/common/utils', () => ({ logError: jest.fn() }));
jest.mock('@/hooks/useCredits', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/hooks/useFeedback', () => ({
  __esModule: true,
  default: () => ['Feedback', jest.fn()],
}));

global.TextDecoder = TextDecoder;
const fetchCredits = jest.fn();
const originalFetch = global.fetch;
let streams;

function Harness() {
  const [summary, explain, abort] = useSummary();
  return (
    <>
      {summary}
      <button onClick={() => explain([1])}>Explain first</button>
      <button onClick={() => explain([2])}>Explain second</button>
      <button onClick={abort}>Cancel</button>
    </>
  );
}

beforeEach(() => {
  streams = [];
  fetchCredits.mockClear();
  trackEvent.mockClear();
  useRouter.mockReturnValue({ pathname: '/data-structures/BST', query: {} });
  useCredits.mockReturnValue({ fetchCredits });
  global.fetch = jest.fn().mockImplementation(() => {
    const body = new ReadableStream({
      start(controller) {
        streams.push(controller);
      },
    });
    return Promise.resolve({ ok: true, body });
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

function mount() {
  const view = render(
    <AppContext.Provider value={{ playStatus: 0, setContext: jest.fn() }}>
      <Harness />
    </AppContext.Provider>,
  );
  fireEvent.click(screen.getByRole('switch', { name: 'AI Summary Toggle' }));
  return view;
}

async function send(controller, event) {
  await act(async () => {
    controller.enqueue(new TextEncoder().encode(`${JSON.stringify(event)}\n`));
  });
}

test('shows partial text while loading and refreshes credits only after completion', async () => {
  mount();
  fireEvent.click(screen.getByText('Explain first'));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  await send(streams[0], { type: 'chunk', text: 'A growing summary' });
  expect(screen.getByText('A growing summary')).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('Writing summary...');
  expect(fetchCredits).not.toHaveBeenCalled();
  expect(trackEvent).toHaveBeenCalledWith('ai_summary_requested');
  expect(trackEvent).not.toHaveBeenCalledWith('ai_summary_succeeded');
  expect(screen.queryByText('Feedback')).not.toBeInTheDocument();
  await send(streams[0], { type: 'done' });
  expect(fetchCredits).toHaveBeenCalledTimes(1);
  expect(trackEvent).toHaveBeenCalledWith('ai_summary_succeeded');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('allows retrying the same input after a truncated response', async () => {
  mount();
  fireEvent.click(screen.getByText('Explain first'));
  await send(streams[0], { type: 'chunk', text: 'Partial summary' });
  await act(async () => streams[0].close());
  expect(screen.getByRole('alert')).toHaveTextContent('Summary interrupted');
  expect(screen.getByText('Partial summary')).toBeVisible();
  expect(fetchCredits).not.toHaveBeenCalled();
  expect(trackEvent).toHaveBeenCalledWith('ai_summary_failed', {
    reason: 'network_error',
  });
  fireEvent.click(screen.getByText('try again'));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  await send(streams[1], { type: 'chunk', text: 'Retried summary' });
  await send(streams[1], { type: 'done' });
  expect(screen.getByText('Retried summary')).toBeVisible();
});

test.each([{ type: 'chunk', text: 'Stale summary' }, { type: 'done' }])(
  'an older request cannot overwrite a newer one with a $type event',
  async (event) => {
    mount();
    fireEvent.click(screen.getByText('Explain first'));
    const firstSignal = global.fetch.mock.calls[0][1].signal;
    fireEvent.click(screen.getByText('Explain second'));
    expect(firstSignal.aborted).toBe(true);
    await send(streams[1], { type: 'chunk', text: 'New summary' });
    await send(streams[0], event);
    expect(screen.getByText('New summary')).toBeVisible();
    expect(screen.queryByText('Stale summary')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeVisible();
    expect(fetchCredits).not.toHaveBeenCalled();
    await send(streams[1], { type: 'done' });
    expect(fetchCredits).toHaveBeenCalledTimes(1);
    expect(
      trackEvent.mock.calls.filter(([name]) => name === 'ai_summary_succeeded'),
    ).toHaveLength(1);
    expect(
      trackEvent.mock.calls.filter(([name]) => name === 'ai_summary_failed'),
    ).toHaveLength(0);
  },
);

test('cancelling before response headers arrive ignores late HTTP errors', async () => {
  let respond;
  global.fetch.mockImplementationOnce(
    () => new Promise((resolve) => (respond = resolve)),
  );
  mount();
  fireEvent.click(screen.getByText('Explain first'));
  const signal = global.fetch.mock.calls[0][1].signal;
  fireEvent.click(screen.getByText('Cancel'));
  expect(signal.aborted).toBe(true);
  await act(async () => respond({ ok: false, status: 503 }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(
    trackEvent.mock.calls.filter(([name]) => name === 'ai_summary_failed'),
  ).toHaveLength(0);
});

test('navigation aborts the stream without reporting cancellation as a failure', async () => {
  const view = mount();
  fireEvent.click(screen.getByText('Explain first'));
  await send(streams[0], { type: 'chunk', text: 'Before navigation' });
  const signal = global.fetch.mock.calls[0][1].signal;
  useRouter.mockReturnValue({ pathname: '/data-structures/AVL', query: {} });
  view.rerender(
    <AppContext.Provider value={{ playStatus: 0, setContext: jest.fn() }}>
      <Harness />
    </AppContext.Provider>,
  );
  expect(signal.aborted).toBe(true);
  await send(streams[0], { type: 'error', status: 503 });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(fetchCredits).not.toHaveBeenCalled();
  expect(
    trackEvent.mock.calls.filter(([name]) => name === 'ai_summary_failed'),
  ).toHaveLength(0);
});

test('reports for streamed service errors and clears errors on cancel', async () => {
  mount();
  fireEvent.click(screen.getByText('Explain first'));
  await send(streams[0], { type: 'chunk', text: 'Partial' });
  await send(streams[0], { type: 'error', status: 503 });
  expect(trackEvent).toHaveBeenCalledWith('ai_summary_failed', {
    reason: 'service_busy',
  });
  expect(screen.getByRole('alert')).toHaveTextContent('AI service is busy');
  fireEvent.click(screen.getByText('Cancel'));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
