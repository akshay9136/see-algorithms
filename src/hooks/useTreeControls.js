import { Redo, Refresh, Save, Share, Undo } from '@mui/icons-material';
import { copyTreeUrl, sleep } from '@/common/utils';
import useUndoRedo from './useUndoRedo';

/**
 * Shared undo/redo/clear/refresh logic for tree-based data structure hooks.
 */
export default function useTreeControls({
  numbers,
  setNumbers,
  newTree,
  collect,
  onClear,
}) {
  const history = useUndoRedo();

  const handleUndo = async () => {
    if (history.canUndo) {
      setNumbers([]);
      await sleep(100);
      newTree(history.undo(collect()));
    }
  };

  const handleRedo = async () => {
    if (history.canRedo) {
      setNumbers([]);
      await sleep(100);
      newTree(history.redo(collect()));
    }
  };

  const handleClear = () => {
    setNumbers([]);
    history.clear();
    onClear?.();
  };

  const handleRefresh = async (data) => {
    handleClear();
    await sleep(100);
    await newTree(data);
  };

  const controls = {
    UNDO: {
      icon: <Undo />,
      onClick: handleUndo,
      label: 'Undo',
      disabled: !history.canUndo,
    },

    REDO: {
      icon: <Redo />,
      onClick: handleRedo,
      label: 'Redo',
      disabled: !history.canRedo,
    },

    CLEAR: {
      text: 'Clear',
      onClick: handleClear,
      disabled: !numbers.length,
      color: 'secondary',
    },

    SAVE: {
      icon: <Save />,
      disabled: !numbers.length,
      label: 'Save this tree',
    },

    SHARE: {
      icon: <Share fontSize="small" sx={{ height: 24 }} />,
      onClick: () => copyTreeUrl(collect()),
      disabled: !numbers.length,
      label: 'Share this tree',
    },

    REFRESH: {
      icon: <Refresh />,
      onClick: handleRefresh,
      label: 'New tree',
    },
  };

  return { history, controls };
}
