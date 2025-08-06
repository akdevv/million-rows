import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Check database connectivity
		await db.$queryRaw`SELECT 1`;

		return NextResponse.json(
			{
				status: "healthy",
				timestamp: new Date().toISOString(),
				service: "million-rows-api",
				database: "connected",
				uptime: process.uptime(),
				environment: process.env.NODE_ENV || "development",
				memory: {
					used: Math.round(
						process.memoryUsage().heapUsed / 1024 / 1024
					),
					total: Math.round(
						process.memoryUsage().heapTotal / 1024 / 1024
					),
					unit: "MB",
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				service: "million-rows-api",
				database: "disconnected",
				error: error instanceof Error ? error.message : "Unknown error",
				environment: process.env.NODE_ENV || "development",
			},
			{ status: 503 }
		);
	}
}
