import { sleep } from './utils';

function newIterator(generator, ...args) {
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
      .catch(() => {
        console.log('Iterator error');
        running = false;
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
