import { createContext, useState, useEffect, useMemo } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to 'light'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    return savedMode || "light";
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      mode,
      toggleTheme
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};