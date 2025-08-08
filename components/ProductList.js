export default function ProductList({ products }) {
  return (
    <div className="bg-white p-4 mt-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Recommendations for you</h2>
        <div className="space-y-4">
          <div className="recommendation-grid">
            {products.map((p, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-sm text-blue-800 mb-1">{p.stepTitle}</h3>
                <p className="text-xs text-gray-600 mb-3">{p.description}</p>
                <div className="card">
                  <img src={p.product.image}
                    alt={p.product.name} width={150} height={100} />
                  <div className="card-content">
                    <h3 className="card-title">{p.product.name}</h3>
                    <div className="price">${p.product.price}</div>
                    🕒 {p.product.timeOfDay}
                    <div className="rating">★★★★☆</div>
                    <a href="#" className="button">Add to Cart</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
