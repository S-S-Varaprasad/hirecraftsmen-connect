
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from localStorage on component mount, but only once
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        // If no theme is stored, use system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch (error) {
      console.error("Failed to get theme from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, [storageKey]);

  // Apply theme to document root
  useEffect(() => {
    if (!isInitialized) return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
    
    // Store in localStorage whenever theme changes (after initialization)
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme, isInitialized, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
