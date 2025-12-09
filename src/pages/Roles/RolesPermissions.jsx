// src/pages/Roles/RolesPermissions.jsx
import React, { useEffect, useState } from 'react';
import { loadEmployees } from '../../data/employeesStorage';
import { useRBAC } from '../../context/RBACContext';

const MODULES = [
  'Dashboard',
  'Customers',
  'Employees',
  'Appointments',
  'Testing',
  'Finance',
  'Reports',
  'Settings',
];

const DEFAULT_PERMS = ['read', 'create', 'update', 'delete'];

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const { permissions, setPermissionsForRole } = useRBAC();

  useEffect(() => {
    // gather roles from employee list + add default system roles
    const list = loadEmployees();
    const r = Array.from(new Set(list.map(e => e.role))).concat(['Super Admin']);
    setRoles(r);
  }, []);

  const toggle = (role, module, perm) => {
    const rolePerms = permissions[role] || {};
    const modulePerms = new Set(rolePerms[module] || []);
    if (modulePerms.has(perm)) modulePerms.delete(perm);
    else modulePerms.add(perm);
    setPermissionsForRole(role, module, Array.from(modulePerms));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>

      <div className="space-y-8">
        {roles.map(role => (
          <div key={role} className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
            <h3 className="font-semibold mb-3">{role}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Module</th>
                    {DEFAULT_PERMS.map(p => <th className="px-4 py-2 text-left" key={p}>{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map(m => (
                    <tr key={m}>
                      <td className="px-4 py-2">{m}</td>
                      {DEFAULT_PERMS.map(p => {
                        const checked = (permissions[role] && permissions[role][m] || []).includes(p);
                        return (
                          <td className="px-4 py-2" key={p}>
                            <input type="checkbox" checked={checked} onChange={() => toggle(role, m, p)} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPermissions;
