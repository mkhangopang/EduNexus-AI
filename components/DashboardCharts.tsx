import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const UsageChart = () => {
  const data = [
    { name: 'Mon', queries: 40 },
    { name: 'Tue', queries: 65 },
    { name: 'Wed', queries: 85 },
    { name: 'Thu', queries: 50 },
    { name: 'Fri', queries: 95 },
    { name: 'Sat', queries: 20 },
    { name: 'Sun', queries: 10 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
        <Bar dataKey="queries" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AdminTrainingChart = () => {
  const data = [
    { name: 'Week 1', accuracy: 82 },
    { name: 'Week 2', accuracy: 85 },
    { name: 'Week 3', accuracy: 89 },
    { name: 'Week 4', accuracy: 94 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
        <Tooltip />
        <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const UserDistributionChart = () => {
    const data = [
      { name: 'Free', value: 400 },
      { name: 'Pro', value: 300 },
      { name: 'Enterprise', value: 300 },
    ];
    const COLORS = ['#94a3b8', '#4f46e5', '#10b981'];
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };
