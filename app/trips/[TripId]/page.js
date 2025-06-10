"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DynamicTrip = dynamic(() => import("./trip"), {
  ssr: false,
});

export default function TripPage() {
  const { tripId } = useParams();
  const router = useRouter();

  const [tripTitle, setTripTitle] = useState("Trip");

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    const match = storedTrips.find((trip) => trip.id.toString() === tripId);
    if (match) setTripTitle(match.title);
  }, [tripId]);

  return (
    <div className="p-6 space-y-6">
      

      <DynamicTrip tripId={tripId} />
    </div>
  );
}
