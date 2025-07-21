"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "@/app/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FiArrowUp,
  FiArrowDown,
  FiTrash,
  FiMapPin,
  FiArrowLeft,
  FiMenu,
} from "react-icons/fi";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Custom icon
const customIcon = new Icon({
  iconUrl: "/locationMarker.png",
  iconSize: [32, 32],
});

function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, 5);
  return null;
}

export default function Trips({ tripId }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState([
    28.6139, 77.2088,
  ]);
  const [tripData, setTripData] = useState({
    title: "Untitled Trip",
    pins: {},
  });
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [imageModal, setImageModal] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // 👉 Universal fetch: Try sharedTrips first for guest mode
  useEffect(() => {
    let unsubscribe = null;
    let didCancel = false;

    const fetchTripUniversal = async () => {
      setLoading(true);

      // 1. Try public collection first
      const publicRef = doc(db, "sharedTrips", tripId);
      const publicSnap = await getDoc(publicRef);

      if (publicSnap.exists()) {
        if (!didCancel) {
          setTripData(publicSnap.data());
          setIsOwner(false);
          setUserId(null);
          setLoading(false);
        }
        return;
      }

      // 2. If not found, check login and try private (user-only) trip
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          setUserId(uid);

          const privateRef = doc(db, "trips", uid, "myTrips", tripId);
          const privateSnap = await getDoc(privateRef);

          if (privateSnap.exists()) {
            setTripData(privateSnap.data());
            setIsOwner(true);
          } else {
            alert("Trip not found.");
            setTripData({ title: "Not found", pins: {} });
            setIsOwner(false);
          }
        } else {
          alert("Trip not found (or private)");
          setTripData({ title: "Not found", pins: {} });
        }
        setLoading(false);
      });
    };

    fetchTripUniversal();

    return () => {
      didCancel = true;
      if (unsubscribe) unsubscribe();
    };
  }, [tripId]);

  // Persist Changes (owner only)
  useEffect(() => {
    if (!isOwner || !userId || !tripId) return;
    const saveTripData = async () => {
      const docRef = doc(db, "trips", userId, "myTrips", tripId);
      await updateDoc(docRef, tripData);
    };
    saveTripData();
    // Only run if the user is owner
    // eslint-disable-next-line
  }, [tripData]);

  // Location Search (owner only)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    const query = inputRef.current.value;
    const res = await fetch(`/api/nominatim?q=${query}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const id = Date.now();
      const newPin = {
        id,
        geocode: [parseFloat(lat), parseFloat(lon)],
        popup: display_name,
        log: { time: "", description: "", image: "" },
      };
      setTripData((prev) => ({
        ...prev,
        pins: { ...prev.pins, [id]: newPin },
      }));
      setSelectedPosition([parseFloat(lat), parseFloat(lon)]);
      inputRef.current.value = "";
    } else {
      alert("Location not found");
    }
  };

  // Only the owner can update images
  const handleImageUpload = async (pinId, file) => {
    if (!isOwner || !userId || !tripId || !file) return;
    try {
      const imgRef = storageRef(
        storage,
        `trip_images/${userId}/${tripId}/${pinId}/${file.name}`
      );
      await uploadBytes(imgRef, file);
      const downloadURL = await getDownloadURL(imgRef);
      handleLogChange(pinId, "image", downloadURL);
    } catch (error) {
      alert("Image upload failed");
      console.error("Upload error:", error);
    }
  };

  const handleLogChange = (pinId, field, value) => {
    if (!isOwner) return;
    setTripData((prev) => ({
      ...prev,
      pins: {
        ...prev.pins,
        [pinId]: {
          ...prev.pins[pinId],
          log: { ...prev.pins[pinId].log, [field]: value },
        },
      },
    }));
  };

  const moveMarker = (pinIds, index, direction) => {
    if (!isOwner) return;
    const keys = Object.keys(pinIds);
    if ((direction === "up" && index === 0) || (direction === "down" && index === keys.length - 1))
      return;
    const newKeys = [...keys];
    const temp = newKeys[index];
    newKeys[index] = newKeys[direction === "up" ? index - 1 : index + 1];
    newKeys[direction === "up" ? index - 1 : index + 1] = temp;
    const newPins = {};
    newKeys.forEach((k) => (newPins[k] = tripData.pins[k]));
    setTripData((prev) => ({ ...prev, pins: newPins }));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-[#3BA99C] font-semibold animate-pulse">
          Loading trip...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#E8F5F2]">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside
          className={`transition-all duration-300 ease-in-out min-h-screen bg-white shadow-xl border-r flex flex-col gap-6 p-4
          ${isSidebarCollapsed ? "w-16" : "w-80"}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between sticky top-0 z-10 bg-white pb-4 ${
              isSidebarCollapsed ? "px-2" : ""
            }`}
          >
            <div className={`flex items-center gap-4 ${isSidebarCollapsed ? "justify-center w-full" : ""}`}>
              <button
                onClick={() => router.push("/trips")}
                className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 rounded p-2 text-gray-700 shadow"
                title="Go Back"
              >
                <FiArrowLeft size={18} />
                {!isSidebarCollapsed && "Go Back"}
              </button>

              {/* Trip title - editable only for owner */}
              {!isSidebarCollapsed && (
                isOwner ? (
                  <input
                    value={tripData.title}
                    onChange={(e) =>
                      setTripData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="flex-1 font-semibold text-lg border-b focus:outline-none px-2 pb-1"
                    placeholder="Trip Title"
                  />
                ) : (
                  <div className="flex-1 font-bold text-lg text-gray-800 truncate px-2 select-text">
                    {tripData.title || "Trip"}
                  </div>
                )
              )}
            </div>
            {/* Toggle Button */}
            <button
              className="p-2 bg-[#3BA99C] text-white rounded shadow hover:bg-[#2f867f] transition ml-2"
              onClick={() => {
                if (!isSidebarOpen) {
                  setIsSidebarOpen(true);
                  setIsSidebarCollapsed(false);
                } else {
                  setIsSidebarCollapsed((prev) => !prev);
                }
              }}
              aria-label="Toggle Sidebar"
            >
              {isSidebarCollapsed ? <FiMenu size={18} /> : "×"}
            </button>
          </div>

          {/* Pin Search - only for owner */}
          {!isSidebarCollapsed && isOwner && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                ref={inputRef}
                placeholder="Search a location (e.g., Taj Mahal)"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-[#3BA99C] bg-[#F7FAFA] shadow"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-[#3BA99C] hover:bg-[#329589] text-white px-4 py-2 rounded transition"
              >
                <FiMapPin /> Pin
              </button>
            </form>
          )}

          {/* Pin List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {Object.values(tripData.pins).length === 0 ? (
              <div className="text-gray-400 text-center py-12">
                {!isSidebarCollapsed &&
                  "No pins yet. Start by adding a location!"}
              </div>
            ) : (
              Object.values(tripData.pins).map((m, index) => (
                <div
                  key={m.id}
                  className="bg-[#F7FAFA] border-l-4 border-[#3BA99C] mb-4 rounded-xl p-4 shadow hover:shadow-md transition-all"
                >
                  <div className="flex gap-2 items-center justify-between">
                    <h3 className="font-bold text-base truncate">
                      {index + 1}. {m.popup}
                    </h3>
                    {isOwner && (
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            moveMarker(tripData.pins, index, "up")
                          }
                          className="p-1 rounded hover:bg-gray-200"
                          title="Move Up"
                        >
                          <FiArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const newPins = { ...tripData.pins };
                            delete newPins[m.id];
                            setTripData((prev) => ({
                              ...prev,
                              pins: newPins,
                            }));
                          }}
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <FiTrash size={16} />
                        </button>
                        <button
                          onClick={() =>
                            moveMarker(tripData.pins, index, "down")
                          }
                          className="p-1 rounded hover:bg-gray-200"
                          title="Move Down"
                        >
                          <FiArrowDown size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Expand Log */}
                  {!isSidebarCollapsed && (
                    <>
                      <button
                        className="block text-[#329589] text-xs mt-2 underline"
                        onClick={() =>
                          setExpandedLogId((prev) =>
                            prev === m.id ? null : m.id
                          )
                        }
                      >
                        {expandedLogId === m.id
                          ? "Hide Log"
                          : "Add/View Log"}
                      </button>

                      {expandedLogId === m.id && (
                        <div className="mt-2 space-y-2 bg-white border rounded-lg p-2">
                          <div>
                            <label className="text-xs">Time</label>
                            <input
                              type="datetime-local"
                              className="w-full border rounded p-1 text-sm"
                              value={m.log.time}
                              onChange={(e) =>
                                handleLogChange(
                                  m.id,
                                  "time",
                                  e.target.value
                                )
                              }
                              disabled={!isOwner}
                            />
                          </div>
                          <div>
                            <label className="text-xs">Description</label>
                            <textarea
                              rows="2"
                              className="w-full border rounded p-1 text-xs"
                              value={m.log.description}
                              onChange={(e) =>
                                handleLogChange(
                                  m.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              disabled={!isOwner}
                            />
                          </div>
                          <div>
                            <label className="text-xs">Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(m.id, e.target.files[0])
                              }
                              className="w-full"
                              disabled={!isOwner}
                            />
                            {m.log.image && (
                              <img
                                src={m.log.image}
                                alt="Log"
                                onClick={() =>
                                  setImageModal({ src: m.log.image, alt: m.popup })
                                }
                                className="mt-2 max-h-32 rounded shadow object-cover w-full cursor-pointer hover:opacity-90 transition"
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      )}

      {/* Map */}
      <main className="flex-1 min-h-screen">
        <MapContainer
          center={selectedPosition}
          zoom={5}
          className="w-full h-screen"
        >
          <TileLayer
            attribution={"© OpenStreetMap contributors"}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView coords={selectedPosition} />
          {Object.values(tripData.pins).length > 1 && (
            <Polyline
              positions={Object.values(tripData.pins).map((m) => m.geocode)}
              pathOptions={{
                color: "#3BA99C",
                weight: 4,
                opacity: 0.8,
                dashArray: "8,6",
              }}
            />
          )}
          {Object.values(tripData.pins).map((m, index) => (
            <Marker key={index} position={m.geocode} icon={customIcon}>
              <Popup maxWidth={300}>
                <div className="font-semibold text-lg mb-2">{m.popup}</div>
                {m.log.description && (
                  <p className="mb-2">{m.log.description}</p>
                )}
                {m.log.time && (
                  <div className="text-xs text-gray-500 mb-2">
                    🕒 {m.log.time}
                  </div>
                )}
                {m.log.image && (
                  <img
                    src={m.log.image}
                    alt="Log"
                    onClick={() => setImageModal({ src: m.log.image, alt: m.popup })}
                    className="w-full max-w-xs h-auto object-cover rounded shadow cursor-pointer hover:opacity-90 transition"
                  />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      {/* Image Modal */}
      {imageModal && (
        <div
          className="fixed inset-0 z-[1000] bg-black bg-opacity-70 flex items-center justify-center px-4"
          onClick={() => setImageModal(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImageModal(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition"
              aria-label="Close Preview"
            >
              ×
            </button>
            <img
              src={imageModal.src}
              alt={imageModal.alt}
              className="rounded-lg w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
