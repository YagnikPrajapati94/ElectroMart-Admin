import React, { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../Themes/Theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = isDarkMode ? darkTheme : lightTheme;
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
