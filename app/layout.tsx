import "./globals.css";
import type { Metadata } from "next";

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
		<html lang="en">
			<body className="antialiased dark">{children}</body>
		</html>
	);
}
