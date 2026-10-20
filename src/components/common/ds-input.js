import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import { Pause, PlayArrow } from '@mui/icons-material';
import { newIterator } from '@/common/iterator';
import {
  analyticsContext,
  trackEvent,
  trackVisualization,
} from '@/common/analytics';
import { randomInt, showError } from '@/common/utils';
import styles from '@/styles/numbers.module.css';

// Explicit labels keep controls such as Clear/Save/Undo out of operation metrics.
const OPERATIONS = {
  insert: 'insert',
  'at head': 'insert',
  'at tail': 'insert',
  delete: 'delete',
  search: 'search',
  extract: 'extract',
  enqueue: 'enqueue',
  dequeue: 'dequeue',
};

let iterators = [];

const DSInput = forwardRef((props, ref) => {
  const [number, setNumber] = useState(props.value ?? randomInt());
  const [status, setStatus] = useState(0);
  const allButtons = props.allButtons || props.buttons;
  const runRef = useRef(null);

  useEffect(() => {
    return () => {
      runRef.current?.cancel();
      runRef.current = null;
      iterators.forEach((it) => it.exit());
      iterators = [];
    };
  }, []);

  const getOperation = (button) => {
    const buttonKey = (button.text || button.label)?.trim().toLowerCase();
    return OPERATIONS[buttonKey];
  };

  const handleChange = (e) => {
    const value = e.target.value.trim().slice(0, 3);
    if (value.length) {
      if (!isNaN(value)) setNumber(parseInt(value));
    } else setNumber('');
  };

  const validate = (button) => {
    if (typeof number !== 'number') {
      const operation = getOperation(button);
      trackEvent('validation_failed', { operation, reason: 'invalid_number' });
      showError('Please enter a number.');
      return false;
    }
    return true;
  };

  const restart = (buttons) => {
    runRef.current?.cancel();
    const context = analyticsContext();
    const run = trackVisualization(buttons.length);
    runRef.current = run;
    return buttons.map((button) =>
      run.wrap(async function* (value) {
        const action = button.onClick(value);
        const result = action?.next ? yield* action : await action;
        if (runRef.current === run && result === false) {
          const operation = getOperation(button);
          trackEvent('validation_failed', { operation }, context);
          run.cancel();
        }
        return result;
      }),
    );
  };

  const handlePlay = (buttons) => {
    switch (status) {
      case 0:
        const [btn] = buttons;
        if (btn.animate || validate(btn)) {
          iterators = restart(buttons).map((action) =>
            newIterator(action, number),
          );
          resume();
        }
        break;
      case 1:
        runRef.current?.control('pause');
        iterators.forEach((it) => it.stop());
        setStatus(-1);
        break;
      default:
        runRef.current?.control('resume');
        resume();
    }
  };

  const resume = async () => {
    setStatus(1);
    const run = runRef.current;
    await Promise.all(iterators.map((it) => it.start()));
    if (runRef.current !== run) return;
    if (isNaN(props.value)) setNumber(randomInt());
    setStatus(0);
  };

  useImperativeHandle(ref, () => ({ value: number, setStatus }));

  return (
    <Box className={styles.inputNumbers} gap={1}>
      <Typography
        component="label"
        htmlFor="dsInput"
        variant="subtitle1"
        fontWeight={600}
      >
        {props.label || 'Enter a number:'}
      </Typography>
      <Input
        id="dsInput"
        sx={{ width: '2.5rem' }}
        size="small"
        value={number}
        onChange={handleChange}
      />
      {!props.hidePlayIcon && (
        <Button
          size="small"
          variant="outlined"
          onClick={handlePlay}
          disabled={status === 0}
          aria-live="polite"
          title="Pause/Play"
          sx={{ minWidth: 40, px: 0 }}
        >
          {status === 1 ? <Pause /> : <PlayArrow />}
        </Button>
      )}
      {props.buttons.map((btn) => (
        <Button
          key={btn.text || btn.label}
          size="small"
          variant="outlined"
          onClick={() => {
            const buttons = allButtons.filter((a) =>
              a.icon ? a.label === btn.label : a.text === btn.text,
            );
            btn.validate || btn.animate
              ? handlePlay(buttons)
              : buttons.forEach((a) => a.onClick());
          }}
          color={btn.color || 'primary'}
          disabled={status === 0 ? btn.disabled : true}
          aria-label={btn.text || btn.label}
          title={btn.label}
          sx={{ minWidth: 40 }}
        >
          {btn.icon || btn.text}
        </Button>
      ))}
    </Box>
  );
});

export default DSInput;
