export default function ProductList({ products }) {
  return (
    <div className="bg-white p-4 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Recommended Products</h2>
      <ul className="list-disc pl-6">
        {products.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  )
}
