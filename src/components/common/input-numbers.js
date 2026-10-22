import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { NavigateNext, Pause, PlayArrow } from '@mui/icons-material';
import { trackEvent, trackVisualization } from '@/common/analytics';
import { randomInt, showError, sleep } from '@/common/utils';
import { newIterator } from '@/common/iterator';
import useSortingUrl from '@/hooks/useSortingUrl';
import styles from '@/styles/numbers.module.css';

var iterators = [];

function InputNumbers(props) {
  const [urlNumbers] = useSortingUrl();
  const [numbers, setNumbers] = useState([]);
  const [status, setStatus] = useState(0);
  const inputDirty = useRef(false);
  const runRef = useRef(null);
  const { min = 7, max = 12 } = props;
  const {
    startHandlers = [props.onStart],
    resetHandlers = [props.onReset],
  } = props;

  useEffect(() => {
    if (urlNumbers) setNumbers(urlNumbers);
  }, [urlNumbers]);

  const handleSelect = (e) => {
    const size = parseInt(e.target.value);
    const values = [];
    for (let i = 0; i < size; i++) {
      values.push(randomInt());
    }
    setNumbers(values);
    trackEvent('input_modified', { action: 'select' });
    props.onSelect?.(size);
  };

  const handleInput = (e, i) => {
    const value = e.target.value.trim().slice(0, 3);
    if (!isNaN(value)) {
      const _numbers = numbers.slice();
      _numbers[i] = parseInt(value) || '';
      setNumbers(_numbers);
      inputDirty.current = true;
    }
  };

  const handleBlur = () => {
    if (inputDirty.current) {
      trackEvent('input_modified', { action: 'edit_values' });
    }
    inputDirty.current = false;
  };

  const validate = () => {
    for (let num of numbers) {
      if (typeof num !== 'number') {
        trackEvent('validation_failed', { reason: 'invalid_numbers' });
        showError('Please enter valid numbers.');
        return false;
      }
    }
    return true;
  };

  const resume = async () => {
    setStatus(1);
    await Promise.all(iterators.map((it) => it.start()));
    setStatus(2);
  };

  const restart = () => {
    if (validate()) {
      runRef.current?.cancel();
      runRef.current = trackVisualization(startHandlers.length);
      iterators = startHandlers.map((start) =>
        newIterator(runRef.current.wrap(start), numbers),
      );
      resume();
    }
  };

  const handleNext = async () => {
    setStatus(1);
    runRef.current?.control('step');
    const results = await Promise.all(iterators.map((it) => it.next()));
    const done = results.every((r) => r.done);
    setStatus(done ? 2 : -1);
  };

  const handlePlay = () => {
    switch (status) {
      case 0:
        restart();
        break;
      case 1:
        runRef.current?.control('pause');
        iterators.forEach((it) => it.stop());
        setStatus(-1);
        break;
      case 2:
        resetHandlers.forEach((reset) => reset());
        sleep(500).then(restart);
        break;
      default:
        runRef.current?.control('resume');
        resume();
    }
  };

  const handleReset = () => {
    runRef.current?.control('reset');
    runRef.current?.cancel();
    setStatus(0);
    setNumbers([]);
    iterators.forEach((it) => it.exit());
    resetHandlers.forEach((reset) => reset(true));
  };

  useEffect(() => handleReset, []);

  return (
    <Box className={styles.inputNumbers}>
      <Typography variant="subtitle1" fontWeight={600}>
        {!numbers.length
          ? 'Select number of elements: '
          : props.label || 'Enter numbers: '}
        &nbsp;
      </Typography>
      {!numbers.length ? (
        <Select onChange={handleSelect} className={styles.select} size="small">
          <MenuItem></MenuItem>
          {Array.from(Array(max - min + 1))
            .map((_, i) => min + i)
            .map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
        </Select>
      ) : (
        <Box display="flex">
          {numbers.map((val, i) => (
            <Input
              key={i}
              value={val}
              onChange={(e) => handleInput(e, i)}
              onBlur={handleBlur}
              sx={{ width: '2.5rem', mr: 1.5 }}
            />
          ))}
        </Box>
      )}
      {numbers.length > 0 && (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={status === 1 ? <Pause /> : <PlayArrow />}
            onClick={handlePlay}
            sx={{ padding: '4px 12px' }}
            aria-live="polite"
          >
            Play
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleNext}
            disabled={status !== -1}
            title="Next Step"
            sx={{ minWidth: 40, px: 0 }}
          >
            <NavigateNext />
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ padding: '4px 12px' }}
          >
            Reset
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default InputNumbers;
