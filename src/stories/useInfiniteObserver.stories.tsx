// useInfiniteScroll.stories.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useInfiniteObserver } from '../useInfiniteObserver';

// Define your component's story meta information
export default {
  title: 'Hooks/useInfiniteObserver',
  component: useInfiniteObserver,
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

const ItemComponent = ({
  items,
  setRefElement,
  isAdvanced = false,
}: {
  isAdvanced: boolean;
  items: itemType[];
  setRefElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}) => (
  <>
    {isAdvanced
      ? items.map((item, index) => (
          <li
            key={`${item.id.name}-${item.id.value}-${item.login.uuid}`}
            ref={index === items.length - 1 ? setRefElement : undefined}
          >
            {item.name.last}
          </li>
        ))
      : items.map((item) => (
          <li key={`${item.id.name}-${item.id.value}-${item.login.uuid}`}>
            {item.name.last}
          </li>
        ))}
    <div ref={setRefElement} />
  </>
);

const Template = ({ isAdvanced = false }: { isAdvanced: boolean }) => {
  const [items, setItems] = useState<itemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);

  const onIntersection = useCallback(() => {
    setPage((pageNo) => pageNo + 1);
  }, []);

  // Use the hook in your component
  const [setRefElement] = useInfiniteObserver({ onIntersection });

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
      <p>
        {isAdvanced
          ? 'With Dynamic Ref, if the initial fetched list does not fill the screen, the list is fetched multiple times untill screen is filled'
          : 'With Static Ref, if the initial fetched list does not fill the screen, the list is fetched again only once. If even that does not fill thes creen, infinite scrolling stops working'}
      </p>
      <p>Fetch Count: {page}</p>
      <ul>
        <ItemComponent
          items={items}
          setRefElement={setRefElement}
          isAdvanced={isAdvanced}
        />
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

// Define templates for the story
const BasicStory: StoryFn = () => <Template isAdvanced={false} />;

const AdvancedStory: StoryFn = () => <Template isAdvanced />;

// Attach the template to the story
export const DynamicRefElement = AdvancedStory.bind({});
export const StaticRefElement = BasicStory.bind({});
