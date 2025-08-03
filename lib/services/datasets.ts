import { findAllDatasets } from "@/lib/dal/base";

export const fetchDatasetsMetadata = async () => {
	try {
		const datasets = await findAllDatasets();
		return datasets.map((dataset) => ({
			id: dataset.id,
			name: dataset.name,
			description: dataset.description || "",
			totalRows: dataset.totalRows,
			headers: dataset.headers as string[],
		}));
	} catch (error) {
		console.error("Error fetching datasets", error);
		throw new Error("Failed to fetch datasets");
	}
};
