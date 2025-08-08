export default function ResultCard({ conditions }) {
  console.log("conditions" , conditions);
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Detected Conditions</h2>
      <div className="list-disc pl-6">
        {conditions.map((c, i) => (
          <>
          <ul>
          <li key={i}>conditions:{c.name}</li>
          <li>score:{c.score}</li>
          <li>status:{c.status}</li>
          </ul>
          <hr/>
          </>
        ))}
      </div>
    </div>
  )
}
