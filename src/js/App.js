import { useState } from "react";

import useMeals from "./useMeals";
import useSelectedMeal from "./useSelectedMeal";
import useLocalStorage from "./useLocalStorage";
// Immagini

import logo from "../img/foodify-logo.png";
import bookmarkIcon from "../img/bookmark-icon.svg";
import searchIcon from "../img/search-icon.svg";
import loadingIcon from "../img/loading-icon.svg";
import errorIcon from "../img/error-message-icon.svg";
import playIcon from "../img/player-video.svg";
import ingredientsTitleIcon from "../img/ingredients-title-icon.svg";
import instructionsIcon from "../img/intructions-icon.svg";
import checkmarkIcon from "../img/checkmark-icon.svg";
import arrowLeft from "../img/arrow-left.svg";
import arrowRight from "../img/arrow-right.svg";
import defaultMsgImage from "../img/default-message__view.svg";

function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { meals, isLoadingResults, searchError } = useMeals(
    query,
    setCurrentPage
  );
  const [isSelected, setIsSelected] = useState(null);

  const { meal, ingredients, isLoadingMeal, mealError } =
    useSelectedMeal(isSelected);

  const [bookmarks, setBookmarks] = useLocalStorage([]);
  const totalPages = Math.ceil(meals.meals?.length / 5);

  function handleSelectMeal(id) {
    setIsSelected(id);
  }

  function handleBookmarks(meal) {
    if (bookmarks.some((i) => i.idMeal === meal.idMeal)) {
      setBookmarks((l) => l.filter((i) => i.idMeal !== meal.idMeal));
      return;
    }

    setBookmarks([...bookmarks, meal]);
  }

  return (
    <div className="app">
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Bookmarks bookmarks={bookmarks} onSetIsSelected={setIsSelected} />
      </Navbar>
      <ExploreMeals>
        <SearchResults
          meals={meals}
          isLoadingResults={isLoadingResults}
          error={searchError}
          onSetIsSelected={handleSelectMeal}
          currentPage={currentPage}
        />
        <Pagination
          meals={meals}
          isLoadingResults={isLoadingResults}
          error={searchError}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
        <Copyright />
      </ExploreMeals>
      <MealView isSelected={isSelected}>
        {isSelected ? (
          <SelectedMeal isLoadingMeal={isLoadingMeal}>
            {isLoadingMeal && <Loader />}
            {!isLoadingMeal &&
              (mealError ? (
                ""
              ) : (
                <>
                  <MealHeader
                    meal={meal}
                    bookmarks={bookmarks}
                    onSetBookmarks={handleBookmarks}
                  />
                  <MealIngredients ingredients={ingredients} />
                  <MealInstructions meal={meal} />
                </>
              ))}
            {mealError && <ErrorMessage message={mealError} />}
          </SelectedMeal>
        ) : (
          <img
            src={defaultMsgImage}
            className="default-message-view"
            alt="Default message"
          ></img>
        )}
      </MealView>
    </div>
  );
}

// Navigazione

function Navbar({ children }) {
  return <div className="nav">{children}</div>;
}

function Logo() {
  return <img src={logo} className="logo" alt="" />;
}

function Search({ query, setQuery }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search a meal (es. cake, soup)"
        className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-btn">
        <div className="search-btn-text">
          <img src={searchIcon} className="search-icon" alt="" />
          SEARCH
        </div>
      </button>
    </div>
  );
}

function Bookmarks({ bookmarks, onSetIsSelected }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="bookmarks"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <img className="bookmark-icon" src={bookmarkIcon} alt="" />
      <span>BOOKMARKS</span>
      {isVisible && (
        <div className="bookmarks-view">
          {bookmarks.length < 1 ? (
            <>
              <div className="bookmarks-view-empty">
                <img
                  className="error-message-icon"
                  src={errorIcon}
                  alt="error"
                ></img>
                No bookmarks yet :)
              </div>
            </>
          ) : (
            bookmarks?.map((meal) => {
              return (
                <>
                  <MealItem
                    meal={meal}
                    key={meal.idMeal}
                    onSetIsSelected={onSetIsSelected}
                  />
                </>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// Risultati di ricerca

function ExploreMeals({ children }) {
  return (
    <div className="meal-results">
      <>{children}</>
    </div>
  );
}

function SearchResults({
  meals,
  isLoadingResults,
  error,
  onSetIsSelected,
  currentPage,
}) {
  return (
    <div className="results-view">
      {isLoadingResults && <Loader />}
      {!isLoadingResults &&
        !error &&
        meals.meals
          ?.map((meal) => {
            return (
              <MealItem
                meal={meal}
                key={meal.idMeal}
                onSetIsSelected={onSetIsSelected}
              />
            );
          })
          .slice((currentPage - 1) * 5, currentPage * 5)}

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function Pagination({
  meals,
  isLoadingResults,
  error,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <div className="change-page">
      {!isLoadingResults && !error && meals && (
        <>
          {currentPage === 1 && totalPages > 1 && (
            <div
              className="btn-page page-right"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <span>Page</span>
              {currentPage + 1}
              <img src={arrowRight} alt=""></img>
            </div>
          )}
          {currentPage > 1 && currentPage < totalPages && (
            <>
              <div
                className="btn-page page-right"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <span>Page</span> {currentPage + 1}
                <img src={arrowRight} alt="" />
              </div>
              <div
                className="btn-page page-left"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <img src={arrowLeft} alt="" />
                <span>Page</span> {currentPage - 1}
              </div>
            </>
          )}
          {currentPage === totalPages && totalPages > 1 && (
            <div
              className="btn-page page-left"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <img src={arrowLeft} alt="" />
              <span>Page</span> {currentPage - 1}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Copyright() {
  return <div className="results-footer">Copyright @ 2024 Edoardo Busti</div>;
}

function MealItem({ meal, onSetIsSelected }) {
  return (
    <div className="meal-item" onClick={() => onSetIsSelected(meal.idMeal)}>
      <div className="meal-item-logo">
        <img src={meal.strMealThumb} alt=""></img>
      </div>

      <div className="meal-item-info">
        <div className="meal-item-header">{meal.strMeal}</div>
      </div>
    </div>
  );
}
// Visualizzazione ricetta e dettagli

function MealView({ children }) {
  return <div className="meal-view">{children}</div>;
}

function SelectedMeal({ children }) {
  return <>{children}</>;
}

function MealHeader({ meal, bookmarks, onSetBookmarks }) {
  const bgImage = {
    backgroundImage: `url("${meal.strMealThumb}")`,
  };
  return (
    <div className="meal-view-image" style={bgImage}>
      <div className="meal-view-title">{meal.strMeal}</div>
      <div className="bookmark-meal" onClick={() => onSetBookmarks(meal)}>
        <svg
          className={
            bookmarks.some((i) => i.idMeal === meal.idMeal)
              ? "bookmark-meal-icon active"
              : "bookmark-meal-icon"
          }
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z"
            stroke="#fff"
            strokeWidth="2"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>
    </div>
  );
}

function MealIngredients({ ingredients }) {
  return (
    <div className="meal-view-ingredients">
      <div className="ingredients-title">
        <img src={ingredientsTitleIcon} alt=""></img>
        INGREDIENTS
      </div>

      <ul className="ingredients-list">
        {ingredients.map((ing) => (
          <SingleIngredient ingredient={ing} />
        ))}
      </ul>
    </div>
  );
}

function SingleIngredient({ ingredient }) {
  return (
    <li className="ingredient-item">
      <img src={checkmarkIcon} alt=""></img> {ingredient}
    </li>
  );
}

function MealInstructions({ meal }) {
  return (
    <div className="meal-view-description">
      <div className="intructions-title">
        <img src={instructionsIcon} alt=""></img> INSTRUCTIONS
      </div>
      <div className="instruction-item">{meal.strInstructions}</div>
      <a
        href={meal.strYoutube}
        className="tutorial-btn"
        rel="noopener noreferrer"
      >
        <img src={playIcon} alt=""></img> WATCH THE TUTORIAL
      </a>
    </div>
  );
}
// Caricamento / errore

function Loader() {
  return (
    <div className="spinner">
      <img src={loadingIcon} alt="" />
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <img className="error-message-icon" src={errorIcon} alt=""></img>
      {message}
    </div>
  );
}

export default App;
