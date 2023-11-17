import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { Dispatch, SetStateAction } from 'react';
import { vi } from 'vitest';
import { useInfiniteScroll } from '../src/useInfiniteScroll';
import { intersect, getObserverOf } from './test-utils';

const HookComponent = ({
  setPage,
}: {
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  const [setLastElement] = useInfiniteScroll(setPage);
  return (
    <div data-testid="wrapper" ref={setLastElement}>
      test
    </div>
  );
};

test('creates an observer', () => {
  const setPage = vi.fn();
  const { getByTestId } = render(<HookComponent setPage={setPage} />);
  const wrapper = getByTestId('wrapper');
  const instance = getObserverOf(wrapper);

  expect(instance.observe).toHaveBeenCalledWith(wrapper);
});

test('does not call the callback without intersection', () => {
  const setPage = vi.fn();
  const { getByTestId } = render(<HookComponent setPage={setPage} />);

  const wrapper = getByTestId('wrapper');
  intersect(wrapper, false);

  expect(setPage).not.toHaveBeenCalled();
});

test('calls the callback on intersection', () => {
  const setPage = vi.fn();
  const { getByTestId } = render(<HookComponent setPage={setPage} />);

  const wrapper = getByTestId('wrapper');
  intersect(wrapper, true);

  expect(setPage).toHaveBeenCalledTimes(1);
});

test('calls the callback twice', () => {
  const setPage = vi.fn();
  const { getByTestId } = render(<HookComponent setPage={setPage} />);

  const wrapper = getByTestId('wrapper');
  intersect(wrapper, true);
  intersect(wrapper, false);
  intersect(wrapper, true);

  expect(setPage).toHaveBeenCalledTimes(2);
});

test('unmounts the hook', () => {
  const setPage = vi.fn();
  const { getByTestId, unmount } = render(<HookComponent setPage={setPage} />);
  const wrapper = getByTestId('wrapper');
  const instance = getObserverOf(wrapper);
  unmount();
  expect(instance.unobserve).toHaveBeenCalledTimes(1);
});
