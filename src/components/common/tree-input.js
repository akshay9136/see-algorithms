import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Button,
  Input,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Pause, PlayArrow } from '@mui/icons-material';
import useDsPlayback from '@/hooks/useDsPlayback';

const TreeInput = forwardRef((props, ref) => {
  const { number, status, setStatus, handleChange, handlePlay, handleAction } =
    useDsPlayback(props);
  const [operation, setOperation] = useState('Insert');
  const toggles = props.buttons.filter((btn) => btn.validate);
  const actions = props.buttons.filter((btn) => !btn.validate);
  const selected = toggles.find((btn) => btn.text === operation) || toggles[0];
  const isBusy = status !== 0;
  const playLabel = status === 1 ? 'Pause' : 'Play';

  useImperativeHandle(ref, () => ({ value: number, setStatus }));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isBusy) {
      e.preventDefault();
      handlePlay(selected);
    }
  };

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
        onKeyDown={handleKeyDown}
        disabled={isBusy}
      />

      <ToggleButtonGroup
        exclusive
        size="small"
        value={selected?.text || null}
        onChange={(_, value) => {
          if (value !== null) setOperation(value);
        }}
        disabled={isBusy}
        aria-label="Tree operation"
      >
        {toggles.map((button) => (
          <ToggleButton
            key={button.text}
            value={button.text}
            disabled={isBusy || button.disabled}
            sx={{ px: 1.5, py: 0.5, fontWeight: 600 }}
          >
            {button.text}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {!props.hidePlayIcon && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handlePlay(selected)}
          disabled={selected.disabled}
          aria-label={playLabel}
          aria-live="polite"
          title={playLabel}
          sx={{ minWidth: 40, px: 0 }}
        >
          {status === 1 ? <Pause /> : <PlayArrow />}
        </Button>
      )}

      {actions.map((btn) => (
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

TreeInput.displayName = 'TreeInput';

export default TreeInput;
