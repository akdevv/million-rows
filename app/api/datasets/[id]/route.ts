import { NextRequest, NextResponse } from "next/server";
import { fetchDatasetData } from "@/lib/services/datasets";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { searchParams } = req.nextUrl;
		const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
		const limit = parseInt(searchParams.get("limit") || "10");

		const result = await fetchDatasetData(id, {
			page,
			limit,
		});

		// Add cache headers to enable browser caching
		const response = NextResponse.json({ success: true, data: result });
		
		// Cache for 5 minutes (300 seconds)
		response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
		response.headers.set('ETag', `"${id}-${page}-${limit}"`);
		
		return response;
	} catch (error) {
		console.error("Error fetching dataset data", error);
		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "An unexpected error occurred",
				},
			},
			{ status: 500 }
		);
	}
}
