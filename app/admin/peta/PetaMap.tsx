"use client";

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface PetaMapProps {
  routes: any[];
  onRouteClick: (routeName: string) => void;
}

const getMidpoint = (c1: [number, number], c2: [number, number]): [number, number] => {

  const t = 0.6;
  return [
    c1[0] + (c2[0] - c1[0]) * t,
    c1[1] + (c2[1] - c1[1]) * t
  ];
};

export default function PetaMap({ routes, onRouteClick }: PetaMapProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer 
        center={[-2.5489, 118.0149]}
        zoom={5} 
        style={{ height: '100%', width: '100%', background: '#0a0d14' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {routes.map((route, idx) => {
          const origin = route.originCoords || [0, 0];
          const dest = route.destCoords || [0, 0];
          const shipPos = getMidpoint(origin, dest);

          return (
            <React.Fragment key={route.routeId || idx}>
              
              <Polyline 
                positions={[origin, dest]}
                pathOptions={{
                  color: '#a855f7',
                  dashArray: '8, 8',
                  weight: 2,
                  opacity: 0.85
                }}
              />

              
              <CircleMarker 
                center={origin}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.8,
                  weight: 1.5
                }}
                radius={5}
              >
                <Popup>
                  <div className="font-sans text-[11px]">
                    <strong className="text-emerald-600">Pelabuhan Asal</strong>
                    <p className="font-semibold text-gray-800 mt-0.5">{route.origin}</p>
                  </div>
                </Popup>
              </CircleMarker>

              
              <CircleMarker 
                center={dest}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.8,
                  weight: 1.5
                }}
                radius={5}
              >
                <Popup>
                  <div className="font-sans text-[11px]">
                    <strong className="text-rose-600">Pelabuhan Tujuan</strong>
                    <p className="font-semibold text-gray-800 mt-0.5">{route.destination}</p>
                  </div>
                </Popup>
              </CircleMarker>

              
              <CircleMarker 
                center={shipPos}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.9,
                  weight: 2
                }}
                radius={8}
                eventHandlers={{
                  click: () => onRouteClick(route.name),
                }}
              >
                <Popup>
                  <div className="font-sans text-xs">
                    <h3 className="font-bold text-gray-900">{route.name}</h3>
                    <p className="text-[10px] text-purple-600 font-semibold font-mono mt-0.5">Route ID: {route.routeId}</p>
                    <div className="border-t border-gray-100 my-1 pt-1 space-y-0.5">
                      <p className="text-[10px] text-gray-600">Kecepatan: <strong>{route.kecepatan} kn</strong></p>
                      <p className="text-[10px] text-gray-600">Rute: {route.origin.split(',')[0]} &rarr; {route.destination.split(',')[0]}</p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
