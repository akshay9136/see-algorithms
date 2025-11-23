import { useState, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, Typography, Box } from '@mui/material';
import { randomInt } from '@/common/utils';
import { showToast } from '../toast';
import styles from '@/styles/numbers.module.css';

const DSInput = forwardRef((props, ref) => {
  const [number, setNumber] = useState(props.keepEmpty ? '' : randomInt());
  const [status, setStatus] = useState(false);

  const handleInput = (e) => {
    const value = e.target.value.trim().slice(0, 3);
    if (value.length) {
        if (!isNaN(value)) {
            setNumber(parseInt(value));
        }
    } else setNumber('');
  };

  const validate = (callback) => {
    if (typeof number !== 'number') {
      showToast({
        message: 'Please enter a number.',
        variant: 'error',
      });
    } else {
      setStatus(true);
      callback(number).then(() => {
          setStatus(false);
          if (!props.keepEmpty) setNumber(randomInt());
        })
        .catch(() => {});
    }
  };

  useImperativeHandle(ref, () => ({
    getValue: () => number,
  }));

  return (
    <Box className={styles.inputNumbers}>
      <Typography variant="subtitle1" fontWeight={600}>
        {props.label || 'Enter a number:'} &nbsp;
      </Typography>
      <Input
        size="small"
        value={number}
        onChange={handleInput}
        className={styles.number}
      />
      <Box display="flex">
        {props.buttons.map((btn, i) => (
          <Button
            key={i}
            size="small"
            variant="outlined"
            onClick={() => {
              const fn = (val) => btn.onClick(val);
              if (btn.validate) validate(fn);
              else fn();
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
});

export default DSInput;
