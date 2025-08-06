"use client";

import { useTheme } from "@/contexts/theme-context";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
			<button
				onClick={() => setTheme("light")}
				className={`p-2 rounded-md transition-colors cursor-pointer ${
					theme === "light"
						? "bg-background text-foreground shadow-sm"
						: "text-muted-foreground hover:text-foreground"
				}`}
				aria-label="Light mode"
			>
				<MdLightMode className="w-4 h-4" />
			</button>
			<button
				onClick={() => setTheme("dark")}
				className={`p-2 rounded-md transition-colors cursor-pointer ${
					theme === "dark"
						? "bg-background text-foreground shadow-sm"
						: "text-muted-foreground hover:text-foreground"
				}`}
				aria-label="Dark mode"
			>
				<MdDarkMode className="w-4 h-4" />
			</button>
		</div>
	);
}
