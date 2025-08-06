import { db } from "@/lib/prisma";
import { DatasetData, DatasetMetadata } from "@/lib/types/datasets";

export const findAllDatasets = async (): Promise<DatasetMetadata[]> => {
	return await db.dataset.findMany({
		orderBy: { name: "asc" },
	});
};

export const findDatasetData = async (
	id: string,
	{ limit, offset }: { limit: number; offset: number }
): Promise<DatasetData> => {
	const dataset = await db.dataset.findUnique({ where: { id } });
	if (!dataset) throw new Error("Dataset not found");

	const dataQueries = {
		primes: () =>
			db.prime.findMany({
				skip: offset,
				take: limit,
				orderBy: { index: "asc" },
			}),
		planetary_scans: () =>
			db.planetaryScans.findMany({
				skip: offset,
				take: limit,
				orderBy: { scan_id: "asc" },
			}),
		cyber_threats: () =>
			db.cyberThreats.findMany({
				skip: offset,
				take: limit,
				orderBy: { timestamp: "asc" },
			}),
	};

	const datasetKey = dataset.name.toLowerCase() as keyof typeof dataQueries;
	const queryFn = dataQueries[datasetKey];

	if (!queryFn) {
		throw new Error(`No data handler found for dataset: ${dataset.name}`);
	}

	const data = await queryFn();

	return {
		datasetId: dataset.id,
		datasetName: dataset.name,
		headers: dataset.headers,
		data,
		total: dataset.totalRows,
	};
};
