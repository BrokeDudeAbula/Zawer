function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-zawer-danger mb-4">🗺️ Zawer</h1>
      <p className="text-lg text-gray-600">附近 Zawer 地图 - 反消费陷阱指南</p>
      <div className="mt-8 flex gap-4">
        <span className="px-3 py-1 rounded-full bg-zawer-danger text-white text-sm">极度 Zawer</span>
        <span className="px-3 py-1 rounded-full bg-zawer-warning text-white text-sm">很 Zawer</span>
        <span className="px-3 py-1 rounded-full bg-zawer-neutral text-white text-sm">一般</span>
        <span className="px-3 py-1 rounded-full bg-zawer-safe text-white text-sm">不 Zawer</span>
        <span className="px-3 py-1 rounded-full bg-zawer-excellent text-white text-sm">推荐</span>
      </div>
    </div>
  )
}

export default App
