// src/pages/Employees/EmployeeView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loadEmployees } from '../../data/employeesStorage';

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    const list = loadEmployees();
    const found = list.find(e => e.id === id);
    if (!found) {
      navigate('/employees');
      return;
    }
    setEmp(found);
  }, [id, navigate]);

  if (!emp) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {emp.avatar ? <img src={emp.avatar} alt="avatar" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xl font-semibold">{(emp.firstName?.[0] ?? '') + (emp.lastName?.[0] ?? '')}</div>}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{emp.firstName} {emp.lastName}</h1>
            <p className="text-sm text-gray-500">{emp.role} — {emp.id}</p>
            <p className="text-sm text-gray-500 mt-1">{emp.email} • {emp.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/employees/edit/${emp.id}`} className="px-3 py-2 border rounded-lg">Edit</Link>
          <Link to="/employees" className="px-3 py-2 bg-gray-100 rounded-lg">Back</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border space-y-4">
        <h3 className="font-semibold">Projects</h3>
        {emp.projects && emp.projects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emp.projects.map(p => (
              <div key={p.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{p.name}</h4>
                  <div className="text-xs text-gray-500">{p.role}</div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{p.description}</div>
              </div>
            ))}
          </div>
        ) : <div className="text-sm text-gray-500">No projects assigned</div>}
      </div>
    </div>
  );
};

export default EmployeeView;
