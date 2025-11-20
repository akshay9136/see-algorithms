import { useState } from 'react';
import {
  Select,
  Input,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import styles from './numbers.module.css';
import { randomInt, sleep } from '@/common/utils';
import { showToast } from '../toast';
import { Pause, PlayArrow } from '@mui/icons-material';

function InputNumbers(props) {
  const [values, setValues] = useState([]);
  const [status, setStatus] = useState(0);
  const { min = 7, max = 12 } = props;

  const handleSelect = (e) => {
    const size = parseInt(e.target.value);
    const values = [];
    for (let i = 0; i < size; i++) {
      values.push(randomInt());
    }
    setValues(values);
    props.onSelect?.(size);
  };

  const handleInput = (e, i) => {
    let val = e.target.value.trim().slice(0, 3);
    if (!isNaN(val)) {
      values[i] = parseInt(val) || '';
      setValues([...values]);
    }
  };

  const validate = () => {
    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] !== 'number') {
        showToast({
          message: 'Please enter valid numbers.',
          variant: 'error',
        });
        return false;
      }
    }
    return true;
  };

  const startToEnd = async () => {
    setStatus(1);
    await props.onStart(values);
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
    setValues([]);
  };

  return (
    <Box className={styles.inputNumbers}>
      <Typography variant="subtitle1" fontWeight={600} width="max-content">
        {!values.length
          ? 'Select number of elements: '
          : props.label || 'Enter numbers: '}
        &nbsp;
      </Typography>
      {!values.length ? (
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
          {values.map((val, i) => (
            <Input
              key={i}
              value={val}
              onChange={(e) => handleInput(e, i)}
              className={styles.number}
            />
          ))}
        </Box>
      )}
      {values.length > 0 &&
        (props.buttons ? props.buttons(values) : (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={status === 1 ? <Pause /> : <PlayArrow />}
              onClick={handleStart}
              sx={{ padding: '4px 12px' }}
              aria-live="polite"
            >
              {props.startBtnText || 'Play'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ padding: '4px 12px' }}
            >
              {props.stopBtnText || 'Reset'}
            </Button>
          </Box>
        ))}
    </Box>
  );
}

export default InputNumbers;
