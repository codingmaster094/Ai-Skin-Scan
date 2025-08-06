export default function ResultCard({ conditions }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Detected Conditions</h2>
      <ul className="list-disc pl-6">
        {conditions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  )
}
