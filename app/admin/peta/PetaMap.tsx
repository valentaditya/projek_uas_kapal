"use client";

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface PetaMapProps {
  ships: any[];
  onShipClick: (shipId: string) => void;
}

export default function PetaMap({ ships, onShipClick }: PetaMapProps) {
  const shipCoordinates: Record<string, [number, number]> = {
    'Los Angeles': [34.0522, -118.2437],
    'Singapore': [1.2902, 103.8519],
    'Sydney': [-33.8688, 151.2093],
    'Rotterdam': [51.9225, 4.47917],
    'New York': [40.7128, -74.0060],
    'Hong Kong': [22.3193, 114.1694],
    'Santos': [-23.9618, -46.3322],
    'Dubai': [25.2048, 55.2708]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Route': return '#3b82f6';
      case 'In Port': return '#06b6d4';
      case 'Delayed': return '#eab308';
      case 'Maintenance': return '#f43f5e';
      default: return '#8884d8';
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%', background: '#0a0d14' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ships.map((ship, idx) => {
          const position = shipCoordinates[ship.tujuan] || [0, 0];
          const color = getStatusColor(ship.status);
          return (
            <CircleMarker 
              key={idx} 
              center={position} 
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
              }}
              radius={8}
              eventHandlers={{
                click: () => onShipClick(ship.name),
              }}
            >
              <Popup className="bg-[#151922] border-white/10 text-white">
                <div className="font-sans">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{ship.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">Status: <span className="font-semibold">{ship.status}</span></p>
                  <p className="text-xs text-gray-600">Kecepatan: {Number(ship.kecepatan).toFixed(2)} kn</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
