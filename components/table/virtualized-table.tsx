"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { DatasetMetadata } from "@/lib/types/datasets";
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
		async (page: number, isInitial = false) => {
			if (!selectedDatasetMetadata?.id || loadingRef.current) return;

			try {
				loadingRef.current = true;

				setState((prev) => ({
					...prev,
					[isInitial ? "isInitialLoading" : "isLoadingMore"]: true,
					error: null,
				}));

				const result = await fetchDatasetData(
					selectedDatasetMetadata.id,
					page,
					CHUNK_SIZE
				);

				const newData = result.data.data;
				setState((prev) => ({
					...prev,
					data: isInitial ? newData : [...prev.data, ...newData],
					totalCount: result.pagination.total,
					currentPage: page,
					hasMore: result.pagination.hasNext,
					isInitialLoading: false,
					isLoadingMore: false,
					error: null,
				}));
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
				loadingRef.current = false;
			} finally {
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

			<div className="flex items-center justify-between px-4 py-2 border-t">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">
						{state.data.length.toLocaleString()}
					</span>
					<span className="text-sm text-muted-foreground">
						of {state.totalCount.toLocaleString()} rows
					</span>
				</div>
			</div>
		</div>
	);
}
