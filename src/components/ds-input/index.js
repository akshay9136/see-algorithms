import { useState } from 'react';
import { Input, Button, Typography, Box } from '@mui/material';
import styles from '../numbers/numbers.module.css';
import { randomInt } from '@/common/utils';
import { showToast } from '../toast';

function DSInput(props) {
  const [number, setNumber] = useState(randomInt());
  const [status, setStatus] = useState(false);

  const handleInput = (e) => {
    let value = e.target.value.trim().slice(0, 3);
    if (!isNaN(value)) {
      setNumber(parseInt(value) || '');
    }
  };

  const validate = (callback) => {
    if (typeof number !== 'number') {
      showToast({
        message: 'Please enter a number.',
        variant: 'error',
      });
    } else {
      setStatus(true);
      callback(number)
        .then(() => {
          setStatus(false);
          setNumber(randomInt());
        })
        .catch(() => {});
    }
  };

  return (
    <Box className={styles.inputNumbers}>
      <Typography variant="subtitle1" fontWeight={600}>
        Enter a number: &nbsp;
      </Typography>
      <Input
        size="small"
        value={number}
        onChange={handleInput}
        className={styles.number}
      />
      <Box display="flex" width="max-content">
        {props.buttons.map((btn, i) => (
          <Button
            key={i}
            size="small"
            variant="outlined"
            onClick={() => {
              btn.validate ? validate(btn.onClick) : btn.onClick();
            }}
            disabled={status || btn.disabled}
            sx={{ mr: 1, minWidth: 40 }}
            title={btn.title}
            aria-label={btn.text}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default DSInput;
