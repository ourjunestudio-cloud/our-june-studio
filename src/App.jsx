import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="min-h-screen bg-[#141210] text-[#f3ece4] font-sans p-4 sm:p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-[#2c251e] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#f9f6f0]">OUR JUNE STUDIO</h1>
          <span className="bg-[#26211c] text-[#86efac] text-xs px-2.5 py-0.5 rounded-full border border-[#2e4d38] font-semibold">
            ● Online Realtime
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#1b1815] p-6 rounded-2xl border border-[#2c251e] shadow-xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#f9f6f0]">Hệ Thống Quản Lý Our June Studio</h2>
          <p className="text-sm text-[#a3978b]">Trang web đã kết nối máy chủ Cloud và sẵn sàng hoạt động trên mọi thiết bị.</p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => alert("Hệ thống đã hoạt động mượt mà!")} className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-[#332b24] transition">
              + Tạo Lịch Chụp Mới
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
