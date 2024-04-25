"use client";
import React, { createContext, useState } from "react";

// Define the type for your theme
type Theme = "light" | "dark";

// Create a context for the theme
export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

// Create a provider component for the theme context
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  // Function to toggle the theme
  const toggleTheme = () => {
    console.log("toggle theme called @@@@");
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("prefers-color-scheme: dark").matches)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
