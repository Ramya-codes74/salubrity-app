// src/pages/Roles/RoleList.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRBAC } from '../../context/RBACContext';

const RoleList = () => {
  const { getRolesList, getRole } = useRBAC();
  const navigate = useNavigate();
  const roles = getRolesList();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Roles</h1>
          <p className="text-gray-500">Manage roles and permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/roles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create Role</Link>
        </div>
      </div>

      <div className="grid gap-3">
        {roles.map((r) => {
          const role = getRole(r);
          const permCount = role && role.permissions ? Object.values(role.permissions).reduce((s, a) => s + (Array.isArray(a) ? a.length : 0), 0) : 0;
          return (
            <div key={r} className="bg-white dark:bg-gray-800 rounded-lg p-4 border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold">{r}</div>
                  {role?.system && <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">system</div>}
                </div>
                <div className="text-sm text-gray-500">{role?.description}</div>
                <div className="text-xs text-gray-400 mt-2">{permCount} permission(s)</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/roles/edit/${encodeURIComponent(r)}`)} className="px-3 py-2 border rounded-lg">Edit</button>
                {!role?.system && <button onClick={() => { if (confirm(`Delete role "${r}"? This will not affect existing employees.`)) { /* delete via RBAC */ } }} className="px-3 py-2 border rounded-lg text-red-600">Delete</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleList;
