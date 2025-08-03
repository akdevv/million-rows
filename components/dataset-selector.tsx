import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatasetMetadata } from "@/lib/types/datasets";

export default function DatasetSelector({
	datasets,
	selectedDataset,
	handleDatasetChange,
}: {
	datasets: DatasetMetadata[];
	selectedDataset: string;
	handleDatasetChange: (value: string) => void;
}) {
	if (datasets.length === 0 || !selectedDataset) {
		return (
			<div className="w-[220px] h-10 bg-muted animate-pulse rounded-md border py-5" />
		);
	}

	return (
		<Select value={selectedDataset} onValueChange={handleDatasetChange}>
			<SelectTrigger className="w-[220px] py-5">
				<SelectValue placeholder="Select dataset" />
			</SelectTrigger>
			<SelectContent>
				{datasets.map((dataset) => (
					<SelectItem key={dataset.id} value={dataset.id}>
						{dataset.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
