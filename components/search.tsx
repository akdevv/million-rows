import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

export default function Search() {
	return (
		<div className="relative w-full">
			<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search..."
				className="pl-10 py-5"
			/>
		</div>
	);
}
