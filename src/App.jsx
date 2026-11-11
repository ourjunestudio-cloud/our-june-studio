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

// GOOGLE CLIENT ID CỦA VIỆT
const GOOGLE_CLIENT_ID = "83206256640-mdhtk892f3vimvegdfm2jgm63ebp0a1r.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const getVietnamTodayStr = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vnTime = new Date(utc + (3600000 * 7));
  return vnTime.toISOString().split('T')[0];
};

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
  'Có khách hỏi',
  'Thử váy và trao đổi với khách',
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
  const currentVNDate = getVietnamTodayStr();
  const currentVNObj = new Date(currentVNDate);

  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(currentVNObj.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentVNObj.getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [shows, setShows] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const unsubShows = onSnapshot(collection(db, "shows"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setShows(items);
    });

    const unsubStaff = onSnapshot(collection(db, "staff"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStaffList(items);
    });

    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: (response) => {
            if (response && response.access_token) {
              localStorage.setItem('google_access_token', response.access_token);
              setIsGoogleConnected(true);
            }
          },
        });
        setTokenClient(client);
        if (localStorage.getItem('google_access_token')) {
          setIsGoogleConnected(true);
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      unsubShows();
      unsubStaff();
    };
  }, []);

  const handleConnectGoogle = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  };

  const syncShowToGoogleCalendar = async (showData) => {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) return;

    const startDate = showData.date;
    const endDateObj = showData.endDate ? new Date(showData.endDate) : new Date(showData.date);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDateStr = endDateObj.toISOString().split('T')[0];

    let colorId = '2'; 
    if (showData.packageType === 'Có khách hỏi') {
      colorId = '5'; 
    } else if (showData.packageType === 'Thử váy và trao đổi với khách') {
      colorId = '9'; 
    } else if (showData.packageType === 'Makeup') {
      colorId = '4'; 
    } else if (['Prewedding', 'Photoshoot', 'Tiệc báo hỷ', 'Đính hôn', 'Thành hôn', 'Tiệc thân mật'].includes(showData.packageType)) {
      colorId = '10'; 
    }

    const eventDetails = {
      summary: `[${showData.packageType}] ${showData.clientName}`,
      description: `SĐT: ${showData.clientPhone || 'Không có'}\nĐịa điểm: ${showData.location || 'Studio'}\nGhi chú: ${showData.notes || 'Không có'}`,
      location: showData.location || 'Our June Studio',
      start: { date: startDate },
      end: { date: endDateStr },
      colorId: colorId,
    };

    try {
      await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
    } catch (err) {
      console.error("Lỗi đồng bộ Google Calendar:", err);
    }
  };

  const deleteShowFromGoogleCalendar = async (showData) => {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) return;

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (data.items) {
        const eventMatch = data.items.find(event => 
          event.summary && event.summary.includes(showData.clientName) &&
          event.start && event.start.date === showData.date
        );
        if (eventMatch) {
          await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventMatch.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` },
          });
        }
      }
    } catch (err) {
      console.error("Lỗi xóa sự kiện trên Google Calendar:", err);
    }
  };

  const handleSyncAllOldShows = async () => {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) return;

    let count = 0;
    for (const show of shows) {
      if (show.date) {
        await syncShowToGoogleCalendar(show);
        count++;
      }
    }
  };

  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [expandedAnalyticsMonth, setExpandedAnalyticsMonth] = useState(null);
  const [selectedStaffForModal, setSelectedStaffForModal] = useState(null);
  
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffFormData, setStaffFormData] = useState({ name: '', role: 'Photo', phone: '' });

  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: 'client', show: null });

  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(selectedMonth);
  const [pickerYear, setPickerYear] = useState(selectedYear);

  const [showFormData, setShowFormData] = useState({
    clientName: '',
    clientPhone: '',
    date: '', 
    endDate: '', 
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

  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const isNonCommercialPackage = (pkgType) => pkgType === 'Thử váy và trao đổi với khách' || pkgType === 'Có khách hỏi';

  const getNormalizeCrewList = (assignedStaff) => {
    if (!assignedStaff) return [];
    if (assignedStaff.crewList && Array.isArray(assignedStaff.crewList)) {
      return assignedStaff.crewList;
    }
    return [];
  };

  const calculateShowStaffPay = (show) => {
    if (isNonCommercialPackage(show.packageType)) return 0;
    const crewList = getNormalizeCrewList(show.assignedStaff);
    return crewList.reduce((sum, item) => sum + Number(item.pay || 0), 0);
  };

  const calculateShowOtherExpenses = (show) => {
    if (isNonCommercialPackage(show.packageType)) return 0;
    return (show.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const calculateShowTotalExpenses = (show) => {
    if (isNonCommercialPackage(show.packageType)) return 0;
    const staffPay = calculateShowStaffPay(show);
    const otherExpenses = calculateShowOtherExpenses(show);
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

  const isShowOnDate = (show, dateStr) => {
    if (!show.date) return false;
    const start = show.date;
    const end = show.endDate || show.date;
    return dateStr >= start && dateStr <= end;
  };

  const currentMonthShows = useMemo(() => {
    const filtered = shows.filter((show) => {
      if (!show.date) return false;
      if (isNonCommercialPackage(show.packageType)) return false;

      const d = new Date(show.date);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const matchMonth = m === selectedMonth && y === selectedYear;

      const matchSearch =
        show.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.packageType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || show.status === statusFilter;

      return (matchMonth || (show.endDate && new Date(show.endDate).getMonth() + 1 === selectedMonth)) && matchSearch && matchStatus;
    });

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
    let commercialShowsCount = 0;

    shows.forEach((show) => {
      if (!show.date) return;
      const d = new Date(show.date);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      
      const isInMonth = (m === selectedMonth && y === selectedYear) || 
                        (show.endDate && new Date(show.endDate).getMonth() + 1 === selectedMonth && new Date(show.endDate).getFullYear() === selectedYear);

      if (isInMonth) {
        if (!isNonCommercialPackage(show.packageType)) {
          commercialShowsCount++;
          totalRevenue += Number(show.totalAmount || 0);
          totalDeposit += Number(show.depositAmount || 0);
          totalExpenses += calculateShowTotalExpenses(show);
          if (show.status === 'Đã thanh toán') completedShowsCount++;
        }
      }
    });

    const netProfit = totalRevenue - totalExpenses;
    const remainingToCollect = totalRevenue - totalDeposit;

    return { totalRevenue, totalDeposit, remainingToCollect, totalExpenses, netProfit, count: commercialShowsCount, completedShowsCount };
  }, [shows, selectedMonth, selectedYear]);

  const yearlyStats = useMemo(() => {
    const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      let revenue = 0, expenses = 0, staffPayExpenses = 0, otherExpenses = 0, count = 0, makeupRevenue = 0, photoRevenue = 0;
      const staffEarnings = {}, staffShowCounts = {};

      shows.forEach((s) => {
        if (!s.date) return;
        const d = new Date(s.date);
        if (d.getFullYear() === selectedYear && d.getMonth() + 1 === monthNum) {
          if (isNonCommercialPackage(s.packageType)) return;

          const totalAmt = Number(s.totalAmount || 0);
          revenue += totalAmt;
          
          const sPay = calculateShowStaffPay(s);
          const oExp = calculateShowOtherExpenses(s);
          staffPayExpenses += sPay;
          otherExpenses += oExp;
          expenses += (sPay + oExp);
          count++;

          if (s.packageType === 'Makeup') makeupRevenue += totalAmt;
          else photoRevenue += totalAmt;

          const crewList = getNormalizeCrewList(s.assignedStaff);
          crewList.forEach((c) => {
            if (c.name && Number(c.pay) > 0) {
              staffEarnings[c.name] = (staffEarnings[c.name] || 0) + Number(c.pay);
              staffShowCounts[c.name] = (staffShowCounts[c.name] || 0) + 1;
            }
          });
        }
      });

      return { month: monthNum, revenue, expenses, staffPayExpenses, otherExpenses, profit: revenue - expenses, count, makeupRevenue, photoRevenue, staffEarnings, staffShowCounts };
    });

    const annualSummary = monthlyBreakdown.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalExpenses: acc.totalExpenses + curr.expenses,
        totalStaffPay: acc.totalStaffPay + curr.staffPayExpenses,
        totalOtherExpenses: acc.totalOtherExpenses + curr.otherExpenses,
        totalProfit: acc.totalProfit + curr.profit,
        totalShows: acc.totalShows + curr.count
      }),
      { totalRevenue: 0, totalExpenses: 0, totalStaffPay: 0, totalOtherExpenses: 0, totalProfit: 0, totalShows: 0 }
    );

    return { monthlyBreakdown, annualSummary };
  }, [shows, selectedYear]);

  const handleExportYearlyExcel = () => {
    try {
      let csvContent = "\uFEFF";
      csvContent += `BÁO CÁO TỔNG KẾT TÀI CHÍNH NĂM ${selectedYear} - OUR JUNE STUDIO\n\n`;
      csvContent += `Tháng,Số lượng Show,Doanh Thu (VNĐ),Chi Phí Lương Thợ (VNĐ),Chi Phí Khác (VNĐ),Tổng Chi Phí (VNĐ),Lợi Nhuận Ròng (VNĐ),Doanh Thu Chụp Ảnh,Doanh Thu Makeup\n`;

      yearlyStats.monthlyBreakdown.forEach((item) => {
        csvContent += `Tháng ${item.month},${item.count},${item.revenue},${item.staffPayExpenses},${item.otherExpenses},${item.expenses},${item.profit},${item.photoRevenue},${item.makeupRevenue}\n`;
      });

      csvContent += `\nTỔNG CẢ NĂM,${yearlyStats.annualSummary.totalShows},${yearlyStats.annualSummary.totalRevenue},${yearlyStats.annualSummary.totalStaffPay},${yearlyStats.annualSummary.totalOtherExpenses},${yearlyStats.annualSummary.totalExpenses},${yearlyStats.annualSummary.totalProfit},,\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OurJune_Studio_BaoCaoNam_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi xuất Excel:", err);
    }
  };

  const getStaffYearlyShows = (staffName) => {
    if (!staffName) return [];
    const matchedShows = [];
    shows.forEach((s) => {
      if (!s.date) return;
      if (isNonCommercialPackage(s.packageType)) return;
      const d = new Date(s.date);
      if (d.getFullYear() === selectedYear) {
        const crewList = getNormalizeCrewList(s.assignedStaff);
        const memberItem = crewList.find(c => c.name === staffName && Number(c.pay || 0) > 0);
        if (memberItem) {
          matchedShows.push({
            id: s.id, date: s.date, endDate: s.endDate, packageType: s.packageType || 'Chụp hình',
            clientName: s.clientName || '', memberId: memberItem.id || memberItem.name,
            pay: memberItem.pay || 0, paid: !!memberItem.paid
          });
        }
      }
    });
    return matchedShows.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleToggleStaffPaid = async (showId, memberIdentifier, currentPaidStatus) => {
    const nextPaidStatus = !currentPaidStatus;

    if (selectedCalendarDay) {
      const updatedDayShows = selectedCalendarDay.shows.map(s => {
        if (s.id === showId) {
          const crewList = getNormalizeCrewList(s.assignedStaff);
          const updatedCrewList = crewList.map(c => {
            const identifier = c.id || c.name;
            if (identifier === memberIdentifier) return { ...c, paid: nextPaidStatus };
            return c;
          });
          return { ...s, assignedStaff: { crewList: updatedCrewList } };
        }
        return s;
      });
      setSelectedCalendarDay(prev => ({ ...prev, shows: updatedDayShows }));
    }

    try {
      const showObj = shows.find(s => s.id === showId);
      if (!showObj) return;

      const crewList = getNormalizeCrewList(showObj.assignedStaff);
      const updatedCrewList = crewList.map((c) => {
        const identifier = c.id || c.name;
        if (identifier === memberIdentifier) return { ...c, paid: nextPaidStatus };
        return c;
      });

      const showRef = doc(db, "shows", showId);
      await updateDoc(showRef, { assignedStaff: { crewList: updatedCrewList } });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thanh toán lương:", error);
    }
  };

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
        const dayShows = shows.filter((s) => isShowOnDate(s, dateStr)).sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
        daysArr.push({ dayNum: prevDayNum, dateStr, isCurrentMonth: false, shows: dayShows });
      } else if (i >= startDayOfWeek + daysInMonth) {
        const nextDayNum = i - (startDayOfWeek + daysInMonth) + 1;
        const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
        const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
        const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => isShowOnDate(s, dateStr)).sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
        daysArr.push({ dayNum: nextDayNum, dateStr, isCurrentMonth: false, shows: dayShows });
      } else {
        const dayNum = i - startDayOfWeek + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const dayShows = shows.filter((s) => isShowOnDate(s, dateStr)).sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
        daysArr.push({ dayNum, dateStr, isCurrentMonth: true, shows: dayShows });
      }
    }
    return daysArr;
  }, [selectedMonth, selectedYear, shows]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(selectedYear - 1); }
    else { setSelectedMonth(selectedMonth - 1); }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(selectedYear + 1); }
    else { setSelectedMonth(selectedMonth + 1); }
  };

  const handleOpenShowModal = (showToEdit = null, defaultDate = null) => {
    if (showToEdit) {
      setEditingShow(showToEdit);
      setShowFormData({
        clientName: showToEdit.clientName || '', clientPhone: showToEdit.clientPhone || '',
        date: showToEdit.date || '', endDate: showToEdit.endDate || '',
        startTime: showToEdit.startTime || '', endTime: showToEdit.endTime || '',
        packageType: showToEdit.packageType || '', location: showToEdit.location || '',
        assignedStaff: { crewList: getNormalizeCrewList(showToEdit.assignedStaff) },
        totalAmount: showToEdit.totalAmount || 0, depositAmount: showToEdit.depositAmount || 0,
        status: showToEdit.status || 'Chưa cọc', expenses: showToEdit.expenses || [], notes: showToEdit.notes || ''
      });
    } else {
      setEditingShow(null);
      const todayStr = defaultDate || getVietnamTodayStr();
      setShowFormData({
        clientName: '', clientPhone: '', date: todayStr, endDate: '',
        startTime: '', endTime: '', packageType: '', location: '',
        assignedStaff: { crewList: [] }, totalAmount: 0, depositAmount: 0,
        status: 'Chưa cọc', expenses: [], notes: ''
      });
    }
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setIsDateRangePickerOpen(false);
    setPickerMonth(selectedMonth);
    setPickerYear(selectedYear);
    setIsShowModalOpen(true);
  };

  const openDayDetailByDate = (targetDateStr, updatedShowsList = shows) => {
    if (!targetDateStr) return;
    const dayShows = updatedShowsList
      .filter((s) => isShowOnDate(s, targetDateStr))
      .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    
    const dObj = new Date(targetDateStr);
    if (!isNaN(dObj.getTime())) {
      setSelectedMonth(dObj.getMonth() + 1);
      setSelectedYear(dObj.getFullYear());
    }

    setSelectedCalendarDay({ dateStr: targetDateStr, shows: dayShows, singleShowMode: dayShows.length === 1 });
    setActiveTab('calendar');
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    const targetDate = showFormData.date;
    const isNonComm = isNonCommercialPackage(showFormData.packageType);

    const payload = {
      ...showFormData,
      totalAmount: isNonComm ? 0 : Number(showFormData.totalAmount || 0),
      depositAmount: isNonComm ? 0 : Number(showFormData.depositAmount || 0),
      expenses: isNonComm ? [] : showFormData.expenses,
      assignedStaff: isNonComm ? { crewList: [] } : showFormData.assignedStaff
    };

    try {
      let updatedShows = [...shows];
      if (editingShow) {
        const showRef = doc(db, "shows", editingShow.id);
        await updateDoc(showRef, payload);
        updatedShows = updatedShows.map(s => s.id === editingShow.id ? { ...payload, id: editingShow.id } : s);
      } else {
        const docRef = await addDoc(collection(db, "shows"), payload);
        updatedShows.push({ ...payload, id: docRef.id });
        syncShowToGoogleCalendar(payload);
      }
      setIsShowModalOpen(false);
      openDayDetailByDate(targetDate, updatedShows);
    } catch (error) {
      console.error("Lỗi lưu show:", error);
    }
  };

  const handleDeleteShow = async (id, targetDate = null) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch này?")) {
      try {
        const showToDelete = shows.find(s => s.id === id);
        if (showToDelete) {
          await deleteShowFromGoogleCalendar(showToDelete);
        }
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
    const newExp = { id: 'exp-' + Date.now(), title: newExpenseTitle, amount: Number(newExpenseAmount) };
    setShowFormData({ ...showFormData, expenses: [...(showFormData.expenses || []), newExp] });
    setNewExpenseTitle('');
    setNewExpenseAmount('');
  };

  const handleRemoveExpense = (id) => {
    setShowFormData({ ...showFormData, expenses: (showFormData.expenses || []).filter((item) => item.id !== id) });
  };

  const handleOpenStaffModal = (staffToEdit = null) => {
    if (staffToEdit) {
      setEditingStaff(staffToEdit);
      setStaffFormData({ name: staffToEdit.name || '', role: staffToEdit.role || 'Photo', phone: staffToEdit.phone || '' });
    } else {
      setEditingStaff(null);
      setStaffFormData({ name: '', role: 'Photo', phone: '' });
    }
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffFormData.name) return;
    try {
      if (editingStaff) {
        const staffRef = doc(db, "staff", editingStaff.id);
        await updateDoc(staffRef, staffFormData);
      } else {
        await addDoc(collection(db, "staff"), staffFormData);
      }
      setStaffFormData({ name: '', role: 'Photo', phone: '' });
      setEditingStaff(null);
      setIsStaffModalOpen(false);
    } catch (error) {
      console.error("Lỗi lưu nhân sự:", error);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân sự này?")) {
      try { await deleteDoc(doc(db, "staff", id)); } catch (error) { console.error("Lỗi xóa nhân sự:", error); }
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({ shows, staffList }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OurJune_Studio_Backup_${getVietnamTodayStr()}.json`;
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
      case 'Chưa cọc': return <span className="bg-[#f0eae1] text-[#7a6e62] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#dcd2c4]">Chưa cọc</span>;
      case 'Đã cọc': return <span className="bg-[#e8dfd2] text-[#4a4036] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#d0c4b4]">Đã cọc</span>;
      case 'Đã thanh toán': return <span className="bg-[#e6f4ea] text-[#137333] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#ceead6]">Đã thanh toán</span>;
      default: return <span className="bg-[#f0eae1] text-[#7a6e62] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#dcd2c4]">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#2c2621] font-sans pb-20 overflow-x-hidden selection:bg-[#e0d6c8]">
      {/* Top Header */}
      <header className="bg-[#ffffff] border-b border-[#e6dfd5] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-base tracking-tight text-[#1c1815]">OUR JUNE</span>
                <span className="text-[10px] bg-[#f0eae1] text-[#635950] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#dcd2c4]">STUDIO</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleConnectGoogle}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${isGoogleConnected ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]' : 'bg-[#f0eae1] text-[#2c2621] border-[#dcd2c4]'}`}
              >
                {isGoogleConnected ? '✓ Đã kết nối Google' : '🔗 Kết nối Google'}
              </button>
              {isGoogleConnected && (
                <button
                  onClick={handleSyncAllOldShows}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#f0eae1] text-[#2c2621] border border-[#dcd2c4] hover:bg-[#e8dfd2] transition"
                  title="Đẩy toàn bộ lịch cũ lên Google Calendar"
                >
                  🔄 Đồng bộ lịch cũ
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center justify-start sm:justify-end bg-[#f2ede6] p-1 rounded-xl text-xs font-medium overflow-x-auto scrollbar-none border border-[#e6dfd5]">
            <button onClick={() => setActiveTab('calendar')} className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'calendar' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
              <Icons.Calendar className="w-3.5 h-3.5 text-[#85786c]" />
              <span>Calendar</span>
            </button>
            <button onClick={() => setActiveTab('list')} className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'list' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
              <Icons.Camera className="w-3.5 h-3.5 text-[#85786c]" />
              <span>Danh Sách</span>
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'analytics' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
              <Icons.TrendingUp className="w-3.5 h-3.5 text-[#137333]" />
              <span>Thống Kê</span>
            </button>
            <button onClick={() => setActiveTab('staff')} className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${activeTab === 'staff' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
              <Icons.Users className="w-3.5 h-3.5 text-[#85786c]" />
              <span>Ekip</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 space-y-3 overflow-x-hidden">
        {/* Month / Year Bar & Quick Data Actions */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-3 shadow-2xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#635950] uppercase tracking-wider shrink-0">Thời gian:</span>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2c2621] focus:outline-none flex-1 sm:flex-initial">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (<option key={m} value={m} className="bg-[#ffffff] text-[#2c2621]">Tháng {m}</option>))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2c2621] focus:outline-none flex-1 sm:flex-initial">
              {Array.from({ length: 17 }, (_, i) => 2024 + i).map((y) => (<option key={y} value={y} className="bg-[#ffffff] text-[#2c2621]">Năm {y}</option>))}
            </select>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => handleOpenShowModal()} className="bg-[#2c2621] text-[#f9f6f0] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#4a4036] transition">
              <Icons.Plus className="w-4 h-4 text-[#dcd2c4]" />
              <span>Tạo Lịch Hẹn / Show Mới</span>
            </button>
            <button onClick={handleExportData} title="Xuất File Sao Lưu" className="p-1.5 border border-[#dcd2c4] rounded-lg text-[#635950] hover:bg-[#f2ede6] transition">
              <Icons.Download className="w-4 h-4" />
            </button>
            <label title="Nhập File Dữ Liệu" className="p-1.5 border border-[#dcd2c4] rounded-lg text-[#635950] hover:bg-[#f2ede6] transition cursor-pointer">
              <Icons.Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#635950] uppercase tracking-wider">Tổng Show T{selectedMonth}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold text-[#1c1815]">{monthStats.count}</span>
              <span className="text-[10px] font-semibold bg-[#e6f4ea] text-[#137333] px-1.5 py-0.5 rounded border border-[#ceead6]">{monthStats.completedShowsCount} xong</span>
            </div>
          </div>

          <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#635950] uppercase tracking-wider">Doanh Thu HĐ</span>
            <div>
              <span className="text-base sm:text-xl font-bold text-[#1c1815] block truncate">{formatCurrencyCompact(monthStats.totalRevenue)}</span>
              <p className="text-[10px] text-[#635950] font-medium truncate">Còn lại: {formatCurrencyCompact(monthStats.remainingToCollect)}</p>
            </div>
          </div>

          <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#a51d24] uppercase tracking-wider">Chi Phí Show</span>
            <div>
              <span className="text-base sm:text-xl font-bold text-[#a51d24] block truncate">{formatCurrencyCompact(monthStats.totalExpenses)}</span>
              <p className="text-[10px] text-[#635950] font-medium truncate">Lương ekip & phát sinh</p>
            </div>
          </div>

          <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] shadow-2xs flex flex-col justify-between space-y-1">
            <span className="text-[11px] font-semibold text-[#137333] uppercase tracking-wider">Lợi Nhuận Ròng</span>
            <div>
              <span className="text-base sm:text-xl font-bold text-[#137333] block truncate">{formatCurrencyCompact(monthStats.netProfit)}</span>
              <p className="text-[10px] text-[#635950] font-medium truncate">Doanh thu trừ Chi phí</p>
            </div>
          </div>
        </div>

        {/* TAB 1: GOOGLE CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-3 sm:p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-1">
                  <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-[#f2ede6] text-[#635950] transition"><Icons.ChevronLeft className="w-4 h-4" /></button>
                  <h2 className="text-sm font-bold text-[#1c1815] min-w-[110px] text-center">Tháng {selectedMonth} / {selectedYear}</h2>
                  <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-[#f2ede6] text-[#635950] transition"><Icons.ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs font-normal text-[#635950] flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Có khách hỏi</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span> Thử váy & trao đổi</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9f1239]"></span> Makeup</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#166534]"></span> Show Chụp Hình</span>
              </div>
            </div>

            {/* Google Calendar Grid */}
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-7 border-b border-[#e6dfd5] text-center pb-2 min-w-[320px]">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dayName, idx) => (<div key={idx} className="text-xs font-semibold text-[#635950]">{dayName}</div>))}
              </div>

              <div className="grid grid-cols-7 border-l border-t border-[#e6dfd5] min-w-[320px]">
                {calendarDays.map((cell, idx) => {
                  const todayStr = getVietnamTodayStr();
                  const isToday = cell.dateStr === todayStr;

                  return (
                    <div key={idx} onClick={() => { if (cell.dateStr) { setSelectedCalendarDay({ dateStr: cell.dateStr, shows: cell.shows, singleShowMode: cell.shows.length === 1 }); } }} className={`min-h-[90px] sm:min-h-[120px] p-1 border-r border-b border-[#e6dfd5] flex flex-col justify-start transition ${cell.isCurrentMonth ? 'bg-[#ffffff] hover:bg-[#fcfbf9]' : 'bg-[#f7f4ef]/60'} cursor-pointer`}>
                      <div className="flex justify-center sm:justify-start mb-1">
                        <span className={`w-5 h-5 sm:w-5.5 sm:h-5.5 flex items-center justify-center rounded-full text-[11px] sm:text-xs font-medium ${isToday ? 'bg-[#2c2621] text-[#f9f6f0] font-bold shadow-2xs' : cell.isCurrentMonth ? 'text-[#1c1815]' : 'text-[#a89f91]'}`}>{cell.dayNum}</span>
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        {cell.shows.map((show) => {
                          const isAsk = show.packageType === 'Có khách hỏi';
                          const isTryDress = isNonCommercialPackage(show.packageType);
                          const isMakeupOnly = show.packageType === 'Makeup';
                          const bgStyle = isAsk ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : isTryDress ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' : isMakeupOnly ? 'bg-rose-50 text-rose-900 font-semibold border border-rose-200' : 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200';
                          const hasMultiDays = show.endDate && show.endDate !== show.date;
                          const isStartDate = show.date === cell.dateStr;
                          const isEndDate = show.endDate === cell.dateStr;

                          return (
                            <div key={show.id} className={`px-1.5 py-1 text-[9px] sm:text-[10px] leading-tight ${bgStyle} ${hasMultiDays ? (isStartDate ? 'rounded-l-md ml-0.5' : isEndDate ? 'rounded-r-md mr-0.5' : 'rounded-none mx-[-4px]') : 'rounded-md'}`} title={`${show.clientName} (${show.packageType})`}>
                              {isStartDate || !hasMultiDays ? (
                                <>
                                  <div className="font-bold uppercase tracking-tighter opacity-95 break-words">{show.packageType} {hasMultiDays && `(Ngày đầu)`}</div>
                                  <div className="font-medium break-words whitespace-normal">{show.clientName}</div>
                                </>
                              ) : (
                                <div className="text-center opacity-85 font-bold truncate">{isEndDate ? '➔ Hết' : '...'}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => handleOpenShowModal()} className="fixed bottom-6 right-6 z-40 bg-[#2c2621] hover:bg-[#4a4036] text-[#f9f6f0] p-3.5 rounded-2xl shadow-lg flex items-center justify-center transition-transform active:scale-95" title="Tạo lịch chụp mới">
              <Icons.Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* TAB 2: SHOW LIST VIEW */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Icons.Search className="w-4 h-4 absolute left-3 top-2.5 text-[#635950]" />
                <input type="text" placeholder="Tìm kiếm theo tên khách, gói chụp, địa điểm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ fontSize: '16px' }} className="w-full pl-9 pr-3 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg text-xs font-medium focus:outline-none text-[#1c1815]" />
              </div>
              <div className="flex gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ fontSize: '16px' }} className="w-full sm:w-auto px-2.5 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg text-xs font-semibold text-[#635950] focus:outline-none">
                  <option value="All" className="bg-[#ffffff] text-[#2c2621]">Tất cả trạng thái</option>
                  <option value="Chưa cọc" className="bg-[#ffffff] text-[#2c2621]">Chưa cọc</option>
                  <option value="Đã cọc" className="bg-[#ffffff] text-[#2c2621]">Đã cọc</option>
                  <option value="Đã thanh toán" className="bg-[#ffffff] text-[#2c2621]">Đã thanh toán</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {currentMonthShows.length === 0 ? (
                <div className="bg-[#ffffff] p-8 rounded-xl border border-[#e6dfd5] text-center space-y-2">
                  <p className="text-[#635950] font-medium text-xs">Chưa có show thương mại nào trong Tháng {selectedMonth}/{selectedYear}</p>
                  <button onClick={() => handleOpenShowModal()} className="text-xs font-semibold text-[#1c1815] hover:underline">+ Tạo lịch chụp mới ngay</button>
                </div>
              ) : (
                currentMonthShows.map((show) => {
                  const totalExp = calculateShowTotalExpenses(show);
                  const profit = (show.totalAmount || 0) - totalExp;
                  const otherExpensesSum = (show.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
                  const dateStr = show.endDate && show.endDate !== show.date ? `${new Date(show.date).toLocaleDateString('vi-VN')} ➔ ${new Date(show.endDate).toLocaleDateString('vi-VN')}` : new Date(show.date).toLocaleDateString('vi-VN');

                  return (
                    <div key={show.id} className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 shadow-2xs space-y-3 hover:border-[#dcd2c4] transition">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#e6dfd5] pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs bg-[#f2ede6] border border-[#dcd2c4] text-[#1c1815] px-2.5 py-0.5 rounded-md">{show.packageType}</span>
                          {renderStatusBadge(show.status)}
                          <span className="text-xs text-[#635950] font-medium">📅 {dateStr}</span>
                        </div>
                        <div className="flex items-center gap-1 self-end sm:self-auto">
                          <button onClick={() => handleOpenShowModal(show)} className="p-1.5 hover:bg-[#f2ede6] rounded-lg text-[#635950] text-xs font-medium flex items-center gap-1 border border-[#dcd2c4]">
                            <Icons.Edit className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button onClick={() => handleDeleteShow(show.id)} type="button" className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-700 text-xs font-medium border border-rose-200 cursor-pointer">
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <h3 className="font-bold text-[#1c1815] text-base">{show.clientName}</h3>
                          <p className="text-[#635950] font-medium mt-0.5">SĐT: {show.clientPhone || 'Chưa có'}</p>
                          <p className="text-[#4a4036] font-medium mt-1">📍 {show.location || 'Chưa cập nhật'}</p>
                        </div>

                        <div className="bg-[#f7f4ef]/60 p-2.5 rounded-lg border border-[#e6dfd5] space-y-1.5">
                          <span className="font-semibold text-[11px] text-[#635950] uppercase tracking-wider block">Phân công Ekip & Lương:</span>
                          <div className="space-y-1.5 text-[#4a4036]">
                            {getNormalizeCrewList(show.assignedStaff).map((member, i) => {
                              const memberIdentifier = member.id || member.name;
                              const memberPay = Number(member.pay || 0);
                              return (
                                <div key={memberIdentifier || i} className="flex items-center justify-between gap-1 bg-[#ffffff] p-1.5 rounded border border-[#e6dfd5]">
                                  <div className="truncate pr-1">
                                    <span className="font-bold text-[#1c1815]">{member.role}:</span> {member.name}
                                    <span className="font-semibold text-rose-700 block">{formatCurrency(memberPay)}</span>
                                  </div>
                                  {memberPay > 0 && (
                                    <div className="flex items-center gap-1 shrink-0 bg-[#f7f4ef] px-2 py-1 rounded border border-[#dcd2c4]">
                                      <input type="checkbox" id={`list-paid-${show.id}-${memberIdentifier}`} checked={!!member.paid} onChange={() => handleToggleStaffPaid(show.id, memberIdentifier, member.paid)} className="w-3.5 h-3.5 rounded accent-[#137333] cursor-pointer" />
                                      <label htmlFor={`list-paid-${show.id}-${memberIdentifier}`} className="cursor-pointer text-[10px] font-semibold text-[#1c1815] select-none">{member.paid ? <span className="text-[#137333]">Đã trả</span> : <span className="text-[#635950]">Chưa trả</span>}</label>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {getNormalizeCrewList(show.assignedStaff).length === 0 && (<span className="text-[#a89f91] italic">Chưa phân công</span>)}
                          </div>
                        </div>

                        <div className="bg-[#f7f4ef]/60 p-2.5 rounded-lg border border-[#e6dfd5] flex flex-col justify-between space-y-1">
                          <div className="flex justify-between text-[#4a4036]"><span>Doanh Thu HĐ:</span><span className="font-bold text-[#1c1815]">{formatCurrency(show.totalAmount)}</span></div>
                          {otherExpensesSum > 0 && (<div className="flex justify-between text-[#635950] text-[11px]"><span>Chi phí phát sinh:</span><span className="font-semibold text-rose-700">-{formatCurrency(otherExpensesSum)}</span></div>)}
                          <div className="flex justify-between text-[#4a4036]"><span>Tổng Chi Phí Show:</span><span className="font-semibold text-rose-700">-{formatCurrency(totalExp)}</span></div>
                          <div className="flex justify-between border-t border-[#e6dfd5] pt-1 font-semibold"><span className="text-[#1c1815]">Lợi Nhuận:</span><span className="text-[#137333]">{formatCurrency(profit)}</span></div>
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
            <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 sm:p-5 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#e6dfd5] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#1c1815]">Tổng Kết Tài Chính Cả Năm {selectedYear}</h2>
                  <p className="text-xs text-[#635950]">Tổng hợp toàn bộ hoạt động kinh doanh trong năm</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold bg-[#f2ede6] text-[#4a4036] px-3 py-1 rounded-full border border-[#dcd2c4]">{yearlyStats.annualSummary.totalShows} Show cả năm</span>
                  <button onClick={handleExportYearlyExcel} className="bg-[#f7f4ef] border border-[#dcd2c4] hover:bg-[#e8dfd2] text-[#137333] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer">
                    <Icons.Download className="w-4 h-4" /><span>Xuất Excel Báo Cáo Năm</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#f7f4ef]/60 p-3.5 rounded-xl border border-[#e6dfd5] space-y-1">
                  <span className="text-xs text-[#635950] font-medium uppercase tracking-wider">Tổng Doanh Thu Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-[#1c1815]">{formatCurrency(yearlyStats.annualSummary.totalRevenue)}</div>
                </div>
                <div className="bg-[#f7f4ef]/60 p-3.5 rounded-xl border border-[#e6dfd5] space-y-1">
                  <span className="text-xs text-[#a51d24] font-medium uppercase tracking-wider">Tổng Chi Phí Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-[#a51d24]">{formatCurrency(yearlyStats.annualSummary.totalExpenses)}</div>
                </div>
                <div className="bg-[#f7f4ef]/60 p-3.5 rounded-xl border border-[#e6dfd5] space-y-1">
                  <span className="text-xs text-[#137333] font-medium uppercase tracking-wider">Tổng Lợi Nhuận Ròng Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-[#137333]">{formatCurrency(yearlyStats.annualSummary.totalProfit)}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 sm:p-6 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#1c1815]">Chi Tiết Theo Từng Tháng</h3>
                <p className="text-xs text-[#635950] font-medium">Bấm vào từng tháng để xem chi tiết</p>
              </div>

              <div className="space-y-3">
                {yearlyStats.monthlyBreakdown.map((item) => {
                  const maxRevenue = Math.max(...yearlyStats.monthlyBreakdown.map((m) => m.revenue), 1);
                  const revPercent = Math.min((item.revenue / maxRevenue) * 100, 100);
                  const isExpanded = expandedAnalyticsMonth === item.month;
                  const staffListEntries = Object.entries(item.staffEarnings || {});

                  return (
                    <div key={item.month} className={`bg-[#ffffff] rounded-xl border transition-all ${isExpanded ? 'border-[#dcd2c4] shadow-xs' : 'border-[#e6dfd5] hover:border-[#dcd2c4]'}`}>
                      <div onClick={() => setExpandedAnalyticsMonth(isExpanded ? null : item.month)} className="p-3 sm:p-4 space-y-2 cursor-pointer">
                        <div className="flex flex-col sm:flex-row justify-between text-xs font-bold text-[#1c1815] gap-1">
                          <div className="flex items-center gap-2">
                            <span>Tháng {item.month} ({item.count} show)</span>
                            <span className="text-[10px] font-semibold text-[#4a4036] bg-[#f2ede6] px-2 py-0.5 rounded-full border border-[#dcd2c4]">{isExpanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}</span>
                          </div>
                          <div className="flex gap-3 text-xs font-semibold">
                            <span className="text-[#1c1815]">Doanh thu: {formatCurrencyCompact(item.revenue)}</span>
                            <span className="text-[#a51d24]">Chi phí: {formatCurrencyCompact(item.expenses)}</span>
                            <span className="text-[#137333]">Lợi nhuận: {formatCurrencyCompact(item.profit)}</span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[#f7f4ef] rounded-full overflow-hidden border border-[#e6dfd5]">
                          <div style={{ width: `${revPercent}%` }} className="h-full bg-[#85786c] rounded-full transition-all duration-300" />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[#e6dfd5] p-4 space-y-4 bg-[#f7f4ef]/40 text-xs">
                          <div className="space-y-2">
                            <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">Phân Bổ Doanh Thu Tháng {item.month}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] flex justify-between items-center">
                                <span className="font-bold text-[#4a4036]">Doanh thu Chụp Ảnh</span><span className="font-bold text-[#1c1815] text-sm">{formatCurrency(item.photoRevenue)}</span>
                              </div>
                              <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] flex justify-between items-center">
                                <span className="font-bold text-[#4a4036]">Doanh thu Makeup</span><span className="font-bold text-[#1c1815] text-sm">{formatCurrency(item.makeupRevenue)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">Thống Kê Show & Lương Ekip Trong Tháng</span>
                            {staffListEntries.length === 0 ? (<p className="text-[#a89f91] italic">Không có dữ liệu nhân sự.</p>) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {staffListEntries.map(([name, totalPay]) => {
                                  const showCount = item.staffShowCounts[name] || 0;
                                  return (
                                    <div key={name} className="bg-[#ffffff] p-2.5 rounded-lg border border-[#e6dfd5] flex flex-col justify-between space-y-1">
                                      <div className="flex justify-between items-center"><span className="font-bold text-[#4a4036]">👤 {name}</span><span className="text-[10px] font-semibold bg-[#f2ede6] text-[#4a4036] px-2 py-0.5 rounded-full border border-[#dcd2c4]">{showCount} show</span></div>
                                      <div className="flex justify-between items-center pt-1 border-t border-[#f2ede6]"><span className="text-[#635950] text-[11px]">Tổng lương:</span><span className="font-bold text-rose-700">{formatCurrency(totalPay)}</span></div>
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
            <div className="md:col-span-2 bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#1c1815]">Đội Ngũ Nhân Sự</h2>
                  <p className="text-xs text-[#635950] font-medium">Bấm vào tên nhân sự để xem lịch chụp và lương năm {selectedYear}</p>
                </div>
                <button onClick={() => handleOpenStaffModal(null)} className="bg-[#f7f4ef] border border-[#dcd2c4] text-[#1c1815] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#e8dfd2] transition">
                  <Icons.Plus className="w-4 h-4 text-[#635950]" /> Thêm Nhân Sự
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((st) => (
                  <div key={st.id} className="bg-[#f7f4ef]/50 p-3 rounded-lg border border-[#e6dfd5] flex justify-between items-center transition group hover:border-[#b5a799]">
                    <div onClick={() => setSelectedStaffForModal(st)} className="cursor-pointer flex-1 pr-2">
                      <h4 className="font-bold text-xs text-[#1c1815] group-hover:text-[#137333] transition flex items-center gap-1.5">
                        <span>👤</span> {st.name} <span className="text-[10px] text-[#137333] font-normal">(Xem lịch & lương ➔)</span>
                      </h4>
                      <span className="text-[10px] font-semibold bg-[#ffffff] text-[#4a4036] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#dcd2c4]">{st.role}</span>
                      <p className="text-[11px] text-[#635950] mt-1">SĐT: {st.phone || 'Chưa có'}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleOpenStaffModal(st)} className="p-1.5 hover:bg-[#ffffff] rounded-lg text-[#635950] border border-[#dcd2c4]" title="Sửa thông tin"><Icons.Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteStaff(st.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-700 border border-rose-200" title="Xóa"><Icons.Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase text-[#635950]">Ghi chú vận hành</h3>
              <p className="text-xs text-[#4a4036] leading-relaxed">
                - Lịch "Có khách hỏi" (màu vàng) và "Thử váy" (màu xanh dương) dùng để note lịch hẹn miễn phí.<br/>
                - Mọi lịch tạo mới sẽ tự động đồng bộ sang Google Calendar cá nhân nếu đã kết nối.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: STAFF FORM */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1815]/40 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-[#e6dfd5] flex justify-between items-center bg-[#ffffff]">
              <h3 className="font-bold text-sm text-[#1c1815]">{editingStaff ? 'Chỉnh Sửa Thông Tin Nhân Sự' : 'Thêm Nhân Sự Mới'}</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-[#635950] hover:text-[#1c1815]"><Icons.X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveStaff} autoComplete="off" className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4a4036] mb-1">Tên Nhân Sự *</label>
                <input type="text" required placeholder="VD: Nguyễn Văn A" value={staffFormData.name} onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815]" />
              </div>
              <div>
                <label className="block font-bold text-[#4a4036] mb-1">Vị Trí Chuyên Môn</label>
                <select value={staffFormData.role} onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815]">
                  <option value="Photo">Photo</option>
                  <option value="Quay phim">Quay phim</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Làm tóc">Làm tóc</option>
                  <option value="Freelance">Freelance Hỗ Trợ</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#4a4036] mb-1">Số Điện Thoại</label>
                <input type="text" placeholder="0901234567" value={staffFormData.phone} onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815]" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e6dfd5]">
                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="px-3.5 py-1.5 border border-[#dcd2c4] rounded-lg text-[#635950]">Hủy</button>
                <button type="submit" className="px-4 py-1.5 bg-[#2c2621] text-[#f9f6f0] rounded-lg font-semibold">{editingStaff ? 'Lưu Thay Đổi' : 'Thêm Nhân Sự'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STAFF YEARLY SCHEDULE */}
      {selectedStaffForModal && (
        <div className="fixed inset-0 z-50 bg-[#1c1815]/40 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-2xl w-full max-w-lg p-4 sm:p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#1c1815]">Lịch Chụp & Lương Năm {selectedYear} Của: <span className="text-[#137333]">{selectedStaffForModal.name}</span></h3>
                <p className="text-xs text-[#635950] font-medium mt-0.5">Chuyên môn: {selectedStaffForModal.role}</p>
              </div>
              <button onClick={() => setSelectedStaffForModal(null)} className="text-[#635950] hover:text-[#1c1815] p-1"><Icons.X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              {(() => {
                const staffShows = getStaffYearlyShows(selectedStaffForModal.name);
                if (staffShows.length === 0) {
                  return (<div className="text-center py-8 space-y-2"><p className="text-xs text-[#635950] italic">Nhân sự này chưa có lịch chụp nào trong năm {selectedYear}.</p></div>);
                }

                const totalYearPay = staffShows.reduce((acc, curr) => acc + Number(curr.pay || 0), 0);
                const totalPaidAmount = staffShows.filter(s => s.paid).reduce((acc, curr) => acc + Number(curr.pay || 0), 0);

                return (
                  <div className="space-y-3 text-xs">
                    <div className="bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5] flex justify-between items-center">
                      <div>
                        <span className="text-[#635950] block">Tổng Show: <strong className="text-[#1c1815]">{staffShows.length} show</strong></span>
                        <span className="text-[#635950] block mt-0.5">Tổng lương năm: <strong className="text-rose-700">{formatCurrency(totalYearPay)}</strong></span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#137333] font-semibold block">Đã thanh toán:</span>
                        <span className="font-bold text-sm text-[#137333]">{formatCurrency(totalPaidAmount)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
                      {staffShows.map((item, idx) => {
                        const dateText = item.endDate && item.endDate !== item.date ? `${new Date(item.date).toLocaleDateString('vi-VN')} ➔ ${new Date(item.endDate).toLocaleDateString('vi-VN')}` : new Date(item.date).toLocaleDateString('vi-VN');
                        return (
                          <div key={item.id + '-' + (item.memberId || idx)} className={`p-3 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition ${item.paid ? 'bg-[#e6f4ea]/50 border-[#ceead6]' : 'bg-[#f7f4ef]/60 border-[#e6dfd5]'}`}>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-semibold bg-[#ffffff] border border-[#dcd2c4] text-[#4a4036] px-2 py-0.5 rounded">📅 {dateText}</span>
                                <span className="font-bold text-[#1c1815]">{item.packageType}</span>
                              </div>
                              <p className="text-[#635950] font-medium">Khách: {item.clientName}</p>
                              <p className="text-rose-700 font-bold">Lương show: {formatCurrency(item.pay)}</p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto bg-[#ffffff] px-3 py-1.5 rounded-lg border border-[#dcd2c4]">
                              <input type="checkbox" id={`paid-chk-${item.id}-${item.memberId}`} checked={!!item.paid} onChange={() => handleToggleStaffPaid(item.id, item.memberId, item.paid)} className="w-4 h-4 rounded accent-[#137333] cursor-pointer" />
                              <label htmlFor={`paid-chk-${item.id}-${item.memberId}`} className="cursor-pointer font-semibold text-[11px] select-none text-[#1c1815]">{item.paid ? <span className="text-[#137333]">Đã trả lương</span> : <span className="text-[#635950]">Chưa trả lương</span>}</label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-2 border-t border-[#e6dfd5] flex justify-end">
              <button onClick={() => setSelectedStaffForModal(null)} className="px-4 py-1.5 bg-[#2c2621] text-[#f9f6f0] rounded-xl text-xs font-semibold hover:bg-[#4a4036]">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHOW FORM */}
      {isShowModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1815]/40 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-xl w-full max-w-lg my-6 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-3.5 border-b border-[#e6dfd5] flex justify-between items-center bg-[#ffffff] shrink-0">
              <h3 className="font-bold text-xs text-[#1c1815]">{editingShow ? 'Chỉnh Sửa Lịch Hẹn / Show' : 'Tạo Lịch Hẹn / Show Mới'}</h3>
              <button onClick={() => setIsShowModalOpen(false)} className="text-[#635950] hover:text-[#1c1815]"><Icons.X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveShow} autoComplete="off" className="p-3.5 sm:p-4 space-y-2.5 overflow-y-auto flex-1 text-[11px]">
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#4a4036]">Tên Khách Hàng *</label>
                  <input type="text" required value={showFormData.clientName} onChange={(e) => setShowFormData({ ...showFormData, clientName: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#4a4036]">Số Điện Thoại</label>
                  <input type="text" value={showFormData.clientPhone} onChange={(e) => setShowFormData({ ...showFormData, clientPhone: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                </div>

                <div className="space-y-1 relative">
                  <label className="block text-[11px] font-bold text-[#4a4036]">Khoảng Ngày Lịch (Từ ngày ➔ Đến ngày) *</label>
                  <div onClick={() => setIsDateRangePickerOpen(!isDateRangePickerOpen)} className="w-full px-3 py-2 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] flex items-center justify-between cursor-pointer hover:border-[#137333] transition">
                    <div className="flex items-center gap-2">
                      <Icons.Calendar className="w-4 h-4 text-[#635950]" />
                      <span>
                        {showFormData.date ? new Date(showFormData.date).toLocaleDateString('vi-VN') : 'Chọn ngày bắt đầu'}
                        {' ➔ '}
                        {showFormData.endDate ? new Date(showFormData.endDate).toLocaleDateString('vi-VN') : (showFormData.date ? new Date(showFormData.date).toLocaleDateString('vi-VN') : 'Chọn ngày kết thúc')}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#137333] bg-[#ffffff] px-2 py-0.5 rounded border border-[#dcd2c4]">Chọn lịch ▾</span>
                  </div>

                  {isDateRangePickerOpen && (
                    <div className="absolute left-0 top-full mt-1.5 z-50 bg-[#ffffff] border border-[#dcd2c4] rounded-2xl shadow-2xl p-4 w-full sm:w-[340px] space-y-3">
                      <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-2">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => { if (pickerMonth === 1) { setPickerMonth(12); setPickerYear(pickerYear - 1); } else { setPickerMonth(pickerMonth - 1); } }} className="p-1 rounded hover:bg-[#f2ede6] text-[#635950]"><Icons.ChevronLeft className="w-4 h-4" /></button>
                          <span className="font-bold text-xs text-[#1c1815]">Tháng {pickerMonth} / {pickerYear}</span>
                          <button type="button" onClick={() => { if (pickerMonth === 12) { setPickerMonth(1); setPickerYear(pickerYear + 1); } else { setPickerMonth(pickerMonth + 1); } }} className="p-1 rounded hover:bg-[#f2ede6] text-[#635950]"><Icons.ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <button type="button" onClick={() => setIsDateRangePickerOpen(false)} className="text-xs text-[#635950] hover:text-[#1c1815]">✕ Đóng</button>
                      </div>

                      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-[#635950] mb-1">
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => <span key={i}>{d}</span>)}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {(() => {
                          const firstDay = new Date(pickerYear, pickerMonth - 1, 1);
                          const numDays = new Date(pickerYear, pickerMonth, 0).getDate();
                          let startDow = firstDay.getDay() - 1;
                          if (startDow === -1) startDow = 6;

                          const cells = [];
                          for (let i = 0; i < startDow; i++) { cells.push(<div key={'empty-' + i} />); }

                          for (let d = 1; d <= numDays; d++) {
                            const dateStr = `${pickerYear}-${String(pickerMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const isStart = showFormData.date === dateStr;
                            const isEnd = showFormData.endDate === dateStr;
                            const isInRange = showFormData.date && showFormData.endDate && dateStr > showFormData.date && dateStr < showFormData.endDate;

                            let btnStyle = "bg-[#f7f4ef] text-[#1c1815] hover:bg-[#e8dfd2]";
                            if (isStart || isEnd) btnStyle = "bg-[#2c2621] text-[#f9f6f0] font-bold shadow-xs";
                            else if (isInRange) btnStyle = "bg-[#e2dbd0] text-[#1c1815]";

                            cells.push(
                              <button key={dateStr} type="button" onClick={() => {
                                if (!showFormData.date || (showFormData.date && showFormData.endDate && showFormData.endDate !== showFormData.date)) {
                                  setShowFormData({ ...showFormData, date: dateStr, endDate: dateStr });
                                } else if (dateStr < showFormData.date) {
                                  setShowFormData({ ...showFormData, date: dateStr, endDate: dateStr });
                                } else {
                                  setShowFormData({ ...showFormData, endDate: dateStr });
                                  setIsDateRangePickerOpen(false);
                                }
                              }} className={`py-1.5 rounded-md font-semibold transition ${btnStyle}`}>{d}</button>
                            );
                          }
                          return cells;
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#4a4036]">Gói Dịch Vụ</label>
                  <select value={showFormData.packageType} onChange={(e) => setShowFormData({ ...showFormData, packageType: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none">
                    <option value="" className="bg-[#ffffff] text-[#635950]">-- Chọn Gói Dịch Vụ --</option>
                    {PACKAGES.map((pkg) => (<option key={pkg} value={pkg} className="bg-[#ffffff] text-[#1c1815]">{pkg}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#4a4036]">Giờ Bắt Đầu</label>
                    <input type="time" value={showFormData.startTime} onChange={(e) => setShowFormData({ ...showFormData, startTime: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#4a4036]">Giờ Kết Thúc</label>
                    <input type="time" value={showFormData.endTime} onChange={(e) => setShowFormData({ ...showFormData, endTime: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#4a4036]">Địa Điểm</label>
                <input type="text" value={showFormData.location} onChange={(e) => setShowFormData({ ...showFormData, location: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#4a4036]">Ghi Chú Lịch Hẹn</label>
                <textarea rows={2} value={showFormData.notes} onChange={(e) => setShowFormData({ ...showFormData, notes: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
              </div>

              {!isNonCommercialPackage(showFormData.packageType) && (
                <>
                  <div className="space-y-2 border-t border-[#e6dfd5] pt-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[10px] text-[#635950] uppercase tracking-wider">Phân công Ekip & Tiền công</span>
                      <button type="button" onClick={() => { const currentCrew = showFormData.assignedStaff.crewList || []; setShowFormData({ ...showFormData, assignedStaff: { crewList: [...currentCrew, { id: 'c-' + Date.now(), name: '', role: 'Photo', pay: 0, paid: false }] } }); }} className="text-[10px] font-bold text-[#1c1815] bg-[#f2ede6] border border-[#dcd2c4] px-2 py-0.5 rounded">+ Thêm Nhân Sự</button>
                    </div>

                    <div className="space-y-1.5">
                      {(showFormData.assignedStaff.crewList || []).map((member, idx) => (
                        <div key={member.id || idx} className="bg-[#f7f4ef]/60 p-2 rounded-lg border border-[#e6dfd5] flex flex-col gap-1.5">
                          <div className="grid grid-cols-2 gap-1.5">
                            <select value={member.role} onChange={(e) => { const updated = [...showFormData.assignedStaff.crewList]; updated[idx].role = e.target.value; setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } }); }} style={{ fontSize: '16px' }} className="w-full px-2 py-1 bg-[#ffffff] border border-[#dcd2c4] rounded font-semibold text-[#1c1815]">
                              <option value="Photo">Photo</option><option value="Video">Video</option><option value="Makeup">Makeup</option><option value="Làm tóc">Làm tóc</option><option value="Freelance">Freelance</option>
                            </select>
                            <select value={member.name} onChange={(e) => { const updated = [...showFormData.assignedStaff.crewList]; updated[idx].name = e.target.value; setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } }); }} style={{ fontSize: '16px' }} className="w-full px-2 py-1 bg-[#ffffff] border border-[#dcd2c4] rounded font-semibold text-[#1c1815]">
                              <option value="">-- Chọn Nhân Sự --</option>
                              {staffList.map((st) => (<option key={st.id} value={st.name}>{st.name} ({st.role})</option>))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <input type="number" placeholder="0 đ" value={member.pay || ''} onChange={(e) => { const updated = [...showFormData.assignedStaff.crewList]; updated[idx].pay = Number(e.target.value); setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } }); }} style={{ fontSize: '16px' }} className="flex-1 px-2.5 py-1 bg-[#ffffff] border border-[#dcd2c4] rounded font-bold text-rose-700" />
                            <button type="button" onClick={() => { const updated = showFormData.assignedStaff.crewList.filter((_, i) => i !== idx); setShowFormData({ ...showFormData, assignedStaff: { crewList: updated } }); }} className="text-[#635950] hover:text-rose-700 p-1 bg-[#ffffff] border border-[#dcd2c4] rounded"><Icons.X className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-[#e6dfd5] pt-2.5">
                    <span className="font-bold text-[10px] text-[#635950] uppercase tracking-wider block">Chi Phí Khác</span>
                    <div className="space-y-1">
                      {(showFormData.expenses || []).map((exp) => (
                        <div key={exp.id} className="flex justify-between items-center bg-[#f7f4ef]/60 p-1.5 rounded border border-[#e6dfd5]">
                          <span className="font-medium text-[#4a4036] truncate pr-2">{exp.title}</span>
                          <div className="flex items-center gap-1.5 shrink-0"><span className="font-bold text-rose-700">-{formatCurrency(exp.amount)}</span><button type="button" onClick={() => handleRemoveExpense(exp.id)} className="text-rose-700"><Icons.X className="w-3 h-3" /></button></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input type="text" placeholder="Tên chi phí" value={newExpenseTitle} onChange={(e) => setNewExpenseTitle(e.target.value)} style={{ fontSize: '16px' }} className="flex-1 px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded text-[#1c1815]" />
                      <input type="number" placeholder="Số tiền" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} style={{ fontSize: '16px' }} className="w-24 px-2 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded font-bold text-rose-700" />
                      <button type="button" onClick={handleAddExpense} className="px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] text-[#1c1815] rounded">+ Thêm</button>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-[#e6dfd5] pt-2.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-[#4a4036]">Giá Hợp Đồng (VNĐ)</label>
                      <input type="number" value={showFormData.totalAmount || ''} onChange={(e) => setShowFormData({ ...showFormData, totalAmount: e.target.value === '' ? 0 : Number(e.target.value) })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded font-bold text-[#1c1815]" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-[#4a4036]">Tiền Đặt Cọc (VNĐ)</label>
                      <input type="number" value={showFormData.depositAmount || ''} onChange={(e) => setShowFormData({ ...showFormData, depositAmount: e.target.value === '' ? 0 : Number(e.target.value) })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded font-bold text-[#1c1815]" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-[#4a4036]">Trạng Thái</label>
                      <select value={showFormData.status} onChange={(e) => setShowFormData({ ...showFormData, status: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded font-bold text-[#1c1815]">
                        <option value="Chưa cọc">Chưa cọc</option><option value="Đã cọc">Đã cọc</option><option value="Đã thanh toán">Đã thanh toán</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2.5 border-t border-[#e6dfd5]">
                <button type="button" onClick={() => { const targetDate = showFormData.date; setIsShowModalOpen(false); if (targetDate) openDayDetailByDate(targetDate); }} className="px-3 py-1 border border-[#dcd2c4] rounded text-[#635950]">Hủy</button>
                <button type="submit" className="px-3 py-1 bg-[#2c2621] text-[#f9f6f0] rounded font-semibold">Lưu Lịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CALENDAR DAY DETAIL */}
      {selectedCalendarDay && (
        <div className="fixed inset-0 z-50 bg-[#1c1815]/40 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-xl w-full max-w-lg p-4 sm:p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="font-bold text-[#1c1815]">Lịch Ngày {new Date(selectedCalendarDay.dateStr).toLocaleDateString('vi-VN')}</h3>
                <p className="text-xs text-[#635950] font-medium">Tổng số: {selectedCalendarDay.shows.length} lịch hẹn/show</p>
              </div>
              <button onClick={() => setSelectedCalendarDay(null)} className="text-[#635950] hover:text-[#1c1815]"><Icons.X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3.5">
              {selectedCalendarDay.shows.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-[#635950] font-medium">Chưa có lịch hẹn hoặc show nào trong ngày này.</p>
                  <button onClick={() => { const dateStr = selectedCalendarDay.dateStr; setSelectedCalendarDay(null); handleOpenShowModal(null, dateStr); }} className="bg-[#2c2621] text-[#f9f6f0] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5">
                    <Icons.Plus className="w-4 h-4 text-[#dcd2c4]" /> Thêm Lịch Mới Cho Ngày Này
                  </button>
                </div>
              ) : (
                selectedCalendarDay.shows.map((show) => {
                  const isNonComm = isNonCommercialPackage(show.packageType);
                  const totalPackage = Number(show.totalAmount || 0);
                  const deposit = Number(show.depositAmount || 0);
                  const remaining = totalPackage - deposit;
                  const totalExp = calculateShowTotalExpenses(show);
                  const profit = totalPackage - totalExp;
                  const dateText = show.endDate && show.endDate !== show.date ? `${new Date(show.date).toLocaleDateString('vi-VN')} ➔ ${new Date(show.endDate).toLocaleDateString('vi-VN')}` : new Date(show.date).toLocaleDateString('vi-VN');

                  return (
                    <div key={show.id} className="bg-[#f7f4ef]/50 p-3.5 rounded-xl border border-[#e6dfd5] space-y-3">
                      <div className="flex justify-between items-start gap-2 border-b border-[#e6dfd5] pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1c1815]">{show.clientName}</h4>
                            <span className="text-[10px] font-bold bg-[#ffffff] border border-[#dcd2c4] text-[#1c1815] px-2 py-0.5 rounded-md">{show.packageType}</span>
                          </div>
                          <p className="text-xs text-[#635950] font-medium mt-0.5">📞 SĐT: {show.clientPhone || 'Chưa có'}</p>
                          <p className="text-xs text-[#4a4036] font-medium mt-0.5">📅 Thời gian: {dateText}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedCalendarDay(null); handleOpenShowModal(show); }} className="text-xs font-semibold text-[#4a4036] hover:underline flex items-center gap-1"><Icons.Edit className="w-3.5 h-3.5" /> Sửa</button>
                          <button onClick={() => handleDeleteShow(show.id, selectedCalendarDay.dateStr)} className="text-rose-700 hover:text-rose-800 p-1 bg-[#ffffff] border border-rose-200 rounded-md"><Icons.Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#ffffff] p-2 rounded-lg border border-[#e6dfd5] flex items-center gap-1.5 text-[#4a4036]">
                          <Icons.Clock className="w-3.5 h-3.5 text-[#635950] shrink-0" /><span><strong>Giờ:</strong> {show.startTime || '08:00'} - {show.endTime || '12:00'}</span>
                        </div>
                        <div className="bg-[#ffffff] p-2 rounded-lg border border-[#e6dfd5] text-[#4a4036] truncate"><span>📍 <strong>Địa điểm:</strong> {show.location || 'Chưa cập nhật'}</span></div>
                      </div>

                      {/* PHẦN HIỂN THỊ EKIP VÀ CHI PHÍ BỔ SUNG TRONG MODAL CHI TIẾT NGÀY */}
                      {!isNonComm && (
                        <div className="space-y-2 text-xs">
                          {/* Ekip */}
                          <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#e6dfd5] space-y-1.5">
                            <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">Phân công Ekip & Lương:</span>
                            <div className="space-y-1">
                              {getNormalizeCrewList(show.assignedStaff).map((member, i) => {
                                const memberIdentifier = member.id || member.name;
                                const memberPay = Number(member.pay || 0);
                                return (
                                  <div key={memberIdentifier || i} className="flex items-center justify-between gap-1 bg-[#f7f4ef] p-1.5 rounded border border-[#e6dfd5]">
                                    <div className="truncate pr-1">
                                      <span className="font-bold text-[#1c1815]">{member.role}:</span> {member.name}
                                      <span className="font-semibold text-rose-700 block">{formatCurrency(memberPay)}</span>
                                    </div>
                                    {memberPay > 0 && (
                                      <div className="flex items-center gap-1 shrink-0 bg-[#ffffff] px-2 py-1 rounded border border-[#dcd2c4]">
                                        <input type="checkbox" id={`day-paid-${show.id}-${memberIdentifier}`} checked={!!member.paid} onChange={() => handleToggleStaffPaid(show.id, memberIdentifier, member.paid)} className="w-3.5 h-3.5 rounded accent-[#137333] cursor-pointer" />
                                        <label htmlFor={`day-paid-${show.id}-${memberIdentifier}`} className="cursor-pointer text-[10px] font-semibold text-[#1c1815] select-none">{member.paid ? <span className="text-[#137333]">Đã trả</span> : <span className="text-[#635950]">Chưa trả</span>}</label>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {getNormalizeCrewList(show.assignedStaff).length === 0 && (<span className="text-[#a89f91] italic">Chưa phân công ekip</span>)}
                            </div>
                          </div>

                          {/* Tài chính show */}
                          <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#e6dfd5] space-y-1.5">
                            <div className="flex justify-between items-center"><span className="text-[#635950] font-medium">Giá hợp đồng:</span><span className="font-bold text-[#1c1815]">{formatCurrency(totalPackage)}</span></div>
                            <div className="flex justify-between items-center text-[#4a4036]"><span className="font-medium">Đã đặt cọc:</span><span className="font-bold text-[#1c1815]">{formatCurrency(deposit)}</span></div>
                            <div className="flex justify-between items-center text-rose-700"><span className="font-medium">Còn lại phải thu:</span><span className="font-bold">{formatCurrency(remaining)}</span></div>
                            <div className="flex justify-between items-center text-rose-700 pt-1 border-t border-[#e6dfd5]"><span className="font-medium">Tổng chi phí (Lương thợ + phát sinh):</span><span className="font-bold">-{formatCurrency(totalExp)}</span></div>
                            <div className="flex justify-between items-center text-[#137333] pt-1 border-t border-[#e6dfd5] font-semibold"><span>Lợi nhuận ròng show:</span><span>{formatCurrency(profit)}</span></div>
                          </div>
                        </div>
                      )}

                      {show.notes && (
                        <div className="bg-[#ffffff] p-2.5 rounded-lg text-xs text-[#4a4036] space-y-0.5 border border-[#e6dfd5]">
                          <span className="font-bold block text-[11px] text-[#635950]">📝 Ghi chú:</span>
                          <p className="leading-relaxed">{show.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#e6dfd5]">
                        <button onClick={() => setConfirmationModal({ isOpen: true, type: 'client', show })} className="flex-1 bg-[#2c2621] text-[#f9f6f0] hover:bg-[#4a4036] px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition">
                          📄 Thông tin gửi Khách xác nhận
                        </button>
                        {!isNonComm && (
                          <button onClick={() => setConfirmationModal({ isOpen: true, type: 'staff', show })} className="flex-1 bg-[#ffffff] hover:bg-[#f2ede6] text-[#1c1815] border border-[#dcd2c4] px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition">
                            👥 Thông tin gửi Nhân sự xác nhận
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#e6dfd5]">
              <button onClick={() => { const dateStr = selectedCalendarDay.dateStr; setSelectedCalendarDay(null); handleOpenShowModal(null, dateStr); }} className="bg-[#2c2621] text-[#f9f6f0] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Icons.Plus className="w-4 h-4 text-[#dcd2c4]" /> Thêm Lịch Mới
              </button>
              <button onClick={() => setSelectedCalendarDay(null)} className="px-3.5 py-1.5 border border-[#e6dfd5] text-[#635950] rounded-xl text-xs font-semibold ml-auto">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPORT CONFIRMATION CARDS */}
      {confirmationModal.isOpen && confirmationModal.show && (
        <div className="fixed inset-0 z-50 bg-[#1c1815]/40 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-2xl w-full max-w-md overflow-hidden my-6">
            <div className="p-3.5 border-b border-[#e6dfd5] flex justify-between items-center bg-[#ffffff]">
              <span className="font-bold text-xs uppercase tracking-wider text-[#635950]">
                {confirmationModal.type === 'client' ? '📋 Phiếu Xác Nhận Dành Cho Khách Hàng' : '📌 Phiếu Xếp Lịch Cho Nhân Sự'}
              </span>
              <button onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })} className="text-[#635950] hover:text-[#1c1815] p-1"><Icons.X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 bg-[#ffffff] space-y-4 text-[#1c1815]">
              <div className="text-center border-b border-[#e6dfd5] pb-3 space-y-1">
                <span className="font-bold text-sm tracking-tight text-[#1c1815]">OUR JUNE STUDIO</span>
                <p className="text-[10px] text-[#635950] font-semibold uppercase tracking-widest">
                  {confirmationModal.type === 'client' ? 'XÁC NHẬN THÔNG TIN LỊCH HẸN & DỊCH VỤ' : 'THÔNG TIN PHÂN CÔNG LỊCH EKIP CHỤP'}
                </p>
              </div>

              {confirmationModal.type === 'client' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5] space-y-1.5">
                    <div className="flex justify-between"><span className="text-[#635950]">Khách hàng:</span><strong className="text-[#1c1815]">{confirmationModal.show.clientName}</strong></div>
                    <div className="flex justify-between"><span className="text-[#635950]">Số điện thoại:</span><strong className="text-[#4a4036]">{confirmationModal.show.clientPhone || 'Chưa cung cấp'}</strong></div>
                    <div className="flex justify-between"><span className="text-[#635950]">Gói dịch vụ:</span><span className="font-bold bg-[#ffffff] text-[#1c1815] border border-[#dcd2c4] px-2 py-0.5 rounded text-[10px]">{confirmationModal.show.packageType}</span></div>
                  </div>

                  <div className="space-y-1.5 bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5]">
                    <div className="flex justify-between">
                      <span className="text-[#635950]">📅 Thời gian:</span>
                      <strong className="text-[#1c1815]">
                        {confirmationModal.show.endDate && confirmationModal.show.endDate !== confirmationModal.show.date
                          ? `${new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')} ➔ ${new Date(confirmationModal.show.endDate).toLocaleDateString('vi-VN')}`
                          : new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')}
                      </strong>
                    </div>
                    <div className="flex justify-between"><span className="text-[#635950]">⏰ Giờ:</span><strong className="text-[#1c1815]">{confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}</strong></div>
                    <div className="flex justify-between"><span className="text-[#635950]">📍 Địa điểm:</span><strong className="text-[#1c1815] text-right truncate max-w-[200px]">{confirmationModal.show.location || 'Tại Studio Our June'}</strong></div>
                  </div>

                  {!isNonCommercialPackage(confirmationModal.show.packageType) && (
                    <div className="bg-[#f7f4ef] p-3.5 rounded-xl border border-[#e6dfd5] space-y-1.5">
                      <div className="flex justify-between text-[#4a4036]"><span>Giá hợp đồng:</span><strong className="text-[#1c1815]">{formatCurrency(confirmationModal.show.totalAmount)}</strong></div>
                      <div className="flex justify-between text-[#4a4036]"><span>Đã đặt cọc:</span><strong className="text-[#1c1815]">{formatCurrency(confirmationModal.show.depositAmount)}</strong></div>
                      <div className="flex justify-between text-rose-700 font-bold border-t border-[#e6dfd5] pt-1.5 text-sm">
                        <span>Còn lại cần thanh toán:</span>
                        <span>{formatCurrency(Number(confirmationModal.show.totalAmount || 0) - Number(confirmationModal.show.depositAmount || 0))}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5] space-y-1">
                    <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">📝 Ghi chú:</span>
                    <p className="text-[#1c1815] leading-relaxed whitespace-pre-wrap">{confirmationModal.show.notes || 'Không có ghi chú'}</p>
                  </div>
                </div>
              )}

              {confirmationModal.type === 'staff' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5] space-y-1.5">
                    <div className="flex justify-between"><span className="text-[#635950]">Tên Show / Gói:</span><span className="font-bold text-[#1c1815]">{confirmationModal.show.packageType}</span></div>
                    <div className="flex justify-between"><span className="text-[#635950]">Tên Khách Hàng:</span><strong className="text-[#1c1815]">{confirmationModal.show.clientName}</strong></div>
                    <div className="flex justify-between"><span className="text-[#635950]">📞 SĐT Khách:</span><strong className="text-[#4a4036]">{confirmationModal.show.clientPhone || 'Chưa cung cấp'}</strong></div>
                  </div>

                  <div className="space-y-1.5 bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5]">
                    <div className="flex justify-between">
                      <span className="text-[#635950]">📅 Thời gian:</span>
                      <strong className="text-[#1c1815]">
                        {confirmationModal.show.endDate && confirmationModal.show.endDate !== confirmationModal.show.date
                          ? `${new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')} ➔ ${new Date(confirmationModal.show.endDate).toLocaleDateString('vi-VN')}`
                          : new Date(confirmationModal.show.date).toLocaleDateString('vi-VN')}
                      </strong>
                    </div>
                    <div className="flex justify-between"><span className="text-[#635950]">⏰ Giờ làm việc:</span><strong className="text-[#1c1815]">{confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}</strong></div>
                    <div className="flex justify-between"><span className="text-[#635950]">📍 Địa điểm:</span><strong className="text-[#1c1815]">{confirmationModal.show.location || 'Tại Studio'}</strong></div>
                  </div>

                  <div className="space-y-1.5 bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5]">
                    <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">Phân công Nhân sự Ekip:</span>
                    {getNormalizeCrewList(confirmationModal.show.assignedStaff).map((c, i) => (
                      <div key={c.id || i} className="flex justify-between border-b border-[#e6dfd5] pb-1 last:border-none">
                        <span className="text-[#635950]">👤 {c.role}:</span><strong className="text-[#1c1815]">{c.name}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f7f4ef] p-3 rounded-xl border border-[#e6dfd5] space-y-1">
                    <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">📝 Ghi chú Ekip:</span>
                    <p className="text-[#1c1815] leading-relaxed whitespace-pre-wrap">{confirmationModal.show.notes || 'Không có'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#ffffff] border-t border-[#e6dfd5] flex justify-between gap-2">
              <button onClick={() => {
                const show = confirmationModal.show;
                const dateStrText = show.endDate && show.endDate !== show.date ? `${new Date(show.date).toLocaleDateString('vi-VN')} đến ${new Date(show.endDate).toLocaleDateString('vi-VN')}` : new Date(show.date).toLocaleDateString('vi-VN');
                let text = '';
                if (confirmationModal.type === 'client') {
                  text = `[OUR JUNE STUDIO] XÁC NHẬN LỊCH\n- Khách hàng: ${show.clientName}\n- Gói: ${show.packageType}\n- Thời gian: ${dateStrText}\n- Giờ: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n- Địa điểm: ${show.location || 'Studio'}`;
                } else {
                  text = `[OUR JUNE STUDIO] LỊCH CHỤP EKIP\n- Show: ${show.packageType} (${show.clientName})\n- Thời gian: ${dateStrText}\n- Giờ: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}`;
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(text).then(() => alert('Đã sao chép tin nhắn!'));
                }
              }} className="flex-1 bg-[#2c2621] text-[#f9f6f0] px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#4a4036]">
                📋 Sao Chép Tin Nhắn
              </button>
              <button onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })} className="px-4 py-1.5 border border-[#e6dfd5] text-[#635950] rounded-xl text-xs font-semibold">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
