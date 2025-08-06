"use client";

import { forwardRef, useCallback, memo } from "react";
import { FixedSizeList as List } from "react-window";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface TableBodyProps {
	data: { [key: string]: any }[];
	headers: string[];
	totalCount: number;
	isLoading: boolean;
	isLoadingMore: boolean;
	hasMore: boolean;
	onLoadMore: () => void;
	onScroll?: (scrollTop: number) => void;
}

// Memoized Row component to prevent re-creation
interface RowProps {
	index: number;
	style: React.CSSProperties;
	data: {
		items: { [key: string]: any }[];
		headers: string[];
		hasMore: boolean;
	};
}

const Row = memo(({ index, style, data: rowData }: RowProps) => {
	const { items, headers, hasMore } = rowData;
	const item = items[index];


	// Loading row at the end
	if (index === items.length && hasMore) {
		return (
			<div style={style} className="flex items-center justify-center border-b bg-background">
				<div className="flex items-center gap-2 py-4 text-muted-foreground">
					<AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
					<span className="text-sm">
						Loading more rows...
					</span>
				</div>
			</div>
		);
	}

	// Empty/loading row
	if (!item) {
		return (
			<div style={style} className="flex items-center border-b bg-muted/5">
				{headers.map((_, idx) => (
					<div
						key={idx}
						className={`flex-1 px-4 py-3 ${
							idx < headers.length - 1
								? "border-r"
								: ""
						}`}
					>
						<div className="h-4 bg-muted animate-pulse rounded w-3/4" />
					</div>
				))}
			</div>
		);
	}
	
	return (
		<div
			style={style}
			className={`flex items-center border-b hover:bg-accent ${
				index % 2 === 0 ? "bg-background" : "bg-muted/20"
			}`}
		>
			{headers.map((header, idx) => {
				const value = item[header] ?? item[idx] ?? "";
				return (
					<div
						key={idx}
						className={`flex-1 px-4 py-3 ${
							idx < headers.length - 1 ? "border-r" : ""
						}`}
					>
						{value}
					</div>
				);
			})}
		</div>
	);
});

Row.displayName = "Row";

const TableBody = forwardRef<List, TableBodyProps>(
	(
		{
			data,
			headers,
			totalCount,
			isLoading,
			isLoadingMore,
			hasMore,
			onLoadMore,
			onScroll,
		},
		ref
	) => {

		const itemCount = hasMore ? data.length + 1 : data.length;
		
		// // Better debugging
		// console.group("📊 TableBody Render");
		// console.log("Data Length:", data.length);
		// console.log("Item Count:", itemCount);
		// console.log("Has More:", hasMore);
		// console.log("Is Loading More:", isLoadingMore);
		
		// if (data.length > 0) {
		// 	console.log("Sample Data:");
		// 	console.table([
		// 		{ index: 0, exists: !!data[0], keys: data[0] ? Object.keys(data[0]).length : 0 },
		// 		{ index: 15, exists: !!data[15], keys: data[15] ? Object.keys(data[15]).length : 0 },
		// 		{ index: 100, exists: !!data[100], keys: data[100] ? Object.keys(data[100]).length : 0 },
		// 		{ index: 999, exists: !!data[999], keys: data[999] ? Object.keys(data[999]).length : 0 }
		// 	]);
		// 	
		// 	if (data[0]) {
		// 		console.log("First item structure:", Object.keys(data[0]).slice(0, 5));
		// 		console.log("Headers expected:", headers);
		// 	}
		// }
		// console.groupEnd();

		// Handle scroll with load more logic
		const handleScroll = useCallback(
			(props: any) => {
				const {
					scrollOffset,
					scrollDirection,
					scrollUpdateWasRequested,
				} = props;
				
				onScroll?.(scrollOffset);

				// Simple load more check
				const scrollPercentage = scrollOffset / ((itemCount * 50) - 550);
				if (
					scrollPercentage > 0.8 && // 80% scrolled
					hasMore &&
					!isLoadingMore &&
					scrollDirection === "forward" &&
					!scrollUpdateWasRequested
				) {
					onLoadMore();
				}
			},
			[onScroll, hasMore, isLoadingMore, onLoadMore, itemCount]
		);

		// Data object for Row component
		const itemData = {
			items: data,
			headers,
			hasMore
		};

		return (
			<List
				ref={ref}
				height={550}
				itemCount={itemCount}
				itemSize={50}
				itemData={itemData}
				width="100%"
				onScroll={handleScroll}
				overscanCount={5}
			>
				{Row}
			</List>
		);
	}
);

export default TableBody;
