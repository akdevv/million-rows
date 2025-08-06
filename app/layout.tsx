import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/theme-context";

export const metadata: Metadata = {
	title: "Million Rows",
	description: "React project efficiently showing 1 million rows",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
						(function() {
							const theme = localStorage.getItem('theme');
							if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
								document.documentElement.classList.add('dark');
							} else {
								document.documentElement.classList.remove('dark');
							}
						})();
						`,
					}}
				/>
			</head>
			<body className="antialiased">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
