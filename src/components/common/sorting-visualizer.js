import useAnimationSpeed from '@/hooks/useAnimationSpeed';
import InputNumbers from './input-numbers';
import SpeedControl from './speed-control';
import { Stack } from '@mui/material';

function SortingVisualizer({ handleSort, handleStop, children }) {
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
      <SpeedControl
        value={speed}
        onChange={setSpeed}
        sx={{ alignSelf: 'flex-end' }}
      />
    </>
  );
}

export default SortingVisualizer;
