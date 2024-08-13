import React, { useState } from 'react';
import { showToast } from '../toast/toast';
import { Input, Button } from '@mui/material';
import styles from '../numbers/numbers.module.css';
import { randomInt } from '@/common/utils';

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
    <div className={styles.inputNumbers + ' mb-0'}>
      <span className="label">Enter a number: &nbsp;</span>
      <Input value={number} onChange={handleInput} className={styles.number} />
      <div>
        {props.buttons.map((btn, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => {
              btn.validate ? validate(btn.onClick) : btn.onClick();
            }}
            disabled={status}
            style={{ marginRight: '8px' }}
          >
            {btn.text}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default DSInput;
