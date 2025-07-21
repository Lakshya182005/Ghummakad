"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "@/app/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FiTrash2, FiEye, FiPlus, FiShare2 } from "react-icons/fi";

export default function MyTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState({});
  const [userId, setUserId] = useState(null);
  const [sharing, setSharing] = useState(null); // tripId currently being shared

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchTrips = async () => {
      const snapshot = await getDocs(
        collection(db, "trips", userId, "myTrips")
      );
      const tripsData = {};
      snapshot.forEach((docSnap) => {
        tripsData[docSnap.id] = docSnap.data();
      });
      setTrips(tripsData);
    };

    fetchTrips();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchTrips();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [userId]);

  const createTrip = async () => {
    if (!userId) return;
    const docRef = await addDoc(collection(db, "trips", userId, "myTrips"), {
      title: "Untitled Trip",
      pins: {},
      createdAt: new Date().toISOString(),
    });
    router.push(`/trips/${docRef.id}`);
  };

  const deleteTrip = async (tripId) => {
    if (!userId) return;

    await deleteDoc(doc(db, "trips", userId, "myTrips", tripId));
    setTrips((prev) => {
      const updated = { ...prev };
      delete updated[tripId];
      return updated;
    });
  };

  const shareTrip = async (tripId) => {
    if (!userId) return;
    setSharing(tripId);
    try {
      const tripRef = doc(db, "trips", userId, "myTrips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        alert("Trip not found.");
        return;
      }

      const sharedRef = doc(db, "sharedTrips", tripId);
      const sharedSnap = await getDoc(sharedRef);

      if (sharedSnap.exists()) {
        // Already shared
        await copyUrl(tripId);
        alert("Trip already shared! Link copied to clipboard.");
        return;
      }

      // Save to sharedTrips collection
      await setDoc(sharedRef, {
        ...tripSnap.data(),
        sharedAt: new Date().toISOString(),
        creatorId: userId,
      });

      await copyUrl(tripId);
      alert("Trip is now shared! Public link copied to clipboard.");
    } catch (error) {
      console.error("Error sharing trip:", error);
      alert("Failed to share trip.");
    }
    setSharing(null);
  };

  const copyUrl = async (tripId) => {
    const url = `${window.location.origin}/trips/${tripId}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="p-6 max-w-auto mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#333]">
          📍 Your Trips
        </h1>
        <button
          onClick={createTrip}
          disabled={!userId}
          className="flex items-center gap-2 bg-[#3BA99C] hover:bg-[#329589] text-white px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50"
        >
          <FiPlus className="text-xl" />
          New Trip
        </button>
      </div>

      {Object.entries(trips).length === 0 ? (
        <div className="text-center text-gray-500 mt-10 text-lg">
          No trips yet... Click "New Trip" to get started 🚀
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Object.entries(trips).map(([tripId, trip]) => (
            <div
              key={tripId}
              className="bg-white rounded-xl shadow-md border hover:shadow-lg transition flex flex-col justify-between p-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-[#333] mb-2 truncate">
                  {trip.title}
                </h2>
                <p className="text-sm text-gray-400">
                  {trip.createdAt
                    ? new Date(trip.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-3 flex-wrap">
                <Link
                  href={`/trips/${tripId}`}
                  className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-gray-800 transition"
                >
                  <FiEye /> View
                </Link>
                <button
                  onClick={() => shareTrip(tripId)}
                  className="flex items-center gap-1 text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md text-blue-700 transition"
                  disabled={sharing === tripId}
                >
                  <FiShare2 />
                  {sharing === tripId ? "Sharing..." : "Share"}
                </button>
                <button
                  onClick={() => deleteTrip(tripId)}
                  className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md text-red-700 transition"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
