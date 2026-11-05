import React, { useState, useMemo } from 'react';

const Icons = {
  Calendar: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Camera: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  X: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

const INITIAL_SHOWS = [
  {
    id: 'show-1',
    clientName: 'Minh Tuấn & Ngọc Mai',
    clientPhone: '0988777666',
    date: '2026-11-15',
    startTime: '07:30',
    endTime: '17:00',
    packageType: 'Thành hôn',
    location: 'InterContinental Danang',
    totalAmount: 25000000,
    depositAmount: 10000000,
    status: 'Đã cọc'
  },
  {
    id: 'show-2',
    clientName: 'Trần Gia Bảo',
    clientPhone: '0912333444',
    date: '2026-11-20',
    startTime: '08:00',
    endTime: '12:00',
    packageType: 'Prewedding',
    location: 'Phố Cổ Hội An',
    totalAmount: 18000000,
    depositAmount: 5000000,
    status: 'Đã cọc'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [shows, setShows] = useState(INITIAL_SHOWS);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0).replace('₫', 'đ');
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfWeek = (new Date(selectedYear, selectedMonth - 1, 1).getDay() + 6) % 7;
    const daysArr = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArr.push({ dayNum: '', dateStr: '', isCurrentMonth: false, shows: [] });
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayShows = shows.filter((s) => s.date === dateStr);
      daysArr.push({ dayNum, dateStr, isCurrentMonth: true, shows: dayShows });
    }

    return daysArr;
  }, [selectedMonth, selectedYear, shows]);

  return (
    <div className="min-h-screen bg-[#141210] text-[#f3ece4] font-sans p-3 sm:p-6">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center border-b border-[#2c251e] pb-4 mb-6 gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#f9f6f0]">OUR JUNE STUDIO</h1>
          <span className="bg-[#26211c] text-[#86efac] text-xs px-2.5 py-0.5 rounded-full border border-[#2e4d38] font-semibold">
            ● App Online Active
          </span>
        </div>

        <nav className="flex bg-[#1b1815] p-1 rounded-xl border border-[#2c251e] text-xs">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
              activeTab === 'calendar' ? 'bg-[#26211c] text-[#f9f6f0] border border-[#3c342c]' : 'text-[#a3978b]'
            }`}
          >
            <Icons.Calendar className="w-4 h-4 text-[#c9bbaE]" /> Calendar
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
              activeTab === 'list' ? 'bg-[#26211c] text-[#f9f6f0] border border-[#3c342c]' : 'text-[#a3978b]'
            }`}
          >
            <Icons.Camera className="w-4 h-4 text-[#c9bbaE]" /> Danh Sách
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        {activeTab === 'calendar' && (
          <div className="bg-[#1b1815] p-4 rounded-2xl border border-[#2c251e] shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
              <h2 className="text-base font-bold text-[#f9f6f0]">Lịch Chụp Tháng {selectedMonth}/{selectedYear}</h2>
              <span className="text-xs text-[#a3978b]">Bấm vào ngày để xem chi tiết</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#a3978b] pb-2">
              <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, idx) => (
                <div
                  key={idx}
                  onClick={() => cell.dateStr && setSelectedCalendarDay(cell)}
                  className={`min-h-[80px] sm:min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
                    cell.isCurrentMonth
                      ? 'bg-[#24201c]/50 border-[#2c251e] hover:border-[#3c342c]'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  <span className="text-xs font-bold text-[#f3ece4]">{cell.dayNum}</span>
                  <div className="space-y-1">
                    {cell.shows.map((s) => (
                      <div key={s.id} className="bg-[#33463a] text-[#f9f6f0] p-1 rounded text-[10px] font-bold truncate">
                        {s.clientName}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-3">
            {shows.map((show) => (
              <div key={show.id} className="bg-[#1b1815] p-4 rounded-xl border border-[#2c251e] shadow-md space-y-2">
                <div className="flex justify-between items-center border-b border-[#2c251e] pb-2">
                  <span className="font-bold text-sm text-[#f9f6f0]">{show.clientName}</span>
                  <span className="text-xs font-semibold bg-[#26211c] text-[#86efac] px-2 py-0.5 rounded border border-[#2e4d38]">
                    {show.packageType}
                  </span>
                </div>
                <div className="text-xs text-[#a3978b] space-y-1">
                  <p>📅 Ngày: {show.date} ({show.startTime} - {show.endTime})</p>
                  <p>📍 Địa điểm: {show.location}</p>
                  <p className="font-bold text-[#f9f6f0] pt-1">💰 Giá gói: {formatCurrency(show.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedCalendarDay && (
        <div className="fixed inset-0 bg-[#141210]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1b1815] p-5 rounded-2xl border border-[#3c342c] w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-2">
              <h3 className="font-bold text-sm text-[#f9f6f0]">Show Ngày {selectedCalendarDay.dateStr}</h3>
              <button onClick={() => setSelectedCalendarDay(null)} className="text-[#a3978b]">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            {selectedCalendarDay.shows.length === 0 ? (
              <p className="text-xs text-[#a3978b] text-center py-4">Trống lịch chụp trong ngày này.</p>
            ) : (
              selectedCalendarDay.shows.map((s) => (
                <div key={s.id} className="bg-[#24201c] p-3 rounded-xl border border-[#3c342c] space-y-1 text-xs">
                  <p className="font-bold text-[#f9f6f0]">{s.clientName} ({s.packageType})</p>
                  <p className="text-[#a3978b]">⏰ {s.startTime} - {s.endTime}</p>
                  <p className="text-[#a3978b]">📍 {s.location}</p>
                  <p className="text-[#86efac] font-bold">Tổng tiền: {formatCurrency(s.totalAmount)}</p>
                </div>
              ))
            )}
            <button
              onClick={() => setSelectedCalendarDay(null)}
              className="w-full bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] py-2 rounded-xl text-xs font-bold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
