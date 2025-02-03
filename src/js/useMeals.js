import { useState, useEffect } from "react";

export function useMeals(query, setCurrentPage) {
  const [meals, setMeals] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    async function fetchMeals() {
      setIsLoadingResults(true);
      setSearchError("");
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch the meal");
        if (!data.meals)
          throw new Error("This meal is not available. Please try again.");

        setMeals(data);
      } catch (err) {
        setSearchError(err.message);
      } finally {
        setCurrentPage(1);
        setIsLoadingResults(false);
        if (query.length === 0) {
          setSearchError("");
        }
      }
    }

    fetchMeals();
  }, [query, setCurrentPage]);

  return { meals, isLoadingResults, searchError };
}

export default useMeals;
