import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useInfiniteObserver } from '../src/useInfiniteObserver';
import { intersect, getObserverOf } from './test-utils';

const HookComponent = ({ onIntersection }: { onIntersection: () => void }) => {
  const [setLastElement] = useInfiniteObserver({ onIntersection });
  return (
    <div data-testid="wrapper" ref={setLastElement}>
      test
    </div>
  );
};

test('creates an observer', () => {
  const onIntersection = vi.fn();
  const { getByTestId } = render(
    <HookComponent onIntersection={onIntersection} />
  );
  const wrapper = getByTestId('wrapper');
  const instance = getObserverOf(wrapper);

  expect(instance.observe).toHaveBeenCalledWith(wrapper);
});

test('does not call the callback without intersection', () => {
  const onIntersection = vi.fn();
  const { getByTestId } = render(
    <HookComponent onIntersection={onIntersection} />
  );

  const wrapper = getByTestId('wrapper');
  intersect(wrapper, false);

  expect(onIntersection).not.toHaveBeenCalled();
});

test('calls the callback on intersection', () => {
  const onIntersection = vi.fn();
  const { getByTestId } = render(
    <HookComponent onIntersection={onIntersection} />
  );

  const wrapper = getByTestId('wrapper');
  intersect(wrapper, true);

  expect(onIntersection).toHaveBeenCalledTimes(1);
});

test('calls the callback only once if ref element not changed', () => {
  const onIntersection = vi.fn();
  const { getByTestId } = render(
    <HookComponent onIntersection={onIntersection} />
  );

  const wrapper = getByTestId('wrapper');
  intersect(wrapper, true);
  intersect(wrapper, false);
  intersect(wrapper, true);

  expect(onIntersection).toHaveBeenCalledTimes(1);
});

test('unmounts the hook', () => {
  const onIntersection = vi.fn();
  const { getByTestId, unmount } = render(
    <HookComponent onIntersection={onIntersection} />
  );
  const wrapper = getByTestId('wrapper');
  const instance = getObserverOf(wrapper);
  unmount();
  expect(instance.unobserve).toHaveBeenCalledTimes(1);
});
