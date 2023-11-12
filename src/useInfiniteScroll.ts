import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';

const useInfiniteScroll = (setPage: Dispatch<SetStateAction<number>>) => {
  const [lastElement, setLastElement] = useState<HTMLElement | null>(null);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPage((no) => no + 1);
        }
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    const currentElement = lastElement;
    const currentobserver = observer.current;

    if (currentElement) {
      currentobserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentobserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  return [setLastElement];
};

export default useInfiniteScroll;
