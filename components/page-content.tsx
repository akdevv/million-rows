"use client";

import { useState, useEffect } from "react";
import Search from "@/components/search";
import VirtualizedTable from "@/components/table/virtualized-table";
import { DatasetMetadata } from "@/lib/types/datasets";
import DatasetSelector from "@/components/dataset-selector";

export default function PageContent({
	datasetsMetadata,
}: {
	datasetsMetadata: DatasetMetadata[];
}) {
	const [selectedDataset, setSelectedDataset] =
		useState<DatasetMetadata | null>(null);

	const findDatasetById = (id: string) =>
		datasetsMetadata.find((d) => d.id === id) || null;

	useEffect(() => {
		if (datasetsMetadata.length === 0) return;

		const cachedId = localStorage.getItem("selectedDataset");
		const cachedDataset = cachedId ? findDatasetById(cachedId) : null;
		const datasetToSelect = cachedDataset || datasetsMetadata[0];

		setSelectedDataset(datasetToSelect);
		localStorage.setItem("selectedDataset", datasetToSelect.id);
	}, [datasetsMetadata, findDatasetById]);

	const handleDatasetChange = (id: string) => {
		const dataset = findDatasetById(id);
		setSelectedDataset(dataset);
		localStorage.setItem("selectedDataset", id);
	};

	return (
		<>
			{/* Search and dataset selector */}
			<div className="mb-6 flex gap-4 items-center">
				<div className="flex-1">
					<Search />
				</div>
				<DatasetSelector
					datasetsMetadata={datasetsMetadata}
					selectedDataset={selectedDataset?.id || ""}
					handleDatasetChange={handleDatasetChange}
				/>
			</div>

			<VirtualizedTable selectedDatasetMetadata={selectedDataset} />
		</>
	);
}
