import { useQuery } from "@tanstack/react-query";
import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "@/auth/firebase";

// Read: 캘린더 데이터 불러오기
export const useCalendarEvents = (month: string) => {
  return useQuery({
    queryKey: ["events", month],
    queryFn: async () => {
      const q = query(
        collection(db, "events"),
        where("monthList", "array-contains", month),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    // 옵션 (ms)
    staleTime: 1000 * 60 * 5,
  });
};
