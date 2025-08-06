"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);
	const [theme, setTheme] = useState<Theme>(() => {
		// Initial theme is determined by the class already set by the script
		if (typeof window !== "undefined") {
			return document.documentElement.classList.contains("dark") ? "dark" : "light";
		}
		return "light";
	});

	useEffect(() => {
		setMounted(true);
		const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
		setTheme(currentTheme);
	}, []);

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	if (!mounted) {
		return <>{children}</>;
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		return {
			theme: "light" as Theme,
			setTheme: () => {},
		};
	}
	return context;
}