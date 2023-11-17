import { useEffect, useState, useRef } from 'react';

type infiniteObserverOptions = {
  onIntersection: () => void;
  threshold?: number;
};

export const useInfiniteObserver = ({
  onIntersection,
  threshold = 1,
}: infiniteObserverOptions) => {
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);
  const visited = useRef(false);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !visited.current) {
          onIntersection();
          visited.current = true;
        }
      },
      { threshold }
    )
  );

  useEffect(() => {
    const currentobserver = observer.current;

    if (refElement) {
      visited.current = false;
      currentobserver.observe(refElement);
    }

    return () => {
      if (refElement) {
        currentobserver.unobserve(refElement);
      }
    };
  }, [refElement]);

  return [setRefElement];
};
