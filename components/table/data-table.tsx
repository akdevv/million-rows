export default function DataTable() {
  // Generate dummy data for demonstration
  const dummyData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Row ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    status: ["Active", "Pending", "Inactive"][Math.floor(Math.random() * 3)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
  }));

  return (
    <div className="w-full max-h-[600px] overflow-auto border rounded-lg">
      <table className="w-full">
        <thead className="sticky top-0 bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Value</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((row) => (
            <tr key={row.id} className="border-t hover:bg-accent">
              <td className="px-4 py-3">{row.id}</td>
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.value}</td>
              <td className="px-4 py-3">{row.status}</td>
              <td className="px-4 py-3">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}