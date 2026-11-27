import { Box, Typography } from '@mui/material';

function ColorLegend({ items = [], label = 'Color legend', ...props }) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      role="group"
      aria-label={label}
      {...props}
    >
      {items.map(([label, color]) => (
        <Typography
          key={label}
          component="span"
          variant="body2"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 12,
              height: 12,
              bgcolor: color,
              border: 1,
              borderColor: 'divider',
              borderRadius: 0.5,
            }}
          />
          {label}
        </Typography>
      ))}
    </Box>
  );
}

export default ColorLegend;
