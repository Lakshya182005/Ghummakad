"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const DynamicTrip = dynamic(() => import("./trip"), {
  ssr: false
});

export default function TripPage() {
  const tripId = useParams()["TripId"];
  const router = useRouter();
  const [userId, setUserId] = useState(null);
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

  useEffect(
    () => {
      const fetchTrip = async () => {
        if (!userId || !tripId) return;

        const tripRef = doc(db, "trips", userId, "myTrips", tripId);
        const tripSnap = await getDoc(tripRef);
      };

      fetchTrip();
    },
    [userId, tripId]
  );

  return (
    <div className="p-6 space-y-6">
      <DynamicTrip tripId={tripId} />
    </div>
  );
}
