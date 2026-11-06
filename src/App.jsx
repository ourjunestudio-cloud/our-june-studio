import React, { useState, useEffect, useMemo } from 'react';

// Inline SVG Icon components to guarantee 100% reliability on mobile without missing imports
const Icons = {
Calendar: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Users: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
DollarSign: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
TrendingUp: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Plus: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Edit: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Trash2: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
ChevronLeft: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
ChevronRight: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Download: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Upload: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Search: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Clock: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
X: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">


),
Camera: (props) => (
<svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">



)
};

const INITIAL_STAFF = [
{ id: '1', name: 'Hoàng Nam', role: 'Photo', phone: '0905123456' },
{ id: '2', name: 'Đức Anh', role: 'Photo', phone: '0905234567' },
{ id: '3', name: 'Thanh Hà', role: 'Quay phim', phone: '0905345678' },
{ id: '4', name: 'Linh Trần', role: 'Makeup', phone: '0905456789' },
{ id: '5', name: 'Hương Trà', role: 'Làm tóc', phone: '0905567890' }
];

const PACKAGES = [
'Tiệc báo hỷ',
'Đính hôn',
'Thành hôn',
'Tiệc thân mật',
'Prewedding',
'Photoshoot',
'Makeup',
'Freelance'
];

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
{ id: 'c-3', name: 'Linh Trần', role: 'Makeup', pay: 1200000 },
{ id: 'c-4', name: 'Hương Trà', role: 'Làm tóc', pay: 800000 }
]
},
totalAmount: 25000000,
depositAmount: 10000000,
status: 'Đã cọc',
expenses: [
{ id: 'exp-1', title: 'Thuê xe di chuyển', amount: 800000 },
{ id: 'exp-2', title: 'Mua hoa cầm tay & Props', amount: 500000 }
],
notes: 'Yêu cầu tông màu ấm nhẹ nhàng, bàn giao toàn bộ file gốc trong 2 ngày.'
},
{
id: 'show-2',
clientName: 'Trần Gia Bảo',
clientPhone: '0912333444',
date: '2026-11-20',
startTime: '08:00',
endTime: '12:00',
packageType: 'Prewedding',
location: 'Studio Our June & Phố Cổ Hội An',
assignedStaff: {
crewList: [
{ id: 'c-5', name: 'Đức Anh', role: 'Photo', pay: 2000000 },
{ id: 'c-6', name: 'Linh Trần', role: 'Makeup', pay: 1500000 },
{ id: 'c-7', name: 'Hương Trà', role: 'Làm tóc', pay: 1000000 },
{ id: 'c-8', name: 'Phan Tuấn', role: 'Freelance', pay: 500000 }
]
},
totalAmount: 18000000,
depositAmount: 5000000,
status: 'Đã cọc',
expenses: [
{ id: 'exp-3', title: 'Vé vào cổng Hội An', amount: 300000 }
],
notes: 'Khách yêu cầu chụp phong cách hoài cổ.'
}
];

export default function App() {
const [activeTab, setActiveTab] = useState('calendar');
const [selectedMonth, setSelectedMonth] = useState(11);
const [selectedYear, setSelectedYear] = useState(2026);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('All');

// Persistence logic
const [shows, setShows] = useState(() => {
const saved = localStorage.getItem('ourjune_shows');
return saved ? JSON.parse(saved) : INITIAL_SHOWS;
});

const [staffList, setStaffList] = useState(() => {
const saved = localStorage.getItem('ourjune_staff');
return saved ? JSON.parse(saved) : INITIAL_STAFF;
});

useEffect(() => {
localStorage.setItem('ourjune_shows', JSON.stringify(shows));
}, [shows]);

useEffect(() => {
localStorage.setItem('ourjune_staff', JSON.stringify(staffList));
}, [staffList]);

// Modals state
const [isShowModalOpen, setIsShowModalOpen] = useState(false);
const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
const [editingShow, setEditingShow] = useState(null);
const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
const [expandedAnalyticsMonth, setExpandedAnalyticsMonth] = useState(null);
const [confirmationModal, setConfirmationModal] = useState({
isOpen: false,
type: 'client',
show: null
});

// Form states
const [showFormData, setShowFormData] = useState({
clientName: '',
clientPhone: '',
date: '',
startTime: '',
endTime: '',
packageType: '',
location: '',
assignedStaff: {
crewList: []
},
totalAmount: 0,
depositAmount: 0,
status: 'Chưa cọc',
expenses: [],
notes: ''
});

const [staffFormData, setStaffFormData] = useState({
name: '',
role: 'Photo',
phone: ''
});

const [newExpenseTitle, setNewExpenseTitle] = useState('');
const [newExpenseAmount, setNewExpenseAmount] = useState('');

// Helper calculation functions
const getNormalizeCrewList = (assignedStaff) => {
if (!assignedStaff) return [];
if (assignedStaff.crewList && Array.isArray(assignedStaff.crewList)) {
return assignedStaff.crewList;
}
const legacy = [];
if (assignedStaff.photo) legacy.push({ id: 'p-1', name: assignedStaff.photo, role: 'Photo', pay: Number(assignedStaff.photoPay || 0) });
if (assignedStaff.video) legacy.push({ id: 'v-1', name: assignedStaff.video, role: 'Video', pay: Number(assignedStaff.videoPay || 0) });
if (assignedStaff.makeup) legacy.push({ id: 'm-1', name: assignedStaff.makeup, role: 'Makeup', pay: Number(assignedStaff.makeupPay || 0) });
if (assignedStaff.hair) legacy.push({ id: 'h-1', name: assignedStaff.hair, role: 'Làm tóc', pay: Number(assignedStaff.hairPay || 0) });
(assignedStaff.customCrew || []).forEach((c, idx) => {
legacy.push({ id: cc-${idx}, name: c.name, role: c.role || 'Freelance', pay: Number(c.pay || 0) });
});
return legacy;
};

const calculateShowStaffPay = (assignedStaff) => {
const crewList = getNormalizeCrewList(assignedStaff);
return crewList.reduce((sum, item) => sum + Number(item.pay || 0), 0);
};

const calculateShowTotalExpenses = (show) => {
const staffPay = calculateShowStaffPay(show.assignedStaff);
const otherExpenses = (show.expenses || []).reduce(
(sum, item) => sum + Number(item.amount || 0),
0
);
return staffPay + otherExpenses;
};

const formatCurrency = (val) => {
return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
.format(val || 0)
.replace('₫', 'đ');
};

const formatCurrencyCompact = (val) => {
if (!val) return '0 đ';
if (val >= 1000000) {
const formatted = (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1);
return ${formatted} tr;
}
return formatCurrency(val);
};

// Filtered shows by month/year & search
const currentMonthShows = useMemo(() => {
return shows.filter((show) => {
if (!show.date) return false;
const d = new Date(show.date);
const m = d.getMonth() + 1;
const y = d.getFullYear();
const matchMonth = m === selectedMonth && y === selectedYear;

  const matchSearch =
    show.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.packageType.toLowerCase().includes(searchTerm.toLowerCase());

  const matchStatus = statusFilter === 'All' || show.status === statusFilter;

  return matchMonth && matchSearch && matchStatus;
});


}, [shows, selectedMonth, selectedYear, searchTerm, statusFilter]);

// Financial summary of selected month
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

return {
  totalRevenue,
  totalDeposit,
  remainingToCollect,
  totalExpenses,
  netProfit,
  count: currentMonthShows.length,
  completedShowsCount
};


}, [currentMonthShows]);

// Yearly overview calculation
const yearlyStats = useMemo(() => {
const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
const monthNum = i + 1;
let revenue = 0;
let expenses = 0;
let count = 0;
let makeupRevenue = 0;
let photoRevenue = 0;
const staffEarnings = {};
const staffShowCounts = {};

  shows.forEach((s) => {
    if (!s.date) return;
    const d = new Date(s.date);
    if (d.getFullYear() === selectedYear && d.getMonth() + 1 === monthNum) {
      const totalAmt = Number(s.totalAmount || 0);
      revenue += totalAmt;
      expenses += calculateShowTotalExpenses(s);
      count++;

      if (s.packageType === 'Makeup') {
        makeupRevenue += totalAmt;
      } else {
        photoRevenue += totalAmt;
      }

      const crewList = getNormalizeCrewList(s.assignedStaff);
      crewList.forEach((c) => {
        if (c.name) {
          if (Number(c.pay)) {
            staffEarnings[c.name] = (staffEarnings[c.name] || 0) + Number(c.pay);
          }
          staffShowCounts[c.name] = (staffShowCounts[c.name] || 0) + 1;
        }
      });
    }
  });

  return {
    month: monthNum,
    revenue,
    expenses,
    profit: revenue - expenses,
    count,
    makeupRevenue,
    photoRevenue,
    staffEarnings,
    staffShowCounts
  };
});

return monthlyBreakdown;


}, [shows, selectedYear]);

// Google Calendar View Days Calculation
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
    const dayShows = shows
      .filter((s) => s.date === dateStr)
      .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    daysArr.push({
      dayNum: prevDayNum,
      dateStr,
      isCurrentMonth: false,
      shows: dayShows
    });
  } else if (i >= startDayOfWeek + daysInMonth) {
    const nextDayNum = i - (startDayOfWeek + daysInMonth) + 1;
    const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDayNum).padStart(2, '0')}`;
    const dayShows = shows
      .filter((s) => s.date === dateStr)
      .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    daysArr.push({
      dayNum: nextDayNum,
      dateStr,
      isCurrentMonth: false,
      shows: dayShows
    });
  } else {
    const dayNum = i - startDayOfWeek + 1;
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayShows = shows
      .filter((s) => s.date === dateStr)
      .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    daysArr.push({
      dayNum,
      dateStr,
      isCurrentMonth: true,
      shows: dayShows
    });
  }
}

return daysArr;


}, [selectedMonth, selectedYear, shows]);

const handlePrevMonth = () => {
if (selectedMonth === 1) {
setSelectedMonth(12);
setSelectedYear(selectedYear - 1);
} else {
setSelectedMonth(selectedMonth - 1);
}
};

const handleNextMonth = () => {
if (selectedMonth === 12) {
setSelectedMonth(1);
setSelectedYear(selectedYear + 1);
} else {
setSelectedMonth(selectedMonth + 1);
}
};

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
assignedStaff: {
crewList: getNormalizeCrewList(showToEdit.assignedStaff)
},
totalAmount: showToEdit.totalAmount || 0,
depositAmount: showToEdit.depositAmount || 0,
status: showToEdit.status || 'Chưa cọc',
expenses: showToEdit.expenses || [],
notes: showToEdit.notes || ''
});
} else {
setEditingShow(null);
setShowFormData({
clientName: '',
clientPhone: '',
date: defaultDate || '',
startTime: '',
endTime: '',
packageType: '',
location: '',
assignedStaff: {
crewList: []
},
totalAmount: 0,
depositAmount: 0,
status: 'Chưa cọc',
expenses: [],
notes: ''
});
}
setNewExpenseTitle('');
setNewExpenseAmount('');
setIsShowModalOpen(true);
};

const handleSaveShow = (e) => {
e.preventDefault();
let savedShow;
if (editingShow) {
savedShow = { ...showFormData, id: editingShow.id };
setShows(shows.map((s) => (s.id === editingShow.id ? savedShow : s)));
} else {
savedShow = { ...showFormData, id: 'show-' + Date.now() };
setShows([savedShow, ...shows]);
}
setIsShowModalOpen(false);

const targetDate = savedShow.date;
const updatedShowsList = editingShow 
  ? shows.map(s => s.id === editingShow.id ? savedShow : s)
  : [savedShow, ...shows];

const refreshedDayShows = updatedShowsList
  .filter(s => s.date === targetDate)
  .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

setSelectedCalendarDay({
  dateStr: targetDate,
  shows: refreshedDayShows
});


};

const handleDeleteShow = (id) => {
setShows(shows.filter((s) => s.id !== id));
};

const handleAddExpense = () => {
if (!newExpenseTitle || !newExpenseAmount) return;
const newExp = {
id: 'exp-' + Date.now(),
title: newExpenseTitle,
amount: Number(newExpenseAmount)
};
setShowFormData({
...showFormData,
expenses: [...(showFormData.expenses || []), newExp]
});
setNewExpenseTitle('');
setNewExpenseAmount('');
};

const handleRemoveExpense = (id) => {
setShowFormData({
...showFormData,
expenses: (showFormData.expenses || []).filter((item) => item.id !== id)
});
};

const handleSaveStaff = (e) => {
e.preventDefault();
if (!staffFormData.name) return;
const newSt = { ...staffFormData, id: 'st-' + Date.now() };
setStaffList([...staffList, newSt]);
setStaffFormData({ name: '', role: 'Photo', phone: '' });
setIsStaffModalOpen(false);
};

const handleDeleteStaff = (id) => {
setStaffList(staffList.filter((st) => st.id !== id));
};

const handleExportData = () => {
const dataStr = JSON.stringify({ shows, staffList }, null, 2);
const blob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = OurJune_Studio_Backup_${new Date().toISOString().split('T')[0]}.json;
a.click();
};

const handleImportData = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = (event) => {
try {
const parsed = JSON.parse(event.target.result);
if (parsed.shows && parsed.staffList) {
setShows(parsed.shows);
setStaffList(parsed.staffList);
alert('Nhập dữ liệu thành công!');
}
} catch (err) {
alert('File không hợp lệ.');
}
};
reader.readAsText(file);
};

const renderStatusBadge = (status) => {
switch (status) {
case 'Chưa cọc':
return (

Chưa cọc

);
case 'Đã cọc':
return (

Đã cọc

);
case 'Đã thanh toán':
return (

Đã thanh toán

);
default:
return (

{status}

);
}
};

return (

{/* Top Header */}






OUR JUNE


STUDIO



Timeless Studio


      {/* Navigation Tabs */}
      <nav className="flex items-center justify-start sm:justify-end bg-[#11100f] p-1 rounded-xl text-xs font-medium overflow-x-auto scrollbar-none border border-[#25221e]">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'calendar' ? 'bg-[#1f1d1b] text-[#f4efe9] font-semibold border border-[#36322d]' : 'text-[#918578] hover:text-[#f4efe9]'
          }`}
        >
          <Icons.Calendar className="w-3.5 h-3.5 text-[#b8a99a]" />
          <span>Calendar</span>
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'list' ? 'bg-[#1f1d1b] text-[#f4efe9] font-semibold border border-[#36322d]' : 'text-[#918578] hover:text-[#f4efe9]'
          }`}
        >
          <Icons.Camera className="w-3.5 h-3.5 text-[#b8a99a]" />
          <span>Danh Sách</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'analytics' ? 'bg-[#1f1d1b] text-[#f4efe9] font-semibold border border-[#36322d]' : 'text-[#918578] hover:text-[#f4efe9]'
          }`}
        >
          <Icons.TrendingUp className="w-3.5 h-3.5 text-[#86efac]" />
          <span>Thống Kê</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'staff' ? 'bg-[#1f1d1b] text-[#f4efe9] font-semibold border border-[#36322d]' : 'text-[#918578] hover:text-[#f4efe9]'
          }`}
        >
          <Icons.Users className="w-3.5 h-3.5 text-[#b8a99a]" />
          <span>Ekip</span>
        </button>
      </nav>
    </div>
  </header>

  {/* Main Container */}
  <main className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 space-y-3 overflow-x-hidden">
    {/* Month / Year Bar & Quick Data Actions */}
    <div className="bg-[#171513] rounded-xl border border-[#25221e] p-3 shadow-2xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-[#918578] uppercase tracking-wider shrink-0">Thời gian:</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-[#1f1d1b] border border-[#36322d] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#e8dfd5] focus:outline-none flex-1 sm:flex-initial"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m} className="bg-[#171513] text-[#e8dfd5]">
              Tháng {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#1f1d1b] border border-[#36322d] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#e8dfd5] focus:outline-none flex-1 sm:flex-initial"
        >
          {Array.from({ length: 17 }, (_, i) => 2024 + i).map((y) => (
            <option key={y} value={y} className="bg-[#171513] text-[#e8dfd5]">
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => handleOpenShowModal()}
          className="bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#2b2723] transition"
        >
          <Icons.Plus className="w-4 h-4 text-[#b8a99a]" />
          <span>Tạo Lịch Chụp Mới</span>
        </button>
        <button
          onClick={handleExportData}
          title="Xuất File Sao Lưu"
          className="p-1.5 border border-[#36322d] rounded-lg text-[#b8a99a] hover:bg-[#1f1d1b] transition"
        >
          <Icons.Download className="w-4 h-4" />
        </button>
        <label
          title="Nhập File Dữ Liệu"
          className="p-1.5 border border-[#36322d] rounded-lg text-[#b8a99a] hover:bg-[#1f1d1b] transition cursor-pointer"
        >
          <Icons.Upload className="w-4 h-4" />
          <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
        </label>
      </div>
    </div>

    {/* Financial Metrics Overview */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] shadow-2xs flex flex-col justify-between space-y-1">
        <span className="text-[11px] font-semibold text-[#918578] uppercase tracking-wider">Tổng Show T{selectedMonth}</span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-bold text-[#f4efe9]">{monthStats.count}</span>
          <span className="text-[10px] font-semibold bg-[#1f1d1b] text-[#86efac] px-1.5 py-0.5 rounded border border-[#2e4d38]">
            {monthStats.completedShowsCount} xong
          </span>
        </div>
      </div>

      <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] shadow-2xs flex flex-col justify-between space-y-1">
        <span className="text-[11px] font-semibold text-[#918578] uppercase tracking-wider">Doanh Thu HĐ</span>
        <div>
          <span className="text-base sm:text-xl font-bold text-[#f4efe9] block truncate">
            {formatCurrencyCompact(monthStats.totalRevenue)}
          </span>
          <p className="text-[10px] text-[#918578] font-medium truncate">
            Còn lại: {formatCurrencyCompact(monthStats.remainingToCollect)}
          </p>
        </div>
      </div>

      <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] shadow-2xs flex flex-col justify-between space-y-1">
        <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">Chi Phí Show</span>
        <div>
          <span className="text-base sm:text-xl font-bold text-rose-300 block truncate">
            {formatCurrencyCompact(monthStats.totalExpenses)}
          </span>
          <p className="text-[10px] text-[#918578] font-medium truncate">Lương ekip & phát sinh</p>
        </div>
      </div>

      <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] shadow-2xs flex flex-col justify-between space-y-1">
        <span className="text-[11px] font-semibold text-[#86efac] uppercase tracking-wider">Lợi Nhuận Ròng</span>
        <div>
          <span className="text-base sm:text-xl font-bold text-[#86efac] block truncate">
            {formatCurrencyCompact(monthStats.netProfit)}
          </span>
          <p className="text-[10px] text-[#918578] font-medium truncate">Doanh thu trừ Chi phí</p>
        </div>
      </div>
    </div>

    {/* TAB 1: GOOGLE CALENDAR VIEW */}
    {activeTab === 'calendar' && (
      <div className="bg-[#171513] rounded-xl border border-[#25221e] p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-full hover:bg-[#1f1d1b] text-[#b8a99a] transition"
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-[#f4efe9] min-w-[110px] text-center">
                Tháng {selectedMonth} / {selectedYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-full hover:bg-[#1f1d1b] text-[#b8a99a] transition"
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-normal text-[#918578]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7a4850]"></span> Makeup</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#35473a]"></span> Show Chụp Hình</span>
          </div>
        </div>

        {/* Google Calendar Grid */}
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-7 border-b border-[#25221e] text-center pb-2 min-w-[320px]">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dayName, idx) => (
              <div key={idx} className="text-xs font-semibold text-[#918578]">
                {dayName}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l border-t border-[#25221e] min-w-[320px]">
            {calendarDays.map((cell, idx) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.dateStr) {
                      if (cell.shows.length === 1) {
                        setSelectedCalendarDay({
                          dateStr: cell.dateStr,
                          shows: cell.shows,
                          singleShowMode: true
                        });
                      } else {
                        setSelectedCalendarDay({
                          dateStr: cell.dateStr,
                          shows: cell.shows,
                          singleShowMode: false
                        });
                      }
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[120px] p-1 border-r border-b border-[#25221e] flex flex-col justify-start transition ${
                    cell.isCurrentMonth ? 'bg-[#171513] hover:bg-[#1f1d1b]/60' : 'bg-[#11100f]/40'
                  } cursor-pointer`}
                >
                  <div className="flex justify-center sm:justify-start mb-1">
                    <span
                      className={`w-5 h-5 sm:w-5.5 sm:h-5.5 flex items-center justify-center rounded-full text-[11px] sm:text-xs font-medium ${
                        isToday
                          ? 'bg-[#c4b5a5] text-[#11100f] font-bold shadow-2xs'
                          : cell.isCurrentMonth
                          ? 'text-[#e8dfd5]'
                          : 'text-[#5e554d]'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {cell.shows.map((show) => {
                      const isMakeupOnly = show.packageType === 'Makeup';
                      const bgStyle = isMakeupOnly 
                        ? 'bg-[#61363e] text-[#f4efe9] font-semibold' 
                        : 'bg-[#2b3a30] text-[#f4efe9] font-semibold';

                      return (
                        <div
                          key={show.id}
                          className={`px-1.5 py-1 rounded text-[9px] sm:text-[10px] leading-tight ${bgStyle}`}
                          title={`${show.clientName} (${show.packageType})`}
                        >
                          <div className="font-bold uppercase tracking-tighter opacity-90 break-words">{show.packageType}</div>
                          <div className="font-normal break-words whitespace-normal">{show.clientName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => handleOpenShowModal()}
          className="fixed bottom-6 right-6 z-40 bg-[#1f1d1b] border border-[#36322d] hover:bg-[#2b2723] text-[#f4efe9] p-3.5 rounded-2xl shadow-lg flex items-center justify-center transition-transform active:scale-95"
          title="Tạo lịch chụp mới"
        >
          <Icons.Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    )}

    {/* TAB 2: SHOW LIST VIEW */}
    {activeTab === 'list' && (
      <div className="space-y-3">
        <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] flex flex-col sm:flex-row gap-2 justify-between">
          <div className="relative flex-1">
            <Icons.Search className="w-4 h-4 absolute left-3 top-2.5 text-[#918578]" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách, gói chụp, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full pl-9 pr-3 py-1.5 bg-[#1f1d1b] border border-[#36322d] rounded-lg text-xs font-medium focus:outline-none text-[#e8dfd5]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full sm:w-auto px-2.5 py-1.5 bg-[#1f1d1b] border border-[#36322d] rounded-lg text-xs font-semibold text-[#b8a99a] focus:outline-none"
            >
              <option value="All" className="bg-[#171513] text-[#b8a99a]">Tất cả trạng thái</option>
              <option value="Chưa cọc" className="bg-[#171513] text-[#b8a99a]">Chưa cọc</option>
              <option value="Đã cọc" className="bg-[#171513] text-[#b8a99a]">Đã cọc</option>
              <option value="Đã thanh toán" className="bg-[#171513] text-[#b8a99a]">Đã thanh toán</option>
            </select>
          </div>
        </div>

        {/* List of Show Cards */}
        <div className="space-y-3">
          {currentMonthShows.length === 0 ? (
            <div className="bg-[#171513] p-8 rounded-xl border border-[#25221e] text-center space-y-2">
              <p className="text-[#918578] font-medium text-xs">Chưa có lịch chụp nào trong Tháng {selectedMonth}/{selectedYear}</p>
              <button
                onClick={() => handleOpenShowModal()}
                className="text-xs font-semibold text-[#e8dfd5] hover:underline"
              >
                + Tạo lịch chụp mới ngay
              </button>
            </div>
          ) : (
            currentMonthShows.map((show) => {
              const totalExp = calculateShowTotalExpenses(show);
              const profit = (show.totalAmount || 0) - totalExp;
              const otherExpensesSum = (show.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

              return (
                <div key={show.id} className="bg-[#171513] rounded-xl border border-[#25221e] p-4 shadow-2xs space-y-3 hover:border-[#36322d] transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#25221e] pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] px-2.5 py-0.5 rounded-md">
                        {show.packageType}
                      </span>
                      {renderStatusBadge(show.status)}
                      <span className="text-xs text-[#918578] font-medium">
                        📅 {new Date(show.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenShowModal(show)}
                        className="p-1.5 hover:bg-[#1f1d1b] rounded-lg text-[#b8a99a] text-xs font-medium flex items-center gap-1 border border-[#36322d]"
                      >
                        <Icons.Edit className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteShow(show.id)}
                        type="button"
                        className="p-1.5 hover:bg-[#38201d] rounded-lg text-rose-300 text-xs font-medium border border-[#4a2926] cursor-pointer"
                      >
                        <Icons.Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <h3 className="font-bold text-[#f4efe9] text-base">{show.clientName}</h3>
                      <p className="text-[#918578] font-medium mt-0.5">SĐT: {show.clientPhone || 'Chưa có'}</p>
                      <p className="text-[#b8a99a] font-medium mt-1">📍 {show.location || 'Chưa cập nhật'}</p>
                    </div>

                    {/* Ekip list */}
                    <div className="bg-[#1f1d1b]/60 p-2.5 rounded-lg border border-[#25221e] space-y-1">
                      <span className="font-semibold text-[11px] text-[#918578] uppercase tracking-wider block">Phân công Ekip:</span>
                      <div className="space-y-0.5 text-[#b8a99a]">
                        {getNormalizeCrewList(show.assignedStaff).map((member) => (
                          <div key={member.id} className="flex justify-between">
                            <span>{member.role}: {member.name}</span>
                            <span className="font-semibold text-rose-300">{formatCurrencyCompact(member.pay)}</span>
                          </div>
                        ))}
                        {getNormalizeCrewList(show.assignedStaff).length === 0 && (
                          <span className="text-[#5e554d] italic">Chưa phân công</span>
                        )}
                      </div>
                    </div>

                    {/* Financial summary for single show */}
                    <div className="bg-[#1f1d1b]/60 p-2.5 rounded-lg border border-[#25221e] flex flex-col justify-between space-y-1">
                      <div className="flex justify-between text-[#b8a99a]">
                        <span>Doanh Thu HĐ:</span>
                        <span className="font-bold text-[#f4efe9]">{formatCurrency(show.totalAmount)}</span>
                      </div>
                      {otherExpensesSum > 0 && (
                        <div className="flex justify-between text-[#918578] text-[11px]">
                          <span>Chi phí phát sinh:</span>
                          <span className="font-semibold text-rose-300">-{formatCurrency(otherExpensesSum)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#b8a99a]">
                        <span>Tổng Chi Phí Show:</span>
                        <span className="font-semibold text-rose-300">-{formatCurrency(totalExp)}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#25221e] pt-1 font-semibold">
                        <span className="text-[#f4efe9]">Lợi Nhuận:</span>
                        <span className="text-[#86efac]">{formatCurrency(profit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    )}

    {/* TAB 3: YEARLY ANALYTICS */}
    {activeTab === 'analytics' && (
      <div className="bg-[#171513] rounded-xl border border-[#25221e] p-4 sm:p-6 shadow-2xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#f4efe9]">Thống Kê Tổng Quan Năm {selectedYear}</h2>
          <p className="text-xs text-[#918578] font-medium">
            Bấm vào từng tháng để xem chi tiết Doanh thu Makeup/Chụp & Tổng lương & số show của từng nhân sự
          </p>
        </div>

        <div className="space-y-3">
          {yearlyStats.map((item) => {
            const maxRevenue = Math.max(...yearlyStats.map((m) => m.revenue), 1);
            const revPercent = Math.min((item.revenue / maxRevenue) * 100, 100);
            const isExpanded = expandedAnalyticsMonth === item.month;
            const staffListEntries = Object.entries(item.staffEarnings || {});

            return (
              <div
                key={item.month}
                className={`bg-[#171513] rounded-xl border transition-all ${
                  isExpanded ? 'border-[#36322d] shadow-xs' : 'border-[#25221e] hover:border-[#36322d]'
                }`}
              >
                <div
                  onClick={() => setExpandedAnalyticsMonth(isExpanded ? null : item.month)}
                  className="p-3 sm:p-4 space-y-2 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between text-xs font-bold text-[#f4efe9] gap-1">
                    <div className="flex items-center gap-2">
                      <span>Tháng {item.month} ({item.count} show)</span>
                      <span className="text-[10px] font-semibold text-[#b8a99a] bg-[#1f1d1b] px-2 py-0.5 rounded-full border border-[#36322d]">
                        {isExpanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs font-semibold">
                      <span className="text-[#f4efe9]">Doanh thu: {formatCurrencyCompact(item.revenue)}</span>
                      <span className="text-rose-300">Chi phí: {formatCurrencyCompact(item.expenses)}</span>
                      <span className="text-[#86efac]">Lợi nhuận: {formatCurrencyCompact(item.profit)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#1f1d1b] rounded-full overflow-hidden border border-[#25221e]">
                    <div
                      style={{ width: `${revPercent}%` }}
                      className="h-full bg-[#918578] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Detailed month breakdown */}
                {isExpanded && (
                  <div className="border-t border-[#25221e] p-4 space-y-4 bg-[#1f1d1b]/40 text-xs">
                    {/* Revenue Breakdown */}
                    <div className="space-y-2">
                      <span className="font-bold text-[11px] text-[#918578] uppercase tracking-wider block">
                        Phân Bổ Doanh Thu Tháng {item.month}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#35473a]"></span>
                            <span className="font-bold text-[#b8a99a]">Doanh thu Chụp Hình</span>
                          </div>
                          <span className="font-bold text-[#f4efe9] text-sm">
                            {formatCurrency(item.photoRevenue)}
                          </span>
                        </div>
                        <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e] flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#61363e]"></span>
                            <span className="font-bold text-[#b8a99a]">Doanh thu Makeup</span>
                          </div>
                          <span className="font-bold text-[#f4efe9] text-sm">
                            {formatCurrency(item.makeupRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Crew Salary & Show Counts Breakdown */}
                    <div className="space-y-2">
                      <span className="font-bold text-[11px] text-[#918578] uppercase tracking-wider block">
                        Thống Kê Show & Lương Ekip Trong Tháng
                      </span>
                      {staffListEntries.length === 0 ? (
                        <p className="text-[#5e554d] italic">Không có dữ liệu nhân sự làm việc trong tháng này.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {staffListEntries.map(([name, totalPay]) => {
                            const showCount = item.staffShowCounts[name] || 0;
                            return (
                              <div
                                key={name}
                                className="bg-[#171513] p-2.5 rounded-lg border border-[#25221e] flex flex-col justify-between space-y-1"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-[#b8a99a]">👤 {name}</span>
                                  <span className="text-[10px] font-semibold bg-[#1f1d1b] text-[#b8a99a] px-2 py-0.5 rounded-full border border-[#36322d]">
                                    {showCount} show
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-[#1e1c19]">
                                  <span className="text-[#918578] text-[11px]">Tổng lương:</span>
                                  <span className="font-bold text-rose-300">{formatCurrency(totalPay)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Annual Summary Card at the bottom */}
        {(() => {
          const totalYearRevenue = yearlyStats.reduce((sum, m) => sum + m.revenue, 0);
          const totalYearExpenses = yearlyStats.reduce((sum, m) => sum + m.expenses, 0);
          const totalYearProfit = totalYearRevenue - totalYearExpenses;
          const totalYearShows = yearlyStats.reduce((sum, m) => sum + m.count, 0);

          return (
            <div className="bg-[#1f1d1b]/50 p-5 rounded-2xl border border-[#25221e] shadow-2xs space-y-3 mt-4">
              <div className="flex justify-between items-center border-b border-[#25221e] pb-3">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#918578] block">Tổng Kết Cả Năm {selectedYear}</span>
                  <span className="text-sm font-semibold text-[#b8a99a]">Tổng số lượng show: {totalYearShows} show</span>
                </div>
                <span className="bg-[#1f1d1b] text-[#b8a99a] text-xs font-semibold px-3 py-1 rounded-full border border-[#36322d]">
                  Cả Năm {selectedYear}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e]">
                  <span className="text-[#918578] font-medium block mb-1">Tổng Doanh Thu Năm</span>
                  <span className="text-lg sm:text-xl font-bold text-[#f4efe9]">
                    {formatCurrency(totalYearRevenue)}
                  </span>
                </div>
                <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e]">
                  <span className="text-rose-300 font-medium block mb-1">Tổng Chi Phí Năm</span>
                  <span className="text-lg sm:text-xl font-bold text-rose-300">
                    {formatCurrency(totalYearExpenses)}
                  </span>
                </div>
                <div className="bg-[#171513] p-3 rounded-xl border border-[#25221e]">
                  <span className="text-[#86efac] font-medium block mb-1">Tổng Lợi Nhuận Năm</span>
                  <span className="text-lg sm:text-xl font-bold text-[#86efac]">
                    {formatCurrency(totalYearProfit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    )}

    {/* TAB 4: STAFF MANAGEMENT */}
    {activeTab === 'staff' && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#171513] rounded-xl border border-[#25221e] p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#25221e] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#f4efe9]">Đội Ngũ Nhân Sự</h2>
              <p className="text-xs text-[#918578] font-medium">Photo, Video, Makeup và Hair</p>
            </div>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#2b2723] transition"
            >
              <Icons.Plus className="w-4 h-4 text-[#b8a99a]" /> Thêm Nhân Sự
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staffList.map((st) => (
              <div key={st.id} className="bg-[#1f1d1b]/50 p-3 rounded-lg border border-[#25221e] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-[#f4efe9]">{st.name}</h4>
                  <span className="text-[10px] font-semibold bg-[#1f1d1b] text-[#b8a99a] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#36322d]">
                    {st.role}
                  </span>
                  <p className="text-[11px] text-[#918578] mt-1">SĐT: {st.phone || 'Chưa có'}</p>
                </div>
                <button
                  onClick={() => handleDeleteStaff(st.id)}
                  className="text-[#5e554d] hover:text-rose-300 p-1"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171513] rounded-xl border border-[#25221e] p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs uppercase text-[#918578]">Ghi chú vận hành</h3>
          <p className="text-xs text-[#b8a99a] leading-relaxed">
            Tất cả dữ liệu được lưu trữ trực tiếp trên thiết bị của bạn. Bạn nên thường xuyên sử dụng tính năng **Xuất Dữ Liệu** ở góc trên để lưu file sao lưu dự phòng an toàn.
          </p>
        </div>
      </div>
    )}
  </main>

  {/* MODAL: SHOW FORM */}
  {isShowModalOpen && (
    <div className="fixed inset-0 z-50 bg-[#11100f]/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-[#171513] rounded-2xl border border-[#25221e] shadow-xl w-full max-w-lg my-6 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-3.5 border-b border-[#25221e] flex justify-between items-center bg-[#171513] shrink-0">
          <h3 className="font-bold text-xs text-[#f4efe9]">
            {editingShow ? 'Chỉnh Sửa Lịch Chụp' : 'Tạo Lịch Chụp Mới'}
          </h3>
          <button onClick={() => setIsShowModalOpen(false)} className="text-[#918578] hover:text-[#f4efe9]">
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveShow} autoComplete="off" className="p-3.5 sm:p-4 space-y-2.5 overflow-y-auto flex-1 text-[11px]">
          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Tên Khách Hàng *</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={showFormData.clientName}
                onChange={(e) => setShowFormData({ ...showFormData, clientName: e.target.value })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Số Điện Thoại</label>
              <input
                type="text"
                autoComplete="off"
                value={showFormData.clientPhone}
                onChange={(e) => setShowFormData({ ...showFormData, clientPhone: e.target.value })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Ngày Chụp *</label>
              <input
                type="date"
                required
                value={showFormData.date}
                onChange={(e) => setShowFormData({ ...showFormData, date: e.target.value })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Gói Dịch Vụ</label>
              <select
                value={showFormData.packageType}
                onChange={(e) => setShowFormData({ ...showFormData, packageType: e.target.value })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold text-[#f4efe9] box-border text-[11px] sm:text-[11px] focus:border-[#c4b5a5] focus:outline-none"
              >
                <option value="" className="bg-[#171513] text-[#918578]">-- Chọn Gói Dịch Vụ --</option>
                {PACKAGES.map((pkg) => (
                  <option key={pkg} value={pkg} className="bg-[#171513] text-[#e8dfd5]">{pkg}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#b8a99a]">Giờ Bắt Đầu</label>
                <input
                  type="time"
                  value={showFormData.startTime}
                  onChange={(e) => setShowFormData({ ...showFormData, startTime: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#b8a99a]">Giờ Kết Thúc</label>
                <input
                  type="time"
                  value={showFormData.endTime}
                  onChange={(e) => setShowFormData({ ...showFormData, endTime: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#b8a99a]">Địa Điểm Chụp</label>
            <input
              type="text"
              autoComplete="off"
              value={showFormData.location}
              onChange={(e) => setShowFormData({ ...showFormData, location: e.target.value })}
              style={{ fontSize: '16px' }}
              className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#b8a99a]">Ghi Chú Buổi Chụp</label>
            <textarea
              rows={2}
              autoComplete="off"
              value={showFormData.notes}
              onChange={(e) => setShowFormData({ ...showFormData, notes: e.target.value })}
              style={{ fontSize: '16px' }}
              className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded-lg font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
            />
          </div>

          {/* Ekip Pay */}
          <div className="space-y-2 border-t border-[#25221e] pt-2.5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
              <span className="font-bold text-[10px] text-[#918578] uppercase tracking-wider">
                Phân công Ekip & Tiền công từng nhân sự
              </span>
              <button
                type="button"
                onClick={() => {
                  const currentCrew = showFormData.assignedStaff.crewList || [];
                  setShowFormData({
                    ...showFormData,
                    assignedStaff: {
                      ...showFormData.assignedStaff,
                      crewList: [
                        ...currentCrew,
                        { id: 'c-' + Date.now() + Math.random(), name: '', role: 'Photo', pay: 0 }
                      ]
                    }
                  });
                }}
                className="text-[10px] font-bold text-[#f4efe9] bg-[#1f1d1b] border border-[#52443a] hover:bg-[#2b2723] px-2 py-0.5 rounded transition"
              >
                + Thêm Nhân Sự Vào Show
              </button>
            </div>

            <div className="space-y-1.5">
              {(showFormData.assignedStaff.crewList || []).map((member, idx) => (
                <div key={member.id || idx} className="bg-[#1f1d1b]/40 p-2 rounded-lg border border-[#453931] flex flex-col gap-1.5 box-border">
                  <div className="grid grid-cols-2 gap-1.5">
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const updated = [...showFormData.assignedStaff.crewList];
                        updated[idx].role = e.target.value;
                        setShowFormData({
                          ...showFormData,
                          assignedStaff: { ...showFormData.assignedStaff, crewList: updated }
                        });
                      }}
                      style={{ fontSize: '16px' }}
                      className="w-full px-2 py-1 bg-[#171513] border border-[#52443a] rounded font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
                    >
                      <option value="Photo" className="bg-[#171513] text-[#e8dfd5]">Photo</option>
                      <option value="Video" className="bg-[#171513] text-[#e8dfd5]">Video</option>
                      <option value="Makeup" className="bg-[#171513] text-[#e8dfd5]">Makeup</option>
                      <option value="Làm tóc" className="bg-[#171513] text-[#e8dfd5]">Làm tóc</option>
                      <option value="Freelance" className="bg-[#171513] text-[#e8dfd5]">Freelance</option>
                    </select>

                    <select
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...showFormData.assignedStaff.crewList];
                        updated[idx].name = e.target.value;
                        setShowFormData({
                          ...showFormData,
                          assignedStaff: { ...showFormData.assignedStaff, crewList: updated }
                        });
                      }}
                      style={{ fontSize: '16px' }}
                      className="w-full px-2 py-1 bg-[#171513] border border-[#52443a] rounded font-semibold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
                    >
                      <option value="" className="bg-[#171513] text-[#918578]">-- Chọn Nhân Sự --</option>
                      {staffList.map((st) => (
                        <option key={st.id} value={st.name} className="bg-[#171513] text-[#e8dfd5]">{st.name} ({st.role})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="0 đ"
                      value={member.pay || ''}
                      onChange={(e) => {
                        const updated = [...showFormData.assignedStaff.crewList];
                        updated[idx].pay = Number(e.target.value);
                        setShowFormData({
                          ...showFormData,
                          assignedStaff: { ...showFormData.assignedStaff, crewList: updated }
                        });
                      }}
                      style={{ fontSize: '16px' }}
                      className="flex-1 px-2.5 py-1 bg-[#171513] border border-[#52443a] rounded font-bold text-rose-300 box-border text-[11px] sm:text-[11px] focus:border-[#c4b5a5] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = showFormData.assignedStaff.crewList.filter((_, i) => i !== idx);
                        setShowFormData({
                          ...showFormData,
                          assignedStaff: { ...showFormData.assignedStaff, crewList: updated }
                        });
                      }}
                      className="text-[#918578] hover:text-rose-300 p-1 shrink-0 bg-[#171513] border border-[#52443a] rounded"
                    >
                      <Icons.X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {(showFormData.assignedStaff.crewList || []).length === 0 && (
                <p className="text-[#5e554d] text-[10px] italic text-center py-1.5 bg-[#1f1d1b]/30 rounded-lg border border-dashed border-[#453931]">
                  Chưa có nhân sự nào được thêm.
                </p>
              )}
            </div>
          </div>

          {/* Chi Phí Khác */}
          <div className="space-y-1.5 border-t border-[#25221e] pt-2.5">
            <span className="font-bold text-[10px] text-[#918578] uppercase tracking-wider block">Chi Phí Khác (Xe, Đồ, Vé...)</span>
            
            <div className="space-y-1">
              {(showFormData.expenses || []).map((exp) => (
                <div key={exp.id} className="flex justify-between items-center bg-[#1f1d1b]/40 p-1.5 rounded border border-[#453931]">
                  <span className="font-medium text-[#b8a99a] truncate pr-2">{exp.title}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-bold text-rose-300">-{formatCurrency(exp.amount)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpense(exp.id)}
                      className="text-rose-300 hover:text-rose-200 p-0.5"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-1.5">
              <input
                type="text"
                placeholder="Tên chi phí"
                value={newExpenseTitle}
                onChange={(e) => setNewExpenseTitle(e.target.value)}
                style={{ fontSize: '16px' }}
                className="flex-1 px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
              />
              <div className="flex gap-1.5">
                <input
                  type="number"
                  placeholder="Số tiền"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full sm:w-24 px-2 py-1 bg-[#1f1d1b] border border-[#52443a] rounded font-bold text-rose-300 box-border text-[11px] sm:text-[11px] focus:border-[#c4b5a5] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddExpense}
                  className="px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] text-[#f4efe9] rounded text-[11px] font-semibold hover:bg-[#2b2723] shrink-0"
                >
                  + Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Finance Input */}
          <div className="space-y-2 border-t border-[#25221e] pt-2.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Giá Hợp Đồng (VNĐ)</label>
              <input
                type="number"
                value={showFormData.totalAmount || ''}
                onChange={(e) => setShowFormData({ ...showFormData, totalAmount: e.target.value === '' ? 0 : Number(e.target.value) })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded font-bold text-[#f4efe9] box-border text-[11px] sm:text-[11px] focus:border-[#c4b5a5] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Tiền Đặt Cọc (VNĐ)</label>
              <input
                type="number"
                value={showFormData.depositAmount || ''}
                onChange={(e) => setShowFormData({ ...showFormData, depositAmount: e.target.value === '' ? 0 : Number(e.target.value) })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded font-bold text-[#f4efe9] box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#b8a99a]">Trạng Thái</label>
              <select
                value={showFormData.status}
                onChange={(e) => setShowFormData({ ...showFormData, status: e.target.value })}
                style={{ fontSize: '16px' }}
                className="w-full px-2.5 py-1 bg-[#1f1d1b] border border-[#52443a] rounded font-bold box-border text-[11px] sm:text-[11px] text-[#f4efe9] focus:border-[#c4b5a5] focus:outline-none"
              >
                <option value="Chưa cọc" className="bg-[#171513] text-[#e8dfd5]">Chưa cọc</option>
                <option value="Đã cọc" className="bg-[#171513] text-[#e8dfd5]">Đã cọc</option>
                <option value="Đã thanh toán" className="bg-[#171513] text-[#e8dfd5]">Đã thanh toán</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2.5 border-t border-[#25221e] shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsShowModalOpen(false);
                if (editingShow) {
                  const freshShow = shows.find(s => s.id === editingShow.id) || editingShow;
                  setSelectedCalendarDay({
                    dateStr: freshShow.date,
                    shows: [freshShow]
                  });
                }
              }}
              className="px-3 py-1 border border-[#36322d] rounded font-semibold text-[#b8a99a] text-[11px] hover:bg-[#1f1d1b]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] rounded font-semibold shadow-xs text-[11px] hover:bg-[#2b2723]"
            >
              Lưu Show
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* MODAL: STAFF FORM */}
  {isStaffModalOpen && (
    <div className="fixed inset-0 z-50 bg-[#11100f]/85 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#171513] rounded-2xl border border-[#25221e] shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b border-[#25221e] flex justify-between items-center bg-[#171513]">
          <h3 className="font-bold text-sm text-[#f4efe9]">Thêm Nhân Sự Mới</h3>
          <button onClick={() => setIsStaffModalOpen(false)} className="text-[#918578] hover:text-[#f4efe9]">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveStaff} autoComplete="off" className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#b8a99a] mb-1">Tên Nhân Sự *</label>
            <input
              type="text"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              name="staff_name_no_autofill"
              placeholder="VD: Nguyễn Văn A"
              value={staffFormData.name}
              onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
              style={{ fontSize: '16px' }}
              className="w-full px-2.5 py-1.5 bg-[#1f1d1b] border border-[#36322d] rounded-lg font-semibold text-[#f4efe9] box-border text-[11px]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#b8a99a] mb-1">Vị Trí Chuyên Môn</label>
            <select
              value={staffFormData.role}
              onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
              style={{ fontSize: '16px' }}
              className="w-full px-2.5 py-1.5 bg-[#1f1d1b] border border-[#36322d] rounded-lg font-semibold text-[#f4efe9] box-border text-[11px]"
            >
              <option value="Photo" className="bg-[#171513] text-[#e8dfd5]">Photo</option>
              <option value="Quay phim" className="bg-[#171513] text-[#e8dfd5]">Quay phim</option>
              <option value="Makeup" className="bg-[#171513] text-[#e8dfd5]">Makeup</option>
              <option value="Làm tóc" className="bg-[#171513] text-[#e8dfd5]">Làm tóc</option>
              <option value="Freelance" className="bg-[#171513] text-[#e8dfd5]">Freelance Hỗ Trợ</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-[#b8a99a] mb-1">Số Điện Thoại</label>
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              name="staff_phone_no_autofill"
              placeholder="0901234567"
              value={staffFormData.phone}
              onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
              style={{ fontSize: '16px' }}
              className="w-full px-2.5 py-1.5 bg-[#1f1d1b] border border-[#36322d] rounded-lg font-semibold text-[#f4efe9] box-border text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#25221e]">
            <button
              type="button"
              onClick={() => setIsStaffModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#36322d] rounded-lg font-semibold text-[#b8a99a] hover:bg-[#1f1d1b]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] rounded-lg font-semibold shadow-xs hover:bg-[#2b2723]"
            >
              Thêm Nhân Sự
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* MODAL: CALENDAR DAY DETAIL */}
  {selectedCalendarDay && (
    <div className="fixed inset-0 z-50 bg-[#11100f]/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-[#171513] rounded-2xl border border-[#25221e] shadow-xl w-full max-w-lg p-4 sm:p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#25221e] pb-3">
          <div>
            <h3 className="font-bold base text-[#f4efe9]">
              Lịch Chụp Ngày {new Date(selectedCalendarDay.dateStr).toLocaleDateString('vi-VN')}
            </h3>
            <p className="text-xs text-[#918578] font-medium">Tổng số: {selectedCalendarDay.shows.length} show</p>
          </div>
          <button onClick={() => setSelectedCalendarDay(null)} className="text-[#918578] hover:text-[#f4efe9]">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {selectedCalendarDay.shows.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-[#918578] font-medium">Chưa có lịch chụp nào trong ngày này.</p>
              <button
                onClick={() => {
                  const dateStr = selectedCalendarDay.dateStr;
                  setSelectedCalendarDay(null);
                  handleOpenShowModal(null, dateStr);
                }}
                className="bg-[#1f1d1b] border border-[#36322d] hover:bg-[#2b2723] text-[#f4efe9] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
              >
                <Icons.Plus className="w-4 h-4 text-[#b8a99a]" /> Thêm Show Mới Cho Ngày Này
              </button>
            </div>
          ) : (
            [...selectedCalendarDay.shows]
              .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'))
              .map((show) => {
              const totalPackage = Number(show.totalAmount || 0);
              const deposit = Number(show.depositAmount || 0);
              const remaining = totalPackage - deposit;

              return (
                <div key={show.id} className="bg-[#1f1d1b]/40 p-3.5 rounded-xl border border-[#25221e] space-y-3">
                  <div className="flex justify-between items-start gap-2 border-b border-[#25221e] pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#f4efe9]">{show.clientName}</h4>
                        <span className="text-[10px] font-bold bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] px-2 py-0.5 rounded-md">
                          {show.packageType}
                        </span>
                      </div>
                      <p className="text-xs text-[#918578] font-medium mt-0.5">
                        📞 SĐT: {show.clientPhone || 'Chưa có'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCalendarDay(null);
                        handleOpenShowModal(show);
                      }}
                      className="text-xs font-semibold text-[#b8a99a] hover:text-[#f4efe9] hover:underline shrink-0"
                    >
                      Sửa Show
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#171513] p-2 rounded-lg border border-[#25221e] flex items-center gap-1.5 text-[#b8a99a]">
                      <Icons.Clock className="w-3.5 h-3.5 text-[#918578] shrink-0" />
                      <span>
                        <strong>Thời gian:</strong> {show.startTime || '08:00'} - {show.endTime || '12:00'}
                      </span>
                    </div>
                    <div className="bg-[#171513] p-2 rounded-lg border border-[#25221e] text-[#b8a99a] truncate">
                      <span>📍 <strong>Địa điểm:</strong> {show.location || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  <div className="bg-[#171513] p-2.5 rounded-lg border border-[#25221e] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#918578] font-medium">Giá gói chụp:</span>
                      <span className="font-bold text-[#f4efe9]">{formatCurrency(totalPackage)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#b8a99a]">
                      <span className="font-medium">Đã đặt cọc:</span>
                      <span className="font-bold text-[#f4efe9]">{formatCurrency(deposit)}</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-300 pt-1 border-t border-[#25221e]">
                      <span className="font-medium">Còn lại phải thu:</span>
                      <span className="font-bold">{formatCurrency(remaining)}</span>
                    </div>
                  </div>

                  <div className="bg-[#171513] p-2.5 rounded-lg border border-[#25221e] space-y-1 text-xs">
                    <span className="font-bold text-[11px] text-[#918578] uppercase tracking-wider block mb-1">
                      Phân công Nhân sự & Tiền công:
                    </span>
                    {getNormalizeCrewList(show.assignedStaff).map((c) => (
                      <div key={c.id} className="flex justify-between text-[#b8a99a] border-b border-[#1e1c19] last:border-none py-0.5">
                        <span>👤 {c.role}: <strong>{c.name}</strong></span>
                        <span className="font-semibold text-rose-300">{formatCurrency(c.pay)}</span>
                      </div>
                    ))}
                    {getNormalizeCrewList(show.assignedStaff).length === 0 && (
                      <p className="text-[#5e554d] italic">Chưa phân công nhân sự</p>
                    )}
                  </div>

                  {show.notes && (
                    <div className="bg-[#171513] p-2.5 rounded-lg text-xs text-[#b8a99a] space-y-0.5 border border-[#25221e]">
                      <span className="font-bold block text-[11px] text-[#918578]">📝 Ghi chú buổi chụp:</span>
                      <p className="leading-relaxed">{show.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#25221e]">
                    <button
                      onClick={() => setConfirmationModal({ isOpen: true, type: 'client', show })}
                      className="flex-1 bg-[#1f1d1b] border border-[#36322d] hover:bg-[#2b2723] text-[#f4efe9] px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      📄 Thông tin gửi Khách xác nhận
                    </button>
                    <button
                      onClick={() => setConfirmationModal({ isOpen: true, type: 'staff', show })}
                      className="flex-1 bg-[#171513] hover:bg-[#1f1d1b] text-[#b8a99a] border border-[#25221e] px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      👥 Thông tin gửi Nhân sự xác nhận
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#25221e]">
          {selectedCalendarDay.shows.length > 0 && (
            <button
              onClick={() => {
                const dateStr = selectedCalendarDay.dateStr;
                setSelectedCalendarDay(null);
                handleOpenShowModal(null, dateStr);
              }}
              className="bg-[#1f1d1b] border border-[#36322d] hover:bg-[#2b2723] text-[#f4efe9] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Icons.Plus className="w-4 h-4 text-[#b8a99a]" /> Thêm Show Mới Ngày Này
            </button>
          )}
          <button
            onClick={() => setSelectedCalendarDay(null)}
            className="px-3.5 py-1.5 border border-[#25221e] text-[#b8a99a] rounded-xl text-xs font-semibold hover:bg-[#1f1d1b] ml-auto"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )}

  {/* MODAL: EXPORT CONFIRMATION CARDS (CLIENT / STAFF) */}
  {confirmationModal.isOpen && confirmationModal.show && (
    <div className="fixed inset-0 z-50 bg-[#11100f]/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-[#171513] rounded-2xl border border-[#25221e] shadow-2xl w-full max-w-md overflow-hidden my-6">
        <div className="p-3.5 border-b border-[#25221e] flex justify-between items-center bg-[#171513]">
          <span className="font-bold text-xs uppercase tracking-wider text-[#b8a99a]">
            {confirmationModal.type === 'client' ? '📋 Phiếu Xác Nhận Dành Cho Khách Hàng' : '📌 Phiếu Xếp Lịch Cho Nhân Sự'}
          </span>
          <button
            onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })}
            className="text-[#918578] hover:text-[#f4efe9] p-1"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Card to Screenshot */}
        <div className="p-5 bg-[#171513] space-y-4 text-[#f4efe9]">
          <div className="text-center border-b border-[#25221e] pb-3 space-y-1">
            <div className="inline-flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#f4efe9]">OUR JUNE STUDIO</span>
            </div>
            <p className="text-[10px] text-[#918578] font-semibold uppercase tracking-widest">
              {confirmationModal.type === 'client' ? 'XÁC NHẬN THÔNG TIN BẢNG GIÁ & LỊCH CHỤP' : 'THÔNG TIN PHÂN CÔNG LỊCH EKIP CHỤP'}
            </p>
          </div>

          {/* CLIENT CONFIRMATION VIEW */}
          {confirmationModal.type === 'client' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#1f1d1b]/50 p-3 rounded-xl border border-[#25221e] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#918578]">Khách hàng:</span>
                  <strong className="text-[#f4efe9]">{confirmationModal.show.clientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">Số điện thoại:</span>
                  <strong className="text-[#b8a99a]">{confirmationModal.show.clientPhone || 'Chưa cung cấp'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">Gói dịch vụ:</span>
                  <span className="font-bold bg-[#171513] text-[#b8a99a] border border-[#36322d] px-2 py-0.5 rounded text-[10px]">
                    {confirmationModal.show.packageType}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 bg-[#1f1d1b]/50 p-3 rounded-xl border border-[#25221e]">
                <div className="flex justify-between">
                  <span className="text-[#918578]">📅 Ngày thực hiện:</span>
                  <strong className="text-[#f4efe9]">
                    {new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">⏰ Thời gian:</span>
                  <strong className="text-[#f4efe9]">
                    {confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">📍 Địa điểm:</span>
                  <strong className="text-[#f4efe9] text-right truncate max-w-[200px]">
                    {confirmationModal.show.location || 'Tại Studio Our June'}
                  </strong>
                </div>
              </div>

              <div className="bg-[#1f1d1b]/50 p-3.5 rounded-xl border border-[#25221e] space-y-1.5">
                <div className="flex justify-between text-[#b8a99a]">
                  <span>Giá hợp đồng:</span>
                  <strong className="text-[#f4efe9]">
                    {formatCurrency(confirmationModal.show.totalAmount)}
                  </strong>
                </div>
                <div className="flex justify-between text-[#b8a99a]">
                  <span>Đã đặt cọc:</span>
                  <strong className="text-[#f4efe9]">{formatCurrency(confirmationModal.show.depositAmount)}</strong>
                </div>
                <div className="flex justify-between text-rose-300 font-bold border-t border-[#25221e] pt-1.5 text-sm">
                  <span>Còn lại cần thanh toán:</span>
                  <span>
                    {formatCurrency(
                      Number(confirmationModal.show.totalAmount || 0) -
                        Number(confirmationModal.show.depositAmount || 0)
                    )}
                  </span>
                </div>
              </div>

              {confirmationModal.show.notes && (
                <div className="bg-[#1f1d1b]/50 p-2.5 rounded-lg text-[#b8a99a] text-[11px] border border-[#25221e]">
                  <strong>Ghi chú:</strong> {confirmationModal.show.notes}
                </div>
              )}

              <p className="text-[10px] text-center text-[#5e554d] italic">
                * Qúy khách vui lòng kiểm tra lại thông tin và phản hồi để Studio chuẩn bị chu đáo nhất.
              </p>
            </div>
          )}

          {/* STAFF CONFIRMATION VIEW */}
          {confirmationModal.type === 'staff' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#1f1d1b]/50 p-3 rounded-xl border border-[#25221e] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#918578]">Tên Show / Gói:</span>
                  <span className="font-bold text-[#f4efe9]">{confirmationModal.show.packageType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">Tên Khách Hàng:</span>
                  <strong className="text-[#f4efe9]">{confirmationModal.show.clientName}</strong>
                </div>
              </div>

              <div className="space-y-1.5 bg-[#1f1d1b]/50 p-3 rounded-xl border border-[#25221e]">
                <div className="flex justify-between">
                  <span className="text-[#918578]">📅 Ngày chụp:</span>
                  <strong className="text-[#f4efe9]">
                    {new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">⏰ Thời gian làm việc:</span>
                  <strong className="text-[#f4efe9]">
                    {confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#918578]">📍 Địa điểm:</span>
                  <strong className="text-[#f4efe9]">{confirmationModal.show.location || 'Tại Studio'}</strong>
                </div>
              </div>

              <div className="bg-[#1f1d1b]/50 p-3 rounded-xl border border-[#25221e] space-y-1.5">
                <span className="font-bold text-[11px] text-[#918578] uppercase tracking-wider block">
                  Phân công Nhân sự Ekip:
                </span>
                {getNormalizeCrewList(confirmationModal.show.assignedStaff).map((c) => (
                  <div key={c.id} className="flex justify-between border-b border-[#1e1c19] pb-1 last:border-none">
                    <span className="text-[#918578]">👤 {c.role}:</span>
                    <strong className="text-[#f4efe9]">{c.name}</strong>
                  </div>
                ))}
                {getNormalizeCrewList(confirmationModal.show.assignedStaff).length === 0 && (
                  <span className="text-[#5e554d] italic">Chưa chọn nhân sự</span>
                )}
              </div>

              {confirmationModal.show.notes && (
                <div className="bg-[#1f1d1b]/50 p-2.5 rounded-lg text-[#b8a99a] text-[11px] border border-[#25221e]">
                  <strong>Lưu ý cho Ekip:</strong> {confirmationModal.show.notes}
                </div>
              )}

              <p className="text-[10px] text-center text-[#5e554d] italic">
                * Anh/em ekip chủ động có mặt trước 15 phút tại địa điểm chụp.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 bg-[#171513] border-t border-[#25221e] flex justify-between gap-2">
          <button
            onClick={() => {
              const show = confirmationModal.show;
              let text = '';
              if (confirmationModal.type === 'client') {
                text = `[OUR JUNE STUDIO] XÁC NHẬN LỊCH CHỤP\n- Khách hàng: ${show.clientName}\n- Gói dịch vụ: ${show.packageType}\n- Ngày chụp: ${new Date(show.date).toLocaleDateString('vi-VN')}\n- Giờ: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n- Địa điểm: ${show.location || 'Studio'}\n- Tổng giá trị: ${formatCurrency(show.totalAmount)}\n- Đã cọc: ${formatCurrency(show.depositAmount)}\n- Còn lại: ${formatCurrency(Number(show.totalAmount || 0) - Number(show.depositAmount || 0))}\n\nQuý khách vui lòng kiểm tra lại giúp Studio nhé!`;
              } else {
                const crewListText = getNormalizeCrewList(show.assignedStaff)
                  .map(c => `+ ${c.role}: ${c.name}`)
                  .join('\n');

                text = `[OUR JUNE STUDIO] THÔNG BÁO LỊCH CHỤP EKIP\n- Show: ${show.packageType} (${show.clientName})\n- Ngày: ${new Date(show.date).toLocaleDateString('vi-VN')}\n- Giờ làm việc: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n- Địa điểm: ${show.location || 'Studio'}\n\nPhân công Ekip:\n${crewListText || '+ Chưa phân công'}\n\nLưu ý: ${show.notes || 'Anh/em có mặt đúng giờ'}`;
              }

              const textArea = document.createElement('textarea');
              textArea.value = text;
              textArea.style.position = 'fixed';
              textArea.style.opacity = '0';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();

              try {
                const successful = document.execCommand('copy');
                if (successful) {
                  alert('Đã sao chép tin nhắn xác nhận!');
                } else {
                  alert('Không thể sao chép tự động. Vui lòng bôi đen và copy thủ công.');
                }
              } catch (err) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(text).then(() => {
                    alert('Đã sao chép tin nhắn xác nhận!');
                  }).catch(() => {
                    alert('Vui lòng bôi đen nội dung trên phiếu để sao chép.');
                  });
                } else {
                  alert('Trình duyệt không hỗ trợ sao chép tự động.');
                }
              }
              document.body.removeChild(textArea);
            }}
            className="flex-1 bg-[#1f1d1b] border border-[#36322d] text-[#f4efe9] px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#2b2723] transition shadow-2xs"
          >
            📋 Sao Chép Tin Nhắn
          </button>
          <button
            onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })}
            className="px-4 py-1.5 border border-[#25221e] text-[#b8a99a] rounded-xl text-xs font-semibold hover:bg-[#1f1d1b]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )}
</div>


);
}
