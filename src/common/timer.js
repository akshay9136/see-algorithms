var timer, func;
var start, delay;
var status = 0;

var Timer = {
    timeout(fn, d, ...args) {
        delay = d;
        func = () => {
            status = 0;
            fn(...args);
        };
        status = 1;
        start = Date.now();
        timer = setTimeout(func, d);
    },

    pause() {
        if (status === 1) {
            delay = start + delay - Date.now();
            status = -1;
            clearTimeout(timer);
        }
    },

    resume() {
        if (status === -1) {
            start = Date.now();
            status = 1;
            timer = setTimeout(func, delay);
        }
    },

    clear() {
        status = 0;
        clearTimeout(timer);
    },
};

export default Timer;

export const wait = (ms) =>
    new Promise((resolve) => {
        timer = setTimeout(resolve, ms);
    });
