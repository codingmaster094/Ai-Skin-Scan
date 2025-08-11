export default function ResultCard({ conditions , products }) {
 
  return (
    <main className="min-h-screen bg-white text-black p-4 max-w-md mx-auto text-left font-sans">
        <div className="overflow-x-auto whitespace-nowrap px-2">
          <h2 className="text-lg font-semibold mb-3">Detected Conditions</h2>
      <div className="flex g-3 space-x-4">
        {conditions.map((c, i) => (
          <div
            key={i}
            className="min-w-[200px] bg-white border rounded-xl shadow-md p-3 text-center"
          >
            {/* <img
             src={c.user_image}
              alt={c.name}
              width={70}
              height={70}
              className="rounded-full object-cover mx-auto "
            /> */}
            <div className="text-md font-medium text-gray-800">{c.name}</div>
            {c.score !== null && (
              <div className="text-sm text-orange-600 font-semibold mt-1">{c.score} / 100</div>
            )}
            <div className="text-sm text-gray-500 mt-1">{c.status}</div>
            <button className="mt-2 text-blue-600 text-sm font-medium">Show more</button>
          </div>
        ))}
      </div>
    </div>

        {/* Recommendations */}
        <h2 className="text-lg font-semibold mb-3">Recommendations for you</h2>
        <div className="space-y-4">
          <div className="recommendation-grid">
            {products.map((p, i) => {
              console.log("ppp" , p)
              const rating = p.product.rating || 0;
              const fullStars = Math.floor(rating);
              const halfStar = rating % 1 >= 0.5;
              const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
              return (
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
                    <div className="rating">
                      {Array(fullStars).fill('★').map((star, idx) => (
                        <span key={`full-${idx}`}>{star}</span>
                      ))}
                      {halfStar && <span>★</span>} {/* Replace with half-star icon if needed */}
                      {Array(emptyStars).fill('☆').map((star, idx) => (
                        <span key={`empty-${idx}`}>{star}</span>
                      ))}
                      <span className="text-gray-600 text-sm ml-1">({rating})</span>
                    </div>
                    <a href="#" className="button">Add to Cart</a>
                  </div>
                </div>
              </div>
            )
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 text-center">
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold">
            🔍 RECOMMENDATIONS FOR YOU
          </button>
        </div>
      </main>
  )
}
