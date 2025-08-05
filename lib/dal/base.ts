import { db } from "@/lib/prisma";
import { DatasetMetadata } from "@/lib/types/datasets";

export const findAllDatasets = async (): Promise<DatasetMetadata[]> => {
	return await db.dataset.findMany({
		orderBy: { name: "asc" },
	});
};
