// Register jest-dom matchers
require('@testing-library/jest-dom');

Array.prototype.swap = function (u, v) {
  let num = this[u];
  this[u] = this[v];
  this[v] = num;
};

Element.prototype.getBoundingClientRect = jest.fn(() => {
  return { width: 700, height: 500 };
});

SVGElement.prototype.getTotalLength = jest.fn(() => 100);

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/common/utils', () => ({
  ...jest.requireActual('@/common/utils'),
  sleep: () => Promise.resolve(),
  cursorOffset: (e) => {
    return { x: e.clientX, y: e.clientY };
  },
  throttle: (fn) => fn,
}));

// Mock useAnimator to provide immediate, synchronous animator helpers
jest.mock('@/hooks/useAnimator', () => require('./mocks/useAnimator'));

// Mock the Iterator to run synchronously in tests (no real delay)
jest.mock('@/common/iterator', () => require('./mocks/iterator'));
