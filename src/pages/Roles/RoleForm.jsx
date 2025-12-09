// src/pages/Roles/RoleForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRBAC } from '../../context/RBACContext';

/**
 * RoleForm supports:
 * - mode = 'create' (route /roles/new)
 * - mode = 'edit' (route /roles/edit/:role)
 *
 * Permissions UI is module → list of actions checkboxes.
 */

const RoleForm = ({ mode = 'create' }) => {
  const { role: roleParam } = useParams(); // roleParam encoded
  const navigate = useNavigate();
  const { modules, createRole, updateRole, getRole, getRolesList } = useRBAC();

  const decodedRole = roleParam ? decodeURIComponent(roleParam) : null;
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // perms shape: { ModuleName: ['read','create'] }
  const [perms, setPerms] = useState({});

  useEffect(() => {
    if (isEdit && decodedRole) {
      const r = getRole(decodedRole);
      if (!r) {
        alert('Role not found');
        navigate('/roles');
        return;
      }
      if (r.system) {
        // disallow editing system role
        alert('System roles cannot be edited');
        navigate('/roles');
        return;
      }
      setName(decodedRole);
      setDescription(r.description || '');
      setPerms(r.permissions || {});
    } else {
      // default new role: empty perms (copy available modules)
      const initial = {};
      Object.keys(modules).forEach(m => { initial[m] = []; });
      setPerms(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, decodedRole]);

  const togglePerm = (moduleName, action) => {
    setPerms(prev => {
      const cur = new Set(prev[moduleName] || []);
      if (cur.has(action)) cur.delete(action); else cur.add(action);
      return { ...prev, [moduleName]: Array.from(cur) };
    });
  };

  const setAllForModule = (moduleName, setAll) => {
    setPerms(prev => ({ ...prev, [moduleName]: setAll ? [...modules[moduleName]] : [] }));
  };

  const handleSave = () => {
    if (!name || name.trim() === '') return alert('Role name required');
    if (name === 'Super Admin') return alert('Cannot create or modify Super Admin');
    const payload = { description, permissions: perms };
    try {
      if (isEdit) {
        updateRole(name, payload);
      } else {
        // prevent creating duplicate
        const existing = getRolesList();
        if (existing.includes(name)) return alert('Role already exists');
        createRole(name, payload);
      }
      navigate('/roles');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save role');
    }
  };

  // module UI order & actions
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? `Edit Role: ${name}` : 'Create Role'}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/roles')} className="px-4 py-2 border rounded-lg">Back</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Role</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Permissions *</label>
            <div className="text-xs text-gray-500 mb-2">Choose module actions</div>
          </div>

          <div className="space-y-4">
            {Object.keys(modules).map((moduleName) => {
              const availableActions = modules[moduleName] || [];
              const checkedForModule = new Set(perms[moduleName] || []);
              return (
                <div key={moduleName} className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{moduleName}</div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setAllForModule(moduleName, true)} className="text-sm px-2 py-1 border rounded">All</button>
                      <button type="button" onClick={() => setAllForModule(moduleName, false)} className="text-sm px-2 py-1 border rounded">None</button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availableActions.map((act) => (
                      <label key={act} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={checkedForModule.has(act)} onChange={() => togglePerm(moduleName, act)} />
                        <span className="capitalize">{act}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="mb-4">
            <div className="font-semibold">General</div>
            <div className="text-xs text-gray-500">Name & description</div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" disabled={isEdit} />
              {isEdit && <div className="text-xs text-gray-500 mt-1">Role name cannot be changed. Use create to make a new role.</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" rows={4} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Permission preview</label>
              <div className="text-xs text-gray-500">
                Selected permissions are saved per module. Super Admin is a system role and cannot be created or edited.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
