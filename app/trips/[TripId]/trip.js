"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter, useParams } from "next/navigation";

const customIcon = new Icon({
  iconUrl: "/locationMarker.png",
  iconSize: [30, 30]
});

function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, 5);
  return null;
}

export default function Trips({ tripId }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState([28.6139, 77.2088]);
  const [tripData, setTripData] = useState({ title: "Untitled Trip", pins: {} });
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !tripId) return;
    const allTrips = JSON.parse(localStorage.getItem("ghummakadTrips")) || {};
    if (allTrips[tripId]) {
      setTripData(allTrips[tripId]);
    }
  }, [tripId]);

  useEffect(() => {
    if (typeof window === "undefined" || !tripId) return;
    const allTrips = JSON.parse(localStorage.getItem("ghummakadTrips")) || {};
    allTrips[tripId] = tripData;
    localStorage.setItem("ghummakadTrips", JSON.stringify(allTrips));
  }, [tripData, tripId]);

  const handleSearch = async e => {
    e.preventDefault();
    const query = inputRef.current.value;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await res.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const id = Date.now();
      const newPin = {
        id,
        geocode: [parseFloat(lat), parseFloat(lon)],
        popup: display_name,
        log: { time: "", description: "", image: "" }
      };
      setTripData(prev => ({
        ...prev,
        pins: { ...prev.pins, [id]: newPin }
      }));
      setSelectedPosition([parseFloat(lat), parseFloat(lon)]);
      inputRef.current.value = "";
    } else {
      alert("Location not found");
    }
  };

  const handleLogChange = (pinId, field, value) => {
    setTripData(prev => ({
      ...prev,
      pins: {
        ...prev.pins,
        [pinId]: {
          ...prev.pins[pinId],
          log: {
            ...prev.pins[pinId].log,
            [field]: value
          }
        }
      }
    }));
  };

  const handleImageUpload = (pinId, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleLogChange(pinId, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const moveMarker = (pinIds, index, direction) => {
    const keys = Object.keys(pinIds);
    if ((direction === "up" && index === 0) || (direction === "down" && index === keys.length - 1)) return;
    const newKeys = [...keys];
    const temp = newKeys[index];
    newKeys[index] = newKeys[direction === "up" ? index - 1 : index + 1];
    newKeys[direction === "up" ? index - 1 : index + 1] = temp;

    const newPins = {};
    newKeys.forEach(k => newPins[k] = tripData.pins[k]);
    setTripData(prev => ({ ...prev, pins: newPins }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-96 bg-white p-4 overflow-y-auto border-r">
        <div className="flex items-center justify-between mb-4">
          <input
            value={tripData.title}
            onChange={e => setTripData(prev => ({ ...prev, title: e.target.value }))}
            className="font-semibold text-lg border-b w-full focus:outline-none"
          />
          <button
          onClick={() => router.push("/trips")}
          className="bg-gray-200 w-40 text-gray-800 px-2 py-2 rounded hover:bg-gray-300"
        >
          ← Go Back
        </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter a location (e.g., Taj Mahal)"
            className="p-2 border rounded w-full"
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            Pin
          </button>
        </form>

        {Object.values(tripData.pins).map((m, index) => (
          <div key={m.id} className="border p-3 rounded mb-3 bg-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-sm">{index + 1}. {m.popup}</h3>
              <div className="space-x-1">
                <button onClick={() => moveMarker(tripData.pins, index, "up")} className="px-2 py-1 text-sm bg-gray-200 rounded">↑</button>
                <button onClick={() => {
                  const newPins = { ...tripData.pins };
                  delete newPins[m.id];
                  setTripData(prev => ({ ...prev, pins: newPins }));
                }} className="text-red-600 underline">Remove</button>
                <button onClick={() => moveMarker(tripData.pins, index, "down")} className="px-2 py-1 text-sm bg-gray-200 rounded">↓</button>
              </div>
            </div>
            <button
              className="text-blue-600 text-sm mt-1 underline"
              onClick={() => setExpandedLogId(prev => prev === m.id ? null : m.id)}
            >
              {expandedLogId === m.id ? "Hide Log" : "Add/View Log"}
            </button>

            {expandedLogId === m.id && (
              <div className="mt-2 space-y-2 bg-white p-2 rounded border">
                <div>
                  <label className="text-sm">Time (optional)</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded p-1"
                    value={m.log.time}
                    onChange={e => handleLogChange(m.id, "time", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Description</label>
                  <textarea
                    rows="2"
                    className="w-full border rounded p-1"
                    value={m.log.description}
                    onChange={e => handleLogChange(m.id, "description", e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(m.id, e.target.files[0])}
                  />
                  {m.log.image && <img src={m.log.image} alt="Log" className="mt-2 max-h-40 rounded" />}
                </div>
              </div>
            )}
          </div>
        ))}
      </aside>

      <main className="flex-1">
        <MapContainer center={selectedPosition} zoom={5} className="h-full">
          <TileLayer
            attribution={'© OpenStreetMap contributors'}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView coords={selectedPosition} />

          {Object.values(tripData.pins).length > 1 && (
            <Polyline
              positions={Object.values(tripData.pins).map(m => m.geocode)}
              pathOptions={{ color: "teal", weight: 3 }}
            />
          )}

          {Object.values(tripData.pins).map((m, index) => (
            <Marker key={index} position={m.geocode} icon={customIcon}>
              <Popup>
                <h1 className="font-semibold">{m.popup}</h1>
                {m.log.description && <p>{m.log.description}</p>}
                {m.log.time && <p className="text-xs text-gray-500">🕒 {m.log.time}</p>}
                {m.log.image && <img src={m.log.image} alt="Log" className="mt-2 max-h-32 rounded" />}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
