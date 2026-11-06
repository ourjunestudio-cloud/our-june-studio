import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Cấu hình Firebase của Our June Studio
const firebaseConfig = {
  apiKey: "AIzaSyDnFRaxtiIjchf8OSkLW566DeIlCmPoML0",
  authDomain: "ourjunestudio-95727.firebaseapp.com",
  projectId: "ourjunestudio-95727",
  storageBucket: "ourjunestudio-95727.firebasestorage.app",
  messagingSenderId: "233758306433",
  appId: "1:233758306433:web:ebd17a24e2dc87e8521d80",
  measurementId: "G-J3TW4NP7TG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inline SVG Icon components
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
  Download: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Upload: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Real-time Firestore states
  const [shows, setShows] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const unsubShows = onSnapshot(collection(db, "shows"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setShows(items);
    });

    const unsubStaff = onSnapshot(collection(db, "staff"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStaffList(items);
    });

    return () => {
      unsubShows();
      unsubStaff();
    };
  }, []);

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
    assignedStaff: { crewList: [] },
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

  const getNormalizeCrewList = (assignedStaff) => {
    if (!assignedStaff) return [];
    if (assignedStaff.crewList && Array.isArray(assignedStaff.crewList)) {
      return assignedStaff.crewList;
    }
    return [];
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
      return `${formatted} tr`;
    }
    return formatCurrency(val);
  };

  const currentMonthShows = useMemo(() => {
    const filtered = shows.filter((show) => {
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

    // Sắp xếp theo thứ tự thời gian từ cũ đến mới (ngày nhỏ/sớm lên trước, ngày lớn/muộn xuống sau)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01');
      const dateB = new Date(b.date || '1970-01-01');
      if (dateA - dateB !== 0) return dateA - dateB;
      return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
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

    const annualSummary = monthlyBreakdown.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalExpenses: acc.totalExpenses + curr.expenses,
        totalProfit: acc.totalProfit + curr.profit,
        totalShows: acc.totalShows + curr.count
      }),
      { totalRevenue: 0, totalExpenses: 0, totalProfit: 0, totalShows: 0 }
    );

    return { monthlyBreakdown, annualSummary };
  }, [shows, selectedYear]);

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
        const dayShows = shows.filter((s) => s.date === dateStr).sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
        daysArr.push({ dayNum: prevDayNum, dateStr, isCurrentMonth: false, shows: dayShows });
      } else if (i >= startDayOfWeek + daysInMonth) {
        const nextDayNum = i - (startDayOfWeek + daysInMonth) + 1;
        const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
        const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
        const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => s.date === dateStr).sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
        daysArr.push({ dayNum: nextDayNum, dateStr, isCurrentMonth: false, shows: dayShows });
      } else {
        const dayNum = i - startDayOfWeek + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => s.date === dateStr).sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
        daysArr.push({ dayNum, dateStr, isCurrentMonth: true, shows: dayShows });
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
        clientName: '',
        clientPhone: '',
        date: defaultDate || '',
        startTime: '',
        endTime: '',
        packageType: '',
        location: '',
        assignedStaff: { crewList: [] },
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

  const openDayDetailByDate = (targetDateStr, updatedShowsList = shows) => {
    if (!targetDateStr) return;
    const dayShows = updatedShowsList
      .filter((s) => s.date === targetDateStr)
      .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    
    const dObj = new Date(targetDateStr);
    if (!isNaN(dObj.getTime())) {
      setSelectedMonth(dObj.getMonth() + 1);
      setSelectedYear(dObj.getFullYear());
    }

    setSelectedCalendarDay({
      dateStr: targetDateStr,
      shows: dayShows,
      singleShowMode: dayShows.length === 1
    });
    setActiveTab('calendar');
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    const targetDate = showFormData.date;
    try {
      let updatedShows = [...shows];
      if (editingShow) {
        const showRef = doc(db, "shows", editingShow.id);
        await updateDoc(showRef, showFormData);
        updatedShows = updatedShows.map(s => s.id === editingShow.id ? { ...showFormData, id: editingShow.id } : s);
      } else {
        const docRef = await addDoc(collection(db, "shows"), showFormData);
        updatedShows.push({ ...showFormData, id: docRef.id });
      }
      setIsShowModalOpen(false);
      openDayDetailByDate(targetDate, updatedShows);
    } catch (error) {
      console.error("Lỗi lưu show:", error);
      alert("Có lỗi khi lưu dữ liệu lên Firebase!");
    }
  };

  const handleDeleteShow = async (id, targetDate = null) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch chụp này?")) {
      try {
        await deleteDoc(doc(db, "shows", id));
        const updatedShows = shows.filter(s => s.id !== id);
        if (selectedCalendarDay && targetDate) {
          openDayDetailByDate(targetDate, updatedShows);
        }
      } catch (error) {
        console.error("Lỗi xóa show:", error);
      }
    }
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

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffFormData.name) return;
    try {
      await addDoc(collection(db, "staff"), staffFormData);
      setStaffFormData({ name: '', role: 'Photo', phone: '' });
      setIsStaffModalOpen(false);
    } catch (error) {
      console.error("Lỗi thêm nhân sự:", error);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân sự này?")) {
      try {
        await deleteDoc(doc(db, "staff", id));
      } catch (error) {
        console.error("Lỗi xóa nhân sự:", error);
      }
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({ shows, staffList }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OurJune_Studio_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.shows && parsed.staffList) {
          for (let s of parsed.shows) {
            const { id, ...data } = s;
            await addDoc(collection(db, "shows"), data);
          }
          for (let st of parsed.staffList) {
            const { id, ...data } = st;
            await addDoc(collection(db, "staff"), data);
          }
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
        return <span className="bg-[#26211c] text-[#d4c5b9] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#3c342c]">Chưa cọc</span>;
      case 'Đã cọc':
        return <span className="bg-[#2c251e] text-[#f3ece4] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#4d4237]">Đã cọc</span>;
      case 'Đã thanh toán':
        return <span className="bg-[#202c24] text-[#86efac] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#2e4d38]">Đã thanh toán</span>;
      default:
        return <span className="bg-[#26211c] text-[#d4c5b9] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#3c342c]">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#f3ece4] font-sans pb-20 overflow-x-hidden selection:bg-[#3c342c]">
      {/* Top Header */}
      <header className="bg-[#1b1815] border-b border-[#2c251e] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-base tracking-tight text-[#f9f6f0]">OUR JUNE</span>
                <span className="text-[10px] bg-[#26211c] text-[#c9bbaE] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#3c342c]">STUDIO</span>
              </div>
            </div>
            <p className="text-[11px] text-[#a3978b] font-normal sm:hidden">Timeless Studio</p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center justify-start sm:justify-end bg-[#141210] p-1 rounded-xl text-xs font-medium overflow-x-auto scrollbar-none border border-[#2c251e]">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'calendar' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b] hover:text-[#f9f6f0]'}`}
            >
              <Icons.Calendar className="w-3.5 h-3.5 text-[#c9bbaE]" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'list' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b] hover:text-[#f9f6f0]'}`}
            >
              <Icons.Camera className="w-3.5 h-3.5 text-[#c9bbaE]" />
              <span>Danh Sách</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'analytics' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b] hover:text-[#f9f6f0]'}`}
            >
              <Icons.TrendingUp className="w-3.5 h-3.5 text-[#86efac]" />
              <span>Thống Kê</span>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'staff' ? 'bg-[#26211c] text-[#f9f6f0] font-semibold border border-[#3c342c]' : 'text-[#a3978b] hover:text-[#f9f6f0]'}`}
            >
              <Icons.Users className="w-3.5 h-3.5 text-[#c9bbaE]" />
              <span>Ekip</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 space-y-3 overflow-x-hidden">
        {/* Month / Year Bar & Quick Data Actions */}
        <div className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-3 shadow-2xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#a3978b] uppercase tracking-wider shrink-0">Thời gian:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-[#24201c] border border-[#3c342c] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#f3ece4] focus:outline-none flex-1 sm:flex-initial"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m} className="bg-[#1b1815] text-[#f3ece4]">Tháng {m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-[#24201c] border border-[#3c342c] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#f3ece4] focus:outline-none flex-1 sm:flex-initial"
            >
              {Array.from({ length: 17 }, (_, i) => 2024 + i).map((y) => (
                <option key={y} value={y} className="bg-[#1b1815] text-[#f3ece4]">Năm {y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => handleOpenShowModal()}
              className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#332b24] transition"
            >
              <Icons.Plus className="w-4 h-4 text-[#c9bbaE]" />
              <span>Tạo Lịch Chụp Mới</span>
            </button>
            <button
              onClick={handleExportData}
              title="Xuất File Sao Lưu"
              className="p-1.5 border border-[#3c342c] rounded-lg text-[#c9bbaE] hover:bg-[#26211c] transition"
            >
              <Icons.Download className="w-4 h-4" />
            </button>
            <label
              title="Nhập File Dữ Liệu"
              className="p-1.5 border border-[#3c342c] rounded-lg text-[#c9bbaE] hover:bg-[#26211c] transition cursor-pointer"
            >
              <Icons.Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#a3978b] uppercase tracking-wider">Tổng Show T{selectedMonth}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold text-[#f9f6f0]">{monthStats.count}</span>
              <span className="text-[10px] font-semibold bg-[#26211c] text-[#86efac] px-1.5 py-0.5 rounded border border-[#2e4d38]">
                {monthStats.completedShowsCount} xong
              </span>
            </div>
          </div>

          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#a3978b] uppercase tracking-wider">Doanh Thu HĐ</span>
            <div>
              <span className="text-base sm:text-xl font-bold text-[#f9f6f0] block truncate">
                {formatCurrencyCompact(monthStats.totalRevenue)}
              </span>
              <p className="text-[10px] text-[#a3978b] font-medium truncate">
                Còn lại: {formatCurrencyCompact(monthStats.remainingToCollect)}
              </p>
            </div>
          </div>

          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">Chi Phí Show</span>
            <div>
              <span className="text-base sm:text-xl font-bold text-rose-300 block truncate">
                {formatCurrencyCompact(monthStats.totalExpenses)}
              </span>
              <p className="text-[10px] text-[#a3978b] font-medium truncate">Lương ekip & phát sinh</p>
            </div>
          </div>

          <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#86efac] uppercase tracking-wider">Lợi Nhuận Ròng</span>
            <div>
              <span className="text-base sm:text-xl font-bold text-[#86efac] block truncate">
                {formatCurrencyCompact(monthStats.netProfit)}
              </span>
              <p className="text-[10px] text-[#a3978b] font-medium truncate">Doanh thu trừ Chi phí</p>
            </div>
          </div>
        </div>

        {/* TAB 1: GOOGLE CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-3 sm:p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-1">
                  <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-[#26211c] text-[#c9bbaE] transition">
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-sm font-bold text-[#f9f6f0] min-w-[110px] text-center">
                    Tháng {selectedMonth} / {selectedYear}
                  </h2>
                  <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-[#26211c] text-[#c9bbaE] transition">
                    <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs font-normal text-[#a3978b]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8c525c]"></span> Makeup</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3e5244]"></span> Show Chụp Hình</span>
              </div>
            </div>

            {/* Google Calendar Grid */}
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-7 border-b border-[#2c251e] text-center pb-2 min-w-[320px]">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dayName, idx) => (
                  <div key={idx} className="text-xs font-semibold text-[#a3978b]">{dayName}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 border-l border-t border-[#2c251e] min-w-[320px]">
                {calendarDays.map((cell, idx) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const isToday = cell.dateStr === todayStr;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (cell.dateStr) {
                          setSelectedCalendarDay({
                            dateStr: cell.dateStr,
                            shows: cell.shows,
                            singleShowMode: cell.shows.length === 1
                          });
                        }
                      }}
                      className={`min-h-[90px] sm:min-h-[120px] p-1 border-r border-b border-[#2c251e] flex flex-col justify-start transition ${cell.isCurrentMonth ? 'bg-[#1b1815] hover:bg-[#26211c]/60' : 'bg-[#141210]/40'} cursor-pointer`}
                    >
                      <div className="flex justify-center sm:justify-start mb-1">
                        <span className={`w-5 h-5 sm:w-5.5 sm:h-5.5 flex items-center justify-center rounded-full text-[11px] sm:text-xs font-medium ${isToday ? 'bg-[#d4c5b9] text-[#141210] font-bold shadow-2xs' : cell.isCurrentMonth ? 'text-[#f3ece4]' : 'text-[#6b625b]'}`}>
                          {cell.dayNum}
                        </span>
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        {cell.shows.map((show) => {
                          const isMakeupOnly = show.packageType === 'Makeup';
                          const bgStyle = isMakeupOnly ? 'bg-[#703f47] text-[#f9f6f0] font-semibold' : 'bg-[#33463a] text-[#f9f6f0] font-semibold';

                          return (
                            <div key={show.id} className={`px-1.5 py-1 rounded text-[9px] sm:text-[10px] leading-tight ${bgStyle}`} title={`${show.clientName} (${show.packageType})`}>
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
              className="fixed bottom-6 right-6 z-40 bg-[#26211c] border border-[#3c342c] hover:bg-[#332b24] text-[#f9f6f0] p-3.5 rounded-2xl shadow-lg flex items-center justify-center transition-transform active:scale-95"
              title="Tạo lịch chụp mới"
            >
              <Icons.Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* TAB 2: SHOW LIST VIEW */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Icons.Search className="w-4 h-4 absolute left-3 top-2.5 text-[#a3978b]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên khách, gói chụp, địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#24201c] border border-[#3c342c] rounded-lg text-xs font-medium focus:outline-none text-[#f3ece4]"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full sm:w-auto px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded-lg text-xs font-semibold text-[#c9bbaE] focus:outline-none"
                >
                  <option value="All" className="bg-[#1b1815] text-[#c9bbaE]">Tất cả trạng thái</option>
                  <option value="Chưa cọc" className="bg-[#1b1815] text-[#c9bbaE]">Chưa cọc</option>
                  <option value="Đã cọc" className="bg-[#1b1815] text-[#c9bbaE]">Đã cọc</option>
                  <option value="Đã thanh toán" className="bg-[#1b1815] text-[#c9bbaE]">Đã thanh toán</option>
                </select>
              </div>
            </div>

            {/* List of Show Cards */}
            <div className="space-y-3">
              {currentMonthShows.length === 0 ? (
                <div className="bg-[#1b1815] p-8 rounded-xl border border-[#2c251e] text-center space-y-2">
                  <p className="text-[#a3978b] font-medium text-xs">Chưa có lịch chụp nào trong Tháng {selectedMonth}/{selectedYear}</p>
                  <button onClick={() => handleOpenShowModal()} className="text-xs font-semibold text-[#f3ece4] hover:underline">
                    + Tạo lịch chụp mới ngay
                  </button>
                </div>
              ) : (
                currentMonthShows.map((show) => {
                  const totalExp = calculateShowTotalExpenses(show);
                  const profit = (show.totalAmount || 0) - totalExp;
                  const otherExpensesSum = (show.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

                  return (
                    <div key={show.id} className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-4 shadow-2xs space-y-3 hover:border-[#3c342c] transition">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#2c251e] pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs bg-[#24201c] border border-[#3c342c] text-[#f9f6f0] px-2.5 py-0.5 rounded-md">{show.packageType}</span>
                          {renderStatusBadge(show.status)}
                          <span className="text-xs text-[#a3978b] font-medium">📅 {new Date(show.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-1 self-end sm:self-auto">
                          <button onClick={() => handleOpenShowModal(show)} className="p-1.5 hover:bg-[#24201c] rounded-lg text-[#c9bbaE] text-xs font-medium flex items-center gap-1 border border-[#3c342c]">
                            <Icons.Edit className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button onClick={() => handleDeleteShow(show.id)} type="button" className="p-1.5 hover:bg-[#3d2524] rounded-lg text-rose-300 text-xs font-medium border border-[#4d302e] cursor-pointer">
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <h3 className="font-bold text-[#f9f6f0] text-base">{show.clientName}</h3>
                          <p className="text-[#a3978b] font-medium mt-0.5">SĐT: {show.clientPhone || 'Chưa có'}</p>
                          <p className="text-[#c9bbaE] font-medium mt-1">📍 {show.location || 'Chưa cập nhật'}</p>
                        </div>

                        {/* Ekip list */}
                        <div className="bg-[#24201c]/60 p-2.5 rounded-lg border border-[#2c251e] space-y-1">
                          <span className="font-semibold text-[11px] text-[#a3978b] uppercase tracking-wider block">Phân công Ekip:</span>
                          <div className="space-y-0.5 text-[#c9bbaE]">
                            {getNormalizeCrewList(show.assignedStaff).map((member, i) => (
                              <div key={member.id || i} className="flex justify-between">
                                <span>{member.role}: {member.name}</span>
                                <span className="font-semibold text-rose-300">{formatCurrency(member.pay)}</span>
                              </div>
                            ))}
                            {getNormalizeCrewList(show.assignedStaff).length === 0 && (
                              <span className="text-[#6b625b] italic">Chưa phân công</span>
                            )}
                          </div>
                        </div>

                        {/* Financial summary for single show */}
                        <div className="bg-[#24201c]/60 p-2.5 rounded-lg border border-[#2c251e] flex flex-col justify-between space-y-1">
                          <div className="flex justify-between text-[#c9bbaE]">
                            <span>Doanh Thu HĐ:</span>
                            <span className="font-bold text-[#f9f6f0]">{formatCurrency(show.totalAmount)}</span>
                          </div>
                          {otherExpensesSum > 0 && (
                            <div className="flex justify-between text-[#a3978b] text-[11px]">
                              <span>Chi phí phát sinh:</span>
                              <span className="font-semibold text-rose-300">-{formatCurrency(otherExpensesSum)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[#c9bbaE]">
                            <span>Tổng Chi Phí Show:</span>
                            <span className="font-semibold text-rose-300">-{formatCurrency(totalExp)}</span>
                          </div>
                          <div className="flex justify-between border-t border-[#2c251e] pt-1 font-semibold">
                            <span className="text-[#f9f6f0]">Lợi Nhuận:</span>
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
          <div className="space-y-4">
            {/* Tổng Kết Cả Năm Card */}
            <div className="bg-[#1b1815] rounded-xl border border-[#3c342c] p-4 sm:p-5 shadow-lg space-y-3">
              <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#f9f6f0]">Tổng Kết Tài Chính Cả Năm {selectedYear}</h2>
                  <p className="text-xs text-[#a3978b]">Tổng hợp toàn bộ hoạt động kinh doanh trong năm</p>
                </div>
                <span className="text-xs font-semibold bg-[#26211c] text-[#c9bbaE] px-3 py-1 rounded-full border border-[#3c342c]">
                  {yearlyStats.annualSummary.totalShows} Show cả năm
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#24201c]/60 p-3.5 rounded-xl border border-[#2c251e] space-y-1">
                  <span className="text-xs text-[#a3978b] font-medium uppercase tracking-wider">Tổng Doanh Thu Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-[#f9f6f0]">
                    {formatCurrency(yearlyStats.annualSummary.totalRevenue)}
                  </div>
                </div>

                <div className="bg-[#24201c]/60 p-3.5 rounded-xl border border-[#2c251e] space-y-1">
                  <span className="text-xs text-rose-300 font-medium uppercase tracking-wider">Tổng Chi Phí Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-rose-300">
                    {formatCurrency(yearlyStats.annualSummary.totalExpenses)}
                  </div>
                </div>

                <div className="bg-[#24201c]/60 p-3.5 rounded-xl border border-[#2c251e] space-y-1">
                  <span className="text-xs text-[#86efac] font-medium uppercase tracking-wider">Tổng Lợi Nhuận Ròng Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-[#86efac]">
                    {formatCurrency(yearlyStats.annualSummary.totalProfit)}
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết từng tháng */}
            <div className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-4 sm:p-6 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#f9f6f0]">Chi Tiết Theo Từng Tháng</h3>
                <p className="text-xs text-[#a3978b] font-medium">Bấm vào từng tháng để xem chi tiết doanh thu và lương nhân sự</p>
              </div>

              <div className="space-y-3">
                {yearlyStats.monthlyBreakdown.map((item) => {
                  const maxRevenue = Math.max(...yearlyStats.monthlyBreakdown.map((m) => m.revenue), 1);
                  const revPercent = Math.min((item.revenue / maxRevenue) * 100, 100);
                  const isExpanded = expandedAnalyticsMonth === item.month;
                  const staffListEntries = Object.entries(item.staffEarnings || {});

                  return (
                    <div key={item.month} className={`bg-[#1b1815] rounded-xl border transition-all ${isExpanded ? 'border-[#3c342c] shadow-xs' : 'border-[#2c251e] hover:border-[#3c342c]'}`}>
                      <div onClick={() => setExpandedAnalyticsMonth(isExpanded ? null : item.month)} className="p-3 sm:p-4 space-y-2 cursor-pointer">
                        <div className="flex flex-col sm:flex-row justify-between text-xs font-bold text-[#f9f6f0] gap-1">
                          <div className="flex items-center gap-2">
                            <span>Tháng {item.month} ({item.count} show)</span>
                            <span className="text-[10px] font-semibold text-[#c9bbaE] bg-[#26211c] px-2 py-0.5 rounded-full border border-[#3c342c]">
                              {isExpanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}
                            </span>
                          </div>
                          <div className="flex gap-3 text-xs font-semibold">
                            <span className="text-[#f9f6f0]">Doanh thu: {formatCurrencyCompact(item.revenue)}</span>
                            <span className="text-rose-300">Chi phí: {formatCurrencyCompact(item.expenses)}</span>
                            <span className="text-[#86efac]">Lợi nhuận: {formatCurrencyCompact(item.profit)}</span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[#24201c] rounded-full overflow-hidden border border-[#2c251e]">
                          <div style={{ width: `${revPercent}%` }} className="h-full bg-[#a3978b] rounded-full transition-all duration-300" />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[#2c251e] p-4 space-y-4 bg-[#24201c]/40 text-xs">
                          <div className="space-y-2">
                            <span className="font-bold text-[11px] text-[#a3978b] uppercase tracking-wider block">Phân Bổ Doanh Thu Tháng {item.month}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 rounded-full bg-[#3e5244]"></span>
                                  <span className="font-bold text-[#c9bbaE]">Doanh thu Chụp Hình</span>
                                </div>
                                <span className="font-bold text-[#f9f6f0] text-sm">{formatCurrency(item.photoRevenue)}</span>
                              </div>
                              <div className="bg-[#1b1815] p-3 rounded-xl border border-[#2c251e] flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 rounded-full bg-[#703f47]"></span>
                                  <span className="font-bold text-[#c9bbaE]">Doanh thu Makeup</span>
                                </div>
                                <span className="font-bold text-[#f9f6f0] text-sm">{formatCurrency(item.makeupRevenue)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="font-bold text-[11px] text-[#a3978b] uppercase tracking-wider block">Thống Kê Show & Lương Ekip Trong Tháng</span>
                            {staffListEntries.length === 0 ? (
                              <p className="text-[#6b625b] italic">Không có dữ liệu nhân sự làm việc trong tháng này.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {staffListEntries.map(([name, totalPay]) => {
                                  const showCount = item.staffShowCounts[name] || 0;
                                  return (
                                    <div key={name} className="bg-[#1b1815] p-2.5 rounded-lg border border-[#2c251e] flex flex-col justify-between space-y-1">
                                      <div className="flex justify-between items-center">
                                        <span className="font-bold text-[#c9bbaE]">👤 {name}</span>
                                        <span className="text-[10px] font-semibold bg-[#26211c] text-[#c9bbaE] px-2 py-0.5 rounded-full border border-[#3c342c]">{showCount} show</span>
                                      </div>
                                      <div className="flex justify-between items-center pt-1 border-t border-[#25201b]">
                                        <span className="text-[#a3978b] text-[11px]">Tổng lương:</span>
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
            </div>
          </div>
        )}

        {/* TAB 4: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-[#1b1815] rounded-xl border border-[#2c251e] p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#f9f6f0]">Đội Ngũ Nhân Sự</h2>
                  <p className="text-xs text-[#a3978b] font-medium">Photo, Video, Makeup và Hair</p>
                </div>
                <button
                  onClick={() => setIsStaffModalOpen(true)}
                  className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#332b24] transition"
                >
                  <Icons.Plus className="w-4 h-4 text-[#c9bbaE]" /> Thêm Nhân Sự
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((st) => (
                  <div key={st.id} className="bg-[#24201c]/50 p-3 rounded-lg border border-[#2c251e] flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xs text-[#f9f6f0]">{st.name}</h4>
                      <span className="text-[10px] font-semibold bg-[#26211c] text-[#c9bbaE] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#3c342c]">{st.role}</span>
                      <p className="text-[11px] text-[#a3978b] mt-1">SĐT: {st.phone || 'Chưa có'}</p>
                    </div>
                    <button onClick={() => handleDeleteStaff(st.id)} className="text-[#6b625b] hover:text-rose-300 p-1">
                      <Icons.Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1b1815] rounded-xl border border-[#2c251e] p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase text-[#a3978b]">Ghi chú vận hành</h3>
              <p className="text-xs text-[#c9bbaE] leading-relaxed">
                Dữ liệu hiện đã được đồng bộ **Real-time** qua Firebase Cloud. Mọi thay đổi từ bất kỳ thiết bị nào sẽ cập nhật tức thì.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: SHOW FORM */}
      {isShowModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141210]/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#1b1815] rounded-2xl border border-[#2c251e] shadow-xl w-full max-w-lg my-6 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-3.5 border-b border-[#2c251e] flex justify-between items-center bg-[#1b1815] shrink-0">
              <h3 className="font-bold text-xs text-[#f9f6f0]">{editingShow ? 'Chỉnh Sửa Lịch Chụp' : 'Tạo Lịch Chụp Mới'}</h3>
              <button onClick={() => setIsShowModalOpen(false)} className="text-[#a3978b] hover:text-[#f9f6f0]">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveShow} autoComplete="off" className="p-3.5 sm:p-4 space-y-2.5 overflow-y-auto flex-1 text-[11px]">
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Tên Khách Hàng *</label>
                  <input
                    type="text"
                    required
                    value={showFormData.clientName}
                    onChange={(e) => setShowFormData({ ...showFormData, clientName: e.target.value })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={showFormData.clientPhone}
                    onChange={(e) => setShowFormData({ ...showFormData, clientPhone: e.target.value })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Ngày Chụp *</label>
                  <input
                    type="date"
                    required
                    value={showFormData.date}
                    onChange={(e) => setShowFormData({ ...showFormData, date: e.target.value })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Gói Dịch Vụ</label>
                  <select
                    value={showFormData.packageType}
                    onChange={(e) => setShowFormData({ ...showFormData, packageType: e.target.value })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                  >
                    <option value="" className="bg-[#1b1815] text-[#a3978b]">-- Chọn Gói Dịch Vụ --</option>
                    {PACKAGES.map((pkg) => (
                      <option key={pkg} value={pkg} className="bg-[#1b1815] text-[#f3ece4]">{pkg}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#c9bbaE]">Giờ Bắt Đầu</label>
                    <input
                      type="time"
                      value={showFormData.startTime}
                      onChange={(e) => setShowFormData({ ...showFormData, startTime: e.target.value })}
                      style={{ fontSize: '16px' }}
                      className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#c9bbaE]">Giờ Kết Thúc</label>
                    <input
                      type="time"
                      value={showFormData.endTime}
                      onChange={(e) => setShowFormData({ ...showFormData, endTime: e.target.value })}
                      style={{ fontSize: '16px' }}
                      className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#c9bbaE]">Địa Điểm Chụp</label>
                <input
                  type="text"
                  value={showFormData.location}
                  onChange={(e) => setShowFormData({ ...showFormData, location: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#c9bbaE]">Ghi Chú Buổi Chụp</label>
                <textarea
                  rows={2}
                  value={showFormData.notes}
                  onChange={(e) => setShowFormData({ ...showFormData, notes: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded-lg font-semibold text-[#f9f6f0] focus:outline-none"
                />
              </div>

              {/* Ekip Pay */}
              <div className="space-y-2 border-t border-[#2c251e] pt-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] text-[#a3978b] uppercase tracking-wider">Phân công Ekip & Tiền công</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentCrew = showFormData.assignedStaff.crewList || [];
                      setShowFormData({
                        ...showFormData,
                        assignedStaff: { crewList: [...currentCrew, { id: 'c-' + Date.now(), name: '', role: 'Photo', pay: 0 }] }
                      });
                    }}
                    className="text-[10px] font-bold text-[#f9f6f0] bg-[#24201c] border border-[#6b5d52] px-2 py-0.5 rounded"
                  >
                    + Thêm Nhân Sự
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(showFormData.assignedStaff.crewList || []).map((member, idx) => (
                    <div key={member.id || idx} className="bg-[#24201c]/40 p-2 rounded-lg border border-[#52443a] flex flex-col gap-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <select
                          value={member.role}
                          onChange={(e) => {
                            const updated = [...showFormData.assignedStaff.crewList];
                            updated[idx].role = e.target.value;
                            setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } });
                          }}
                          style={{ fontSize: '16px' }}
                          className="w-full px-2 py-1 bg-[#1b1815] border border-[#6b5d52] rounded font-semibold text-[#f9f6f0]"
                        >
                          <option value="Photo">Photo</option>
                          <option value="Video">Video</option>
                          <option value="Makeup">Makeup</option>
                          <option value="Làm tóc">Làm tóc</option>
                          <option value="Freelance">Freelance</option>
                        </select>

                        <select
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...showFormData.assignedStaff.crewList];
                            updated[idx].name = e.target.value;
                            setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } });
                          }}
                          style={{ fontSize: '16px' }}
                          className="w-full px-2 py-1 bg-[#1b1815] border border-[#6b5d52] rounded font-semibold text-[#f9f6f0]"
                        >
                          <option value="">-- Chọn Nhân Sự --</option>
                          {staffList.map((st) => (
                            <option key={st.id} value={st.name}>{st.name} ({st.role})</option>
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
                            setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } });
                          }}
                          style={{ fontSize: '16px' }}
                          className="flex-1 px-2.5 py-1 bg-[#1b1815] border border-[#6b5d52] rounded font-bold text-rose-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = showFormData.assignedStaff.crewList.filter((_, i) => i !== idx);
                            setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } });
                          }}
                          className="text-[#a3978b] hover:text-rose-300 p-1 bg-[#1b1815] border border-[#6b5d52] rounded"
                        >
                          <Icons.X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chi Phí Khác */}
              <div className="space-y-1.5 border-t border-[#2c251e] pt-2.5">
                <span className="font-bold text-[10px] text-[#a3978b] uppercase tracking-wider block">Chi Phí Khác</span>
                <div className="space-y-1">
                  {(showFormData.expenses || []).map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center bg-[#24201c]/40 p-1.5 rounded border border-[#52443a]">
                      <span className="font-medium text-[#c9bbaE] truncate pr-2">{exp.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold text-rose-300">-{formatCurrency(exp.amount)}</span>
                        <button type="button" onClick={() => handleRemoveExpense(exp.id)} className="text-rose-300">
                          <Icons.X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Tên chi phí"
                    value={newExpenseTitle}
                    onChange={(e) => setNewExpenseTitle(e.target.value)}
                    style={{ fontSize: '16px' }}
                    className="flex-1 px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded text-[#f9f6f0]"
                  />
                  <input
                    type="number"
                    placeholder="Số tiền"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    style={{ fontSize: '16px' }}
                    className="w-24 px-2 py-1 bg-[#24201c] border border-[#6b5d52] rounded font-bold text-rose-300"
                  />
                  <button type="button" onClick={handleAddExpense} className="px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] text-[#f9f6f0] rounded">
                    + Thêm
                  </button>
                </div>
              </div>

              {/* Finance Input */}
              <div className="space-y-2 border-t border-[#2c251e] pt-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Giá Hợp Đồng (VNĐ)</label>
                  <input
                    type="number"
                    value={showFormData.totalAmount || ''}
                    onChange={(e) => setShowFormData({ ...showFormData, totalAmount: e.target.value === '' ? 0 : Number(e.target.value) })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded font-bold text-[#f9f6f0]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Tiền Đặt Cọc (VNĐ)</label>
                  <input
                    type="number"
                    value={showFormData.depositAmount || ''}
                    onChange={(e) => setShowFormData({ ...showFormData, depositAmount: e.target.value === '' ? 0 : Number(e.target.value) })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded font-bold text-[#f9f6f0]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#c9bbaE]">Trạng Thái</label>
                  <select
                    value={showFormData.status}
                    onChange={(e) => setShowFormData({ ...showFormData, status: e.target.value })}
                    style={{ fontSize: '16px' }}
                    className="w-full px-2.5 py-1 bg-[#24201c] border border-[#6b5d52] rounded font-bold text-[#f9f6f0]"
                  >
                    <option value="Chưa cọc">Chưa cọc</option>
                    <option value="Đã cọc">Đã cọc</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2.5 border-t border-[#2c251e]">
                <button 
                  type="button" 
                  onClick={() => { 
                    const targetDate = showFormData.date;
                    setIsShowModalOpen(false); 
                    if (targetDate) openDayDetailByDate(targetDate);
                  }} 
                  className="px-3 py-1 border border-[#3c342c] rounded text-[#c9bbaE]"
                >
                  Hủy
                </button>
                <button type="submit" className="px-3 py-1 bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] rounded font-semibold">
                  Lưu Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STAFF FORM */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141210]/85 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#1b1815] rounded-2xl border border-[#2c251e] shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-[#2c251e] flex justify-between items-center bg-[#1b1815]">
              <h3 className="font-bold text-sm text-[#f9f6f0]">Thêm Nhân Sự Mới</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-[#a3978b] hover:text-[#f9f6f0]">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} autoComplete="off" className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#c9bbaE] mb-1">Tên Nhân Sự *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded-lg font-semibold text-[#f9f6f0]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#c9bbaE] mb-1">Vị Trí Chuyên Môn</label>
                <select
                  value={staffFormData.role}
                  onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded-lg font-semibold text-[#f9f6f0]"
                >
                  <option value="Photo">Photo</option>
                  <option value="Quay phim">Quay phim</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Làm tóc">Làm tóc</option>
                  <option value="Freelance">Freelance Hỗ Trợ</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#c9bbaE] mb-1">Số Điện Thoại</label>
                <input
                  type="text"
                  placeholder="0901234567"
                  value={staffFormData.phone}
                  onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                  style={{ fontSize: '16px' }}
                  className="w-full px-2.5 py-1.5 bg-[#24201c] border border-[#3c342c] rounded-lg font-semibold text-[#f9f6f0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2c251e]">
                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="px-3.5 py-1.5 border border-[#3c342c] rounded-lg text-[#c9bbaE]">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] rounded-lg font-semibold">
                  Thêm Nhân Sự
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CALENDAR DAY DETAIL */}
      {selectedCalendarDay && (
        <div className="fixed inset-0 z-50 bg-[#141210]/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#1b1815] rounded-2xl border border-[#2c251e] shadow-xl w-full max-w-lg p-4 sm:p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2c251e] pb-3">
              <div>
                <h3 className="font-bold text-[#f9f6f0]">Lịch Chụp Ngày {new Date(selectedCalendarDay.dateStr).toLocaleDateString('vi-VN')}</h3>
                <p className="text-xs text-[#a3978b] font-medium">Tổng số: {selectedCalendarDay.shows.length} show</p>
              </div>
              <button onClick={() => setSelectedCalendarDay(null)} className="text-[#a3978b] hover:text-[#f9f6f0]">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {selectedCalendarDay.shows.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-[#a3978b] font-medium">Chưa có lịch chụp nào trong ngày này.</p>
                  <button
                    onClick={() => {
                      const dateStr = selectedCalendarDay.dateStr;
                      setSelectedCalendarDay(null);
                      handleOpenShowModal(null, dateStr);
                    }}
                    className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Icons.Plus className="w-4 h-4 text-[#c9bbaE]" /> Thêm Show Mới Cho Ngày Này
                  </button>
                </div>
              ) : (
                selectedCalendarDay.shows.map((show) => {
                  const totalPackage = Number(show.totalAmount || 0);
                  const deposit = Number(show.depositAmount || 0);
                  const remaining = totalPackage - deposit;

                  return (
                    <div key={show.id} className="bg-[#24201c]/40 p-3.5 rounded-xl border border-[#2c251e] space-y-3">
                      <div className="flex justify-between items-start gap-2 border-b border-[#2c251e] pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#f9f6f0]">{show.clientName}</h4>
                            <span className="text-[10px] font-bold bg-[#24201c] border border-[#3c342c] text-[#f9f6f0] px-2 py-0.5 rounded-md">{show.packageType}</span>
                          </div>
                          <p className="text-xs text-[#a3978b] font-medium mt-0.5">📞 SĐT: {show.clientPhone || 'Chưa có'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedCalendarDay(null); handleOpenShowModal(show); }} className="text-xs font-semibold text-[#c9bbaE] hover:underline flex items-center gap-1">
                            <Icons.Edit className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button onClick={() => handleDeleteShow(show.id, selectedCalendarDay.dateStr)} className="text-rose-300 hover:text-rose-400 p-1 bg-[#1b1815] border border-[#4d302e] rounded-md" title="Xóa show này">
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#1b1815] p-2 rounded-lg border border-[#2c251e] flex items-center gap-1.5 text-[#c9bbaE]">
                          <Icons.Clock className="w-3.5 h-3.5 text-[#a3978b] shrink-0" />
                          <span><strong>Thời gian:</strong> {show.startTime || '08:00'} - {show.endTime || '12:00'}</span>
                        </div>
                        <div className="bg-[#1b1815] p-2 rounded-lg border border-[#2c251e] text-[#c9bbaE] truncate">
                          <span>📍 <strong>Địa điểm:</strong> {show.location || 'Chưa cập nhật'}</span>
                        </div>
                      </div>

                      <div className="bg-[#1b1815] p-2.5 rounded-lg border border-[#2c251e] space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#a3978b] font-medium">Giá gói chụp:</span>
                          <span className="font-bold text-[#f9f6f0]">{formatCurrency(totalPackage)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#c9bbaE]">
                          <span className="font-medium">Đã đặt cọc:</span>
                          <span className="font-bold text-[#f9f6f0]">{formatCurrency(deposit)}</span>
                        </div>
                        <div className="flex justify-between items-center text-rose-300 pt-1 border-t border-[#2c251e]">
                          <span className="font-medium">Còn lại phải thu:</span>
                          <span className="font-bold">{formatCurrency(remaining)}</span>
                        </div>
                      </div>

                      <div className="bg-[#1b1815] p-2.5 rounded-lg border border-[#2c251e] space-y-1 text-xs">
                        <span className="font-bold text-[11px] text-[#a3978b] uppercase tracking-wider block mb-1">Phân công Nhân sự & Tiền công:</span>
                        {getNormalizeCrewList(show.assignedStaff).map((c, i) => (
                          <div key={c.id || i} className="flex justify-between text-[#c9bbaE] border-b border-[#25201b] last:border-none py-0.5">
                            <span>👤 {c.role}: <strong>{c.name}</strong></span>
                            <span className="font-semibold text-rose-300">{formatCurrency(c.pay)}</span>
                          </div>
                        ))}
                        {getNormalizeCrewList(show.assignedStaff).length === 0 && (
                          <p className="text-[#6b625b] italic">Chưa phân công nhân sự</p>
                        )}
                      </div>

                      {show.notes && (
                        <div className="bg-[#1b1815] p-2.5 rounded-lg text-xs text-[#c9bbaE] space-y-0.5 border border-[#2c251e]">
                          <span className="font-bold block text-[11px] text-[#a3978b]">📝 Ghi chú buổi chụp:</span>
                          <p className="leading-relaxed">{show.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#2c251e]">
                        <button
                          onClick={() => setConfirmationModal({ isOpen: true, type: 'client', show })}
                          className="flex-1 bg-[#26211c] border border-[#3c342c] hover:bg-[#332b24] text-[#f9f6f0] px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          📄 Thông tin gửi Khách xác nhận
                        </button>
                        <button
                          onClick={() => setConfirmationModal({ isOpen: true, type: 'staff', show })}
                          className="flex-1 bg-[#1b1815] hover:bg-[#26211c] text-[#c9bbaE] border border-[#2c251e] px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          👥 Thông tin gửi Nhân sự xác nhận
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#2c251e]">
              {selectedCalendarDay.shows.length > 0 && (
                <button
                  onClick={() => {
                    const dateStr = selectedCalendarDay.dateStr;
                    setSelectedCalendarDay(null);
                    handleOpenShowModal(null, dateStr);
                  }}
                  className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Icons.Plus className="w-4 h-4 text-[#c9bbaE]" /> Thêm Show Mới
                </button>
              )}
              <button onClick={() => setSelectedCalendarDay(null)} className="px-3.5 py-1.5 border border-[#2c251e] text-[#c9bbaE] rounded-xl text-xs font-semibold ml-auto">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPORT CONFIRMATION CARDS (CLIENT / STAFF) */}
      {confirmationModal.isOpen && confirmationModal.show && (
        <div className="fixed inset-0 z-50 bg-[#141210]/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#1b1815] rounded-2xl border border-[#2c251e] shadow-2xl w-full max-w-md overflow-hidden my-6">
            <div className="p-3.5 border-b border-[#2c251e] flex justify-between items-center bg-[#1b1815]">
              <span className="font-bold text-xs uppercase tracking-wider text-[#c9bbaE]">
                {confirmationModal.type === 'client' ? '📋 Phiếu Xác Nhận Dành Cho Khách Hàng' : '📌 Phiếu Xếp Lịch Cho Nhân Sự'}
              </span>
              <button
                onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })}
                className="text-[#a3978b] hover:text-[#f9f6f0] p-1"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 bg-[#1b1815] space-y-4 text-[#f9f6f0]">
              <div className="text-center border-b border-[#2c251e] pb-3 space-y-1">
                <span className="font-bold text-sm tracking-tight text-[#f9f6f0]">OUR JUNE STUDIO</span>
                <p className="text-[10px] text-[#a3978b] font-semibold uppercase tracking-widest">
                  {confirmationModal.type === 'client' ? 'XÁC NHẬN THÔNG TIN BẢNG GIÁ & LỊCH CHỤP' : 'THÔNG TIN PHÂN CÔNG LỊCH EKIP CHỤP'}
                </p>
              </div>

              {confirmationModal.type === 'client' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">Khách hàng:</span>
                      <strong className="text-[#f9f6f0]">{confirmationModal.show.clientName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">Số điện thoại:</span>
                      <strong className="text-[#c9bbaE]">{confirmationModal.show.clientPhone || 'Chưa cung cấp'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">Gói dịch vụ:</span>
                      <span className="font-bold bg-[#1b1815] text-[#c9bbaE] border border-[#3c342c] px-2 py-0.5 rounded text-[10px]">{confirmationModal.show.packageType}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e]">
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">📅 Ngày thực hiện:</span>
                      <strong className="text-[#f9f6f0]">{new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">⏰ Thời gian:</span>
                      <strong className="text-[#f9f6f0]">{confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">📍 Địa điểm:</span>
                      <strong className="text-[#f9f6f0] text-right truncate max-w-[200px]">{confirmationModal.show.location || 'Tại Studio Our June'}</strong>
                    </div>
                  </div>

                  <div className="bg-[#24201c]/50 p-3.5 rounded-xl border border-[#2c251e] space-y-1.5">
                    <div className="flex justify-between text-[#c9bbaE]">
                      <span>Giá hợp đồng:</span>
                      <strong className="text-[#f9f6f0]">{formatCurrency(confirmationModal.show.totalAmount)}</strong>
                    </div>
                    <div className="flex justify-between text-[#c9bbaE]">
                      <span>Đã đặt cọc:</span>
                      <strong className="text-[#f9f6f0]">{formatCurrency(confirmationModal.show.depositAmount)}</strong>
                    </div>
                    <div className="flex justify-between text-rose-300 font-bold border-t border-[#2c251e] pt-1.5 text-sm">
                      <span>Còn lại cần thanh toán:</span>
                      <span>{formatCurrency(Number(confirmationModal.show.totalAmount || 0) - Number(confirmationModal.show.depositAmount || 0))}</span>
                    </div>
                  </div>

                  <div className="bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e] space-y-1">
                    <span className="font-bold text-[11px] text-[#a3978b] uppercase tracking-wider block">📝 Ghi chú buổi chụp:</span>
                    <p className="text-[#f9f6f0] leading-relaxed whitespace-pre-wrap">{confirmationModal.show.notes || 'Không có ghi chú'}</p>
                  </div>
                </div>
              )}

              {confirmationModal.type === 'staff' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">Tên Show / Gói:</span>
                      <span className="font-bold text-[#f9f6f0]">{confirmationModal.show.packageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">Tên Khách Hàng:</span>
                      <strong className="text-[#f9f6f0]">{confirmationModal.show.clientName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">📞 SĐT Khách Hàng:</span>
                      <strong className="text-[#c9bbaE]">{confirmationModal.show.clientPhone || 'Chưa cung cấp'}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e]">
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">📅 Ngày chụp:</span>
                      <strong className="text-[#f9f6f0]">{new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">⏰ Thời gian làm việc:</span>
                      <strong className="text-[#f9f6f0]">{confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a3978b]">📍 Địa điểm:</span>
                      <strong className="text-[#f9f6f0]">{confirmationModal.show.location || 'Tại Studio'}</strong>
                    </div>
                  </div>

                  <div className="bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e] space-y-1.5">
                    <span className="font-bold text-[11px] text-[#a3978b] uppercase tracking-wider block">Phân công Nhân sự Ekip:</span>
                    {getNormalizeCrewList(confirmationModal.show.assignedStaff).map((c, i) => (
                      <div key={c.id || i} className="flex justify-between border-b border-[#25201b] pb-1 last:border-none">
                        <span className="text-[#a3978b]">👤 {c.role}:</span>
                        <strong className="text-[#f9f6f0]">{c.name}</strong>
                      </div>
                    ))}
                    {getNormalizeCrewList(confirmationModal.show.assignedStaff).length === 0 && (
                      <span className="text-[#6b625b] italic">Chưa chọn nhân sự</span>
                    )}
                  </div>

                  <div className="bg-[#24201c]/50 p-3 rounded-xl border border-[#2c251e] space-y-1">
                    <span className="font-bold text-[11px] text-[#a3978b] uppercase tracking-wider block">📝 Ghi chú cho Ekip:</span>
                    <p className="text-[#f9f6f0] leading-relaxed whitespace-pre-wrap">{confirmationModal.show.notes || 'Không có ghi chú'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#1b1815] border-t border-[#2c251e] flex justify-between gap-2">
              <button
                onClick={() => {
                  const show = confirmationModal.show;
                  let text = '';
                  if (confirmationModal.type === 'client') {
                    text = `[OUR JUNE STUDIO] XÁC NHẬN LỊCH CHỤP\n- Khách hàng: ${show.clientName}\n- Gói dịch vụ: ${show.packageType}\n- Ngày chụp: ${new Date(show.date).toLocaleDateString('vi-VN')}\n- Giờ: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n- Địa điểm: ${show.location || 'Studio'}\n- Tổng giá trị: ${formatCurrency(show.totalAmount)}\n- Đã cọc: ${formatCurrency(show.depositAmount)}\n- Còn lại: ${formatCurrency(Number(show.totalAmount || 0) - Number(show.depositAmount || 0))}\n- Ghi chú: ${show.notes || 'Không có'}\n\nQuý khách vui lòng kiểm tra lại giúp Studio nhé!`;
                  } else {
                    const crewListText = getNormalizeCrewList(show.assignedStaff)
                      .map(c => `+ ${c.role}: ${c.name}`)
                      .join('\n');
                    text = `[OUR JUNE STUDIO] THÔNG BÁO LỊCH CHỤP EKIP\n- Show: ${show.packageType} (${show.clientName})\n- SĐT Khách: ${show.clientPhone || 'Chưa có'}\n- Ngày: ${new Date(show.date).toLocaleDateString('vi-VN')}\n- Giờ làm việc: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n- Địa điểm: ${show.location || 'Studio'}\n\nPhân công Ekip:\n${crewListText || '+ Chưa phân công'}\n\nGhi chú: ${show.notes || 'Không có'}\n\nAnh/em lưu ý có mặt đúng giờ nhé!`;
                  }
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                      alert('Đã sao chép tin nhắn xác nhận!');
                    }).catch(() => {
                      alert('Không thể sao chép tự động.');
                    });
                  }
                }}
                className="flex-1 bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#332b24] transition shadow-2xs"
              >
                📋 Sao Chép Tin Nhắn
              </button>
              <button
                onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })}
                className="px-4 py-1.5 border border-[#2c251e] text-[#c9bbaE] rounded-xl text-xs font-semibold hover:bg-[#26211c]"
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
