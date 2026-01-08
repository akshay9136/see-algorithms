import { logError, sleep } from './utils';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function newIterator(generator, ...args) {
  let iterator = generator(...args);
  let running = false;
  let steps = [];
  let onEnd;

  function loop() {
    if (!running) return;

    iterator.next()
      .then(({ value, done }) => {
        if (done) {
          running = false;
          onEnd();
        } else if (running) {
          if (typeof value === 'number') {
            sleep(value).then(loop);
          } else {
            steps.push(clone(value));
            loop();
          }
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

    back(handler) {
      if (steps.length) {
        iterator = handler(steps.pop());
        iterator.next();
      }
    },

    exit() {
      iterator.return();
      running = false;
    },
  };
}

const Iterator = {
  it: null,

  new(generator, ...args) {
    this.it = newIterator(generator, ...args);
    return this.it;
  },

  current() {
    return this.it;
  },
};

export default Iterator;
