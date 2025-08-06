import { PaginatedResponse } from "@/lib/types/datasets";

// Cache storage
const cache: Record<string, { data: PaginatedResponse; timestamp: number }> =
	{};
const pendingRequests: Record<string, Promise<PaginatedResponse>> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper functions
function isCacheValid(timestamp: number): boolean {
	return Date.now() - timestamp < CACHE_TTL;
}

function getCacheKey(datasetId: string, page: number, limit: number): string {
	return `${datasetId}:${page}:${limit}`;
}

export function clearDatasetCache(datasetId: string): void {
	Object.keys(cache).forEach((key) => {
		if (key.startsWith(`${datasetId}:`)) {
			delete cache[key];
		}
	});
}

async function makeApiRequest(
	datasetId: string,
	page: number,
	limit: number
): Promise<PaginatedResponse> {
	const res = await fetch(
		`/api/datasets/${datasetId}?page=${page}&limit=${limit}`
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch data: ${res.statusText}`);
	}

	const result = await res.json();
	if (!result.success) {
		throw new Error(`Failed to fetch data: ${result.error.message}`);
	}

	return result.data;
}

export async function fetchDatasetData(
	datasetId: string,
	page: number,
	limit: number = 1000
): Promise<PaginatedResponse> {
	const cacheKey = getCacheKey(datasetId, page, limit);

	// Check cache first
	const cached = cache[cacheKey];
	if (cached && isCacheValid(cached.timestamp)) {
		return cached.data;
	}

	// Check if request is already pending
	if (cacheKey in pendingRequests) {
		return pendingRequests[cacheKey];
	}

	// Make new request
	const requestPromise = makeApiRequest(datasetId, page, limit);
	pendingRequests[cacheKey] = requestPromise;

	try {
		const result = await requestPromise;

		// Cache the result
		cache[cacheKey] = {
			data: result,
			timestamp: Date.now(),
		};

		return result;
	} catch (error) {
		throw error;
	} finally {
		delete pendingRequests[cacheKey];
	}
}
