import React, { useState, useMemo, useEffect } from 'react';

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
  Clock: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        { id: 'c-2', name: 'Thanh Hà', role: 'Video', pay: 2000000 },
        { id: 'c-3', name: 'Linh Trần', role: 'Makeup', pay: 1200000 }
      ]
    },
    totalAmount: 25000000,
    depositAmount: 10000000,
    status: 'Đã cọc',
    expenses: [
      { id: 'exp-1', title: 'Thuê xe di chuyển', amount: 800000 }
    ],
    notes: 'Yêu cầu tông màu ấm nhẹ nhàng.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [shows, setShows] = useState(INITIAL_SHOWS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: 'client', show: null });

  const [showFormData, setShowFormData] = useState({
    clientName: '', clientPhone: '', date: '', startTime: '', endTime: '',
    packageType: 'Thành hôn', location: '', assignedStaff: { crewList: [] },
    totalAmount: 0, depositAmount: 0, status: 'Chưa cọc', expenses: [], notes: ''
  });

  const [staffFormData, setStaffFormData] = useState({ name: '', role: 'Photo', phone: '' });
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const getNormalizeCrewList = (assignedStaff) => {
    if (!assignedStaff) return [];
    if (assignedStaff.crewList && Array.isArray(assignedStaff.crewList)) return assignedStaff.crewList;
    return [];
  };

  const calculateShowStaffPay = (assignedStaff) => {
    const crewList = getNormalizeCrewList(assignedStaff);
    return crewList.reduce((sum, item) => sum + Number(item.pay || 0), 0);
  };

  const calculateShowTotalExpenses = (show) => {
    const staffPay = calculateShowStaffPay(show.assignedStaff);
    const otherExpenses = (show.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return staffPay + otherExpenses;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0).replace('₫', 'đ');
  };

  const formatCurrencyCompact = (val) => {
    if (!val) return '0 đ';
    if (val >= 1000000) {
      const formatted = (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1);
      return `${formatted} tr`;
    }
    return formatCurrency(val);
  };

  const currentMonthShows = useMemo(() => {
    return shows.filter((show) => {
      if (!show.date) return false;
      const d = new Date(show.date);
      const matchMonth = (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
      const matchSearch = show.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          show.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          show.packageType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || show.status === statusFilter;
      return matchMonth && matchSearch && matchStatus;
    });
  }, [shows, selectedMonth, selectedYear, searchTerm, statusFilter]);

  const monthStats = useMemo(() => {
    let totalRevenue = 0;
    let totalDeposit = 0;
    let totalExpenses = 0;
    let completedShowsCount = 0;

    currentMonthShows.forEach((show) => {
      totalRevenue += Number(show.totalAmount || 0);
      totalDeposit += Number(show.depositAmount || 0);
      totalExpenses += calculateShowTotalExpenses(show);
      if (show.status === 'Đã thanh toán') completedShowsCount++;
    });

    const netProfit = totalRevenue - totalExpenses;
    const remainingToCollect = totalRevenue - totalDeposit;

    return { totalRevenue, totalDeposit, remainingToCollect, totalExpenses, netProfit, count: currentMonthShows.length, completedShowsCount };
  }, [currentMonthShows]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysArr = [];
    const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      if (i < startDayOfWeek) {
        const prevMonthLastDay = new Date(selectedYear, selectedMonth - 1, 0).getDate();
        const prevDayNum = prevMonthLastDay - (startDayOfWeek - i - 1);
        const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
        const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
        const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => s.date === dateStr);
        daysArr.push({ dayNum: prevDayNum, dateStr, isCurrentMonth: false, shows: dayShows });
      } else if (i >= startDayOfWeek + daysInMonth) {
        const nextDayNum = i - (startDayOfWeek + daysInMonth) + 1;
        const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
        const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
        const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => s.date === dateStr);
        daysArr.push({ dayNum: nextDayNum, dateStr, isCurrentMonth: false, shows: dayShows });
      } else {
        const dayNum = i - startDayOfWeek + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => s.date === dateStr);
        daysArr.push({ dayNum, dateStr, isCurrentMonth: true, shows: dayShows });
      }
    }
    return daysArr;
  }, [selectedMonth, selectedYear, shows]);

  const handleOpenShowModal = (showToEdit = null, defaultDate = null) => {
    if (showToEdit) {
      setEditingShow(showToEdit);
      setShowFormData({
        clientName: showToEdit.clientName || '',
        clientPhone: showToEdit.clientPhone || '',
        date: showToEdit.date || '',
        startTime: showToEdit.startTime || '',
        endTime: showToEdit.endTime || '',
        packageType: showToEdit.packageType || '',
        location: showToEdit.location || '',
        assignedStaff: { crewList: getNormalizeCrewList(showToEdit.assignedStaff) },
        totalAmount: showToEdit.totalAmount || 0,
        depositAmount: showToEdit.depositAmount || 0,
        status: showToEdit.status || 'Chưa cọc',
        expenses: showToEdit.expenses || [],
        notes: showToEdit.notes || ''
      });
    } else {
      setEditingShow(null);
      setShowFormData({
        clientName: '', clientPhone: '', date: defaultDate || new Date().toISOString().split('T')[0],
        startTime: '08:00', endTime: '12:00', packageType: 'Thành hôn', location: '',
        assignedStaff: { crewList: [] }, totalAmount: 0, depositAmount: 0, status: 'Chưa cọc', expenses: [], notes: ''
      });
    }
    setIsShowModalOpen(true);
  };

  const handleSaveShow = (e) => {
    e.preventDefault();
    if (editingShow) {
      setShows(shows.map((s) => s.id === editingShow.id ? { ...showFormData, id: editingShow.id } : s));
    } else {
      setShows([{ ...showFormData, id: 'show-' + Date.now() }, ...shows]);
    }
    setIsShowModalOpen(false);
  };

  const handleDeleteShow = (id) => {
    setShows(shows.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#f3ece4] font-sans pb-20">
      <header className="bg-[#1b1815] border-b border-[#2c251e] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#f9f6f0]">OUR JUNE</span>
            <span className="text-[10px] bg-[#26211c] text-[#c9bbaE] font-semibold px-2 py-0.5 rounded-md border border-[#3c342c]">STUDIO</span>
          </div>
          <nav className="flex items-center bg-[#141210] p-1 rounded-xl text-xs font-medium border border-[#2c251e]">
            <button onClick={() => setActiveTab('calendar')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${activeTab === 'calendar' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b]'}`}>
              <Icons.Calendar className="w-3.5 h-3.5" /> Calendar
            </button>
            <button onClick={() => setActiveTab('list')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${activeTab === 'list' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b]'}`}>
              <Icons.Camera className="w-3.5 h-3.5" /> Danh Sách
            </button>
            <button onClick={() => setActiveTab('staff')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${activeTab === 'staff' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b]'}`}>
              <Icons.Users className="w-3.5 h-3.5" /> Ekip
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-4 space-y-4">
        <div className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#a3978b]">THỜI GIAN:</span>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-[#24201c] border border-[#3c342c] rounded-lg px-2.5 py-1.5 font-semibold text-[#f3ece4]">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (<option key={m} value={m}>Tháng {m}</option>))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-[#24201c] border border-[#3c342c] rounded-lg px-2.5 py-1.5 font-semibold text-[#f3ece4]">
              {Array.from({ length: 10 }, (_, i) => 2024 + i).map((y) => (<option key={y} value={y}>Năm {y}</option>))}
            </select>
          </div>
          <button onClick={() => handleOpenShowModal()} className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#332b24]">
            <Icons.Plus className="w-4 h-4 text-[#c9bbaE]" /> Tạo Lịch Chụp Mới
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] space-y-1">
            <span className="text-[11px] font-semibold text-[#a3978b]">TỔNG SHOW T{selectedMonth}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#f9f6f0]">{monthStats.count}</span>
              <span className="text-[10px] font-semibold bg-[#26211c] text-[#86efac] px-1.5 py-0.5 rounded border border-[#2e4d38]">{monthStats.completedShowsCount} xong</span>
            </div>
          </div>
          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] space-y-1">
            <span className="text-[11px] font-semibold text-[#a3978b]">DOANH THU HĐ</span>
            <span className="text-lg font-bold text-[#f9f6f0] block">{formatCurrencyCompact(monthStats.totalRevenue)}</span>
          </div>
          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] space-y-1">
            <span className="text-[11px] font-semibold text-rose-300">CHI PHÍ SHOW</span>
            <span className="text-lg font-bold text-rose-300 block">{formatCurrencyCompact(monthStats.totalExpenses)}</span>
          </div>
          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] space-y-1">
            <span className="text-[11px] font-semibold text-[#86efac]">LỢI NHUẬN RÒNG</span>
            <span className="text-lg font-bold text-[#86efac] block">{formatCurrencyCompact(monthStats.netProfit)}</span>
          </div>
        </div>

        {activeTab === 'calendar' && (
          <div className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <button onClick={() => { if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(selectedYear - 1); } else { setSelectedMonth(selectedMonth - 1); } }} className="p-1 rounded hover:bg-[#26211c] text-[#c9bbaE]">
                  <Icons.ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-bold text-[#f9f6f0]">Tháng {selectedMonth} / {selectedYear}</h2>
                <button onClick={() => { if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(selectedYear + 1); } else { setSelectedMonth(selectedMonth + 1); } }} className="p-1 rounded hover:bg-[#26211c] text-[#c9bbaE]">
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#a3978b]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#703f47]"></span> Makeup</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#33463a]"></span> Show Chụp Hình</span>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-[#2c251e] text-center pb-2 text-xs font-semibold text-[#a3978b]">
              <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
            </div>

            <div className="grid grid-cols-7 border-l border-t border-[#2c251e]">
              {calendarDays.map((cell, idx) => (
                <div key={idx} onClick={() => cell.dateStr && setSelectedCalendarDay(cell)} className={`min-h-[100px] p-1 border-r border-b border-[#2c251e] flex flex-col justify-start cursor-pointer hover:bg-[#26211c]/50 ${cell.isCurrentMonth ? 'bg-[#1b1815]' : 'bg-[#141210]/40'}`}>
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${cell.isCurrentMonth ? 'text-[#f3ece4]' : 'text-[#6b625b]'}`}>{cell.dayNum}</span>
                  <div className="space-y-1">
                    {cell.shows.map((show) => {
                      const isMakeup = show.packageType === 'Makeup';
                      return (
                        <div key={show.id} className={`px-1.5 py-1 rounded text-[10px] ${isMakeup ? 'bg-[#703f47] text-[#f9f6f0]' : 'bg-[#33463a] text-[#f9f6f0]'}`}>
                          <div className="font-bold uppercase">{show.packageType}</div>
                          <div>{show.clientName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-3">
            {currentMonthShows.map((show) => (
              <div key={show.id} className="bg-[#1b1815] p-4 rounded-xl border border-[#2c251e] space-y-2">
                <div className="flex justify-between items-center border-b border-[#2c251e] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs bg-[#24201c] border border-[#3c342c] text-[#f9f6f0] px-2 py-0.5 rounded">{show.packageType}</span>
                    <h3 className="font-bold text-sm text-[#f9f6f0]">{show.clientName}</h3>
                  </div>
                  <button onClick={() => handleDeleteShow(show.id)} className="text-rose-300 text-xs">Xóa</button>
                </div>
                <div className="text-xs text-[#a3978b] flex justify-between">
                  <span>📅 {show.date} | 📍 {show.location || 'Chưa cập nhật'}</span>
                  <span className="font-bold text-[#86efac]">{formatCurrency(show.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-[#1b1815] p-4 rounded-xl border border-[#2c251e] space-y-3">
            <h2 className="text-sm font-bold text-[#f9f6f0]">Danh Sách Nhân Sự Ekip</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {staffList.map((st) => (
                <div key={st.id} className="bg-[#24201c] p-3 rounded-lg border border-[#3c342c] text-xs space-y-1">
                  <p className="font-bold text-[#f9f6f0]">{st.name}</p>
                  <p className="text-[#a3978b]">Chức danh: {st.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {isShowModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141210]/85 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#1b1815] rounded-2xl border border-[#2c251e] w-full max-w-md p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-2">
              <h3 className="font-bold text-sm text-[#f9f6f0]">Tạo Lịch Chụp Mới</h3>
              <button onClick={() => setIsShowModalOpen(false)}><Icons.X className="w-4 h-4 text-[#a3978b]" /></button>
            </div>
            <form onSubmit={handleSaveShow} className="space-y-3">
              <div>
                <label className="block text-[#c9bbaE] mb-1">Tên Khách Hàng</label>
                <input type="text" required value={showFormData.clientName} onChange={(e) => setShowFormData({ ...showFormData, clientName: e.target.value })} className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded text-[#f9f6f0]" />
              </div>
              <div>
                <label className="block text-[#c9bbaE] mb-1">Ngày Chụp</label>
                <input type="date" required value={showFormData.date} onChange={(e) => setShowFormData({ ...showFormData, date: e.target.value })} className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded text-[#f9f6f0]" />
              </div>
              <div>
                <label className="block text-[#c9bbaE] mb-1">Gói Dịch Vụ</label>
                <select value={showFormData.packageType} onChange={(e) => setShowFormData({ ...showFormData, packageType: e.target.value })} className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded text-[#f9f6f0]">
                  {PACKAGES.map((pkg) => (<option key={pkg} value={pkg}>{pkg}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[#c9bbaE] mb-1">Giá Hợp Đồng (VNĐ)</label>
                <input type="number" value={showFormData.totalAmount} onChange={(e) => setShowFormData({ ...showFormData, totalAmount: Number(e.target.value) })} className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded text-[#f9f6f0]" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#2c251e]">
                <button type="button" onClick={() => setIsShowModalOpen(false)} className="px-3 py-1 border border-[#3c342c] rounded text-[#c9bbaE]">Hủy</button>
                <button type="submit" className="px-3 py-1 bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] rounded font-bold">Lưu Show</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
