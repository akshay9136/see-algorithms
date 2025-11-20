import { sleep } from './utils';

function createTimer() {
  let target = 0;
  let remaining = 0;
  let callback = null;
  let rafId = null;
  let status = 0; // 0 idle, 1 running, -1 paused

  function now() {
    return performance.now();
  }

  function tick(t) {
    if (status !== 1) return;
    if (t >= target) {
      status = 0;
      const fn = callback;
      callback = null;
      fn && fn();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  return {
    timeout(fn, ms) {
      this.clear();
      callback = fn;
      status = 1;
      target = now() + ms;
      rafId = requestAnimationFrame(tick);
    },

    pause() {
      if (status === 1) {
        remaining = target - now();
        status = -1;
        cancelAnimationFrame(rafId);
      }
    },

    resume() {
      if (status === -1) {
        status = 1;
        target = now() + remaining;
        rafId = requestAnimationFrame(tick);
      }
    },

    clear() {
      status = 0;
      callback = null;
      cancelAnimationFrame(rafId);
    },

    sleep(ms) {
      return new Promise((resolve) => {
        this.timeout(resolve, ms);
      });
    },
  };
}

const Timer = createTimer();

export default Timer;

export function Iterator(generator, ...args) {
  let _iterator = generator(...args);
  let running = false;
  let onEnd;

  function loop() {
    if (!running) return;

    _iterator.next()
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
      _iterator.return();
    },
  };
}
