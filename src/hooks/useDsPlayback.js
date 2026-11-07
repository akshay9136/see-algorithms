import { useState, useEffect, useRef } from 'react';
import { randomInt, showError } from '@/common/utils';
import { newIterator } from '@/common/iterator';
import {
  analyticsContext,
  trackEvent,
  trackVisualization,
} from '@/common/analytics';

const OPERATIONS = {
  insert: 'insert',
  'at head': 'insert',
  'at tail': 'insert',
  delete: 'delete',
  search: 'search',
  extract: 'extract',
  enqueue: 'enqueue',
  dequeue: 'dequeue',
};

function getOperation(btn) {
  const buttonKey = (btn.text || btn.label)?.trim().toLowerCase();
  return OPERATIONS[buttonKey];
}

/**
 * Shared number handling and playback for both ds-input and tree-input components.
 */
export default function useDsPlayback(props) {
  const [number, setNumber] = useState(props.value ?? randomInt());
  const [status, setStatus] = useState(0);
  const runRef = useRef(null);
  const itref = useRef([]); // iterators ref

  useEffect(() => {
    return () => {
      runRef.current?.cancel();
      runRef.current = null;
      itref.current.forEach((it) => it.exit());
      itref.current = [];
    };
  }, []);

  const matchingButtons = (btn) => {
    const allButtons = props.allButtons || props.buttons;
    return allButtons.filter((b) =>
      btn.icon ? b.label === btn.label : b.text === btn.text,
    );
  };

  const validate = (button) => {
    if (typeof number !== 'number') {
      trackEvent('validation_failed', {
        operation: getOperation(button),
        reason: 'invalid_number',
      });
      showError('Please enter a number.');
      return false;
    }
    return true;
  };

  const restart = (buttons) => {
    runRef.current?.cancel();
    const context = analyticsContext();
    const run = trackVisualization(buttons.length);
    runRef.current = run;
    return buttons.map((btn) =>
      run.wrap(async function* (value) {
        const action = btn.onClick(value);
        const result = action?.next ? yield* action : await action;
        if (runRef.current === run && result === false) {
          const operation = getOperation(btn);
          trackEvent('validation_failed', { operation }, context);
          run.cancel();
        }
        return result;
      }),
    );
  };

  const handlePlay = (btn) => {
    switch (status) {
      case 0:
        if (btn.animate || validate(btn)) {
          itref.current = restart(matchingButtons(btn)).map((action) =>
            newIterator(action, props.scaleDelay, number),
          );
          resume();
        }
        break;
      case 1:
        runRef.current?.control('pause');
        itref.current.forEach((it) => it.stop());
        setStatus(-1);
        break;
      default:
        runRef.current?.control('resume');
        resume();
    }
  };

  const resume = async () => {
    setStatus(1);
    const run = runRef.current;
    await Promise.all(itref.current.map((it) => it.start()));
    if (runRef.current !== run) return;
    if (isNaN(props.value)) setNumber(randomInt());
    setStatus(0);
  };

  const handleAction = (btn) => {
    if (btn.validate || btn.animate) handlePlay(btn);
    else matchingButtons(btn).forEach((action) => action.onClick());
  };

  const handleChange = (e) => {
    const value = e.target.value.trim().slice(0, 3);
    if (!isNaN(value)) setNumber(value.length ? parseInt(value) : '');
  };

  return { number, status, setStatus, handleChange, handlePlay, handleAction };
}
