import { beforeEach, afterEach, vi } from 'vitest';

const observerMap = new Map();
const instanceMap = new Map();

beforeEach(() => {
  // @ts-ignore
  global.IntersectionObserver = vi.fn((cb, options = {}) => {
    const instance = {
      thresholds: Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: vi.fn((element: Element) => {
        instanceMap.set(element, instance);
        observerMap.set(element, cb);
      }),
      unobserve: vi.fn((element: Element) => {
        instanceMap.delete(element);
        observerMap.delete(element);
      }),
      disconnect: vi.fn(),
    };
    return instance;
  });
});

afterEach(() => {
  // @ts-ignore
  global.IntersectionObserver.mockReset();
  instanceMap.clear();
  observerMap.clear();
});

export function intersect(element: Element, isIntersecting: boolean) {
  const cb = observerMap.get(element);
  if (cb) {
    cb([
      {
        isIntersecting,
        target: element,
        intersectionRatio: isIntersecting ? 1 : -1,
      },
    ]);
  }
}

export const getObserverOf = (element: Element): IntersectionObserver =>
  instanceMap.get(element);
