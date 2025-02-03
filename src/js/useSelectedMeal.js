import { useState, useEffect } from "react";

export function useSelectedMeal(isSelected) {
  const [meal, setMeal] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [isLoadingMeal, setIsLoadingMeal] = useState(false);
  const [mealError, setMealError] = useState("");

  useEffect(() => {
    async function getMealDetails() {
      setIsLoadingMeal(true);
      setMealError("");
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${isSelected}`
        );

        if (!res.ok) throw new Error("Failed to fetch the meal");
        const data = await res.json();
        if (!data.meals) throw new Error("Cannot load the meal");

        setMeal(data.meals[0]);
      } catch (err) {
        setMealError(err.message);
      } finally {
        setIsLoadingMeal(false);
      }
    }
    getMealDetails();
  }, [setIsLoadingMeal, setMealError, isSelected, setMeal]);

  useEffect(() => {
    setIngredients([]);

    for (let i = 1; i < 20; i++) {
      const ingredient = meal[`strIngredient${i}`];

      if (ingredient === undefined || ingredient === "") break;

      setIngredients((ings) => [...ings, ingredient]);
    }
  }, [meal, setIngredients]);

  return { meal, ingredients, isLoadingMeal, mealError };
}

export default useSelectedMeal;
