export default function TableHeader({ headers }: { headers: string[] }) {
	return (
		<div className="flex bg-muted border-b sticky top-0 z-10">
			{headers.map((header: string, index: number) => (
				<div
					key={index}
					className={`flex-1 px-4 py-3 text-left font-medium ${
						index < headers.length - 1 ? "border-r" : ""
					}`}
				>
					{header}
				</div>
			))}
		</div>
	);
}
