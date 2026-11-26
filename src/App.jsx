import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";

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
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

const parseYearMonth = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-');
  if (parts.length < 2) return null;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  if (!year || !month) return null;
  return { year, month };
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
  Bell: (props) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
  ),
  Phone: (props) => (
    <svg className={props.className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
};

const PACKAGES = [
  'Ngày nghỉ',
  'Đợi khách',
  'Gặp khách',
  'Tiệc cưới',
  'Đính hôn',
  'Psc',
  'Tiệc thân mật',
  'Prewedding',
  'Photoshoot',
  'Makeup',
  'Freelance'
];

const normalizePackageName = (pkg) => {
  if (!pkg) return pkg;
  if (pkg === 'Có khách hỏi') return 'Đợi khách';
  if (pkg === 'Thử váy và trao đổi với khách') return 'Gặp khách';
  if (pkg === 'Tiệc báo hỷ') return 'Tiệc cưới';
  if (pkg === 'Thành hôn') return 'Psc';
  return pkg;
};

const sanitizeForFirestore = (obj) => JSON.parse(JSON.stringify(obj));

export default function App() {
  const currentVNDate = getVietnamTodayStr();
  const currentVNParts = parseYearMonth(currentVNDate) || { year: 2026, month: 11 };

  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(currentVNParts.month);
  const [selectedYear, setSelectedYear] = useState(currentVNParts.year);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [shows, setShows] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastSeenLogAt, setLastSeenLogAt] = useState(() => Number(localStorage.getItem('ojs_last_seen_log_at') || 0));
  const [restoringLogId, setRestoringLogId] = useState(null);

  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  // State cho modal xác nhận trước khi xóa sự kiện trên Google Calendar
  const [syncDeletePrompt, setSyncDeletePrompt] = useState({
    isOpen: false,
    candidates: [],
    addedCount: 0,
    isExecuting: false
  });

  const checkTokenStatus = () => {
    const savedToken = localStorage.getItem('google_access_token');
    const expiresAt = localStorage.getItem('google_token_expires_at');
    if (savedToken && expiresAt && new Date().getTime() < Number(expiresAt)) {
      setIsGoogleConnected(true);
    } else {
      setIsGoogleConnected(false);
    }
  };

  useEffect(() => {
    const unsubShows = onSnapshot(collection(db, "shows"), (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          packageType: normalizePackageName(data.packageType)
        };
      });
      setShows(items);
    });

    const unsubStaff = onSnapshot(collection(db, "staff"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStaffList(items);
    });

    const unsubLogs = onSnapshot(collection(db, "activity_logs"), (snapshot) => {
      const items = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
      setActivityLogs(items.slice(0, 100));
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
              const expiresAt = new Date().getTime() + (response.expires_in || 3600) * 1000;
              localStorage.setItem('google_access_token', response.access_token);
              localStorage.setItem('google_token_expires_at', expiresAt);
              setIsGoogleConnected(true);
            }
          },
        });
        setTokenClient(client);
        checkTokenStatus();
      }
    };
    document.body.appendChild(script);

    window.addEventListener('focus', checkTokenStatus);

    return () => {
      unsubShows();
      unsubStaff();
      unsubLogs();
      window.removeEventListener('focus', checkTokenStatus);
    };
  }, []);

  const writeActivityLog = async ({ actionType, targetType, summary, detail = '', previousData = null, targetId = null }) => {
    try {
      const now = Date.now();
      const timeLabel = new Date(now).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });

      await addDoc(collection(db, "activity_logs"), {
        actionType,
        targetType,
        targetId: targetId || null,
        summary,
        detail,
        timeLabel,
        timestamp: now,
        previousData: previousData ? sanitizeForFirestore(previousData) : null
      });
    } catch (err) {
      console.error("Lỗi ghi nhật ký thông báo:", err);
    }
  };

  const handleOpenNotifications = () => {
    const latestTs = activityLogs.length > 0 ? Number(activityLogs[0].timestamp || Date.now()) : Date.now();
    setLastSeenLogAt(latestTs);
    localStorage.setItem('ojs_last_seen_log_at', String(latestTs));
    setIsNotificationOpen(true);
  };

  const unreadLogsCount = useMemo(() => {
    return activityLogs.filter(log => Number(log.timestamp || 0) > lastSeenLogAt).length;
  }, [activityLogs, lastSeenLogAt]);

  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [expandedAnalyticsMonth, setExpandedAnalyticsMonth] = useState(null);
  const [selectedStaffForModal, setSelectedStaffForModal] = useState(null);
  const [modalOriginTab, setModalOriginTab] = useState('calendar');

  const [editingStaff, setEditingStaff] = useState(null);
  const [staffFormData, setStaffFormData] = useState({ name: '', role: 'Photo', phone: '' });

  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: 'client', show: null });

  // Lắng nghe sự kiện phím ESC để đóng nhanh các modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isNotificationOpen) {
          setIsNotificationOpen(false);
        } else if (syncDeletePrompt.isOpen && !syncDeletePrompt.isExecuting) {
          setSyncDeletePrompt({ isOpen: false, candidates: [], addedCount: 0, isExecuting: false });
        } else if (confirmationModal.isOpen) {
          setConfirmationModal({ isOpen: false, type: 'client', show: null });
        } else if (isShowModalOpen) {
          setIsShowModalOpen(false);
        } else if (isStaffModalOpen) {
          setIsStaffModalOpen(false);
        } else if (selectedStaffForModal) {
          setSelectedStaffForModal(null);
        } else if (selectedCalendarDay) {
          setSelectedCalendarDay(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationOpen, syncDeletePrompt.isOpen, syncDeletePrompt.isExecuting, confirmationModal.isOpen, isShowModalOpen, isStaffModalOpen, selectedStaffForModal, selectedCalendarDay]);

  const handleConnectGoogle = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const getVerifiedAccessToken = () => {
    return new Promise((resolve) => {
      const savedToken = localStorage.getItem('google_access_token');
      const expiresAt = localStorage.getItem('google_token_expires_at');
      
      if (savedToken && expiresAt && new Date().getTime() < Number(expiresAt)) {
        setIsGoogleConnected(true);
        resolve(savedToken);
        return;
      }

      setIsGoogleConnected(false);

      if (!tokenClient) {
        resolve(null);
        return;
      }

      tokenClient.callback = (response) => {
        if (response && response.access_token) {
          const newExpiresAt = new Date().getTime() + (response.expires_in || 3600) * 1000;
          localStorage.setItem('google_access_token', response.access_token);
          localStorage.setItem('google_token_expires_at', newExpiresAt);
          setIsGoogleConnected(true);
          resolve(response.access_token);
        } else {
          setIsGoogleConnected(false);
          resolve(null);
        }
      };

      tokenClient.requestAccessToken({ prompt: '' });
    });
  };

  const syncShowToGoogleCalendar = async (showData) => {
    const accessToken = await getVerifiedAccessToken();
    if (!accessToken) {
      alert("⚠️ Cần cấp quyền Google để đồng bộ lịch mới tạo lên Google Calendar!");
      return false;
    }

    const startDate = showData.date;
    const endDateObj = showData.endDate ? new Date(`${showData.endDate}T00:00:00`) : new Date(`${showData.date}T00:00:00`);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDateStr = endDateObj.toISOString().split('T')[0];

    let colorId = '2'; 
    if (showData.packageType === 'Ngày nghỉ') {
      colorId = '3'; 
    } else if (showData.packageType === 'Đợi khách') {
      colorId = '5'; 
    } else if (showData.packageType === 'Gặp khách') {
      colorId = '9'; 
    } else if (showData.packageType === 'Makeup') {
      colorId = '4'; 
    } else if (['Prewedding', 'Photoshoot', 'Tiệc cưới', 'Đính hôn', 'Psc', 'Tiệc thân mật'].includes(showData.packageType)) {
      colorId = '10'; 
    }

    const expectedSummary = `[${showData.packageType}] ${showData.clientName}`;

    try {
      const checkRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=2500', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const checkData = await checkRes.json();
      const existingEvents = checkData.items || [];
      
      const alreadyExists = existingEvents.some(event => 
        event.summary === expectedSummary && event.start && event.start.date === startDate
      );

      if (alreadyExists) {
        return true; 
      }

      const eventDetails = {
        summary: expectedSummary,
        description: showData.packageType === 'Ngày nghỉ' 
          ? `Ghi chú: ${showData.notes || 'Không có'}` 
          : `SĐT: ${showData.clientPhone || 'Không có'}\nĐịa điểm: ${showData.location || 'Studio'}\nGhi chú: ${showData.notes || 'Không có'}`,
        location: showData.packageType === 'Ngày nghỉ' ? 'Cá nhân' : (showData.location || 'Our June Studio'),
        start: { date: startDate },
        end: { date: endDateStr },
        colorId: colorId,
      };

      const createRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });

      return createRes.ok;
    } catch (err) {
      console.error("Lỗi đồng bộ Google Calendar:", err);
      return false;
    }
  };

  const deleteShowFromGoogleCalendar = async (showData) => {
    const accessToken = await getVerifiedAccessToken();
    if (!accessToken) return;

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=2500', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (data.items) {
        const expectedSummary = `[${showData.packageType}] ${showData.clientName}`;
        const matchingEvents = data.items.filter(event => 
          event.summary === expectedSummary &&
          event.start && event.start.date === showData.date
        );
        for (const eventMatch of matchingEvents) {
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

  // Bước 1: Quét lịch mới còn thiếu & thu thập danh sách sự kiện dự kiến xóa để người dùng xác nhận
  const handleSmartSyncWithGoogle = async () => {
    const accessToken = await getVerifiedAccessToken();
    if (!accessToken) {
      alert("Vui lòng kết nối Google trước!");
      return;
    }

    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=2500', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const gData = await res.json();
      const googleEvents = gData.items || [];

      let addedCount = 0;
      const deleteCandidates = [];
      const seenKeys = new Set();

      for (const gEvent of googleEvents) {
        if (!gEvent.summary || !gEvent.start || gEvent.status === 'cancelled') continue;
        const startStr = gEvent.start.date || (gEvent.start.dateTime ? gEvent.start.dateTime.slice(0, 10) : '');
        const key = `${gEvent.summary}__${startStr}`;

        if (seenKeys.has(key)) {
          deleteCandidates.push({
            id: gEvent.id,
            summary: gEvent.summary,
            startStr: startStr || 'Không rõ ngày',
            reason: 'Lịch trùng lặp',
            selected: true
          });
          continue;
        }
        seenKeys.add(key);

        const matchFound = shows.some(show => {
          const expectedSummary = `[${show.packageType}] ${show.clientName}`;
          return gEvent.summary === expectedSummary && startStr === show.date;
        });

        if (!matchFound) {
          deleteCandidates.push({
            id: gEvent.id,
            summary: gEvent.summary,
            startStr: startStr || 'Không rõ ngày',
            reason: 'Không có trên danh sách web',
            selected: true
          });
        }
      }

      for (const show of shows) {
        if (show.date) {
          const expectedSummary = `[${show.packageType}] ${show.clientName}`;
          const alreadyExistsOnGoogle = googleEvents.some(gEvent => {
            if (!gEvent.summary || !gEvent.start || gEvent.status === 'cancelled') return false;
            const gStart = gEvent.start.date || (gEvent.start.dateTime ? gEvent.start.dateTime.slice(0, 10) : '');
            return gEvent.summary === expectedSummary && gStart === show.date;
          });

          if (!alreadyExistsOnGoogle) {
            await syncShowToGoogleCalendar(show);
            addedCount++;
          }
        }
      }

      if (deleteCandidates.length > 0) {
        setSyncDeletePrompt({
          isOpen: true,
          candidates: deleteCandidates,
          addedCount,
          isExecuting: false
        });
      } else {
        alert(`Đồng bộ hoàn tất!\n- Đã thêm mới: ${addedCount} lịch.\n- Không có lịch thừa nào cần xóa.`);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ thông minh:", err);
      alert("Có lỗi xảy ra khi đồng bộ với Google Calendar.");
    }
  };

  // Bước 2: Chỉ xóa các lịch người dùng đã tick chọn sau khi xác nhận
  const handleConfirmDeleteSyncEvents = async () => {
    const selectedItems = syncDeletePrompt.candidates.filter(item => item.selected);
    const addedCount = syncDeletePrompt.addedCount;

    if (selectedItems.length === 0) {
      setSyncDeletePrompt({ isOpen: false, candidates: [], addedCount: 0, isExecuting: false });
      alert(`Đã thêm mới ${addedCount} lịch. Không có lịch nào bị xóa.`);
      return;
    }

    const accessToken = await getVerifiedAccessToken();
    if (!accessToken) {
      alert("Phiên kết nối Google đã hết hạn. Vui lòng kết nối lại!");
      return;
    }

    setSyncDeletePrompt(prev => ({ ...prev, isExecuting: true }));
    let deletedCount = 0;

    try {
      for (const item of selectedItems) {
        const delRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (delRes.ok || delRes.status === 404 || delRes.status === 410) {
          deletedCount++;
        }
      }
      setSyncDeletePrompt({ isOpen: false, candidates: [], addedCount: 0, isExecuting: false });
      alert(`Đồng bộ thành công!\n- Đã thêm mới: ${addedCount} lịch.\n- Đã xóa: ${deletedCount} lịch đã chọn.`);
    } catch (err) {
      console.error("Lỗi khi xóa lịch đã xác nhận:", err);
      setSyncDeletePrompt(prev => ({ ...prev, isExecuting: false }));
      alert("Có lỗi xảy ra khi xóa một số lịch trên Google Calendar.");
    }
  };

  const toggleSyncCandidate = (id) => {
    setSyncDeletePrompt(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c)
    }));
  };

  const toggleAllSyncCandidates = (nextSelected) => {
    setSyncDeletePrompt(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => ({ ...c, selected: nextSelected }))
    }));
  };

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
    incomes: [],
    expenses: [],
    notes: ''
  });

  const [newIncomeTitle, setNewIncomeTitle] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const isNonCommercialPackage = (pkgType) => pkgType === 'Gặp khách' || pkgType === 'Đợi khách' || pkgType === 'Ngày nghỉ';

  const getBrandName = (pkgType) => {
    if (pkgType === 'Makeup') return 'DO ANH THI MAKEUP';
    return 'OUR JUNE STUDIO';
  };

  const getNormalizeCrewList = (assignedStaff) => {
    if (!assignedStaff) return [];
    if (assignedStaff.crewList && Array.isArray(assignedStaff.crewList)) {
      return assignedStaff.crewList;
    }
    return [];
  };

  const calculateShowOtherIncomes = (show) => {
    if (isNonCommercialPackage(show.packageType)) return 0;
    return (show.incomes || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const calculateShowTotalRevenue = (show) => {
    if (isNonCommercialPackage(show.packageType)) return 0;
    return Number(show.totalAmount || 0) + calculateShowOtherIncomes(show);
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

  const isShowInSelectedYearMonth = (show, targetYear, targetMonth) => {
    const startYM = parseYearMonth(show.date);
    if (!startYM) return false;
    const endYM = show.endDate ? parseYearMonth(show.endDate) : startYM;

    const matchStart = startYM.year === targetYear && startYM.month === targetMonth;
    const matchEnd = Boolean(endYM && endYM.year === targetYear && endYM.month === targetMonth);
    return matchStart || matchEnd;
  };

  const currentMonthShows = useMemo(() => {
    const filtered = shows.filter((show) => {
      if (!show.date) return false;
      if (isNonCommercialPackage(show.packageType)) return false;

      if (!isShowInSelectedYearMonth(show, selectedYear, selectedMonth)) return false;

      const matchSearch =
        show.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.packageType.toLowerCase().includes(searchTerm.toLowerCase());

      let matchFilter = true;
      if (statusFilter === 'Media') {
        matchFilter = show.packageType !== 'Makeup';
      } else if (statusFilter === 'Makeup') {
        matchFilter = show.packageType === 'Makeup';
      } else if (statusFilter !== 'All') {
        matchFilter = show.status === statusFilter;
      }

      return matchSearch && matchFilter;
    });

    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
    });
  }, [shows, selectedMonth, selectedYear, searchTerm, statusFilter]);

  const monthStats = useMemo(() => {
    let totalRevenue = 0;
    let totalContractAmount = 0;
    let totalOtherIncome = 0;
    let totalDeposit = 0;
    let totalExpenses = 0;
    let completedShowsCount = 0;
    let commercialShowsCount = 0;

    shows.forEach((show) => {
      if (!show.date) return;
      if (isShowInSelectedYearMonth(show, selectedYear, selectedMonth)) {
        if (!isNonCommercialPackage(show.packageType)) {
          commercialShowsCount++;
          const contractAmt = Number(show.totalAmount || 0);
          const otherInc = calculateShowOtherIncomes(show);
          totalContractAmount += contractAmt;
          totalOtherIncome += otherInc;
          totalRevenue += contractAmt + otherInc;
          totalDeposit += Number(show.depositAmount || 0);
          totalExpenses += calculateShowTotalExpenses(show);
          if (show.status === 'Đã thanh toán') completedShowsCount++;
        }
      }
    });

    const netProfit = totalRevenue - totalExpenses;
    const remainingToCollect = totalContractAmount - totalDeposit;

    return { totalRevenue, totalOtherIncome, totalDeposit, remainingToCollect, totalExpenses, netProfit, count: commercialShowsCount, completedShowsCount };
  }, [shows, selectedMonth, selectedYear]);

  const yearlyStats = useMemo(() => {
    const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      let revenue = 0, otherIncomeTotal = 0, expenses = 0, staffPayExpenses = 0, otherExpenses = 0, count = 0;
      let makeupRevenue = 0, makeupExpenses = 0, makeupCount = 0;
      let photoRevenue = 0, photoExpenses = 0, photoCount = 0;
      const staffEarnings = {}, staffShowCounts = {};
      const monthShows = [];

      shows.forEach((s) => {
        if (!s.date) return;
        const ym = parseYearMonth(s.date);
        if (ym && ym.year === selectedYear && ym.month === monthNum) {
          if (isNonCommercialPackage(s.packageType)) return;

          const contractAmt = Number(s.totalAmount || 0);
          const otherInc = calculateShowOtherIncomes(s);
          const totalAmt = contractAmt + otherInc;
          revenue += totalAmt;
          otherIncomeTotal += otherInc;
          
          const sPay = calculateShowStaffPay(s);
          const oExp = calculateShowOtherExpenses(s);
          const sExp = sPay + oExp;

          staffPayExpenses += sPay;
          otherExpenses += oExp;
          expenses += sExp;
          count++;

          if (s.packageType === 'Makeup') {
            makeupRevenue += totalAmt;
            makeupExpenses += sExp;
            makeupCount++;
          } else {
            photoRevenue += totalAmt;
            photoExpenses += sExp;
            photoCount++;
          }

          const profit = totalAmt - sExp;
          monthShows.push({
            ...s,
            otherInc,
            totalRev: totalAmt,
            staffPay: sPay,
            otherExp: oExp,
            totalExp: sExp,
            profit
          });

          const crewList = getNormalizeCrewList(s.assignedStaff);
          crewList.forEach((c) => {
            if (c.name && Number(c.pay) > 0) {
              staffEarnings[c.name] = (staffEarnings[c.name] || 0) + Number(c.pay);
              staffShowCounts[c.name] = (staffShowCounts[c.name] || 0) + 1;
            }
          });
        }
      });

      const photoProfit = photoRevenue - photoExpenses;
      const makeupProfit = makeupRevenue - makeupExpenses;

      return { 
        month: monthNum, revenue, otherIncomeTotal, expenses, staffPayExpenses, otherExpenses, 
        profit: revenue - expenses, count, 
        photoRevenue, photoExpenses, photoProfit, photoCount,
        makeupRevenue, makeupExpenses, makeupProfit, makeupCount,
        staffEarnings, staffShowCounts,
        monthShows: monthShows.sort((a, b) => a.date.localeCompare(b.date))
      };
    });

    const annualSummary = monthlyBreakdown.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalOtherIncome: acc.totalOtherIncome + curr.otherIncomeTotal,
        totalExpenses: acc.totalExpenses + curr.expenses,
        totalStaffPay: acc.totalStaffPay + curr.staffPayExpenses,
        totalOtherExpenses: acc.totalOtherExpenses + curr.otherExpenses,
        totalProfit: acc.totalProfit + curr.profit,
        totalShows: acc.totalShows + curr.count,
        totalPhotoShows: acc.totalPhotoShows + curr.photoCount,
        totalMakeupShows: acc.totalMakeupShows + curr.makeupCount
      }),
      {
        totalRevenue: 0,
        totalOtherIncome: 0,
        totalExpenses: 0,
        totalStaffPay: 0,
        totalOtherExpenses: 0,
        totalProfit: 0,
        totalShows: 0,
        totalPhotoShows: 0,
        totalMakeupShows: 0
      }
    );

    return { monthlyBreakdown, annualSummary };
  }, [shows, selectedYear]);

  const handleExportYearlyExcel = () => {
    try {
      let csvContent = "\uFEFF";
      csvContent += `BÁO CÁO TỔNG KẾT TÀI CHÍNH NĂM ${selectedYear} - OUR JUNE STUDIO\n\n`;
      
      csvContent += `--- TỔNG HỢP CÁC THÁNG TRONG NĂM ---\n`;
      csvContent += `Tháng,Số lượng Show,Số Show Chụp,Số Show Makeup,Khoản Thu Khác (VNĐ),Tổng Doanh Thu (VNĐ),Chi Phí Lương Thợ (VNĐ),Chi Phí Khác (VNĐ),Tổng Chi Phí (VNĐ),Lợi Nhuận Ròng (VNĐ),Lợi Nhuận Chụp Ảnh,Lợi Nhuận Makeup\n`;

      yearlyStats.monthlyBreakdown.forEach((item) => {
        csvContent += `Tháng ${item.month},${item.count},${item.photoCount},${item.makeupCount},${item.otherIncomeTotal},${item.revenue},${item.staffPayExpenses},${item.otherExpenses},${item.expenses},${item.profit},${item.photoProfit},${item.makeupProfit}\n`;
      });

      csvContent += `TỔNG CẢ NĂM,${yearlyStats.annualSummary.totalShows},${yearlyStats.annualSummary.totalPhotoShows},${yearlyStats.annualSummary.totalMakeupShows},${yearlyStats.annualSummary.totalOtherIncome},${yearlyStats.annualSummary.totalRevenue},${yearlyStats.annualSummary.totalStaffPay},${yearlyStats.annualSummary.totalOtherExpenses},${yearlyStats.annualSummary.totalExpenses},${yearlyStats.annualSummary.totalProfit},,\n\n\n`;

      csvContent += `--- DANH SÁCH CHI TIẾT SHOW THEO TỪNG THÁNG TRONG NĂM ---\n\n`;
      
      yearlyStats.monthlyBreakdown.forEach((item) => {
        if (item.monthShows.length > 0) {
          csvContent += `THÁNG ${item.month} (${item.count} show)\n`;
          csvContent += `Ngày,Gói dịch vụ,Tên khách hàng,Trạng thái,Giá HĐ (VNĐ),Khoản thu khác (VNĐ),Tổng doanh thu (VNĐ),Lương ekip (VNĐ),Chi phí phát sinh (VNĐ),Tổng chi phí (VNĐ),Lợi nhuận ròng (VNĐ)\n`;
          
          item.monthShows.forEach((show) => {
            const dateStr = show.endDate && show.endDate !== show.date ? `${show.date} -> ${show.endDate}` : show.date;
            const clientClean = (show.clientName || '').replace(/,/g, ' ');
            csvContent += `${dateStr},${show.packageType},"${clientClean}",${show.status},${show.totalAmount || 0},${show.otherInc},${show.totalRev},${show.staffPay},${show.otherExp},${show.totalExp},${show.profit}\n`;
          });
          csvContent += `\n`;
        }
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OurJune_Studio_BaoCaoNam_${selectedYear}_ChiTietShow.csv`;
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
      const ym = parseYearMonth(s.date);
      if (ym && ym.year === selectedYear) {
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
    return matchedShows.sort((a, b) => a.date.localeCompare(b.date));
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

  const handlePrevYear = () => {
    setSelectedYear((y) => y - 1);
  };

  const handleNextYear = () => {
    setSelectedYear((y) => y + 1);
  };

  const handleOpenShowModal = (showToEdit = null, defaultDate = null) => {
    setModalOriginTab(activeTab);

    if (showToEdit) {
      setEditingShow(showToEdit);
      setShowFormData({
        clientName: showToEdit.clientName || '', clientPhone: showToEdit.clientPhone || '',
        date: showToEdit.date || '', endDate: showToEdit.endDate || '',
        startTime: showToEdit.startTime || '', endTime: showToEdit.endTime || '',
        packageType: showToEdit.packageType || '', location: showToEdit.location || '',
        assignedStaff: { crewList: getNormalizeCrewList(showToEdit.assignedStaff) },
        totalAmount: showToEdit.totalAmount || 0, depositAmount: showToEdit.depositAmount || 0,
        status: showToEdit.status || 'Chưa cọc', incomes: showToEdit.incomes || [], expenses: showToEdit.expenses || [], notes: showToEdit.notes || ''
      });
    } else {
      setEditingShow(null);
      const todayStr = defaultDate || getVietnamTodayStr();
      setShowFormData({
        clientName: '', clientPhone: '', date: todayStr, endDate: '',
        startTime: '', endTime: '', packageType: '', location: '',
        assignedStaff: { crewList: [] }, totalAmount: 0, depositAmount: 0,
        status: 'Chưa cọc', incomes: [], expenses: [], notes: ''
      });
    }
    setNewIncomeTitle('');
    setNewIncomeAmount('');
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
    
    const ym = parseYearMonth(targetDateStr);
    if (ym) {
      setSelectedMonth(ym.month);
      setSelectedYear(ym.year);
    }

    setSelectedCalendarDay({ dateStr: targetDateStr, shows: dayShows, singleShowMode: dayShows.length === 1 });
    setActiveTab('calendar');
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    const targetDate = showFormData.date;
    const isNonComm = isNonCommercialPackage(showFormData.packageType);

    let finalIncomes = [...(showFormData.incomes || [])];
    const pendingIncomeTitle = (newIncomeTitle || '').trim();
    const pendingIncomeAmount = Number(newIncomeAmount || 0);
    if (!isNonComm && (pendingIncomeTitle !== '' || pendingIncomeAmount > 0)) {
      finalIncomes.push({
        id: 'inc-' + Date.now(),
        title: pendingIncomeTitle || 'Khoản thu khác',
        amount: pendingIncomeAmount
      });
    }

    let finalExpenses = [...(showFormData.expenses || [])];
    const pendingTitle = (newExpenseTitle || '').trim();
    const pendingAmount = Number(newExpenseAmount || 0);
    if (!isNonComm && (pendingTitle !== '' || pendingAmount > 0)) {
      finalExpenses.push({
        id: 'exp-' + Date.now(),
        title: pendingTitle || 'Chi phí phát sinh',
        amount: pendingAmount
      });
    }

    const payload = {
      ...showFormData,
      clientName: showFormData.packageType === 'Ngày nghỉ' ? (showFormData.clientName || 'Ngày nghỉ cá nhân') : showFormData.clientName,
      totalAmount: isNonComm ? 0 : Number(showFormData.totalAmount || 0),
      depositAmount: isNonComm ? 0 : Number(showFormData.depositAmount || 0),
      incomes: isNonComm ? [] : finalIncomes,
      expenses: isNonComm ? [] : finalExpenses,
      assignedStaff: isNonComm ? { crewList: [] } : showFormData.assignedStaff
    };

    try {
      const accessToken = await getVerifiedAccessToken();
      if (!accessToken) {
        alert("⚠️ Phiên kết nối Google đã hết hạn. Vui lòng bấm đồng ý đăng nhập Google để hoàn tất việc lưu và đồng bộ lịch!");
        return;
      }

      let updatedShows = [...shows];
      if (editingShow) {
        const previousSnapshot = { ...editingShow };
        delete previousSnapshot.id;

        await deleteShowFromGoogleCalendar(editingShow);
        const showRef = doc(db, "shows", editingShow.id);
        await updateDoc(showRef, payload);
        updatedShows = updatedShows.map(s => s.id === editingShow.id ? { ...payload, id: editingShow.id } : s);

        await writeActivityLog({
          actionType: 'update',
          targetType: 'show',
          targetId: editingShow.id,
          summary: `Sửa lịch [${payload.packageType}] - ${payload.clientName}`,
          detail: `Ngày ${payload.date}${payload.endDate && payload.endDate !== payload.date ? ` → ${payload.endDate}` : ''} · Trạng thái: ${payload.status}`,
          previousData: previousSnapshot
        });
      } else {
        const docRef = await addDoc(collection(db, "shows"), payload);
        updatedShows.push({ ...payload, id: docRef.id });

        await writeActivityLog({
          actionType: 'create',
          targetType: 'show',
          targetId: docRef.id,
          summary: `Thêm lịch [${payload.packageType}] - ${payload.clientName}`,
          detail: `Ngày ${payload.date}${payload.endDate && payload.endDate !== payload.date ? ` → ${payload.endDate}` : ''} · ${payload.location || 'Chưa rõ địa điểm'}`
        });
      }
      
      const syncSuccess = await syncShowToGoogleCalendar(payload);
      if (!syncSuccess) {
        alert("⚠️ Lịch đã được lưu vào web nhưng chưa thể đẩy lên Google Calendar. Vui lòng kiểm tra lại kết nối.");
      }

      setNewIncomeTitle('');
      setNewIncomeAmount('');
      setNewExpenseTitle('');
      setNewExpenseAmount('');
      setIsShowModalOpen(false);

      if (modalOriginTab === 'list') {
        setActiveTab('list');
      } else {
        openDayDetailByDate(targetDate, updatedShows);
      }
    } catch (error) {
      console.error("Lỗi lưu show:", error);
    }
  };

  const handleDeleteShow = async (id, targetDate = null) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch này?")) {
      try {
        const showToDelete = shows.find(s => s.id === id);
        if (showToDelete) {
          const snapshot = { ...showToDelete };
          delete snapshot.id;

          await deleteShowFromGoogleCalendar(showToDelete);
          await deleteDoc(doc(db, "shows", id));

          await writeActivityLog({
            actionType: 'delete',
            targetType: 'show',
            targetId: id,
            summary: `Xóa lịch [${showToDelete.packageType}] - ${showToDelete.clientName}`,
            detail: `Ngày ${showToDelete.date}${showToDelete.endDate && showToDelete.endDate !== showToDelete.date ? ` → ${showToDelete.endDate}` : ''} · Doanh thu: ${formatCurrency(calculateShowTotalRevenue(showToDelete))}`,
            previousData: snapshot
          });
        } else {
          await deleteDoc(doc(db, "shows", id));
        }

        const updatedShows = shows.filter(s => s.id !== id);
        if (selectedCalendarDay && targetDate) {
          openDayDetailByDate(targetDate, updatedShows);
        }
      } catch (error) {
        console.error("Lỗi xóa show:", error);
      }
    }
  };

  const handleRestoreShowFromLog = async (logItem) => {
    if (!logItem || !logItem.previousData || logItem.targetType !== 'show') return;
    setRestoringLogId(logItem.id);
    try {
      const restoredPayload = sanitizeForFirestore(logItem.previousData);
      if (logItem.targetId) {
        await setDoc(doc(db, "shows", logItem.targetId), restoredPayload);
      } else {
        await addDoc(collection(db, "shows"), restoredPayload);
      }

      if (restoredPayload.date) {
        await syncShowToGoogleCalendar(restoredPayload);
      }

      await writeActivityLog({
        actionType: 'restore',
        targetType: 'show',
        targetId: logItem.targetId || null,
        summary: `Khôi phục lịch [${restoredPayload.packageType}] - ${restoredPayload.clientName}`,
        detail: `Khôi phục về bản ngày ${restoredPayload.date} (${logItem.timeLabel})`
      });

      alert(`Đã khôi phục lịch "${restoredPayload.clientName}" (${restoredPayload.date}) thành công!`);
    } catch (err) {
      console.error("Lỗi khôi phục lịch:", err);
      alert("Không thể khôi phục lịch này. Vui lòng thử lại.");
    } finally {
      setRestoringLogId(null);
    }
  };

  const handleAddIncome = () => {
    const trimmedTitle = (newIncomeTitle || '').trim();
    const parsedAmount = Number(newIncomeAmount || 0);
    if (!trimmedTitle && parsedAmount <= 0) return;
    const newInc = {
      id: 'inc-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: trimmedTitle || 'Khoản thu khác',
      amount: parsedAmount
    };
    setShowFormData(prev => ({ ...prev, incomes: [...(prev.incomes || []), newInc] }));
    setNewIncomeTitle('');
    setNewIncomeAmount('');
  };

  const handleRemoveIncome = (id) => {
    setShowFormData(prev => ({ ...prev, incomes: (prev.incomes || []).filter((item) => item.id !== id) }));
  };

  const handleAddExpense = () => {
    const trimmedTitle = (newExpenseTitle || '').trim();
    const parsedAmount = Number(newExpenseAmount || 0);
    if (!trimmedTitle && parsedAmount <= 0) return;
    const newExp = {
      id: 'exp-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: trimmedTitle || 'Chi phí phát sinh',
      amount: parsedAmount
    };
    setShowFormData(prev => ({ ...prev, expenses: [...(prev.expenses || []), newExp] }));
    setNewExpenseTitle('');
    setNewExpenseAmount('');
  };

  const handleRemoveExpense = (id) => {
    setShowFormData(prev => ({ ...prev, expenses: (prev.expenses || []).filter((item) => item.id !== id) }));
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
        await writeActivityLog({
          actionType: 'update',
          targetType: 'staff',
          targetId: editingStaff.id,
          summary: `Sửa nhân sự: ${staffFormData.name}`,
          detail: `Vị trí: ${staffFormData.role} · SĐT: ${staffFormData.phone || 'Chưa có'}`
        });
      } else {
        const docRef = await addDoc(collection(db, "staff"), staffFormData);
        await writeActivityLog({
          actionType: 'create',
          targetType: 'staff',
          targetId: docRef.id,
          summary: `Thêm nhân sự: ${staffFormData.name}`,
          detail: `Vị trí: ${staffFormData.role} · SĐT: ${staffFormData.phone || 'Chưa có'}`
        });
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
      try {
        const targetStaff = staffList.find(s => s.id === id);
        await deleteDoc(doc(db, "staff", id));
        if (targetStaff) {
          await writeActivityLog({
            actionType: 'delete',
            targetType: 'staff',
            targetId: id,
            summary: `Xóa nhân sự: ${targetStaff.name}`,
            detail: `Vị trí: ${targetStaff.role}`
          });
        }
      } catch (error) { console.error("Lỗi xóa nhân sự:", error); }
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Chưa cọc': return <span className="bg-[#f0eae1] text-[#7a6e62] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#dcd2c4]">Chưa cọc</span>;
      case 'Đã cọc': return <span className="bg-[#e8dfd2] text-[#4a4036] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#d0c4b4]">Đã cọc</span>;
      case 'Đã thanh toán': return <span className="bg-[#e6f4ea] text-[#137333] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#ceead6]">Đã thanh toán</span>;
      default: return <span className="bg-[#f0eae1] text-[#7a6e62] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#dcd2c4]">{status}</span>;
    }
  };

  const renderCalendarStatusIndicator = (status) => {
    switch (status) {
      case 'Chưa cọc': return <span className="text-[8px] px-1.5 py-0.2 bg-[#f0eae1] text-[#7a6e62] rounded font-semibold border border-[#dcd2c4]">Chưa cọc</span>;
      case 'Đã cọc': return <span className="text-[8px] px-1.5 py-0.2 bg-[#e8dfd2] text-[#4a4036] rounded font-semibold border border-[#d0c4b4]">Đã cọc</span>;
      case 'Đã thanh toán': return <span className="text-[8px] px-1.5 py-0.2 bg-[#e6f4ea] text-[#137333] rounded font-semibold border border-[#ceead6]">Đã thanh toán</span>;
      default: return null;
    }
  };

  const mediaStaffList = useMemo(() => {
    return staffList.filter(st => {
      const r = (st.role || '').toLowerCase();
      return r.includes('photo') || r.includes('quay') || r.includes('film') || r.includes('media');
    });
  }, [staffList]);

  const makeupStaffList = useMemo(() => {
    return staffList.filter(st => {
      const r = (st.role || '').toLowerCase();
      return r.includes('makeup') || r.includes('tóc') || r.includes('hair') || r.includes('trang điểm');
    });
  }, [staffList]);

  const otherStaffList = useMemo(() => {
    const mediaIds = new Set(mediaStaffList.map(s => s.id));
    const makeupIds = new Set(makeupStaffList.map(s => s.id));
    return staffList.filter(st => !mediaIds.has(st.id) && !makeupIds.has(st.id));
  }, [staffList, mediaStaffList, makeupStaffList]);

  const selectedSyncDeleteCount = useMemo(
    () => syncDeletePrompt.candidates.filter(c => c.selected).length,
    [syncDeletePrompt.candidates]
  );

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#2c2621] font-sans pb-24 selection:bg-[#e0d6c8]">
      {/* Top Header & Sticky Navigation Bar */}
      <header className="bg-[#ffffff] border-b border-[#e6dfd5] sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-3 py-2 flex flex-col gap-1.5">
          
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-sans font-bold text-sm sm:text-base tracking-tight text-[#1c1815] truncate">OUR JUNE</span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] bg-[#f0eae1] text-[#635950] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#dcd2c4] shrink-0">STUDIO</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenNotifications}
                className="relative text-[10px] font-bold px-2 py-1 rounded-lg bg-[#f7f4ef] text-[#1c1815] border border-[#dcd2c4] hover:bg-[#e8dfd2] transition flex items-center gap-1 whitespace-nowrap"
                title="Xem lịch sử thêm, sửa, xóa trên web và khôi phục nếu cần"
              >
                <Icons.Bell className="w-3.5 h-3.5 text-[#4a4036] shrink-0" />
                <span>Thông báo</span>
                {unreadLogsCount > 0 && (
                  <span className="bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                    {unreadLogsCount > 99 ? '99+' : unreadLogsCount}
                  </span>
                )}
              </button>

              {isGoogleConnected ? (
                <button
                  type="button"
                  onClick={handleSmartSyncWithGoogle}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#e6f4ea] text-[#137333] border border-[#ceead6] hover:bg-[#ceead6] transition flex items-center gap-1 whitespace-nowrap"
                  title="Đã kết nối Google Calendar — bấm để đồng bộ lịch ngay"
                >
                  <span>📱 Đồng bộ Google</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#fdf2f2] text-[#991b1b] border border-[#fecaca] animate-pulse transition flex items-center gap-1 whitespace-nowrap"
                  title="Chưa kết nối Google Calendar — bấm để kết nối ngay"
                >
                  <span>⚠️ Kết nối Google</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 bg-[#f2ede6] p-1.5 rounded-xl border border-[#e6dfd5]">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button onClick={() => setActiveTab('calendar')} className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium ${activeTab === 'calendar' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
                <Icons.Calendar className="w-3.5 h-3.5 text-[#85786c]" />
                <span>Lịch</span>
              </button>
              <button onClick={() => setActiveTab('list')} className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium ${activeTab === 'list' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
                <Icons.Camera className="w-3.5 h-3.5 text-[#85786c]" />
                <span>Danh Sách</span>
              </button>
              <button onClick={() => setActiveTab('analytics')} className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium ${activeTab === 'analytics' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
                <Icons.TrendingUp className="w-3.5 h-3.5 text-[#137333]" />
                <span>Thống Kê</span>
              </button>
              <button onClick={() => setActiveTab('staff')} className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium ${activeTab === 'staff' ? 'bg-[#ffffff] text-[#1c1815] font-semibold border border-[#dcd2c4] shadow-2xs' : 'text-[#635950] hover:text-[#1c1815]'}`}>
                <Icons.Users className="w-3.5 h-3.5 text-[#85786c]" />
                <span>Ekip</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 pt-1 border-t border-[#e6dfd5]">
              <a
                href="https://beacons.ai/ourjune.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-2 rounded-md bg-[#ffffff] border border-[#dcd2c4] text-[#635950] hover:text-[#1c1815] hover:bg-[#faf8f5] transition-all flex items-center justify-center gap-1 text-[11px] font-semibold text-center truncate"
                title="Mở trang Báo giá"
              >
                <span>💰 Báo giá</span>
              </a>
              <a
                href="https://shotpik.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-2 rounded-md bg-[#ffffff] border border-[#dcd2c4] text-[#635950] hover:text-[#1c1815] hover:bg-[#faf8f5] transition-all flex items-center justify-center gap-1 text-[11px] font-semibold text-center truncate"
                title="Mở Album trả khách"
              >
                <span>📂 Album</span>
              </a>
              <a
                href="https://www.ourjunestudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-2 rounded-md bg-[#ffffff] border border-[#dcd2c4] text-[#635950] hover:text-[#1c1815] hover:bg-[#faf8f5] transition-all flex items-center justify-center gap-1 text-[11px] font-semibold text-center truncate"
                title="Mở Web chính thức"
              >
                <span>🌐 Web chính</span>
              </a>
              <a
                href="https://ourjunestudio.shotpik.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-2 rounded-md bg-[#ffffff] border border-[#dcd2c4] text-[#635950] hover:text-[#1c1815] hover:bg-[#faf8f5] transition-all flex items-center justify-center gap-1 text-[11px] font-semibold text-center truncate"
                title="Mở Portfolio Ảnh Film"
              >
                <span>🎞️ Film</span>
              </a>
            </div>

            {/* Nút điều hướng thời gian nhanh ghim cố định ngay dưới khối Báo giá / Album / Web chính / Film */}
            <div className="pt-1 border-t border-[#e6dfd5] flex items-center justify-between gap-2">
              {(activeTab === 'calendar' || activeTab === 'list') ? (
                <div className="flex-1 flex items-center justify-between bg-[#ffffff] px-2 py-1 rounded-lg border border-[#dcd2c4]">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-md hover:bg-[#f2ede6] text-[#4a4036] transition"
                    title="Tháng trước"
                  >
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#1c1815] text-center select-none">
                    Tháng {selectedMonth} / {selectedYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-md hover:bg-[#f2ede6] text-[#4a4036] transition"
                    title="Tháng sau"
                  >
                    <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-[#ffffff] px-2 py-1 rounded-lg border border-[#dcd2c4]">
                  <button
                    type="button"
                    onClick={handlePrevYear}
                    className="p-1 rounded-md hover:bg-[#f2ede6] text-[#4a4036] transition"
                    title="Năm trước"
                  >
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#1c1815] text-center select-none">
                    Năm {selectedYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextYear}
                    className="p-1 rounded-md hover:bg-[#f2ede6] text-[#4a4036] transition"
                    title="Năm sau"
                  >
                    <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 space-y-3">
        {(activeTab === 'calendar' || activeTab === 'list') && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] shadow-2xs flex flex-col justify-between space-y-1">
              <span className="text-[11px] font-semibold text-[#635950] uppercase tracking-wider">Tổng Show T{selectedMonth}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-bold text-[#1c1815]">{monthStats.count}</span>
                <span className="text-[10px] font-semibold bg-[#e6f4ea] text-[#137333] px-1.5 py-0.5 rounded border border-[#ceead6]">{monthStats.completedShowsCount} xong</span>
              </div>
            </div>

            <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] shadow-2xs flex flex-col justify-between space-y-1">
              <span className="text-[11px] font-semibold text-[#635950] uppercase tracking-wider">Tổng Doanh Thu</span>
              <div>
                <span className="text-base sm:text-xl font-bold text-[#1c1815] block truncate">{formatCurrencyCompact(monthStats.totalRevenue)}</span>
                <p className="text-[10px] text-[#635950] font-medium truncate">
                  {monthStats.totalOtherIncome > 0
                    ? `Gồm thu khác: +${formatCurrencyCompact(monthStats.totalOtherIncome)}`
                    : `Còn lại: ${formatCurrencyCompact(monthStats.remainingToCollect)}`}
                </p>
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
                <p className="text-[10px] text-[#635950] font-medium truncate">Tổng doanh thu trừ Chi phí</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: GOOGLE CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-3 sm:p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <h2 className="text-sm font-bold text-[#1c1815]">Tháng {selectedMonth} / {selectedYear}</h2>

              <div className="hidden sm:flex items-center gap-3 text-xs font-normal text-[#635950] flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Ngày nghỉ</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Đợi khách</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span> Gặp khách</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9f1239]"></span> Makeup</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#166534]"></span> Show Chụp Hình</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-7 border-b border-[#e6dfd5] text-center pb-2 min-w-[320px]">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dayName, idx) => (<div key={idx} className="text-xs font-semibold text-[#635950]">{dayName}</div>))}
              </div>

              <div className="grid grid-cols-7 border-l border-t border-[#e6dfd5] min-w-[320px]">
                {calendarDays.map((cell, idx) => {
                  const todayStr = getVietnamTodayStr();
                  const isToday = cell.dateStr === todayStr;

                  return (
                    <div key={idx} onClick={() => { if (cell.dateStr) { setSelectedCalendarDay({ dateStr: cell.dateStr, shows: cell.shows, singleShowMode: cell.shows.length === 1 }); } }} className={`min-h-[105px] sm:min-h-[135px] p-1 border-r border-b border-[#e6dfd5] flex flex-col justify-start transition ${cell.isCurrentMonth ? 'bg-[#ffffff] hover:bg-[#fcfbf9] font-normal' : 'bg-[#f7f4ef]/60'} cursor-pointer`}>
                      <div className="flex justify-center sm:justify-start mb-1">
                        <span className={`w-5 h-5 sm:w-5.5 sm:h-5.5 flex items-center justify-center rounded-full text-[11px] sm:text-xs font-medium ${isToday ? 'bg-[#2c2621] text-[#f9f6f0] font-bold shadow-2xs' : cell.isCurrentMonth ? 'text-[#1c1815]' : 'text-[#a89f91]'}`}>{cell.dayNum}</span>
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        {cell.shows.map((show) => {
                          const isOff = show.packageType === 'Ngày nghỉ';
                          const isAsk = show.packageType === 'Đợi khách';
                          const isTryDress = isNonCommercialPackage(show.packageType) && !isOff;
                          const isMakeupOnly = show.packageType === 'Makeup';
                          const bgStyle = isOff ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300' : isAsk ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : isTryDress ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' : isMakeupOnly ? 'bg-rose-50 text-rose-900 font-semibold border border-rose-200' : 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200';
                          const hasMultiDays = show.endDate && show.endDate !== show.date;
                          const isStartDate = show.date === cell.dateStr;
                          const isEndDate = show.endDate === cell.dateStr;

                          return (
                            <div key={show.id} className={`px-1.5 py-1 text-[9px] sm:text-[10px] leading-tight ${bgStyle} ${hasMultiDays ? (isStartDate ? 'rounded-l-md ml-0.5' : isEndDate ? 'rounded-r-md mr-0.5' : 'rounded-none mx-[-4px]') : 'rounded-md'} space-y-0.5`} title={`${show.clientName} (${show.packageType}) - ${show.status || 'Chưa cọc'}`}>
                              {isStartDate || !hasMultiDays ? (
                                <>
                                  <div className="font-bold uppercase tracking-tighter opacity-95 break-words flex items-center justify-between gap-1">
                                    <span>{show.packageType} {hasMultiDays && `(Ngày đầu)`}</span>
                                  </div>
                                  <div className="font-medium break-words whitespace-normal">{show.clientName}</div>
                                  {!isNonCommercialPackage(show.packageType) && (
                                    <div className="pt-0.5">
                                      {renderCalendarStatusIndicator(show.status)}
                                    </div>
                                  )}
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
          </div>
        )}

        {/* TAB 2: SHOW LIST VIEW */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] flex flex-col sm:flex-row gap-2 flex-1 justify-end">
              <div className="relative flex-1 max-w-md">
                <Icons.Search className="w-4 h-4 absolute left-3 top-2.5 text-[#635950]" />
                <input type="text" placeholder="Tìm kiếm theo tên khách, gói chụp, địa điểm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ fontSize: '16px' }} className="w-full pl-9 pr-3 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg text-xs font-medium focus:outline-none text-[#1c1815]" />
              </div>
              <div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ fontSize: '16px' }} className="w-full sm:w-auto px-2.5 py-1.5 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg text-xs font-semibold text-[#635950] focus:outline-none">
                  <option value="All" className="bg-[#ffffff] text-[#2c2621]">Tất cả trạng thái</option>
                  <option value="Media" className="bg-[#ffffff] text-[#2c2621]">Media</option>
                  <option value="Makeup" className="bg-[#ffffff] text-[#2c2621]">Make up</option>
                  <option value="Chưa cọc" className="bg-[#ffffff] text-[#2c2621]">Chưa cọc</option>
                  <option value="Đã cọc" className="bg-[#ffffff] text-[#2c2621]">Đã cọc</option>
                  <option value="Đã thanh toán" className="bg-[#ffffff] text-[#2c2621]">Đã thanh toán</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {currentMonthShows.length === 0 ? (
                <div className="bg-[#ffffff] p-8 rounded-xl border border-[#e6dfd5] text-center space-y-2">
                  <p className="text-[#635950] font-medium text-xs">Chưa có show thương mại nào phù hợp trong Tháng {selectedMonth}/{selectedYear}</p>
                  <button onClick={() => handleOpenShowModal()} className="text-xs font-semibold text-[#1c1815] hover:underline">+ Tạo lịch chụp mới ngay</button>
                </div>
              ) : (
                currentMonthShows.map((show) => {
                  const totalRev = calculateShowTotalRevenue(show);
                  const totalExp = calculateShowTotalExpenses(show);
                  const profit = totalRev - totalExp;
                  const otherIncomesSum = calculateShowOtherIncomes(show);
                  const otherExpensesSum = (show.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
                  const dateStr = show.endDate && show.endDate !== show.date ? `${new Date(`${show.date}T00:00:00`).toLocaleDateString('vi-VN')} ➔ ${new Date(`${show.endDate}T00:00:00`).toLocaleDateString('vi-VN')}` : new Date(`${show.date}T00:00:00`).toLocaleDateString('vi-VN');

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
                          <div className="flex justify-between text-[#4a4036]"><span>Giá Hợp Đồng:</span><span className="font-semibold text-[#1c1815]">{formatCurrency(show.totalAmount)}</span></div>
                          {otherIncomesSum > 0 && (<div className="flex justify-between text-[#137333] text-[11px]"><span>Khoản thu khác:</span><span className="font-semibold">+{formatCurrency(otherIncomesSum)}</span></div>)}
                          <div className="flex justify-between text-[#1c1815] font-semibold"><span>Tổng Doanh Thu:</span><span>{formatCurrency(totalRev)}</span></div>
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
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">{yearlyStats.annualSummary.totalPhotoShows} Show chụp</span>
                  <span className="text-xs font-semibold bg-rose-50 text-rose-900 px-3 py-1 rounded-full border border-rose-200">{yearlyStats.annualSummary.totalMakeupShows} Show Makeup</span>
                  <button onClick={handleExportYearlyExcel} className="bg-[#f7f4ef] border border-[#dcd2c4] hover:bg-[#e8dfd2] text-[#137333] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer">
                    <Icons.Download className="w-4 h-4" /><span>Xuất Excel Báo Cáo Năm (Kèm Chi Tiết Show)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#f7f4ef]/60 p-3.5 rounded-xl border border-[#e6dfd5] space-y-1">
                  <span className="text-xs text-[#635950] font-medium uppercase tracking-wider">Tổng Doanh Thu Năm</span>
                  <div className="text-lg sm:text-xl font-bold text-[#1c1815]">{formatCurrency(yearlyStats.annualSummary.totalRevenue)}</div>
                  {yearlyStats.annualSummary.totalOtherIncome > 0 && (
                    <span className="text-[11px] font-semibold text-[#137333] block">Gồm thu khác: +{formatCurrency(yearlyStats.annualSummary.totalOtherIncome)}</span>
                  )}
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
                <p className="text-xs text-[#635950] font-medium">Bấm vào từng tháng để xem chi tiết lợi nhuận dịch vụ</p>
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
                            <span className="font-bold text-[11px] text-[#635950] uppercase tracking-wider block">Lợi Nhuận Theo Mảng Dịch Vụ Tháng {item.month}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#4a4036]">Lợi Nhuận Chụp Ảnh</span>
                                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-200">{item.photoCount} show</span>
                                  </div>
                                  <span className="text-[10px] text-[#635950] block mt-0.5">Doanh thu: {formatCurrencyCompact(item.photoRevenue)}</span>
                                </div>
                                <span className="font-bold text-[#137333] text-sm">{formatCurrency(item.photoProfit)}</span>
                              </div>
                              <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e6dfd5] flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#4a4036]">Lợi Nhuận Makeup</span>
                                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-900 px-1.5 py-0.5 rounded border border-rose-200">{item.makeupCount} show</span>
                                  </div>
                                  <span className="text-[10px] text-[#635950] block mt-0.5">Doanh thu: {formatCurrencyCompact(item.makeupRevenue)}</span>
                                </div>
                                <span className="font-bold text-[#137333] text-sm">{formatCurrency(item.makeupProfit)}</span>
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

        {/* TAB 4: STAFF MANAGEMENT (GROUPED INTO MEDIA & MAKEUP) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1c1815]">Đội Ngũ Nhân Sự Studio</h2>
                <p className="text-xs text-[#635950] font-medium">Phân chia theo bộ phận Media và Makeup để dễ dàng quản lý</p>
              </div>
              <button onClick={() => handleOpenStaffModal(null)} className="bg-[#2c2621] text-[#f9f6f0] hover:bg-[#4a4036] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition self-end sm:self-auto">
                <Icons.Plus className="w-4 h-4 text-[#dcd2c4]" /> Thêm Nhân Sự Mới
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* NHÓM 1: MEDIA & QUAY CHỤP */}
              <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#1c1815]">Bộ Phận Media & Quay Chụp</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#f2ede6] text-[#4a4036] px-2.5 py-0.5 rounded-full border border-[#dcd2c4]">{mediaStaffList.length} nhân sự</span>
                </div>

                {mediaStaffList.length === 0 ? (
                  <p className="text-xs text-[#a89f91] italic py-4 text-center">Chưa có nhân sự nào trong bộ phận này.</p>
                ) : (
                  <div className="space-y-2.5">
                    {mediaStaffList.map((st) => (
                      <div key={st.id} className="bg-[#f7f4ef]/50 p-3 rounded-lg border border-[#e6dfd5] flex justify-between items-center transition group hover:border-[#b5a799]">
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 onClick={() => setSelectedStaffForModal(st)} className="font-bold text-xs text-[#1c1815] group-hover:text-[#137333] transition flex items-center gap-1.5 cursor-pointer">
                              <span>📷</span> {st.name} <span className="text-[10px] text-[#137333] font-normal">(Xem lịch & lương ➔)</span>
                            </h4>
                          </div>
                          <span className="text-[10px] font-semibold bg-[#ffffff] text-[#4a4036] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#dcd2c4]">{st.role}</span>
                          <p className="text-[11px] text-[#635950] mt-1">SĐT: {st.phone || 'Chưa có'}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {st.phone ? (
                            <a href={`tel:${st.phone}`} className="p-1.5 hover:bg-[#e6f4ea] rounded-lg text-[#137333] border border-[#ceead6] transition" title={`Gọi cho ${st.name}`}>
                              <Icons.Phone className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="p-1.5 text-[#a89f91] opacity-50 cursor-not-allowed" title="Chưa có SĐT"><Icons.Phone className="w-4 h-4" /></span>
                          )}
                          <button onClick={() => handleOpenStaffModal(st)} className="p-1.5 hover:bg-[#ffffff] rounded-lg text-[#635950] border border-[#dcd2c4]" title="Sửa"><Icons.Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteStaff(st.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-700 border border-rose-200" title="Xóa"><Icons.Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* NHÓM 2: MAKEUP & LÀM TÓC */}
              <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9f1239]"></span>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#1c1815]">Bộ Phận Makeup & Làm Tóc</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#f2ede6] text-[#4a4036] px-2.5 py-0.5 rounded-full border border-[#dcd2c4]">{makeupStaffList.length} nhân sự</span>
                </div>

                {makeupStaffList.length === 0 ? (
                  <p className="text-xs text-[#a89f91] italic py-4 text-center">Chưa có nhân sự nào trong bộ phận này.</p>
                ) : (
                  <div className="space-y-2.5">
                    {makeupStaffList.map((st) => (
                      <div key={st.id} className="bg-[#f7f4ef]/50 p-3 rounded-lg border border-[#e6dfd5] flex justify-between items-center transition group hover:border-[#b5a799]">
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 onClick={() => setSelectedStaffForModal(st)} className="font-bold text-xs text-[#1c1815] group-hover:text-[#137333] transition flex items-center gap-1.5 cursor-pointer">
                              <span>💄</span> {st.name} <span className="text-[10px] text-[#137333] font-normal">(Xem lịch & lương ➔)</span>
                            </h4>
                          </div>
                          <span className="text-[10px] font-semibold bg-[#ffffff] text-[#4a4036] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#dcd2c4]">{st.role}</span>
                          <p className="text-[11px] text-[#635950] mt-1">SĐT: {st.phone || 'Chưa có'}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {st.phone ? (
                            <a href={`tel:${st.phone}`} className="p-1.5 hover:bg-[#e6f4ea] rounded-lg text-[#137333] border border-[#ceead6] transition" title={`Gọi cho ${st.name}`}>
                              <Icons.Phone className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="p-1.5 text-[#a89f91] opacity-50 cursor-not-allowed" title="Chưa có SĐT"><Icons.Phone className="w-4 h-4" /></span>
                          )}
                          <button onClick={() => handleOpenStaffModal(st)} className="p-1.5 hover:bg-[#ffffff] rounded-lg text-[#635950] border border-[#dcd2c4]" title="Sửa"><Icons.Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteStaff(st.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-700 border border-rose-200" title="Xóa"><Icons.Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* NHÂN SỰ KHÁC (NẾU CÓ) */}
            {otherStaffList.length > 0 && (
              <div className="bg-[#ffffff] rounded-xl border border-[#e6dfd5] p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-2.5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#635950]">Bộ Phận Khác / Freelance Hỗ Trợ</h3>
                  <span className="text-[10px] font-semibold bg-[#f2ede6] text-[#4a4036] px-2.5 py-0.5 rounded-full border border-[#dcd2c4]">{otherStaffList.length} nhân sự</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {otherStaffList.map((st) => (
                    <div key={st.id} className="bg-[#f7f4ef]/50 p-3 rounded-lg border border-[#e6dfd5] flex justify-between items-center">
                      <div className="flex-1 pr-2">
                        <h4 onClick={() => setSelectedStaffForModal(st)} className="font-bold text-xs text-[#1c1815] cursor-pointer hover:underline">👤 {st.name}</h4>
                        <span className="text-[10px] font-semibold bg-[#ffffff] text-[#4a4036] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#dcd2c4]">{st.role}</span>
                        <p className="text-[11px] text-[#635950] mt-1">SĐT: {st.phone || 'Chưa có'}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {st.phone && <a href={`tel:${st.phone}`} className="p-1.5 text-[#137333]"><Icons.Phone className="w-4 h-4" /></a>}
                        <button onClick={() => handleOpenStaffModal(st)} className="p-1.5 text-[#635950]"><Icons.Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteStaff(st.id)} className="p-1.5 text-rose-700"><Icons.Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NÚT TẠO NHANH NỔI Ở GÓC DƯỚI BÊN PHẢI */}
      <button onClick={() => handleOpenShowModal()} className="fixed bottom-6 right-6 z-40 bg-[#2c2621] hover:bg-[#4a4036] text-[#f9f6f0] p-3.5 rounded-2xl shadow-lg flex items-center justify-center transition-transform active:scale-95" title="Tạo lịch chụp mới">
        <Icons.Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* MODAL: NHẬT KÝ THÔNG BÁO & KHÔI PHỤC */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[75] bg-[#1c1815]/55 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[88vh]">
            <div className="p-4 border-b border-[#e6dfd5] flex justify-between items-center bg-[#ffffff]">
              <div>
                <h3 className="font-bold text-sm text-[#1c1815]">Thông Báo & Nhật Ký Thao Tác</h3>
                <p className="text-xs text-[#635950] mt-0.5">
                  Theo dõi lịch sử thêm, sửa, xóa trên web và bấm <strong>Khôi phục</strong> nếu thao tác nhầm.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(false)}
                className="text-[#635950] hover:text-[#1c1815] p-1"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1 text-xs">
              {activityLogs.length === 0 ? (
                <p className="text-center text-[#635950] italic py-8">Chưa có thông báo thao tác nào được ghi nhận.</p>
              ) : (
                activityLogs.map((log) => {
                  const badgeMap = {
                    create: { text: 'Thêm mới', cls: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]' },
                    update: { text: 'Chỉnh sửa', cls: 'bg-amber-50 text-amber-900 border-amber-200' },
                    delete: { text: 'Đã xóa', cls: 'bg-rose-50 text-rose-800 border-rose-200' },
                    restore: { text: 'Đã khôi phục', cls: 'bg-blue-50 text-blue-900 border-blue-200' }
                  };
                  const badge = badgeMap[log.actionType] || { text: log.actionType, cls: 'bg-[#f2ede6] text-[#4a4036] border-[#dcd2c4]' };
                  const canRestore = log.targetType === 'show' && log.previousData && (log.actionType === 'update' || log.actionType === 'delete');

                  return (
                    <div key={log.id} className="p-3 rounded-xl border border-[#e6dfd5] bg-[#f7f4ef]/50 flex items-start justify-between gap-2.5">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>{badge.text}</span>
                          <span className="text-[11px] text-[#635950] font-medium">{log.timeLabel || ''}</span>
                        </div>
                        <div className="font-bold text-[#1c1815] break-words">{log.summary}</div>
                        {log.detail && <div className="text-[11px] text-[#4a4036] break-words">{log.detail}</div>}
                      </div>

                      {canRestore && (
                        <button
                          type="button"
                          disabled={restoringLogId === log.id}
                          onClick={() => handleRestoreShowFromLog(log)}
                          className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#2c2621] hover:bg-[#4a4036] text-[#f9f6f0] text-[11px] font-semibold transition disabled:opacity-50"
                          title="Khôi phục lại dữ liệu lịch trước khi sửa/xóa"
                        >
                          {restoringLogId === log.id ? 'Đang khôi phục...' : 'Khôi phục'}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-[#ffffff] border-t border-[#e6dfd5] flex justify-end">
              <button
                type="button"
                onClick={() => setIsNotificationOpen(false)}
                className="px-4 py-1.5 bg-[#2c2621] text-[#f9f6f0] rounded-xl text-xs font-semibold hover:bg-[#4a4036]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN TRƯỚC KHI XÓA LỊCH TRÊN GOOGLE CALENDAR */}
      {syncDeletePrompt.isOpen && (
        <div className="fixed inset-0 z-[70] bg-[#1c1815]/55 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[88vh]">
            <div className="p-4 border-b border-[#e6dfd5] flex justify-between items-center bg-[#ffffff]">
              <div>
                <h3 className="font-bold text-sm text-[#1c1815]">Xác Nhận Xóa Lịch Trên Google Calendar</h3>
                <p className="text-xs text-[#635950] mt-0.5">
                  Đã thêm mới <strong className="text-[#137333]">{syncDeletePrompt.addedCount}</strong> lịch. Vui lòng kiểm tra kỹ và bỏ chọn lịch quan trọng bạn muốn giữ lại:
                </p>
              </div>
              <button
                disabled={syncDeletePrompt.isExecuting}
                onClick={() => setSyncDeletePrompt({ isOpen: false, candidates: [], addedCount: 0, isExecuting: false })}
                className="text-[#635950] hover:text-[#1c1815] p-1 disabled:opacity-40"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-2 bg-[#f7f4ef] border-b border-[#e6dfd5] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#4a4036]">
                Đang chọn xóa: <strong className="text-rose-700">{selectedSyncDeleteCount}</strong> / {syncDeletePrompt.candidates.length} lịch
              </span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => toggleAllSyncCandidates(true)} className="font-semibold text-[#1c1815] hover:underline">Chọn tất cả</button>
                <button type="button" onClick={() => toggleAllSyncCandidates(false)} className="font-semibold text-[#635950] hover:underline">Bỏ chọn tất cả</button>
              </div>
            </div>

            <div className="p-3.5 space-y-2 overflow-y-auto flex-1 text-xs">
              {syncDeletePrompt.candidates.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    item.selected
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-[#f7f4ef]/60 border-[#e6dfd5] opacity-75'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.selected}
                    onChange={() => toggleSyncCandidate(item.id)}
                    className="mt-0.5 w-4 h-4 rounded accent-rose-700 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1c1815] break-words">{item.summary}</div>
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px] text-[#635950]">
                      <span>📅 {item.startStr}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#ffffff] border border-[#dcd2c4] font-semibold text-[#4a4036]">
                        {item.reason}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-3.5 bg-[#ffffff] border-t border-[#e6dfd5] flex justify-end gap-2">
              <button
                type="button"
                disabled={syncDeletePrompt.isExecuting}
                onClick={() => setSyncDeletePrompt({ isOpen: false, candidates: [], addedCount: 0, isExecuting: false })}
                className="px-3.5 py-1.5 border border-[#dcd2c4] rounded-xl text-xs font-semibold text-[#4a4036] hover:bg-[#f7f4ef] disabled:opacity-40"
              >
                Không xóa lịch nào
              </button>
              <button
                type="button"
                disabled={syncDeletePrompt.isExecuting}
                onClick={handleConfirmDeleteSyncEvents}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
              >
                {syncDeletePrompt.isExecuting
                  ? 'Đang xóa...'
                  : `Xác nhận xóa (${selectedSyncDeleteCount})`}
              </button>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#1c1815]">Lịch Chụp & Lương Năm {selectedYear} Của: <span className="text-[#137333]">{selectedStaffForModal.name}</span></h3>
                  {selectedStaffForModal.phone && (
                    <a
                      href={`tel:${selectedStaffForModal.phone}`}
                      className="px-2 py-0.5 rounded-md bg-[#e6f4ea] text-[#137333] border border-[#ceead6] hover:bg-[#ceead6] transition flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Icons.Phone /> Gọi ngay
                    </a>
                  )}
                </div>
                <p className="text-xs text-[#635950] font-medium mt-0.5">Chuyên môn: {selectedStaffForModal.role} | SĐT: {selectedStaffForModal.phone || 'Chưa có'}</p>
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
                        const dateText = item.endDate && item.endDate !== item.date ? `${new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN')} ➔ ${new Date(`${item.endDate}T00:00:00`).toLocaleDateString('vi-VN')}` : new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN');
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
                  <label className="block text-[11px] font-bold text-[#4a4036]">Gói Dịch Vụ *</label>
                  <select value={showFormData.packageType} onChange={(e) => setShowFormData({ ...showFormData, packageType: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none">
                    <option value="" className="bg-[#ffffff] text-[#635950]">-- Chọn Gói Dịch Vụ --</option>
                    {PACKAGES.map((pkg) => (<option key={pkg} value={pkg} className="bg-[#ffffff] text-[#1c1815]">{pkg}</option>))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#4a4036]">
                    {showFormData.packageType === 'Ngày nghỉ' ? 'Tiêu đề / Tên lịch nghỉ (VD: Nghỉ phép, Việc cá nhân)' : 'Tên Khách Hàng *'}
                  </label>
                  <input type="text" required value={showFormData.clientName} onChange={(e) => setShowFormData({ ...showFormData, clientName: e.target.value })} placeholder={showFormData.packageType === 'Ngày nghỉ' ? 'Ví dụ: Ngày nghỉ cá nhân' : 'Nhập tên khách hàng'} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                </div>

                {showFormData.packageType !== 'Ngày nghỉ' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#4a4036]">Số Điện Thoại</label>
                    <input type="text" value={showFormData.clientPhone} onChange={(e) => setShowFormData({ ...showFormData, clientPhone: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                  </div>
                )}

                <div className="space-y-1 relative">
                  <label className="block text-[11px] font-bold text-[#4a4036]">Khoảng Ngày Lịch (Từ ngày ➔ Đến ngày) *</label>
                  <div onClick={() => setIsDateRangePickerOpen(!isDateRangePickerOpen)} className="w-full px-3 py-2 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] flex items-center justify-between cursor-pointer hover:border-[#137333] transition">
                    <div className="flex items-center gap-2">
                      <Icons.Calendar className="w-4 h-4 text-[#635950]" />
                      <span>
                        {showFormData.date ? new Date(`${showFormData.date}T00:00:00`).toLocaleDateString('vi-VN') : 'Chọn ngày bắt đầu'}
                        {' ➔ '}
                        {showFormData.endDate ? new Date(`${showFormData.endDate}T00:00:00`).toLocaleDateString('vi-VN') : (showFormData.date ? new Date(`${showFormData.date}T00:00:00`).toLocaleDateString('vi-VN') : 'Chọn ngày kết thúc')}
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

                {showFormData.packageType !== 'Ngày nghỉ' && (
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
                )}
              </div>

              {showFormData.packageType !== 'Ngày nghỉ' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#4a4036]">Địa Điểm</label>
                  <input type="text" value={showFormData.location} onChange={(e) => setShowFormData({ ...showFormData, location: e.target.value })} style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#4a4036]">Ghi Chú</label>
                <textarea rows={2} value={showFormData.notes} onChange={(e) => setShowFormData({ ...showFormData, notes: e.target.value })} placeholder="Nhập ghi chú cho ngày nghỉ hoặc lịch hẹn" style={{ fontSize: '16px' }} className="w-full px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded-lg font-semibold text-[#1c1815] focus:outline-none" />
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
                    <span className="font-bold text-[10px] text-[#635950] uppercase tracking-wider block">Khoản Thu Khác</span>
                    <div className="space-y-1">
                      {(showFormData.incomes || []).map((inc) => (
                        <div key={inc.id} className="flex justify-between items-center bg-[#f7f4ef]/60 p-1.5 rounded border border-[#e6dfd5]">
                          <span className="font-medium text-[#4a4036] truncate pr-2">{inc.title}</span>
                          <div className="flex items-center gap-1.5 shrink-0"><span className="font-bold text-[#137333]">+{formatCurrency(inc.amount)}</span><button type="button" onClick={() => handleRemoveIncome(inc.id)} className="text-rose-700"><Icons.X className="w-3 h-3" /></button></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input type="text" placeholder="Tên khoản thu (VD: Tip khách)" value={newIncomeTitle} onChange={(e) => setNewIncomeTitle(e.target.value)} style={{ fontSize: '16px' }} className="flex-1 min-w-0 px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded text-[#1c1815]" />
                      <input type="number" placeholder="Số tiền" value={newIncomeAmount} onChange={(e) => setNewIncomeAmount(e.target.value)} style={{ fontSize: '16px' }} className="w-24 shrink-0 px-2 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded font-bold text-[#137333]" />
                      <button type="button" onClick={handleAddIncome} className="shrink-0 px-2.5 py-1 bg-[#2c2621] text-[#f9f6f0] font-semibold rounded">+ Thêm</button>
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
                      <input type="text" placeholder="Tên chi phí" value={newExpenseTitle} onChange={(e) => setNewExpenseTitle(e.target.value)} style={{ fontSize: '16px' }} className="flex-1 min-w-0 px-2.5 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded text-[#1c1815]" />
                      <input type="number" placeholder="Số tiền" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} style={{ fontSize: '16px' }} className="w-24 shrink-0 px-2 py-1 bg-[#f7f4ef] border border-[#dcd2c4] rounded font-bold text-rose-700" />
                      <button type="button" onClick={handleAddExpense} className="shrink-0 px-2.5 py-1 bg-[#2c2621] text-[#f9f6f0] font-semibold rounded">+ Thêm</button>
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
                <button type="button" onClick={() => { setIsShowModalOpen(false); setActiveTab(modalOriginTab); }} className="px-3 py-1 border border-[#dcd2c4] rounded text-[#635950]">Hủy</button>
                <button type="submit" className="px-3 py-1 bg-[#2c2621] text-[#f9f6f0] rounded font-semibold">Lưu Lịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CALENDAR DAY DETAIL */}
      {selectedCalendarDay && !confirmationModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1815]/40 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-xl w-full max-w-lg p-4 sm:p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="font-bold text-[#1c1815]">Lịch Ngày {new Date(`${selectedCalendarDay.dateStr}T00:00:00`).toLocaleDateString('vi-VN')}</h3>
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
                  const isOff = show.packageType === 'Ngày nghỉ';
                  const isNonComm = isNonCommercialPackage(show.packageType);
                  const totalPackage = Number(show.totalAmount || 0);
                  const otherIncomesSum = calculateShowOtherIncomes(show);
                  const totalRevenue = totalPackage + otherIncomesSum;
                  const deposit = Number(show.depositAmount || 0);
                  const remaining = totalPackage - deposit;
                  const totalExp = calculateShowTotalExpenses(show);
                  const profit = totalRevenue - totalExp;
                  const dateText = show.endDate && show.endDate !== show.date ? `${new Date(`${show.date}T00:00:00`).toLocaleDateString('vi-VN')} ➔ ${new Date(`${show.endDate}T00:00:00`).toLocaleDateString('vi-VN')}` : new Date(`${show.date}T00:00:00`).toLocaleDateString('vi-VN');

                  return (
                    <div key={show.id} className="bg-[#f7f4ef]/50 p-3.5 rounded-xl border border-[#e6dfd5] space-y-3">
                      <div className="flex justify-between items-start gap-2 border-b border-[#e6dfd5] pb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-[#1c1815]">{show.clientName}</h4>
                            <span className="text-[10px] font-bold bg-[#ffffff] border border-[#dcd2c4] text-[#1c1815] px-2 py-0.5 rounded-md">{show.packageType}</span>
                            {!isNonComm && renderStatusBadge(show.status)}
                          </div>
                          {!isOff && <p className="text-xs text-[#635950] font-medium mt-0.5">📞 SĐT: {show.clientPhone || 'Chưa có'}</p>}
                          <p className="text-xs text-[#4a4036] font-medium mt-0.5">📅 Thời gian: {dateText}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedCalendarDay(null); handleOpenShowModal(show); }} className="text-xs font-semibold text-[#4a4036] hover:underline flex items-center gap-1"><Icons.Edit className="w-3.5 h-3.5" /> Sửa</button>
                          <button onClick={() => handleDeleteShow(show.id, selectedCalendarDay.dateStr)} className="text-rose-700 hover:text-rose-800 p-1 bg-[#ffffff] border border-rose-200 rounded-md"><Icons.Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      {!isOff && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#ffffff] p-2 rounded-lg border border-[#e6dfd5] flex items-center gap-1.5 text-[#4a4036]">
                            <Icons.Clock className="w-3.5 h-3.5 text-[#635950] shrink-0" /><span><strong>Giờ:</strong> {show.startTime || '08:00'} - {show.endTime || '12:00'}</span>
                          </div>
                          <div className="bg-[#ffffff] p-2 rounded-lg border border-[#e6dfd5] text-[#4a4036] truncate"><span>📍 <strong>Địa điểm:</strong> {show.location || 'Chưa cập nhật'}</span></div>
                        </div>
                      )}

                      {!isNonComm && (
                        <div className="space-y-2 text-xs">
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

                          <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#e6dfd5] space-y-1.5">
                            <div className="flex justify-between items-center"><span className="text-[#635950] font-medium">Giá hợp đồng:</span><span className="font-bold text-[#1c1815]">{formatCurrency(totalPackage)}</span></div>
                            {(show.incomes || []).length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-[#f2ede6]">
                                <span className="text-[#635950] font-medium text-[11px] block">Khoản thu khác:</span>
                                {(show.incomes || []).map((inc) => (
                                  <div key={inc.id} className="flex justify-between items-center text-[11px] text-[#137333]">
                                    <span>+ {inc.title}</span>
                                    <span className="font-semibold">+{formatCurrency(inc.amount)}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center font-semibold text-[#1c1815] pt-0.5">
                                  <span>Tổng doanh thu show:</span>
                                  <span>{formatCurrency(totalRevenue)}</span>
                                </div>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-[#4a4036] pt-1 border-t border-[#f2ede6]"><span className="text-[#635950] font-medium">Đã đặt cọc:</span><span className="font-bold text-[#1c1815]">{formatCurrency(deposit)}</span></div>
                            <div className="flex justify-between items-center text-rose-700"><span className="text-[#635950] font-medium">Còn lại phải thu:</span><span className="font-bold">{formatCurrency(remaining)}</span></div>
                            <div className="flex justify-between items-center text-rose-700 pt-1 border-t border-[#e6dfd5]"><span className="text-[#635950] font-medium">Tổng chi phí (Lương thợ + phát sinh):</span><span className="font-bold">-{formatCurrency(totalExp)}</span></div>
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

                      {!isOff && (
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
                      )}
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
      {confirmationModal.isOpen && confirmationModal.show && (() => {
        const brandTitle = getBrandName(confirmationModal.show.packageType);
        return (
          <div className="fixed inset-0 z-[60] bg-[#1c1815]/75 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
            <div className="bg-[#ffffff] rounded-2xl border border-[#e6dfd5] shadow-2xl w-full max-w-md overflow-hidden my-6">
              <div className="p-3.5 border-b border-[#e6dfd5] flex justify-between items-center bg-[#ffffff]">
                <span className="font-bold text-xs uppercase tracking-wider text-[#635950]">
                  {confirmationModal.type === 'client' ? '📋 Phiếu Xác Nhận Dành Cho Khách Hàng' : '📌 Phiếu Xếp Lịch Cho Nhân Sự'}
                </span>
                <button onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })} className="text-[#635950] hover:text-[#1c1815] p-1"><Icons.X className="w-5 h-5" /></button>
              </div>

              <div className="p-5 bg-[#ffffff] space-y-4 text-[#1c1815]">
                <div className="text-center border-b border-[#e6dfd5] pb-3 space-y-1">
                  <span className="font-bold text-sm tracking-tight text-[#1c1815] uppercase">{brandTitle}</span>
                  <p className="text-[10px] text-[#635950] font-semibold uppercase tracking-widest">
                    {confirmationModal.type === 'client' ? 'XÁC NHẬN THÔNG TIN LỊCH HẸN & DỊCH VỤ' : 'THÔNG TIN PHÂN CÔNG LỊCH EKIP'}
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
                            ? `${new Date(`${confirmationModal.show.date}T00:00:00`).toLocaleDateString('vi-VN')} ➔ ${new Date(`${confirmationModal.show.endDate}T00:00:00`).toLocaleDateString('vi-VN')}`
                            : new Date(`${confirmationModal.show.date}T00:00:00`).toLocaleDateString('vi-VN')}
                        </strong>
                      </div>
                      <div className="flex justify-between"><span className="text-[#635950]">⏰ Giờ:</span><strong className="text-[#1c1815]">{confirmationModal.show.startTime || '08:00'} - {confirmationModal.show.endTime || '12:00'}</strong></div>
                      <div className="flex justify-between"><span className="text-[#635950]">📍 Địa điểm:</span><strong className="text-[#1c1815] text-right truncate max-w-[200px]">{confirmationModal.show.location || (confirmationModal.show.packageType === 'Makeup' ? 'Tại Do Anh Thi Makeup' : 'Tại Studio Our June')}</strong></div>
                    </div>

                    {!isNonCommercialPackage(confirmationModal.show.packageType) && (
                      <div className="bg-[#f7f4ef] p-3.5 rounded-xl border border-[#e6dfd5] space-y-1.5">
                        <div className="flex justify-between text-[#4a4036]"><span>Giá hợp đồng:</span><strong className="text-[#1c1815]">{formatCurrency(confirmationModal.show.totalAmount)}</strong></div>
                        {calculateShowOtherIncomes(confirmationModal.show) > 0 && (
                          <div className="flex justify-between text-[#137333]"><span>Khoản thu khác:</span><strong>+{formatCurrency(calculateShowOtherIncomes(confirmationModal.show))}</strong></div>
                        )}
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
                            ? `${new Date(`${confirmationModal.show.date}T00:00:00`).toLocaleDateString('vi-VN')} ➔ ${new Date(`${confirmationModal.show.endDate}T00:00:00`).toLocaleDateString('vi-VN')}`
                            : new Date(`${confirmationModal.show.date}T00:00:00`).toLocaleDateString('vi-VN')}
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
                  const isMakeupShow = show.packageType === 'Makeup';
                  const msgBrandHeader = isMakeupShow ? 'DO ANH THI MAKEUP' : 'OUR JUNE STUDIO';
                  const msgBrandFooter = isMakeupShow ? 'Do Anh Thi Makeup' : 'Our June Studio';
                  const defaultLocationText = isMakeupShow ? 'Tại Do Anh Thi Makeup' : 'Tại Studio Our June';

                  const dateStrText = show.endDate && show.endDate !== show.date 
                    ? `${new Date(`${show.date}T00:00:00`).toLocaleDateString('vi-VN')} đến ${new Date(`${show.endDate}T00:00:00`).toLocaleDateString('vi-VN')}` 
                    : new Date(`${show.date}T00:00:00`).toLocaleDateString('vi-VN');
                  
                  let text = '';
                  if (confirmationModal.type === 'client') {
                    const total = Number(show.totalAmount || 0);
                    const otherInc = calculateShowOtherIncomes(show);
                    const deposit = Number(show.depositAmount || 0);
                    const remaining = total - deposit;

                    text = `[${msgBrandHeader}] XÁC NHẬN LỊCH HẸN & DỊCH VỤ\n` +
                           `----------------------------------------\n` +
                           `- Khách hàng: ${show.clientName}\n` +
                           `- SĐT: ${show.clientPhone || 'Chưa cung cấp'}\n` +
                           `- Gói dịch vụ: ${show.packageType}\n` +
                           `- Ngày: ${dateStrText}\n` +
                           `- Khung giờ: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n` +
                           `- Địa điểm: ${show.location || defaultLocationText}\n`;
                    
                    if (!isNonCommercialPackage(show.packageType)) {
                      text += `- Giá hợp đồng: ${formatCurrency(total)}\n`;
                      if (otherInc > 0) {
                        text += `- Khoản thu khác: +${formatCurrency(otherInc)}\n`;
                      }
                      text += `- Đã đặt cọc: ${formatCurrency(deposit)}\n` +
                              `- Còn lại cần thanh toán: ${formatCurrency(remaining)}\n`;
                    }

                    text += `- Ghi chú: ${show.notes || 'Không có'}\n` +
                            `----------------------------------------\n` +
                            `Cảm ơn bạn đã đồng hành cùng ${msgBrandFooter}!`;
                  } else {
                    const crewText = getNormalizeCrewList(show.assignedStaff)
                      .map(c => `+ ${c.role}: ${c.name}`)
                      .join('\n');

                    text = `[${msgBrandHeader}] LỊCH PHÂN CÔNG EKIP\n` +
                           `----------------------------------------\n` +
                           `- Gói / Show: ${show.packageType}\n` +
                           `- Khách hàng: ${show.clientName} (SĐT: ${show.clientPhone || 'Chưa có'})\n` +
                           `- Ngày: ${dateStrText}\n` +
                           `- Khung giờ: ${show.startTime || '08:00'} - ${show.endTime || '12:00'}\n` +
                           `- Địa điểm: ${show.location || defaultLocationText}\n` +
                           `- Ekip phụ trách:\n${crewText || 'Chưa phân công'}\n` +
                           `- Ghi chú: ${show.notes || 'Không có'}\n` +
                           `----------------------------------------\n` +
                           `Mọi người chú ý thời gian chuẩn bị nhé!`;
                  }

                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => alert('Đã sao chép đầy đủ nội dung tin nhắn vào bộ nhớ tạm!'));
                  }
                }} className="flex-1 bg-[#2c2621] text-[#f9f6f0] px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#4a4036]">
                  📋 Sao Chép Tin Nhắn Đầy Đủ
                </button>
                <button onClick={() => setConfirmationModal({ isOpen: false, type: 'client', show: null })} className="px-4 py-1.5 border border-[#e6dfd5] text-[#635950] rounded-xl text-xs font-semibold">Đóng</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
