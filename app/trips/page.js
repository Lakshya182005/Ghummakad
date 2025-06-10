'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState({});

  // Load all trips from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("ghummakadTrips");
    if (data) {
      setTrips(JSON.parse(data));
    }
  }, []);

  // Create a new trip and navigate to it
  const createTrip = () => {
    const newId = Date.now().toString();
    const newTrip = {
      title: "Untitled Trip",
      pins: {}
    };

    const updatedTrips = {
      ...trips,
      [newId]: newTrip
    };

    localStorage.setItem("ghummakadTrips", JSON.stringify(updatedTrips));
    router.push(`/trips/${newId}`);
  };

  // Delete a trip
  const deleteTrip = (tripId) => {
    const updatedTrips = { ...trips };
    delete updatedTrips[tripId];
    setTrips(updatedTrips);
    localStorage.setItem("ghummakadTrips", JSON.stringify(updatedTrips));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <button
          onClick={createTrip}
          className="bg-teal-600 text-white px-4 py-2 rounded shadow"
        >
          + Create Trip
        </button>
      </div>

      {Object.entries(trips).map(([tripId, trip]) => (
        <div
          key={tripId}
          className="border rounded-lg p-4 flex items-center justify-between hover:shadow transition"
        >
          <div>
            <h2 className="text-xl font-semibold">{trip.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(Number(tripId)).toLocaleString()}
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
      ))}
    </div>
  );
}
