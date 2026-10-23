import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 },
];

/**
 * Segmented speed-selector with options: 0.5x, 1x (default), 2x, 4x.
 * Drop this into any visualization toolbar.
 */
export default function SpeedControl({ value, onChange, sx }) {
  return (
    <Box
      sx={sx}
      display="inline-flex"
      alignItems="center"
      gap={1}
      width="fit-content"
    >
      <Typography
        id="speed-control-label"
        variant="body2"
        color="text.secondary"
        fontWeight={600}
      >
        Control speed:
      </Typography>

      <ToggleButtonGroup
        value={value}
        onChange={(_event, nextSpeed) => {
          if (nextSpeed !== null) onChange(nextSpeed);
        }}
        exclusive
        aria-labelledby="speed-control-label"
        sx={{
          '& .MuiToggleButton-root': {
            px: 1.5,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            lineHeight: 1,
          },
        }}
      >
        {SPEED_OPTIONS.map(({ label, value }) => (
          <ToggleButton
            key={value}
            value={value}
            aria-label={`${label} animation speed`}
          >
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
