import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ERPThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("erp-theme") === "dark"
  );

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("erp-theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useERPTheme() {
  return useContext(ThemeContext);
}
