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
import { randomInt } from '@/common/utils';
import { showToast } from '../toast';

function InputNumbers(props) {
  const [values, setValues] = useState([]);
  const [status, setStatus] = useState(false);
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
        setStatus(false);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!status) {
      if (validate()) {
        setTimeout(() => setStatus(true), 100);
        props.onStart(values);
      }
    } else {
      props.onStop();
      setTimeout(() => setStatus(false), 100);
      setValues([]);
    }
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
      {values.length > 0 && (
        <Button variant="contained" onClick={handleSubmit}>
          {!status
            ? props.startBtnText || 'Start'
            : props.stopBtnText || 'Stop'}
        </Button>
      )}
    </Box>
  );
}

export default InputNumbers;
