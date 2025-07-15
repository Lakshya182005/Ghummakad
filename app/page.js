"use client";

import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";


export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const features = [
    {
      step: "1 of 3",
      title: "Pin & Map",
      description: "Drop pins on the map to mark your favorite spots and share your travel route",
      imageUrl:
        "/mapNpin.avif"
    },
    {
      step: "2 of 3",
      title: "Trip Logs",
      description: "Create a beautiful travel log with your photos, videos, and stories",
      imageUrl:
        "/logs.jpg"
    },
    {
      step: "3 of 3",
      title: "Share & Reflect",
      description: "Share your travel moments and reflect on your journey",
      imageUrl:
        "/reflect.jpg"
    }
  ];

  return (
    <main className="min-h-screen text-[#333] bg-[#E0E0E0]">
      <div className="sm:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat sm:gap-8 sm:rounded-xl items-start justify-end px-4 pb-10 sm:px-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(/man-mountain.jpg)'
          }}
        >
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-white text-4xl font-extrabold sm:text-5xl">
              Welcome, {user?.username || "Traveler"}!
            </h1>
            <h2 className="text-white text-base mt-2 sm:text-lg">
              Start your next adventure by pinning memories on the map.
            </h2>
            <button
              onClick={() => router.push("/trips")}
              className="mt-4 bg-[#FFA45B] text-white px-6 py-2 rounded hover:bg-[#ff8b3d] transition"
            >
              Go to Trips
            </button>
          </div>
        </div>
      </div>

      <section className="px-4 sm:px-10 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map(({ step, title, description, imageUrl }, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col"
            >
              <div
                className="h-40 bg-cover bg-center rounded mb-3"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <h3 className="text-lg font-semibold text-[#3BA99C]">{title}</h3>
              <p className="text-sm mt-1">{description}</p>
              <button className="mt-3 text-[#FF6B6B] font-medium hover:underline self-start" onClick={() => router.push("/trips")}>
                Go Now
              </button>
            </div>
          ))}
        </div>
      </section>

      
    </main>
  );
}
