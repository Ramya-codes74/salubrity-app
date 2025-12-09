// src/pages/Employees/EmployeeList.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { loadEmployees, saveEmployees } from '../../data/employeesStorage';
import ConfirmModal from '../../shared/ConfirmModal';
import SlidePanel from '../../shared/SlidePanel';
import EmailPreviewModal from '../../shared/EmailPreviewModal';
// import { useRBAC } from '../../context/RBACContext';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const EmployeeList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [confirm, setConfirm] = useState(null); // {type, payload, title, body}
  const [emailPreview, setEmailPreview] = useState(null);
  const [sortBy, setSortBy] = useState({ field: 'createdAt', dir: 'desc' });

  // Helper to load employees from storage and set state
  const refresh = useCallback(() => {
    try {
      const list = loadEmployees();
    //   console.log('[EmployeeList] loaded employees from storage:', list);
      if (Array.isArray(list)) {
        setEmployees(list);
      } else {
        console.warn('[EmployeeList] loadEmployees did not return an array, resetting to []');
        setEmployees([]);
      }
    } catch (err) {
      console.error('[EmployeeList] failed to load employees:', err);
      setEmployees([]);
    }
  }, []);

  // initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // react to external localStorage changes (other tab), keep list updated
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.startsWith('employees')) {
        // console.log('[EmployeeList] storage event detected, refreshing');
        refresh();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  // if navigated with state (e.g. after creating an employee), show preview and refresh list
  useEffect(() => {
    if (location?.state?.emailPreview) {
    //   console.log('[EmployeeList] location.state.emailPreview:', location.state.emailPreview);
      // refresh from storage (in case create saved the employee)
      refresh();

      setEmailPreview(location.state.emailPreview);

      // clear navigation state so refresh/back doesn't reopen modal
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.emailPreview]);

  // Save employees after mutations and refresh
  const mutateAndPersist = (nextList) => {
    saveEmployees(nextList);
    setEmployees(nextList);
  };

  // Derived data: roles & filtered list
  const roles = useMemo(() => Array.from(new Set(employees.map(e => e.role).filter(Boolean))), [employees]);

  const filtered = useMemo(() => {
    let list = employees.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        [e.id, e.firstName, e.lastName, `${e.firstName} ${e.lastName}`, e.email, e.phone, e.role].join(' ').toLowerCase().includes(q)
      );
    }
    if (statusFilter) list = list.filter(e => e.status === statusFilter);
    if (roleFilter) list = list.filter(e => e.role === roleFilter);

    list.sort((a, b) => {
      const aVal = a[sortBy.field] || '';
      const bVal = b[sortBy.field] || '';
      if (aVal === bVal) return 0;
      if (sortBy.dir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return list;
  }, [employees, query, statusFilter, roleFilter, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { if (page > pages) setPage(pages); }, [pages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Actions: delete / toggle / terminate / invite
  const handleDelete = (id) => {
    setConfirm({ type: 'delete', payload: id, title: 'Delete employee?', body: 'This will permanently delete the employee record.' });
  };
  const handleToggleActive = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    const newStatus = emp.status === 'Active' ? 'Deactivated' : 'Active';
    setConfirm({ type: 'toggle', payload: { id, newStatus }, title: `${newStatus === 'Active' ? 'Activate' : 'Deactivate'} employee?`, body: `Change status to ${newStatus}?` });
  };
  const handleTerminate = (id) => {
    setConfirm({ type: 'terminate', payload: id, title: 'Terminate employee?', body: 'This will mark the employee as Terminated.' });
  };

  const confirmAction = () => {
    if (!confirm) return;
    const { type, payload } = confirm;
    if (type === 'delete') {
      const next = employees.filter(p => p.id !== payload);
      mutateAndPersist(next);
    } else if (type === 'toggle') {
      const next = employees.map(p => p.id === payload.id ? { ...p, status: payload.newStatus } : p);
      mutateAndPersist(next);
    } else if (type === 'terminate') {
      const next = employees.map(p => p.id === payload ? { ...p, status: 'Terminated' } : p);
      mutateAndPersist(next);
    }
    setConfirm(null);
  };

  const handleInviteAgain = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    const temp = Math.random().toString(36).slice(-8);
    const next = employees.map(p => p.id === id ? { ...p, status: 'Invitation Sent' } : p);
    mutateAndPersist(next);
    setEmailPreview({ email: emp.email, password: temp, name: `${emp.firstName} ${emp.lastName}` });
  };

  // Useful debug log if list is unexpectedly empty
  useEffect(() => {
    if (employees.length === 0) {
      console.debug('[EmployeeList] employees array is empty. Check localStorage key and employeesStorage.STORAGE_KEY');
    }
  }, [employees]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-gray-500 mt-1">Manage employees, roles & access.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(true)} className="px-3 py-2 border rounded-lg flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <Link to="/employees/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Employee
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search employees by name, id, email..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
          </div>

          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-3 py-2 border rounded-lg">
            {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} / page</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Employee</th>
                <th className="px-6 py-3 text-left">Employee ID</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                        {emp.avatar ? <img src={emp.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-sm font-semibold">{(emp.firstName?.[0] ?? '') + (emp.lastName?.[0] ?? '')}</span>}
                      </div>
                      <div>
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-gray-500">{emp.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">{emp.id}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : emp.status === 'Deactivated' ? 'bg-yellow-100 text-yellow-800' : emp.status === 'Terminated' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/employees/view/${emp.id}`} className="p-2 hover:bg-gray-100 rounded-md"><Eye className="w-4 h-4" /></Link>
                      <Link to={`/employees/edit/${emp.id}`} className="p-2 hover:bg-gray-100 rounded-md"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(emp.id)} className="p-2 hover:bg-gray-100 rounded-md"><Trash2 className="w-4 h-4" /></button>
                      {/* <button onClick={() => handleToggleActive(emp.id)} className="p-2 hover:bg-gray-100 rounded-md">
                        {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button> */}
                      {/* <button onClick={() => handleInviteAgain(emp.id)} className="p-2 hover:bg-gray-100 rounded-md">Invite</button> */}
                    </div>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing <strong>{pageItems.length}</strong> of <strong>{total}</strong></div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 border rounded-lg text-sm">Prev</button>
            <div className="px-3 py-2 border rounded-lg text-sm">Page {page} / {pages}</div>
            <button disabled={page === pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="px-3 py-2 border rounded-lg text-sm">Next</button>
          </div>
        </div>
      </div>

      {confirm && <ConfirmModal title={confirm.title} body={confirm.body} onCancel={() => setConfirm(null)} onConfirm={confirmAction} />}

      <SlidePanel open={showFilters} onClose={() => setShowFilters(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Any</option>
                <option>Active</option>
                <option>Deactivated</option>
                <option>Terminated</option>
                <option>Invitation Sent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Any</option>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sort by</label>
              <select value={`${sortBy.field}:${sortBy.dir}`} onChange={(e) => {
                const [field, dir] = e.target.value.split(':');
                setSortBy({ field, dir });
              }} className="w-full p-2 border rounded-lg">
                <option value="createdAt:desc">Newest</option>
                <option value="createdAt:asc">Oldest</option>
                <option value="firstName:asc">First name (A → Z)</option>
                <option value="firstName:desc">First name (Z → A)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setStatusFilter(''); setRoleFilter(''); setSortBy({ field: 'createdAt', dir: 'desc' }); }} className="px-4 py-2 border rounded-lg">Reset</button>
              <button onClick={() => setShowFilters(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
            </div>
          </div>
        </div>
      </SlidePanel>

      {emailPreview && (
        <EmailPreviewModal
          to={emailPreview.email}
          name={emailPreview.name}
          password={emailPreview.password}
          onClose={() => setEmailPreview(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
