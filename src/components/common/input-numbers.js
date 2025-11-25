import { forwardRef, useImperativeHandle, useState } from 'react';
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
import { Pause, PlayArrow } from '@mui/icons-material';

const InputNumbers = forwardRef((props, ref) => {
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
      numbers[i] = parseInt(value) || '';
      setNumbers([...numbers]);
    }
  };

  const validate = () => {
    for (let i = 0; i < numbers.length; i++) {
      if (typeof numbers[i] !== 'number') {
        showError('Please enter valid numbers.');
        return false;
      }
    }
    return true;
  };

  const startToEnd = async () => {
    setStatus(1);
    await props.onStart(numbers);
    setStatus(2);
  };

  const handleStart = async () => {
    switch (status) {
      case 0:
        if (validate()) startToEnd();
        break;
      case 1:
        setStatus(-1);
        props.onStop();
        break;
      case 2:
        props.onReset();
        await sleep(500);
        if (validate()) startToEnd();
        break;
      default:
        startToEnd();
    }
  };

  const handleReset = () => {
    props.onReset();
    setStatus(0);
    setNumbers([]);
  };

  useImperativeHandle(ref, () => ({
    values: numbers,
    validate,
  }));

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
      {numbers.length > 0 &&
        (props.buttons ? (
          props.buttons
        ) : (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={status === 1 ? <Pause /> : <PlayArrow />}
              onClick={handleStart}
              sx={{ padding: '4px 12px' }}
              aria-live="polite"
            >
              Play
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ padding: '4px 12px' }}
            >
              Reset
            </Button>
          </Box>
        ))}
    </Box>
  );
});

export default InputNumbers;
