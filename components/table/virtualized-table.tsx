"use client";

import { useState, useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import TableHeader from "./table-header";
import TableBody from "./table-body";
import { DatasetMetadata } from "@/lib/types/datasets";

export default function VirtualizedTable({
	selectedDatasetMetadata,
}: {
	selectedDatasetMetadata: DatasetMetadata | null;
}) {
	if (!selectedDatasetMetadata) {
		return null;
	}

	const [data, setData] = useState<Array<{ [key: string]: any }>>([]);
	const listRef = useRef<List>(null);

	useEffect(() => {
		if (!selectedDatasetMetadata.headers) return;
		
		// Generate random data based on headers
		const randomData = Array.from({ length: 10000 }, (_, i) => {
			const row: { [key: string]: any } = {};
			
			selectedDatasetMetadata.headers.forEach((header, idx) => {
				// Generate different types of random data based on header name
				if (header.toLowerCase().includes('id')) {
					row[header] = i + 1;
				} else if (header.toLowerCase().includes('name')) {
					row[header] = `Row ${i + 1}`;
				} else if (header.toLowerCase().includes('value') || header.toLowerCase().includes('amount')) {
					row[header] = Math.floor(Math.random() * 1000);
				} else if (header.toLowerCase().includes('status')) {
					row[header] = ["Active", "Pending", "Inactive"][Math.floor(Math.random() * 3)];
				} else if (header.toLowerCase().includes('date')) {
					row[header] = new Date(
						2024,
						Math.floor(Math.random() * 12),
						Math.floor(Math.random() * 28) + 1
					).toLocaleDateString();
				} else {
					// Default random string
					row[header] = `Data ${idx}-${i}`;
				}
			});
			
			return row;
		});
		
		setData(randomData);
	}, [selectedDatasetMetadata.headers]);

	return (
		<div className="w-full h-[600px] border rounded-lg overflow-hidden flex flex-col">
			<TableHeader headers={selectedDatasetMetadata.headers || []} />
			<div className="flex-1 overflow-hidden">
				<TableBody 
					ref={listRef} 
					data={data} 
					headers={selectedDatasetMetadata.headers || []}
					height={550} 
				/>
			</div>
		</div>
	);
}
