import useAnimationSpeed from '@/hooks/useAnimationSpeed';
import InputNumbers from './input-numbers';
import SpeedControl from './speed-control';

function SortingVisualizer({ handleSort, handleStop, children }) {
  const { speed, setSpeed, scaleDelay } = useAnimationSpeed();

  return (
    <>
      <InputNumbers
        onStart={handleSort}
        onReset={handleStop}
        scaleDelay={scaleDelay}
      />
      <br />
      {children}
      <SpeedControl
        value={speed}
        onChange={setSpeed}
        sx={{ alignSelf: 'flex-end' }}
      />
    </>
  );
}

export default SortingVisualizer;
