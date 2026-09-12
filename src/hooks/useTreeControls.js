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
    newTree(data);
  };

  const controls = {
    UNDO: {
      text: <Undo />,
      onClick: handleUndo,
      title: 'Undo',
      disabled: !history.canUndo,
    },

    REDO: {
      text: <Redo />,
      onClick: handleRedo,
      title: 'Redo',
      disabled: !history.canRedo,
    },

    CLEAR: {
      text: 'Clear',
      onClick: handleClear,
      disabled: !numbers.length,
    },

    SAVE: {
      text: <Save />,
      disabled: !numbers.length,
      title: 'Save this tree',
    },

    SHARE: {
      text: <Share fontSize="small" />,
      onClick: () => copyTreeUrl(collect()),
      disabled: !numbers.length,
      title: 'Share this tree',
    },

    REFRESH: {
      text: <Refresh />,
      onClick: handleRefresh,
      title: 'New tree',
    },
  };

  return { history, controls };
}
