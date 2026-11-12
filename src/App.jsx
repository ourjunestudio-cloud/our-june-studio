export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="font-bold text-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
            <span>Our June Studio</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <a href="https://beacons.ai/ourjune.studio" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-colors whitespace-nowrap">💰 Báo giá</a>
            <a href="https://shotpik.com/dashboard" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-colors whitespace-nowrap">📂 Album</a>
            <a href="https://www.ourjunestudio.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-colors whitespace-nowrap">🌐 Web chính</a>
            <a href="https://ourjunestudio.shotpik.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-colors whitespace-nowrap">🎞️ Film Portfolio</a>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Lịch trình & Giao diện gốc</h2>
          <p className="text-gray-500 text-sm">Giao diện cũ của Việt được bảo lưu hoàn toàn, bổ sung thêm thanh lối tắt nhanh ở phía trên.</p>
        </div>
      </main>
    </div>
  );
}
