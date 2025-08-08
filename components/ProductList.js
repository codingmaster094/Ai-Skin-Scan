export default function ProductList({ products }) {
  return (
    <div className="bg-white p-4 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Recommended Products</h2>
      <div className="list-disc pl-6">
        {products.map((p, i) => (
          <>
          <ul>
          <li key={i}>description:{p.description}</li>
          <li>
          <ul>
            <li><img src={p.product.image} width={30} height={30}/></li>
            <li>product: {p.product.name}</li>
            <li>price:{p.product.price}</li>
            <li>timeOfDay:{p.product.timeOfDay}</li>
          </ul>
          </li>
          <li>{p.stepTitle}</li>
          </ul>
          <hr/>
          </>
        ))}
      </div>
    </div>
  )
}
