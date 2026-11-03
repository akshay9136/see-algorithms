import { act, render } from '@testing-library/react';
import { AdUnit } from '../src/components/common';
import AppContext from '../src/common/context';

const renderAd = (ad, adsReady = true) =>
  render(<AppContext.Provider value={{ adsReady }}>{ad}</AppContext.Provider>);

describe('AdUnit Component', () => {
  let width, observers, originalResize;

  beforeEach(() => {
    width = 0;
    observers = [];
    originalResize = global.ResizeObserver;
    jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => width);

    global.ResizeObserver = jest.fn().mockImplementation((callback) => {
      const observer = { callback, observe: jest.fn(), disconnect: jest.fn() };
      observers.push(observer);
      return observer;
    });
    window.adsbygoogle = { push: jest.fn() };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.ResizeObserver = originalResize;
    delete window.adsbygoogle;
  });

  test('waits for a measurable width and requests the ad only once', () => {
    renderAd(<AdUnit />);
    expect(window.adsbygoogle.push).not.toHaveBeenCalled();
    act(() => observers[0].callback());
    expect(window.adsbygoogle.push).not.toHaveBeenCalled();
    width = 300;
    act(() => observers[0].callback());
    expect(window.adsbygoogle.push).toHaveBeenCalledTimes(1);
    expect(observers[0].disconnect).toHaveBeenCalled();
    act(() => observers[0].callback());
    expect(window.adsbygoogle.push).toHaveBeenCalledTimes(1);
  });

  test('waits for the AdSense script even when the slot has width', () => {
    width = 300;
    const { container, rerender } = renderAd(<AdUnit />, false);
    expect(container.querySelector('.adsbygoogle')).toBeNull();
    expect(window.adsbygoogle.push).not.toHaveBeenCalled();
    rerender(
      <AppContext.Provider value={{ adsReady: true }}>
        <AdUnit />
      </AppContext.Provider>,
    );
    expect(window.adsbygoogle.push).toHaveBeenCalledTimes(1);
  });

  test('keeps zero-width slots out of page-wide ad requests', () => {
    const { container } = renderAd(
      <>
        <AdUnit />
        <AdUnit />
      </>,
    );
    const [hiddenAd, visibleAd] = container.querySelectorAll('ins');
    Object.defineProperty(visibleAd, 'clientWidth', { value: 300 });
    window.adsbygoogle.push.mockImplementation(() =>
      container.querySelector('.adsbygoogle'),
    );
    act(() => observers[1].callback());
    expect(window.adsbygoogle.push).toHaveBeenCalledTimes(1);
    expect(window.adsbygoogle.push).toHaveReturnedWith(visibleAd);
    expect(hiddenAd).not.toHaveClass('adsbygoogle');
  });

  test('cancels pending initialization when unmounted', () => {
    const { unmount } = renderAd(<AdUnit />);
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalled();
    width = 300;
    act(() => observers[0].callback());
    expect(window.adsbygoogle.push).not.toHaveBeenCalled();
  });

  test('skips an ad already marked with data-ad-status', () => {
    const { container } = renderAd(<AdUnit />);
    container.querySelector('ins').setAttribute('data-ad-status', 'done');
    width = 300;
    act(() => observers[0].callback());
    expect(window.adsbygoogle.push).not.toHaveBeenCalled();
  });
});
