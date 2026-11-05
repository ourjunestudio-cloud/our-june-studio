import React, { useState, useMemo } from 'react';

const Icons = {
  Calendar: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Users: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  DollarSign: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TrendingUp: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Plus: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash2: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  ChevronLeft: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Search: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  X: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Camera: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

const INITIAL_STAFF = [
  { id: '1', name: 'Hoàng Nam', role: 'Photo', phone: '0905123456' },
  { id: '2', name: 'Đức Anh', role: 'Photo', phone: '0905234567' },
  { id: '3', name: 'Thanh Hà', role: 'Quay phim', phone: '0905345678' },
  { id: '4', name: 'Linh Trần', role: 'Makeup', phone: '0905456789' },
  { id: '5', name: 'Hương Trà', role: 'Làm tóc', phone: '0905567890' }
];

const PACKAGES = ['Tiệc báo hỷ', 'Đính hôn', 'Thành hôn', 'Tiệc thân mật', 'Prewedding', 'Photoshoot', 'Makeup', 'Freelance'];

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
    assignedStaff: {
      crewList: [
        { id: 'c-1', name: 'Hoàng Nam', role: 'Photo', pay: 1500000 },
        { id: 'c-2', name: 'Thanh Hà', role: 'Quay phim', pay: 2000000 },
        { id: 'c-3', name: 'Linh Trần', role: 'Makeup', pay: 1200000 }
      ]
    },
    totalAmount: 25000000,
    depositAmount: 10000000,
    status: 'Đã cọc',
    expenses: [
      { id: 'ex-1', title: 'Thuê xe đi lại', amount: 800000 }
    ],
    notes: 'Yêu cầu tông màu ấm nhẹ nhàng.'
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
    assignedStaff: {
      crewList: [
        { id: 'c-4', name: 'Đức Anh', role: 'Photo', pay: 1800000 },
        { id: 'c-5', name: 'Hương Trà', role: 'Làm tóc', pay: 1000000 }
      ]
    },
    totalAmount: 18000000,
    depositAmount: 18000000,
    status: 'Hoàn tất',
    expenses: [],
    notes: 'Chụp phong cách vintage.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [shows, setShows] = useState(INITIAL_SHOWS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '12:00',
    packageType: 'Thành hôn',
    location: '',
    totalAmount: '',
    depositAmount: '',
    status: 'Chờ cọc',
    notes: '',
    crewList: [],
    expenses: []
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0).replace('₫', 'đ');
  };

  const filteredShows = useMemo(() => {
    return shows.filter((s) => {
      const matchSearch = s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.clientPhone.includes(searchQuery) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const showDate = new Date(s.date);
      const matchMonth = (showDate.getMonth() + 1) === selectedMonth && showDate.getFullYear() === selectedYear;

      return matchSearch && (activeTab === 'shows' ? true : matchMonth);
    });
  }, [shows, searchQuery, selectedMonth, selectedYear, activeTab]);

  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalCollected = 0;
    let totalPayroll = 0;
    let totalExpenses = 0;

    shows.forEach((s) => {
      const showDate = new Date(s.date);
      if ((showDate.getMonth() + 1) === selectedMonth && showDate.getFullYear() === selectedYear) {
        totalRevenue += Number(s.totalAmount || 0);
        totalCollected += Number(s.depositAmount || 0);

        if (s.assignedStaff?.crewList) {
          s.assignedStaff.crewList.forEach((c) => totalPayroll += Number(c.pay || 0));
        }

        if (s.expenses) {
          s.expenses.forEach((e) => totalExpenses += Number(e.amount || 0));
        }
      }
    });

    const netProfit = totalRevenue - totalPayroll - totalExpenses;

    return { totalRevenue, totalCollected, totalPayroll, totalExpenses, netProfit };
  }, [shows, selectedMonth, selectedYear]);

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

  const handleOpenAddShow = () => {
    setEditingShow(null);
    setFormData({
      clientName: '',
      clientPhone: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '12:00',
      packageType: 'Thành hôn',
      location: '',
      totalAmount: '',
      depositAmount: '',
      status: 'Chờ cọc',
      notes: '',
      crewList: [],
      expenses: []
    });
    setIsShowModalOpen(true);
  };

  const handleOpenEditShow = (show) => {
    setEditingShow(show);
    setFormData({
      ...show,
      crewList: show.assignedStaff?.crewList || [],
      expenses: show.expenses || []
    });
    setIsShowModalOpen(true);
  };

  const handleSaveShow = (e) => {
    e.preventDefault();
    const newShowObj = {
      id: editingShow ? editingShow.id : `show-${Date.now()}`,
      ...formData,
      totalAmount: Number(formData.totalAmount),
      depositAmount: Number(formData.depositAmount),
      assignedStaff: { crewList: formData.crewList }
    };

    if (editingShow) {
      setShows(shows.map(s => s.id === editingShow.id ? newShowObj : s));
    } else {
      setShows([newShowObj, ...shows]);
    }
    setIsShowModalOpen(false);
  };

  const handleDeleteShow = (id) => {
    setShows(shows.filter(s => s.id !== id));
  };

  const addCrewMember = () => {
    setFormData({
      ...formData,
      crewList: [...formData.crewList, { id: `c-${Date.now()}`, name: staff[0]?.name || '', role: 'Photo', pay: 1000000 }]
    });
  };

  const removeCrewMember = (index) => {
    const updated = [...formData.crewList];
    updated.splice(index, 1);
    setFormData({ ...formData, crewList: updated });
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#f3ece4] font-sans pb-12">
      <header className="bg-[#1b1815] border-b border-[#2c251e] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#26211c] p-2 rounded-xl border border-[#3c342c]">
              <Icons.Camera className="w-6 h-6 text-[#86efac]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#f9f6f0]">OUR JUNE STUDIO</h1>
              <p className="text-[11px] text-[#a3978b]">Hệ Thống Quản Lý Lịch Chụp & Doanh Thu Pro</p>
            </div>
          </div>

          <nav className="flex bg-[#141210] p-1 rounded-xl border border-[#2c251e] text-xs font-medium">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'calendar' ? 'bg-[#26211c] text-[#f9f6f0] border border-[#3c342c] font-bold' : 'text-[#a3978b] hover:text-[#f3ece4]'
              }`}
            >
              <Icons.Calendar className="w-4 h-4 text-[#c9bbaE]" /> Lịch Chụp
            </button>
            <button
              onClick={() => setActiveTab('shows')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'shows' ? 'bg-[#26211c] text-[#f9f6f0] border border-[#3c342c] font-bold' : 'text-[#a3978b] hover:text-[#f3ece4]'
              }`}
            >
              <Icons.Camera className="w-4 h-4 text-[#c9bbaE]" /> Danh Sách Show ({shows.length})
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'finance' ? 'bg-[#26211c] text-[#f9f6f0] border border-[#3c342c] font-bold' : 'text-[#a3978b] hover:text-[#f3ece4]'
              }`}
            >
              <Icons.TrendingUp className="w-4 h-4 text-[#c9bbaE]" /> Doanh Thu
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'staff' ? 'bg-[#26211c] text-[#f9f6f0] border border-[#3c342c] font-bold' : 'text-[#a3978b] hover:text-[#f3ece4]'
              }`}
            >
              <Icons.Users className="w-4 h-4 text-[#c9bbaE]" /> Ekip ({staff.length})
            </button>
          </nav>

          <button
            onClick={handleOpenAddShow}
            className="bg-[#26211c] hover:bg-[#332b24] text-[#f9f6f0] border border-[#3c342c] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
          >
            <Icons.Plus className="w-4 h-4 text-[#86efac]" /> + Thêm Show Mới
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        <div className="bg-[#1b1815] p-4 rounded-2xl border border-[#2c251e] flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#a3978b] font-semibold">Chọn Tháng:</span>
            <div className="flex items-center bg-[#141210] border border-[#2c251e] rounded-xl p-1 text-xs">
              <button
                onClick={() => {
                  if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(selectedYear - 1); }
                  else { setSelectedMonth(selectedMonth - 1); }
                }}
                className="p-1.5 hover:bg-[#26211c] rounded-lg transition"
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-[#f9f6f0]">Tháng {selectedMonth} / {selectedYear}</span>
              <button
                onClick={() => {
                  if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(selectedYear + 1); }
                  else { setSelectedMonth(selectedMonth + 1); }
                }}
                className="p-1.5 hover:bg-[#26211c] rounded-lg transition"
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Icons.Search className="w-4 h-4 absolute left-3 top-2.5 text-[#a3978b]" />
            <input
              type="text"
              placeholder="Tìm khách hàng, sđt, địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141210] border border-[#2c251e] rounded-xl pl-9 pr-3 py-2 text-xs text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1b1815] p-4 rounded-2xl border border-[#2c251e] space-y-1 shadow-md">
            <span className="text-[11px] text-[#a3978b] font-semibold flex items-center gap-1.5">
              <Icons.DollarSign className="w-3.5 h-3.5 text-[#86efac]" /> Tổng Doanh Thu Show
            </span>
            <p className="text-lg font-bold text-[#f9f6f0]">{formatCurrency(metrics.totalRevenue)}</p>
          </div>

          <div className="bg-[#1b1815] p-4 rounded-2xl border border-[#2c251e] space-y-1 shadow-md">
            <span className="text-[11px] text-[#a3978b] font-semibold flex items-center gap-1.5">
              <Icons.TrendingUp className="w-3.5 h-3.5 text-[#60a5fa]" /> Thực Thu (Đã Cọc)
            </span>
            <p className="text-lg font-bold text-[#60a5fa]">{formatCurrency(metrics.totalCollected)}</p>
          </div>

          <div className="bg-[#1b1815] p-4 rounded-2xl border border-[#2c251e] space-y-1 shadow-md">
            <span className="text-[11px] text-[#a3978b] font-semibold flex items-center gap-1.5">
              <Icons.Users className="w-3.5 h-3.5 text-[#f87171]" /> Lương Ekip / NNC
            </span>
            <p className="text-lg font-bold text-[#f87171]">{formatCurrency(metrics.totalPayroll)}</p>
          </div>

          <div className="bg-[#1b1815] p-4 rounded-2xl border border-[#2c251e] space-y-1 shadow-md">
            <span className="text-[11px] text-[#a3978b] font-semibold flex items-center gap-1.5">
              <Icons.DollarSign className="w-3.5 h-3.5 text-[#facc15]" /> Lợi Nhuận Ròng
            </span>
            <p className="text-lg font-bold text-[#86efac]">{formatCurrency(metrics.netProfit)}</p>
          </div>
        </div>

        {activeTab === 'calendar' && (
          <div className="bg-[#1b1815] p-5 rounded-2xl border border-[#2c251e] shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
              <h2 className="text-base font-bold text-[#f9f6f0]">Lịch Chụp Tháng {selectedMonth}/{selectedYear}</h2>
              <span className="text-xs text-[#a3978b]">Bấm vào ngày bất kỳ để xem lịch chi tiết</span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs text-[#a3978b] pb-1">
              <div>Thứ 2</div><div>Thứ 3</div><div>Thứ 4</div><div>Thứ 5</div><div>Thứ 6</div><div>Thứ 7</div><div>Chủ Nhật</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, idx) => (
                <div
                  key={idx}
                  onClick={() => cell.dateStr && setSelectedCalendarDay(cell)}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
                    cell.isCurrentMonth
                      ? cell.shows.length > 0
                        ? 'bg-[#24201c] border-[#3c342c] hover:border-[#86efac]'
                        : 'bg-[#181512] border-[#25201a] hover:border-[#3c342c]'
                      : 'bg-transparent border-transparent opacity-20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#f3ece4]">{cell.dayNum}</span>
                    {cell.shows.length > 0 && (
                      <span className="bg-[#26211c] text-[#86efac] text-[10px] px-1.5 py-0.5 rounded font-bold border border-[#2e4d38]">
                        {cell.shows.length} show
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cell.shows.map((s) => (
                      <div key={s.id} className="bg-[#33463a] text-[#f9f6f0] p-1 rounded text-[10px] font-semibold truncate border border-[#2e4d38]">
                        {s.clientName}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shows' && (
          <div className="space-y-4">
            {filteredShows.length === 0 ? (
              <div className="bg-[#1b1815] p-8 rounded-2xl border border-[#2c251e] text-center text-[#a3978b] text-xs">
                Không tìm thấy show chụp nào phù hợp.
              </div>
            ) : (
              filteredShows.map((show) => (
                <div key={show.id} className="bg-[#1b1815] p-5 rounded-2xl border border-[#2c251e] shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#2c251e] pb-3">
                    <div>
                      <span className="text-xs font-bold text-[#a3978b] uppercase tracking-wider">{show.packageType}</span>
                      <h3 className="text-base font-bold text-[#f9f6f0]">{show.clientName} - <span className="text-xs font-normal text-[#a3978b]">{show.clientPhone}</span></h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        show.status === 'Hoàn tất' ? 'bg-[#1c2e24] text-[#86efac] border-[#2e4d38]' : 'bg-[#2a241b] text-[#facc15] border-[#4d3e23]'
                      }`}>
                        ● {show.status}
                      </span>
                      <button onClick={() => handleOpenEditShow(show)} className="p-1.5 bg-[#26211c] border border-[#3c342c] rounded-lg text-[#a3978b] hover:text-[#f3ece4]">
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteShow(show.id)} className="p-1.5 bg-[#26211c] border border-[#3c342c] rounded-lg text-[#f87171] hover:bg-[#3d2424]">
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#a3978b]">
                    <div>
                      <p>📅 Ngày chụp: <span className="font-bold text-[#f3ece4]">{show.date}</span> ({show.startTime} - {show.endTime})</p>
                      <p>📍 Địa điểm: <span className="font-bold text-[#f3ece4]">{show.location}</span></p>
                    </div>

                    <div>
                      <p>💰 Tổng hợp đồng: <span className="font-bold text-[#f9f6f0]">{formatCurrency(show.totalAmount)}</span></p>
                      <p>💳 Đã đặt cọc: <span className="font-bold text-[#60a5fa]">{formatCurrency(show.depositAmount)}</span></p>
                    </div>

                    <div>
                      <p className="font-bold text-[#f3ece4] mb-1">👥 Ekip Phụ Trách ({show.assignedStaff?.crewList?.length || 0}):</p>
                      <div className="flex flex-wrap gap-1">
                        {show.assignedStaff?.crewList?.map((c, i) => (
                          <span key={i} className="bg-[#24201c] px-2 py-0.5 rounded text-[10px] text-[#f3ece4] border border-[#3c342c]">
                            {c.name} ({c.role})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-[#1b1815] p-6 rounded-2xl border border-[#2c251e] space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-[#f9f6f0]">Báo Cáo Tài Chính Chi Tiết Tháng {selectedMonth}/{selectedYear}</h2>
            <div className="space-y-3">
              {filteredShows.map((show) => (
                <div key={show.id} className="bg-[#141210] p-4 rounded-xl border border-[#2c251e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-[#f9f6f0]">{show.clientName} ({show.packageType})</p>
                    <p className="text-[#a3978b]">{show.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#86efac]">+ {formatCurrency(show.totalAmount)}</p>
                    <p className="text-[10px] text-[#a3978b]">Cọc: {formatCurrency(show.depositAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-[#1b1815] p-6 rounded-2xl border border-[#2c251e] space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
              <h2 className="text-base font-bold text-[#f9f6f0]">Danh Sách Ekip & Nhân Sự Studio</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {staff.map((s) => (
                <div key={s.id} className="bg-[#141210] p-4 rounded-xl border border-[#2c251e] space-y-1">
                  <p className="font-bold text-sm text-[#f9f6f0]">{s.name}</p>
                  <p className="text-xs text-[#a3978b]">Chức danh: <span className="text-[#86efac] font-semibold">{s.role}</span></p>
                  <p className="text-xs text-[#a3978b]">SĐT: {s.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isShowModalOpen && (
        <div className="fixed inset-0 bg-[#141210]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#1b1815] p-6 rounded-2xl border border-[#3c342c] w-full max-w-2xl space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
              <h3 className="font-bold text-base text-[#f9f6f0]">
                {editingShow ? 'Chỉnh Sửa Thông Tin Show' : 'Thêm Show Chụp Mới'}
              </h3>
              <button onClick={() => setIsShowModalOpen(false)} className="text-[#a3978b] hover:text-[#f3ece4]">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShow} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Tên Khách Hàng / Cô Dâu Chú Rể</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Ngày Chụp</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Giờ Bắt Đầu</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Gói Dịch Vụ</label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  >
                    {PACKAGES.map((pkg) => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a3978b] mb-1 font-semibold">Địa Điểm Chụp</label>
                <input
                  type="text"
                  placeholder="Ví dụ: InterContinental Danang..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Tổng Hợp Đồng (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Đã Cọc (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a3978b] mb-1 font-semibold">Trạng Thái Show</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#141210] border border-[#2c251e] rounded-xl p-2.5 text-[#f3ece4] focus:outline-none focus:border-[#3c342c]"
                  >
                    <option value="Chờ cọc">Chờ cọc</option>
                    <option value="Đã cọc">Đã cọc</option>
                    <option value="Hoàn tất">Hoàn tất</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#2c251e] pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#f9f6f0]">Phân Công Ekip Thực Hiện</span>
                  <button type="button" onClick={addCrewMember} className="text-[#86efac] font-bold text-[11px] hover:underline">
                    + Thêm Nhân Sự
                  </button>
                </div>
                {formData.crewList.map((crew, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={crew.name}
                      onChange={(e) => {
                        const updated = [...formData.crewList];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, crewList: updated });
                      }}
                      className="flex-1 bg-[#141210] border border-[#2c251e] rounded-xl p-2 text-[#f3ece4]"
                    >
                      {staff.map((s) => (
                        <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Lương/Công"
                      value={crew.pay}
                      onChange={(e) => {
                        const updated = [...formData.crewList];
                        updated[idx].pay = Number(e.target.value);
                        setFormData({ ...formData, crewList: updated });
                      }}
                      className="w-28 bg-[#141210] border border-[#2c251e] rounded-xl p-2 text-[#f3ece4]"
                    />
                    <button type="button" onClick={() => removeCrewMember(idx)} className="text-[#f87171] p-1">
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 border-t border-[#2c251e] pt-3">
                <button
                  type="button"
                  onClick={() => setIsShowModalOpen(false)}
                  className="px-4 py-2 bg-[#24201c] text-[#a3978b] rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#26211c] text-[#f9f6f0] border border-[#3c342c] rounded-xl font-bold shadow-md hover:bg-[#332b24]"
                >
                  Lưu Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <div className="flex justify-between font-bold text-[#f9f6f0]">
                    <span>{s.clientName}</span>
                    <span className="text-[#86efac]">{s.packageType}</span>
                  </div>
                  <p className="text-[#a3978b]">⏰ {s.startTime} - {s.endTime}</p>
                  <p className="text-[#a3978b]">📍 {s.location}</p>
                  <p className="text-[#86efac] font-bold pt-1">Tổng tiền: {formatCurrency(s.totalAmount)}</p>
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
