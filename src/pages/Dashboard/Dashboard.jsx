import React from 'react';
import { Users, Calendar, Brain, DollarSign } from 'lucide-react';

const stats = [
  { label: 'Total Customers', value: '2,543', icon: Users },
  { label: 'Active Appointments', value: '128', icon: Calendar },
  { label: 'Tests Completed', value: '4,891', icon: Brain },
  { label: 'Revenue (MTD)', value: '$45,320', icon: DollarSign }
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <s.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
