// useInfiniteScroll.stories.tsx

import React, { useState, useEffect } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useInfiniteScroll } from '../useInfiniteScroll';

// Define your component's story meta information
export default {
  title: 'Hooks/useInfiniteScroll',
  component: useInfiniteScroll,
} as Meta;

type itemType = {
  id: {
    name: string;
    value: string;
  };
  login: {
    uuid: string;
  };
  name: {
    last: string;
  };
};

// Define a template for the story
const Template: StoryFn = () => {
  const [items, setItems] = useState<itemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);

  // Use the hook in your component
  const [setLastElement] = useInfiniteScroll(setPage);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://randomuser.me/api/?page=${page}&results=5&seed=abc`
      );
      const data = await response.json();

      if (page > 1) {
        setItems((prevItems) => [...prevItems, ...data.results]);
      } else {
        setItems(data.results);
      }
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div>
      <ul>
        {items.map((item, index) =>
          index === items.length - 1 ? (
            <li
              key={`${item.id.name}-${item.id.value}-${item.login.uuid}`}
              ref={setLastElement}
            >
              {item.name.last}
            </li>
          ) : (
            <li key={`${item.id.name}-${item.id.value}-${item.login.uuid}`}>
              {item.name.last}
            </li>
          )
        )}
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

// Attach the template to the story
export const BasicUsage = Template.bind({});
