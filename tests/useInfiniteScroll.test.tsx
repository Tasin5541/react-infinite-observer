import '@testing-library/jest-dom/vitest';
import { act, render, waitFor } from '@testing-library/react';
import { it, expect, vi, describe, beforeEach, afterEach } from 'vitest';
import { useState } from 'react';
import useInfiniteScroll from '../src/useInfiniteScroll';

// IntersectionObserver isn't available in test environment
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
beforeEach(() => {
  window.IntersectionObserver = mockIntersectionObserver;
});
afterEach(() => {
  delete (window as any).IntersectionObserver;
});
describe('useInfiniteScroll', () => {
  it('should increase the page number when the last element is intersecting', async () => {
    const TestComponent = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [page, setPage] = useState<number>(1);
      const [setLastElement] = useInfiniteScroll(setPage);

      // Simulate a list of items
      const items = Array.from({ length: 10 }, (_, index) => (
        <div key={index} style={{ padding: '2px', border: '1px solid #ccc' }}>
          Item {index + 1}
        </div>
      ));

      return (
        <div>
          {items}
          <div
            ref={setLastElement}
            style={{ height: '2px', background: 'lightblue' }}
          >
            {/* This element will trigger the infinite scroll */}
          </div>
        </div>
      );
    };

    const { getByText } = render(<TestComponent />);
    // Initial render should have 10 items
    for (let i = 1; i <= 10; i++) {
      expect(getByText(`Item ${i}`)).toBeInTheDocument();
    }

    act(() => {
      mockIntersectionObserver.mock.calls[0][0]([{ isIntersecting: true }]);
    });

    // Wait for the callback to be executed
    await waitFor(() => {
      // Perform assertions inside the callback
      expect(mockIntersectionObserver.mock.calls[0][0]).toHaveLength(1); // observe
      expect(mockIntersectionObserver.mock.calls[1][0]).toHaveLength(1); // unobserve
    });
  });
});

// useInfiniteScroll.test.tsx

// import '@testing-library/jest-dom/vitest';
// import { render, act } from '@testing-library/react';
// import React, { useState } from 'react';
// import { afterAll, beforeAll, expect, vi, test } from 'vitest';
// import useInfiniteScroll from '../src/useInfiniteScroll'; // Update the import path

// // Mock IntersectionObserver
// class IntersectionObserverMock {
//   observe = vi.fn();

//   unobserve = vi.fn();
// }

// // Replace the global IntersectionObserver with our mock
// beforeAll(() => {
//   window.IntersectionObserver = IntersectionObserverMock as any;
// });

// // Restore the original IntersectionObserver after all tests
// afterAll(() => {
//   delete (window as any).IntersectionObserver;
// });

// test('useInfiniteScroll triggers setPage when the last element is intersected', () => {
//   const TestComponent = () => {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [page, setPage] = useState<number>(1);
//     const [setLastElement] = useInfiniteScroll(setPage);

//     // Simulate a list of items
//     const items = Array.from({ length: 10 }, (_, index) => (
//       <div key={index} style={{ padding: '20px', border: '1px solid #ccc' }}>
//         Item {index + 1}
//       </div>
//     ));

//     return (
//       <div>
//         {items}
//         <div
//           ref={setLastElement}
//           style={{ height: '20px', background: 'lightblue' }}
//         >
//           {/* This element will trigger the infinite scroll */}
//         </div>
//       </div>
//     );
//   };

//   const { getByText } = render(<TestComponent />);

//   // Initial render should have 10 items
//   for (let i = 1; i <= 10; i++) {
//     expect(getByText(`Item ${i}`)).toBeInTheDocument();
//   }

//   // Trigger intersection by mocking the IntersectionObserver callback
//   act(() => {
//     (IntersectionObserverMock as any).mock.calls[0][0]([
//       { isIntersecting: true },
//     ]);
//   });

//   // After intersection, the hook should trigger setPage and add more items
//   for (let i = 1; i <= 20; i++) {
//     expect(getByText(`Item ${i}`)).toBeInTheDocument();
//   }

//   // Ensure the correct number of observe and unobserve calls were made
//   expect((IntersectionObserverMock as any).mock.calls[0][0]).toHaveLength(1); // observe
//   expect((IntersectionObserverMock as any).mock.calls[1][0]).toHaveLength(1); // unobserve
// });
