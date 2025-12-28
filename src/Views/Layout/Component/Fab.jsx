import React from "react";
import { useTheme } from "../../Context/ThemeContext";

const Fab = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div className="fabContainer ">
      <button
        onClick={toggleTheme}
        className={`btn FabbtnToggleTheme border-0 ${
          isDarkMode ? "text-light" : "text-dark"
        } shadow-none    rounded-circle`}
      >
        <i
          className={isDarkMode ? "fa-solid fa-sun " : "fa-solid fa-moon  "}
        ></i>
      </button>
    </div>
  );
};

export default Fab;
