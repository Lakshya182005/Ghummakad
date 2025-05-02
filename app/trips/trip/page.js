"use client";
import React, { useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new Icon({
  iconUrl: "/locationMarker.png",
  iconSize: [30, 30]
});

function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

function Trips() {
  const [markers, setMarkers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([28.9612, 77.0933]);
  const inputRef = useRef(null);

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
        geocode: [parseFloat(lat), parseFloat(lon)],
        popup: display_name
      };
      setMarkers([...markers, newMarker]);
      setSelectedPosition([parseFloat(lat), parseFloat(lon)]);
      inputRef.current.value = "";
    } else {
      alert("Location not found");
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 m-3">
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

      <MapContainer center={selectedPosition} zoom={5} className="h-[50vh] m-3">
        <TileLayer
          attribution="&copy; <a href=&quot;http://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a>"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView coords={selectedPosition} />

        {markers.map((m, index) =>
          <Marker key={index} position={m.geocode} icon={customIcon}>
            <Popup>
              <h1>
                {m.popup}
              </h1>
              <button
                className="text-blue-600 underline mt-2"
                onClick={() => alert("(log panel)")}
              >
                Add Trip Log
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Trips;
