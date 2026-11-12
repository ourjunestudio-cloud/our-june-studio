import { useState } from "react";

export default function ControlCenter() {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* --- THANH ĐIỀU HƯỚNG CỐ ĐỊNH (STICKY NAVBAR) --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Tên Studio */}
            <div className="font-bold text-lg tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("calendar")}>
              <span className="w-3 h-3 bg-black rounded-full"></span>
              <span>Our June Studio</span>
            </div>

            {/* Các tab nội bộ & Lối tắt trang phụ */}
            <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
              
              {/* Nhóm Tab Chức Năng Chính */}
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "calendar" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📅 Lịch
              </button>
              
              <button
                onClick={() => setActiveTab("list")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "list" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📋 Danh sách
              </button>

              <button
                onClick={() => setActiveTab("stats")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "stats" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📊 Thống kê
              </button>

              <button
                onClick={() => setActiveTab("team")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "team" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                👥 Ekip
              </button>

              {/* Đường phân cách */}
              <div className="h-5 w-px bg-gray-300 mx-1"></div>

              {/* Nhóm Lối Tắt Nhanh Sang Các Trang Phụ */}
              <a
                href="https://beacons.ai/ourjune.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                title="Mở trang Báo giá"
              >
                💰 Báo giá
              </a>

              <a
                href="https://shotpik.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                title="Mở Album trả khách"
              >
                📂 Album
              </a>

              <a
                href="https://www.ourjunestudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                title="Mở Web chính thức"
              >
                🌐 Web chính
              </a>

              <a
                href="https://ourjunestudio.shotpik.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                title="Mở Portfolio Ảnh Film"
              >
                🎞️ Film
              </a>

            </nav>
          </div>
        </div>
      </header>

      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG --- */}
      <main className="max-w-6xl mx-auto p-4 mt-4">
        
        {/* TAB 1: LỊCH CHỤP */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[350px]">
              <h2 className="text-xl font-bold mb-2">Lịch trình & Đồng bộ Google</h2>
              <p className="text-sm text-gray-500">Nơi hiển thị lịch trình và widget đồng bộ Google Calendar...</p>
            </div>
          </div>
        )}

        {/* TAB 2: DANH SÁCH & PHÂN LOẠI TRẠNG THÁI */}
        {activeTab === "list" && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Danh sách khách hàng & Trạng thái</h2>
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-600">Quản lý vòng đời ảnh cưới</span>
            </div>
            
            {/* Minh họa nhãn trạng thái */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg text-center">
                <span className="text-xs font-semibold text-yellow-800 block">Đã cọc</span>
              </div>
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg text-center">
                <span className="text-xs font-semibold text-blue-800 block">Đang chuẩn bị</span>
              </div>
              <div className="p-3 border border-purple-200 bg-purple-50 rounded-lg text-center">
                <span className="text-xs font-semibold text-purple-800 block">Đã chụp xong</span>
              </div>
              <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg text-center">
                <span className="text-xs font-semibold text-orange-800 block">Đang hậu kỳ</span>
              </div>
              <div className="p-3 border border-green-200 bg-green-50 rounded-lg text-center">
                <span className="text-xs font-semibold text-green-800 block">Đã bàn giao</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THỐNG KÊ */}
        {activeTab === "stats" && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-2">Thống kê hoạt động Studio</h2>
            <p className="text-gray-500 text-sm">Theo dõi tổng lượng lịch chụp trong tuần và tháng.</p>
          </div>
        )}

        {/* TAB 4: EKIP */}
        {activeTab === "team" && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-2">Quản lý Ekip (Việt & Thi)</h2>
            <p className="text-gray-500 text-sm">Phân công công việc chụp ảnh và makeup cho các cặp đôi.</p>
          </div>
        )}
      </main>
    </div>
  );
}
