export type DatasetMetadata = {
	id: string;
	name: string;
	description: string | null;
	totalRows: number;
	headers: string[];
};
