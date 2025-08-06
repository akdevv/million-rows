export type DatasetMetadata = {
	id: string;
	name: string;
	description: string | null;
	totalRows: number;
	headers: string[];
};

export type DatasetData = {
	datasetId: string;
	datasetName: string;
	headers: string[];
	data: Record<string, unknown>[];
	total: number;
};

export type PaginatedResponse = {
	data: DatasetData;
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
};
