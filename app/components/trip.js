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

const customIcon = new Icon({
  iconUrl: "/locationMarker.png",
  iconSize: [30, 30]
});

function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, 5);
  return null;
}

function Trips() {
  const [markers, setMarkers] = useState(() => { 
    if (typeof window === "undefined"){ return []};
    const saved = localStorage.getItem("ghummakadMarkers");
    return (saved ? JSON.parse(saved) : []);
  });
  const [selectedPosition, setSelectedPosition] = useState([28.6139, 77.2088]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {return};
    localStorage.setItem(
      "ghummakadMarkers",
      JSON.stringify(markers)
    );
  }, [markers]);

  const handleSearch = async e => {
    e.preventDefault();
    const query = inputRef.current.value;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const newMarker = {
        id: Date.now(),
        geocode: [parseFloat(lat), parseFloat(lon)],
        popup: display_name
      };
      setMarkers(prev => [...prev, newMarker]);
      setSelectedPosition([parseFloat(lat), parseFloat(lon)]);
      inputRef.current.value = "";
    } else {
      alert("Location not found");
    }
  };

  const moveMarkerUp = index => {
    if (index === 0) return;
    const updated = [...markers];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setMarkers(updated);
  };

  const moveMarkerDown = index => {
    if (index === markers.length - 1) return;
    const updated = [...markers];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setMarkers(updated);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-96 bg-white p-4 overflow-y-auto border-r">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">Trip Path</div>
          
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

        {markers.map((m, index) => (
          <div
            key={m.id}
            className="border p-3 rounded mb-3 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-sm">
                {index + 1}. {m.popup}
              </h3>
              <div className="space-x-1">
                <button
                  onClick={() => moveMarkerUp(index)}
                  disabled={index === 0}
                  className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  className="text-red-600 underline"
                  onClick={() => {
                    const updatedMarkers = markers.filter(
                      (_, i) => i !== index
                    );
                    setMarkers(updatedMarkers);
                  }}
                >
                  Remove
                </button>
                <button
                  onClick={() => moveMarkerDown(index)}
                  disabled={index === markers.length - 1}
                  className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  ↓
                </button>
              </div>
            </div>
            <div>
              Placeholder for log panel...
            </div>
          </div>
        ))}
      </aside>

      <main className="flex-1">
        <MapContainer center={selectedPosition} zoom={5} className="h-full">
          <TileLayer
            attribution={
              '© OpenStreetMap contributors — Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ChangeMapView coords={selectedPosition} />

          {markers.length > 1 && (
            <Polyline
              positions={markers.map(m => m.geocode)}
              pathOptions={{ color: "teal", weight: 3 }}
            />
          )}

          {markers.map((m, index) => (
            <Marker key={index} position={m.geocode} icon={customIcon}>
              <Popup>
                <h1 className="font-semibold">{m.popup}</h1>
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => alert("(log panel)")}
                  >
                    Add Trip Log
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => {
                      const updatedMarkers = markers.filter(
                        (_, i) => i !== index
                      );
                      setMarkers(updatedMarkers);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

export default Trips;
