import { createContext, ReactNode, useEffect, useState } from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

type ThemeContextProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [isDark, setIsDark] = useState(false);

  function toggleTheme() {
    const newMode = !isDark;
    document.documentElement.className = newMode ? "dark" : "";
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  }

  useEffect(() => {
    if (window) {
      const storageMode = window.localStorage.getItem("theme") === "dark";
      if (storageMode) {
        setIsDark(window.localStorage.getItem("theme") === "dark");
        document.documentElement.className = storageMode ? "dark" : "";
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
