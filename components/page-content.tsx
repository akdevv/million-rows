"use client";

import { useState, useEffect } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Search from "@/components/search";
import DataTable from "@/components/table/data-table";
import { DatasetMetadata } from "@/lib/types/datasets";
import DatasetSelector from "@/components/dataset-selector";

export default function PageContent({
	datasets,
}: {
	datasets: DatasetMetadata[];
}) {
	const [selectedDataset, setSelectedDataset] =
		useState<DatasetMetadata | null>(null);

	useEffect(() => {
		if (datasets.length > 0) {
			const cachedDataset = localStorage.getItem("selectedDataset");
			const defaultDataset = datasets[0];

			if (cachedDataset && datasets.some((d) => d.id === cachedDataset)) {
				setSelectedDataset(
					datasets.find((d) => d.id === cachedDataset) || null
				);
			} else {
				setSelectedDataset(defaultDataset);
				localStorage.setItem("selectedDataset", defaultDataset.id);
			}
		}
	}, [datasets]);

	// Cache selected dataset when it changes
	const handleDatasetChange = (value: string) => {
		setSelectedDataset(datasets.find((d) => d.id === value) || null);
		localStorage.setItem("selectedDataset", value);
	};

	return (
		<>
			<div className="mb-6 flex gap-4 items-center">
				<div className="flex-1">
					<Search />
				</div>
				<DatasetSelector
					datasets={datasets}
					selectedDataset={selectedDataset?.id || ""}
					handleDatasetChange={handleDatasetChange}
				/>
			</div>

			<DataTable />

			{selectedDataset && (
				<div className="mt-4 text-xs text-muted-foreground/60 flex items-center gap-1">
					<IoIosInformationCircleOutline className="h-3 w-3 flex-shrink-0" />
					{selectedDataset.description && (
						<p>
							{selectedDataset.description}: (
							{selectedDataset.totalRows.toLocaleString()} total
							rows)
						</p>
					)}
				</div>
			)}
		</>
	);
}
