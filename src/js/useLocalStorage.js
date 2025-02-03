import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [bookmarks, setBookmarks] = useState(function () {
    const storedBookmark = localStorage.getItem(key);

    return storedBookmark ? JSON.parse(storedBookmark) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(bookmarks));
    },
    [bookmarks, key]
  );

  return [bookmarks, setBookmarks];
}

export default useLocalStorage;
