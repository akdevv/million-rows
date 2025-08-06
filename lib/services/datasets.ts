import { PaginatedResponse } from "@/lib/types/datasets";
import { findAllDatasets, findDatasetData } from "@/lib/dal/datasets";

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

export const fetchDatasetData = async (
	id: string,
	{ page, limit }: { page: number; limit: number }
): Promise<PaginatedResponse> => {
	try {
		const calculatedOffset = (page - 1) * limit;
		const data = await findDatasetData(id, {
			limit,
			offset: calculatedOffset,
		});

		// Convert BigInt values to strings to avoid serialization errors
		const serializedData = JSON.parse(
			JSON.stringify(data, (_, value) =>
				typeof value === "bigint" ? value.toString() : value
			)
		);

		const totalPages = Math.ceil(serializedData.total / limit);

		console.log(
			`[Service] Total records: ${serializedData.total}, Total pages: ${totalPages}, Current page: ${page}`
		);

		return {
			data: serializedData,
			pagination: {
				page,
				limit,
				total: serializedData.total,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
		};
	} catch (error) {
		console.error("Error fetching dataset data", error);
		throw new Error("Failed to fetch dataset data");
	}
};
