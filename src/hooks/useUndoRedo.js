import { useState } from 'react';

export default function useUndoRedo() {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const push = (current) => {
    setUndoStack((prev) => [...prev, current]);
    setRedoStack([]);
  };

  const undo = (current) => {
    if (undoStack.length) {
      setRedoStack((prev) => [...prev, current]);
      const prevState = undoStack.pop();
      setUndoStack(undoStack.slice());
      return prevState;
    }
  };

  const redo = (current) => {
    if (redoStack.length) {
      setUndoStack((prev) => [...prev, current]);
      const nextState = redoStack.pop();
      setRedoStack(redoStack.slice());
      return nextState;
    }
  };

  const clear = () => {
    setUndoStack([]);
    setRedoStack([]);
  };

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return { push, undo, redo, clear, canUndo, canRedo };
}
