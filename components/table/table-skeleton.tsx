import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
	return (
		<div className="w-full h-[600px] border rounded-lg overflow-hidden flex flex-col">
			<div className="flex-1 overflow-hidden">
				{Array.from({ length: 12 }).map((_, i) => (
					<div
						key={i}
						className={`flex items-center border-b h-[50px] px-4 py-3 ${
							i === 0 ? "bg-muted sticky top-0 z-10" : "bg-background"
						}`}
					>
						<Skeleton className="w-full h-5" />
					</div>
				))}
			</div>
		</div>
	);
}
