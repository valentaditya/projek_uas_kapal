"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';

export function StatusDistribusiChart({ ships }: { ships: any[] }) {
  const statusCounts = ships.reduce((acc, ship) => {
    acc[ship.status] = (acc[ship.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'En Route', value: statusCounts['En Route'] || 0, fill: '#3b82f6' },
    { name: 'In Port', value: statusCounts['In Port'] || 0, fill: '#06b6d4' },
    { name: 'Delayed', value: statusCounts['Delayed'] || 0, fill: '#eab308' },
    { name: 'Maintenance', value: statusCounts['Maintenance'] || 0, fill: '#f43f5e' },
  ].filter(item => item.value > 0);

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#151922', borderColor: '#ffffff10', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegionalDistribusiChart({ ships }: { ships: any[] }) {
  const regionCounts = ships.reduce((acc, ship) => {
    let r = ship.region || 'Other';
    if (r === 'Southeast Asia') r = 'SE Asia';
    if (r === 'North America') r = 'N. America';
    if (r === 'East Asia') r = 'E. Asia';
    if (r === 'South America') r = 'S. America';
    if (r === 'Middle East') r = 'Mid East';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'Pacific', value: regionCounts['Pacific'] || 0 },
    { name: 'SE Asia', value: regionCounts['SE Asia'] || 0 },
    { name: 'Oceania', value: regionCounts['Oceania'] || 0 },
    { name: 'Europe', value: regionCounts['Europe'] || 0 },
    { name: 'N. America', value: regionCounts['N. America'] || 0 },
    { name: 'E. Asia', value: regionCounts['E. Asia'] || 0 },
    { name: 'S. America', value: regionCounts['S. America'] || 0 },
    { name: 'Mid East', value: regionCounts['Mid East'] || 0 },
    { name: 'Indonesia', value: regionCounts['Indonesia'] || 0 },
  ];

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={{ stroke: '#ffffff20' }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#ffffff05' }}
            contentStyle={{ backgroundColor: '#151922', borderColor: '#ffffff10', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }}
            formatter={(val: any) => [val, 'Jumlah Kapal']}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FuelLevelChart({ ships }: { ships: any[] }) {
  const data = ships.map(s => {
    const nameParts = s.name.split(' ');
    const shortName = nameParts.length > 1 ? nameParts[1] : nameParts[0];
    return {
      name: shortName,
      fuel: (Number(s.fuel) || 0) / 100
    };
  });

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
          <XAxis 
            type="number"
            domain={[0, 1]}
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={{ stroke: '#ffffff20' }}
            tickLine={false}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#ffffff05' }}
            contentStyle={{ backgroundColor: '#151922', borderColor: '#ffffff10', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#b06aee' }}
            formatter={(val: any) => [`${(val * 100).toFixed(0)}%`, 'Bahan Bakar']}
          />
          <Bar dataKey="fuel" fill="#b06aee" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KecepatanChart({ ships }: { ships: any[] }) {
  const data = ships
    .filter(s => s.status === 'En Route' || s.status === 'Delayed')
    .map(s => ({
      name: s.name.replace('ANAGATA ', ''),
      speed: Number(s.kecepatan) || 0
    }));

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={{ stroke: '#ffffff20' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 25]}
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#151922', borderColor: '#ffffff10', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#06b6d4' }}
            formatter={(val: any) => [`${val.toFixed(1)} kn`, 'Kecepatan']}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            stroke="#06b6d4" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} 
            activeDot={{ r: 6, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
