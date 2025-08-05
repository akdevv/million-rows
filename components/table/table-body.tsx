"use client";

import { CSSProperties, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";

interface RowData {
	[key: string]: any;
}

interface TableBodyProps {
	data: RowData[];
	headers: string[];
	height: number;
	onScroll?: (scrollTop: number) => void;
}

interface RowProps {
	index: number;
	style: CSSProperties;
	data: {
		rows: RowData[];
		headers: string[];
	};
}

const Row = ({ index, style, data }: RowProps) => {
	const { rows, headers } = data;
	const item = rows[index];
	
	return (
		<div
			style={style}
			className={`flex items-center border-b hover:bg-accent ${
				index % 2 === 0 ? "bg-background" : "bg-muted/20"
			}`}
		>
			{headers.map((header, idx) => (
				<div 
					key={idx} 
					className={`flex-1 px-4 py-3 ${
						idx < headers.length - 1 ? "border-r" : ""
					}`}
				>
					{item[header] ?? item[idx] ?? ""}
				</div>
			))}
		</div>
	);
};

const TableBody = forwardRef<List, TableBodyProps>(({ data, headers, height, onScroll }, ref) => {
	return (
		<List
			ref={ref}
			height={height}
			itemCount={data.length}
			itemSize={50}
			width="100%"
			itemData={{ rows: data, headers }}
			onScroll={({ scrollOffset }) => onScroll?.(scrollOffset)}
		>
			{Row}
		</List>
	);
});

TableBody.displayName = "TableBody";

export default TableBody;
