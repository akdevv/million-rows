import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DatasetSelector() {
  return (
    <Select defaultValue="dataset1">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select dataset" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dataset1">Dataset 1</SelectItem>
        <SelectItem value="dataset2">Dataset 2</SelectItem>
        <SelectItem value="dataset3">Dataset 3</SelectItem>
      </SelectContent>
    </Select>
  );
}