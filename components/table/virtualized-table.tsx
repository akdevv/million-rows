"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { DatasetData, DatasetMetadata } from "@/lib/types/datasets";
import { fetchDatasetData } from "@/lib/api/request-manager";
import { MdError } from "react-icons/md";

import TableBody from "./table-body";
import TableHeader from "./table-header";
import TableSkeleton from "./table-skeleton";

interface TableState {
	data: Record<string, any>[];
	totalCount: number;
	isInitialLoading: boolean;
	isLoadingMore: boolean;
	currentPage: number;
	hasMore: boolean;
	error: string | null;
}

const CHUNK_SIZE = 1000;

interface VirtualizedTableProps {
	selectedDatasetMetadata: DatasetMetadata | null;
}

export default function VirtualizedTable({
	selectedDatasetMetadata,
}: VirtualizedTableProps) {
	const [state, setState] = useState<TableState>({
		data: [],
		totalCount: 0,
		isInitialLoading: false,
		isLoadingMore: false,
		currentPage: 1,
		hasMore: true,
		error: null,
	});

	const listRef = useRef<List>(null);
	const loadingRef = useRef(false);

	const loadData = useCallback(
		async (page: number, isInitial: boolean = false) => {
			if (!selectedDatasetMetadata?.id || loadingRef.current) return;

			try {
				loadingRef.current = true; // Set loading ref immediately

				if (isInitial) {
					setState((prev) => ({
						...prev,
						isInitialLoading: true,
						error: null,
					}));
				} else {
					setState((prev) => ({
						...prev,
						isLoadingMore: true,
						error: null,
					}));
				}

				const result = await fetchDatasetData(
					selectedDatasetMetadata.id,
					page,
					CHUNK_SIZE
				);

				const newData = result.data.data;
				setState((prev) => {
					const updatedData = isInitial
						? newData
						: [...prev.data, ...newData];
					return {
						...prev,
						data: updatedData,
						totalCount: result.pagination.total,
						currentPage: page,
						hasMore: result.pagination.hasNext,
						isInitialLoading: false,
						isLoadingMore: false,
						error: null,
					};
				});
			} catch (error) {
				console.error("Error loading data:", error);
				setState((prev) => ({
					...prev,
					isInitialLoading: false,
					isLoadingMore: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to load data",
				}));
				loadingRef.current = false; // Reset on error
			} finally {
				// Reset loading ref after a small delay to prevent double triggers
				setTimeout(() => {
					loadingRef.current = false;
				}, 100);
			}
		},
		[selectedDatasetMetadata?.id]
	);

	const loadMore = useCallback(() => {
		if (state.hasMore && !state.isLoadingMore && !loadingRef.current) {
			loadData(state.currentPage + 1);
		}
	}, [state.hasMore, state.isLoadingMore, state.currentPage, loadData]);

	// Reset and load initial data when dataset changes
	useEffect(() => {
		if (selectedDatasetMetadata?.id) {
			setState({
				data: [],
				totalCount: 0,
				isInitialLoading: true,
				isLoadingMore: false,
				currentPage: 1,
				hasMore: true,
				error: null,
			});

			loadData(1, true);
		}
	}, [selectedDatasetMetadata?.id, loadData]);

	if (!selectedDatasetMetadata || state.isInitialLoading) {
		return <TableSkeleton />;
	}

	if (state.error) {
		return (
			<div className="w-full h-[600px] border rounded-lg overflow-hidden flex items-center justify-center bg-muted/20">
				<div className="text-center space-y-2 p-6">
					<MdError className="w-12 h-12 text-destructive mx-auto" />
					<div>
						<h3 className="text-lg font-medium text-foreground">
							Failed to load data
						</h3>
						<p className="text-sm text-muted-foreground max-w-md">
							{state.error}
						</p>
					</div>
					<button
						onClick={() => loadData(1, true)}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-[600px] border rounded-lg overflow-hidden flex flex-col">
			<TableHeader headers={selectedDatasetMetadata.headers || []} />
			<div className="flex-1 overflow-hidden">
				<TableBody
					ref={listRef}
					data={state.data}
					headers={selectedDatasetMetadata.headers || []}
					totalCount={state.totalCount}
					isLoading={state.isInitialLoading}
					isLoadingMore={state.isLoadingMore}
					hasMore={state.hasMore}
					onLoadMore={loadMore}
				/>
			</div>

			{/* Footer with stats */}
			<div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20 text-sm text-muted-foreground">
				<span>
					{state.data.length.toLocaleString()} of{" "}
					{state.totalCount.toLocaleString()} rows loaded
				</span>

				{state.isLoadingMore && (
					<span className="text-blue-600">Loading more...</span>
				)}

				{!state.hasMore && state.data.length > 0 && (
					<span className="text-green-600">All data loaded</span>
				)}
			</div>
		</div>
	);
}
