import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import { db } from "./firebase";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Giải pháp 1 & 3: Tải 20 bản ghi đầu tiên kết hợp Skeleton Loading
  useEffect(() => {
    async function fetchInitialBookings() {
      try {
        setLoading(true);
        const q = query(
          collection(db, "bookings"),
          orderBy("date", "desc"),
          limit(20) // Giải pháp 1: Giới hạn số lượng tải về
        );
        
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setBookings(list);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        if (snapshot.docs.length < 20) setHasMore(false);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialBookings();
  }, []);

  // Hàm tải thêm dữ liệu cũ khi bấm xem thêm
  const loadMoreBookings = async () => {
    if (!lastVisible) return;
    try {
      const q = query(
        collection(db, "bookings"),
        orderBy("date", "desc"),
        startAfter(lastVisible),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const moreList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setBookings(prev => [...prev, ...moreList]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      if (snapshot.docs.length < 20) setHasMore(false);
    } catch (error) {
      console.error("Lỗi tải thêm:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Danh sách lịch chụp Our June</h2>
      
      {/* Giải pháp 3: Giao diện Skeleton Loading nhấp nháy khi đang tải */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p className="font-semibold">{item.clientName || "Khách hàng"}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>

          {hasMore && (
            <button 
              onClick={loadMoreBookings}
              className="mt-4 w-full py-2 bg-black text-white rounded-lg font-medium"
            >
              Xem thêm lịch cũ
            </button>
          )}
        </>
      )}
    </div>
  );
}
