import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import customersData from '../../data/mockCustomers';

const CustomerList = () => {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const customers = useMemo(() => customersData, []);

  const filtered = useMemo(() => {
    if (!query) return customers;
    return customers.filter(c => [c.id, c.name, c.email].join(' ').toLowerCase().includes(query.toLowerCase()));
  }, [query, customers]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your customer base</p>
        </div>
        <Link to="/customers/new" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg">
          <Plus className="w-5 h-5" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input placeholder="Search customers..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 px-4 py-2.5 border rounded-lg">
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
              <tr>
                {['Customer ID','Name','Age','Gender','Acquired On','Total Tests','Status','Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">{c.id}</td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.age}</td>
                  <td className="px-6 py-4">{c.gender}</td>
                  <td className="px-6 py-4">{c.acquiredOn}</td>
                  <td className="px-6 py-4">{c.tests}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/customers/${c.id}`} className="p-2 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4 text-blue-600"/></Link>
                      <button className="p-2 hover:bg-green-50 rounded-lg"><Edit className="w-4 h-4 text-green-600"/></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-600"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing <span className="font-semibold">{filtered.length}</span> customers</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border rounded-lg text-sm" disabled>Previous</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-2 border rounded-lg text-sm">Next</button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            {/* filter UI */}
            <div className="mt-6 space-y-4">
              <select className="w-full p-2 border rounded-lg">
                <option>All status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
              <button className="flex-1 px-4 py-2 border rounded-lg">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
