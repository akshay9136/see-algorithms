import useAnimationSpeed from '@/hooks/useAnimationSpeed';
import InputNumbers from './input-numbers';
import SpeedControl from './speed-control';
import { Box, Stack } from '@mui/material';

function SortingVisualizer({ handleSort, handleStop, children, colorLegend }) {
  const { speed, setSpeed, scaleDelay } = useAnimationSpeed();

  return (
    <>
      <Stack spacing={2} className="sortingVis">
        <InputNumbers
          onStart={handleSort}
          onReset={handleStop}
          scaleDelay={scaleDelay}
        />
        <br />
        {children}
      </Stack>
      <Box display="flex" mt="20px !important">
        {colorLegend}
        <SpeedControl value={speed} onChange={setSpeed} sx={{ ml: 'auto' }} />
      </Box>
    </>
  );
}

export default SortingVisualizer;
