import { useEffect, useState } from 'react';
import {
  Select,
  Input,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import styles from '@/styles/numbers.module.css';
import { randomInt, showError, sleep } from '@/common/utils';
import { NavigateNext, Pause, PlayArrow } from '@mui/icons-material';
import Iterator from '@/common/iterator';

function InputNumbers(props) {
  const [numbers, setNumbers] = useState([]);
  const [status, setStatus] = useState(0);
  const { min = 7, max = 12 } = props;

  const handleSelect = (e) => {
    const size = parseInt(e.target.value);
    const values = [];
    for (let i = 0; i < size; i++) {
      values.push(randomInt());
    }
    setNumbers(values);
    props.onSelect?.(size);
  };

  const handleInput = (e, i) => {
    const value = e.target.value.trim().slice(0, 3);
    if (!isNaN(value)) {
      const _numbers = numbers.slice();
      _numbers[i] = parseInt(value) || '';
      setNumbers(_numbers);
    }
  };

  const validate = () => {
    for (let num of numbers) {
      if (typeof num !== 'number') {
        showError('Please enter valid numbers.');
        return false;
      }
    }
    return true;
  };

  const resume = async () => {
    setStatus(1);
    await Iterator.current().start();
    setStatus(2);
  };

  const restart = () => {
    if (validate()) {
      Iterator.new(props.onStart, numbers);
      resume();
    }
  };

  const handleNext = async () => {
    setStatus(1);
    const { done } = await Iterator.current().next();
    setStatus(done ? 2 : -1);
  };

  const handlePlay = () => {
    switch (status) {
      case 0:
        restart();
        break;
      case 1:
        Iterator.current().stop();
        setStatus(-1);
        break;
      case 2:
        props.onReset();
        sleep(500).then(restart);
        break;
      default:
        resume();
    }
  };

  const handleReset = () => {
    props.onReset(true);
    setStatus(0);
    setNumbers([]);
    Iterator.current()?.exit();
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
              className={styles.number}
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
