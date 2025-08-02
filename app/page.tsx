import Header from "@/components/header";
import Search from "@/components/search";
import DatasetSelector from "@/components/dataset-selector";
import DataTable from "@/components/data-table";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <Search />
          </div>
          <DatasetSelector />
        </div>
        
        <DataTable />
      </main>
    </div>
  );
}