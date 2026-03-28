import { logError, sleep } from './utils';

export function newIterator(generator, ...args) {
  let iterator = generator(...args);
  let running = false;
  let onEnd;

  function loop() {
    if (!running) return;

    iterator.next()
      .then(({ value, done }) => {
        if (done) {
          running = false;
          onEnd();
        } else if (running) {
          sleep(value).then(loop);
        }
      })
      .catch((err) => {
        running = false;
        logError({
          title: 'Iterator error',
          message: err.message,
          page: window.location.pathname,
        });
      });
  }

  return {
    start() {
      running = true;
      loop();
      return new Promise((resolve) => {
        onEnd = resolve;
      });
    },

    stop() {
      running = false;
    },

    next() {
      return iterator.next();
    },

    exit() {
      iterator.return();
      running = false;
    },
  };
}
