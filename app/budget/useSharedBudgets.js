"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const useSharedBudgets = (userEmail) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!userEmail) return;

      try {
        const q = query(
          collection(db, "budgets"), // ✅ top-level budgets collection
          where("participants", "array-contains", userEmail)
        );

        const querySnapshot = await getDocs(q);
        const userBudgets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBudgets(userBudgets);
      } catch (error) {
        console.error("Failed to fetch shared budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [userEmail]);

  return { budgets, loading };
};
export default useSharedBudgets;
