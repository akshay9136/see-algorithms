import { useState, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, Typography, Box } from '@mui/material';
import { randomInt, showError } from '@/common/utils';
import { Pause, PlayArrow } from '@mui/icons-material';
import Iterator from '@/common/iterator';
import styles from '@/styles/numbers.module.css';

const DSInput = forwardRef((props, ref) => {
  const [number, setNumber] = useState(props.keepEmpty ? '' : randomInt());
  const [status, setStatus] = useState(0);

  const handleInput = (e) => {
    const value = e.target.value.trim().slice(0, 3);
    if (value.length) {
      if (!isNaN(value)) {
        setNumber(parseInt(value));
      }
    } else setNumber('');
  };

  const validate = () => {
    if (typeof number !== 'number') {
      showError('Please enter a number.');
      return false;
    }
    return true;
  };

  const resume = async () => {
    setStatus(1);
    await Iterator.current().start();
    if (!props.keepEmpty) setNumber(randomInt());
    setStatus(0);
  };

  const handlePlay = (btn) => {
    switch (status) {
      case 0:
        if (validate()) {
          Iterator.new(btn.onClick, number);
          resume();
        }
        break;
      case 1:
        Iterator.current().stop();
        setStatus(-1);
        break;
      default:
        resume();
    }
  };

  useImperativeHandle(ref, () => ({ value: number, setStatus }));

  return (
    <Box className={styles.inputNumbers}>
      <Typography
        component="label"
        htmlFor="dsInput"
        variant="subtitle1"
        fontWeight={600}
      >
        {props.label || 'Enter a number:'} &nbsp;
      </Typography>
      <Input
        id="dsInput"
        className={styles.number}
        size="small"
        value={number}
        onChange={handleInput}
      />
      <Box display="flex">
        {!props.hidePlayIcon && (
          <Button
            size="small"
            variant="outlined"
            onClick={handlePlay}
            disabled={status === 0}
            aria-live="polite"
            title="Pause/Play"
            sx={{ minWidth: 40, mr: 1, px: 0 }}
          >
            {status === 1 ? <Pause /> : <PlayArrow />}
          </Button>
        )}
        {props.buttons.map((btn, i) => (
          <Button
            key={i}
            size="small"
            variant="outlined"
            onClick={() => {
              btn.validate ? handlePlay(btn) : btn.onClick();
            }}
            disabled={status === 0 ? btn.disabled : true}
            aria-label={btn.text}
            title={btn.title}
            sx={{ mr: 1, minWidth: 40 }}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
});

export default DSInput;
