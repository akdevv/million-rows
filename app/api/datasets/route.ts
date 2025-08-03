import { NextResponse } from "next/server";
import { DatasetMetadata } from "@/lib/types/datasets";
import { fetchDatasetsMetadata } from "@/lib/services/datasets";

export async function GET(): Promise<
	NextResponse<{
		success: boolean;
		data?: DatasetMetadata[];
		message?: string;
	}>
> {
	try {
		const datasets = await fetchDatasetsMetadata();

		return NextResponse.json({
			success: true,
			data: datasets,
		});
	} catch (error) {
		console.error("Error fetching datasets", error);
		return NextResponse.json(
			{
				success: false,
				message: "Error fetching datasets",
			},
			{ status: 500 }
		);
	}
}
