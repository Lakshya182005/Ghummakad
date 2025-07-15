"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";
import { db, auth } from "@/app/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function MyTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState({});
  const [userId, setUserId] = useState(null);

  // Track auth state
  useEffect(
    () => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) setUserId(user.uid);
        else router.push("/login");
      });
      return () => unsubscribe();
    },
    [router]
  );

  // Fetch trips whenever userId changes or on component re-focus
  useEffect(
    () => {
      if (!userId) return;

      const fetchTrips = async () => {
        const snapshot = await getDocs(
          collection(db, "trips", userId, "myTrips")
        );

        const tripsData = {};
        snapshot.forEach(docSnap => {
          tripsData[docSnap.id] = docSnap.data();
        });
        setTrips(tripsData);
      };

      // Initial fetch
      fetchTrips();

      // Refetch on visibility change (when user comes back to tab/page)
      const handleVisibility = () => {
        if (document.visibilityState === "visible") {
          fetchTrips();
        }
      };

      document.addEventListener("visibilitychange", handleVisibility);
      return () =>
        document.removeEventListener("visibilitychange", handleVisibility);
    },
    [userId]
  );

  const createTrip = async () => {
    if (!userId) return;

    const docRef = await addDoc(collection(db, "trips", userId, "myTrips"), {
      title: "Untitled Trip",
      pins: {}
    });

    router.push(`/trips/${docRef.id}`);
  };

  const deleteTrip = async tripId => {
    if (!userId) return;

    await deleteDoc(doc(db, userId, "trips", tripId));
    const updatedTrips = { ...trips };
    delete updatedTrips[tripId];
    setTrips(updatedTrips);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <button
          onClick={createTrip}
          className="bg-teal-600 text-white px-4 py-2 rounded shadow"
          disabled={!userId}
        >
          + Create Trip
        </button>
      </div>

      {Object.entries(trips).length === 0 &&
        <p className="text-gray-500">No trips yet.</p>}

      {Object.entries(trips).map(([tripId, trip]) =>
        <div
          key={tripId}
          className="border rounded-lg p-4 flex items-center justify-between hover:shadow transition"
        >
          <div>
            <h2 className="text-xl font-semibold">
              {trip.title}
            </h2>
            <p className="text-sm text-gray-500">
              {trip.createdAt ? new Date(trip.createdAt).toLocaleString() : "—"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/trips/${tripId}`}
              className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            >
              View
            </Link>
            <button
              onClick={() => deleteTrip(tripId)}
              className="bg-red-100 px-3 py-1 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
