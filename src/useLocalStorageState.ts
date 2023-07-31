import { useState, useEffect } from "react";

interface ToWatchMovie {
  imdbId: string;
  imdbRating: string;
  plot: string;
  poster: string;
  runtime: string;
  title: string;
  userRating?: number;
}
function useLocalStorageState(initialValue: [], key: string) {
  const [value, setValue] = useState<ToWatchMovie[] | []>(
    () => JSON.parse(localStorage.getItem(key)) || initialValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export default useLocalStorageState;
