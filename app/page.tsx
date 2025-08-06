import { use } from "react";
import { DatasetMetadata } from "@/lib/types/datasets";
import PageContent from "@/components/page-content";
import ThemeToggle from "@/components/theme-toggle";

const fetchDatasets = async () => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`,
			{
				next: { revalidate: 24 * 60 * 60 }, // 24 hours
			}
		);

		if (!res.ok) {
			throw new Error("Failed to fetch datasets");
		}

		const data = await res.json();
		return data.data || [];
	} catch (error) {
		console.error("Error fetching datasets", error);
		throw new Error("Failed to fetch datasets");
	}
};

export default function Home() {
	const datasetsMetadata: DatasetMetadata[] = use(fetchDatasets());

	return (
		<div className="min-h-screen">
			<header className="border-b">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Million Rows</h1>
							<p className="mt-2 text-muted-foreground">
								Efficiently displaying and managing large datasets
							</p>
						</div>
						<ThemeToggle />
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-6">
				<PageContent datasetsMetadata={datasetsMetadata} />
			</main>
		</div>
	);
}
