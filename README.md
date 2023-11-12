# React Infinite Observer

Check live [StoryBook demo](https://tasin5541.github.io/react-infinite-observer/)
![React Infinite Observer](https://raw.githubusercontent.com/Tasin5541/react-infinite-observer/main/demo/demo.gif)

## Overview

React Infinite Observer is a lightweight React hook for handling infinite scrolling in your web applications. It enables you to efficiently load and display large sets of data by triggering requests as the user scrolls down/up the page.

## Features

- **Infinite Scrolling:** Load more data automatically as the user scrolls down/up the page.
- **Easy Integration:** Simple integration into your existing React components.
- **Flexibility:** Customize the trigger point for fetching more data and loading indicator appearance.
- **Full Manual Control:** The hook provides option to autofetch data without scolling until height of list > screen height

## Getting Started

### Installation

```bash
npm install react-infinite-observer
```

or

```bash
yarn add react-infinite-observer
```

### Usage

Basic usage

```tsx
import { FC, useState, useEffect } from 'react';
import { useInfiniteScroll } from 'react-infinite-observer';

export const App: FC = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [setLastElement] = useInfiniteScroll(setPage);

  const fetchData = async () => {
    // Fetch more data and update state
    setIsLoading(true);
    // ... fetch data logic
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div id="scrollAreab">
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name.last}</li>
        ))}
        <div ref={setLastElement}></div>
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};
```

Advanced usage (keep fetching data until screen is filled)

```tsx
import { FC, useState, useEffect } from 'react';
import { useInfiniteScroll } from 'react-infinite-observer';

export const App: FC = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [setLastElement] = useInfiniteScroll(setPage);

  const fetchData = async () => {
    // Fetch more data and update state
    setIsLoading(true);
    // ... fetch data logic
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div id="scrollAreab">
      <ul>
        {items.map((item, index) =>
          index === items.length - 1 ? (
            <li key={index} ref={setLastElement}>
              {item.name.last}
            </li>
          ) : (
            <li key={index}>{item.name.last}</li>
          )
        )}
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};
```

## Props

- **setPage (required):** A setState function that will be called when the observer intersects with the trigger point and increase the page size, typically used for fetching more data.

## Example

Check out the [stackblitz snippet](https://stackblitz.com/edit/stackblitz-starters-plpsiy?file=src%2FApp.tsx) for a simple implementation.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Tasin5541/react-infinite-observer/blob/main/LICENSE) file for details.
