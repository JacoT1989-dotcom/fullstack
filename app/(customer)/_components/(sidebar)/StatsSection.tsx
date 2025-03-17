export default function StatsSection() {
  return (
    <div className="flex border-b border-slate-600">
      <div className="flex-1 py-4 text-center border-r border-slate-600">
        <p className="text-2xl font-bold">0</p>
        <p className="text-sm text-slate-300">Orders</p>
      </div>
      <div className="flex-1 py-4 text-center">
        <p className="text-2xl font-bold">0</p>
        <p className="text-sm text-slate-300">Wishlist</p>
      </div>
    </div>
  );
}
