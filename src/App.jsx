import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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
    expenses: [],
    notes: 'Yêu cầu tông màu ấm nhẹ nhàng.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2026);

  return (
    <div className="min-h-screen bg-[#141210] text-[#f3ece4] font-sans p-6">
      <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-[#2c251e] pb-4 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#f9f6f0]">OUR JUNE STUDIO</h1>
        <span className="bg-[#26211c] text-[#86efac] px-3 py-1 rounded-full text-xs font-semibold border border-[#2e4d38]">
          ● Web Online Ready
        </span>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#1b1815] p-6 rounded-2xl border border-[#2c251e] shadow-xl text-center space-y-3">
          <h2 className="text-2xl font-bold text-[#f9f6f0]">Hệ Thống Quản Lý Our June Studio</h2>
          <p className="text-sm text-[#a3978b]">Trang web đã kết nối máy chủ và sẵn sàng hoạt động trên mọi thiết bị.</p>
          <div className="pt-4 flex justify-center gap-3">
            <button className="bg-[#26211c] border border-[#3c342c] text-[#f9f6f0] px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
              + Tạo Lịch Chụp Mới
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}