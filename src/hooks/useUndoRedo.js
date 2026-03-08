import { useState } from 'react';

export default function useUndoRedo() {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const push = (nodes) => {
    setUndoStack((prev) => [...prev, nodes]);
    setRedoStack([]);
  };

  const undo = (currentState) => {
    if (undoStack.length) {
      setRedoStack([...redoStack, currentState]);
      const prevState = undoStack.pop();
      setUndoStack(undoStack.slice());
      return prevState;
    }
  };

  const redo = (currentState) => {
    if (redoStack.length) {
      setUndoStack([...undoStack, currentState]);
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
