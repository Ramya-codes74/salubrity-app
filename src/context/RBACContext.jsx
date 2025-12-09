// src/context/RBACContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'rbac_roles_v1';
const RBACContext = createContext();

const DEFAULT_MODULES = {
  Dashboard: ['read'],
  Customers: ['read','create','update','delete'],
  Employees: ['read','create','update','delete'],
  Appointments: ['read','create','update','delete'],
  Testing: ['read','create','update','delete'],
  Finance: ['read','create','update','delete'],
  Reports: ['read'],
  Settings: ['read','update'],
};

const ensureSuperAdmin = (obj) => {
  // create a Super Admin role with full permissions if missing
  if (!obj['Super Admin']) {
    const perms = {};
    Object.keys(DEFAULT_MODULES).forEach((m) => {
      perms[m] = Array.from(new Set(DEFAULT_MODULES[m].concat(['read','create','update','delete'])));
    });
    obj['Super Admin'] = { description: 'All permissions (system)', permissions: perms, system: true };
  } else {
    // mark system role
    obj['Super Admin'].system = true;
  }
  return obj;
};

export const RBACProvider = ({ children }) => {
  const [rolesMap, setRolesMap] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // seed with Super Admin and a few example roles
        const seed = {
          'Super Admin': { description: 'All permissions (system)', permissions: {}, system: true },
          Admin: { description: 'Administrator', permissions: {} },
          Manager: { description: 'Manager', permissions: {} },
          Tester: { description: 'Tester', permissions: {} }
        };
        // give some default perms for the seeded roles (safe defaults)
        Object.keys(seed).forEach((r) => {
          seed[r].permissions = {};
          Object.keys(DEFAULT_MODULES).forEach((m) => {
            seed[r].permissions[m] = r === 'Super Admin' ? [...DEFAULT_MODULES[m]] : (r === 'Admin' ? [...DEFAULT_MODULES[m]] : (r === 'Manager' ? ['read','create','update'] : ['read']));
          });
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        setRolesMap(seed);
        return;
      }
      const parsed = JSON.parse(raw);
      const ensured = ensureSuperAdmin(parsed);
      setRolesMap(ensured);
    } catch (err) {
      console.error('[RBAC] failed to load, seeding fallback', err);
      const fallback = ensureSuperAdmin({});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      setRolesMap(fallback);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rolesMap));
    } catch (err) {
      console.warn('[RBAC] failed to persist rolesMap', err);
    }
  }, [rolesMap]);

  // CRUD for roles (roleName is string)
  const createRole = (roleName, { description = '', permissions = {} } = {}) => {
    if (!roleName || roleName.trim() === '') throw new Error('Role name required');
    if (roleName === 'Super Admin') throw new Error('Cannot create Super Admin');
    setRolesMap(prev => ({ ...prev, [roleName]: { description, permissions, system: false } }));
  };

  const updateRole = (roleName, { description, permissions }) => {
    if (roleName === 'Super Admin') throw new Error('Cannot modify Super Admin');
    setRolesMap(prev => {
      if (!prev[roleName]) return prev;
      return { ...prev, [roleName]: { ...prev[roleName], description: description ?? prev[roleName].description, permissions: permissions ?? prev[roleName].permissions } };
    });
  };

  const deleteRole = (roleName) => {
    if (roleName === 'Super Admin') throw new Error('Cannot delete Super Admin');
    setRolesMap(prev => {
      const next = { ...prev };
      delete next[roleName];
      return next;
    });
  };

  const getRolesList = () => Object.keys(rolesMap);

  const getRole = (roleName) => rolesMap[roleName] || null;

  // Set permissions for a given role/module
  const setPermissionsForRole = (roleName, moduleName, perms) => {
    setRolesMap(prev => {
      if (!prev[roleName]) return prev;
      return { ...prev, [roleName]: { ...prev[roleName], permissions: { ...prev[roleName].permissions, [moduleName]: perms } } };
    });
  };

  // check if role has action on module
  const can = (roleName, moduleName, action) => {
    if (!roleName || !moduleName || !action) return false;
    const role = rolesMap[roleName];
    if (!role || !role.permissions) return false;
    const modulePerms = role.permissions[moduleName] || [];
    return modulePerms.includes(action);
  };

  const value = useMemo(() => ({
    rolesMap,
    createRole,
    updateRole,
    deleteRole,
    getRolesList,
    getRole,
    setPermissionsForRole,
    can,
    modules: DEFAULT_MODULES
  }), [rolesMap]);

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};

export const useRBAC = () => {
  const ctx = useContext(RBACContext);
  if (!ctx) throw new Error('useRBAC must be used within RBACProvider');
  return ctx;
};
