import { forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import { Pause, PlayArrow } from '@mui/icons-material';
import useDsPlayback from '@/hooks/useDsPlayback';

const DSInput = forwardRef((props, ref) => {
  const { number, status, setStatus, handleChange, handlePlay, handleAction } =
    useDsPlayback(props);

  useImperativeHandle(ref, () => ({ value: number, setStatus }));
  const isBusy = status !== 0;

  return (
    <Box className="inputRow" gap={1}>
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
        disabled={isBusy}
      />

      {!props.hidePlayIcon && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handlePlay()}
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
          onClick={() => handleAction(btn)}
          color={btn.color || 'primary'}
          disabled={isBusy || btn.disabled}
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

DSInput.displayName = 'DSInput';

export default DSInput;
