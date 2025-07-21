"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Dynamically load actual Trip component
const DynamicTrip = dynamic(() => import("./trip"), { ssr: false });

export default function TripPage() {
  const tripId = useParams()["TripId"];
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false); // track loading

  useEffect(() => {
    const checkAccess = async () => {
      if (!tripId) return;

      // 1. Check shared/public trip
      const publicRef = doc(db, "sharedTrips", tripId);
      const publicSnap = await getDoc(publicRef);

      if (publicSnap.exists()) {
        setIsAllowed(true);
        setChecked(true);
        return;
      }

      // 2. If not shared, check private via auth
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          // Not shared. Not logged in.
          router.push("/404");
          return;
        }

        const privateRef = doc(db, "trips", user.uid, "myTrips", tripId);
        const privateSnap = await getDoc(privateRef);

        if (privateSnap.exists()) {
          setIsAllowed(true);
        } else {
          router.push("/404");
        }

        setChecked(true);
      });
    };

    checkAccess();
  }, [tripId, router]);

  if (!checked) {
    return (
      <div className="h-screen flex items-center justify-center text-[#3BA99C] font-semibold">
        Loading trip...
      </div>
    );
  }

  return (
    <div className="space-y-6">{isAllowed && <DynamicTrip tripId={tripId} />}</div>
  );
}
