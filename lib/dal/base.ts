import { db } from "@/lib/prisma";

export const findAllDatasets = async () => {
	return await db.dataset.findMany({
		orderBy: { name: "asc" },
	});
};
