function newIterator(generator, ...args) {
  let iterator = generator(...args);
  let running = false;
  let onEnd;

  function loop() {
    if (!running) return;
    iterator.next().then(({ done }) => {
        if (done) {
          running = false;
          onEnd();
        } else if (running) {
          Promise.resolve().then(loop);
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

module.exports = {
  __esModule: true,
  default: {
    it: null,
    new(generator, ...args) {
      this.it = newIterator(generator, ...args);
      return this.it;
    },
    current() {
      return this.it;
    },
  },
};
