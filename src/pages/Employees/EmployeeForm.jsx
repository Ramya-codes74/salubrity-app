// src/pages/Employees/EmployeeForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadEmployees, saveEmployees, genEmployeeId } from '../../data/employeesStorage';
import EmailPreviewModal from '../../shared/EmailPreviewModal';
import { useRBAC } from '../../context/RBACContext';



const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = (err) => rej(err);
});

const EmployeeForm = ({ mode = 'add' }) => {
    const { getRolesList } = useRBAC();
    const ROLE_OPTIONS = getRolesList();
    const { id } = useParams();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: ROLE_OPTIONS[0],
        avatar: null,
        projects: []
    });
    const [emailPreview, setEmailPreview] = useState(null);

    useEffect(() => {
        setEmployees(loadEmployees());
    }, []);

    useEffect(() => {
        if (mode === 'edit' && employees.length && id) {
            const emp = employees.find(e => e.id === id);
            if (emp) {
                setForm({
                    firstName: emp.firstName,
                    lastName: emp.lastName,
                    email: emp.email,
                    phone: emp.phone,
                    role: emp.role,
                    avatar: emp.avatar || null,
                    projects: emp.projects || []
                });
            } else {
                // not found
                navigate('/employees');
            }
        }
    }, [mode, employees, id, navigate]);

    const handleFile = async (file) => {
        if (!file) return;
        const b = await toBase64(file);
        setForm(f => ({ ...f, avatar: b }));
    };

    // inside EmployeeForm.jsx - replace the existing handleSubmit function with this
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.firstName || !form.email) {
            alert('First name and email are required');
            return;
        }

        if (mode === 'add') {
            const newId = genEmployeeId(employees);
            // create temp password
            const temp = Math.random().toString(36).slice(-8);

            const newEmp = {
                id: newId,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                role: form.role,
                status: 'Invitation Sent',
                avatar: form.avatar || null,
                projects: form.projects || [],
                createdAt: new Date().toISOString()
            };

            const next = [newEmp, ...employees];
            // persist
            saveEmployees(next);
            setEmployees(next);

            // prepare preview payload
            const preview = { email: newEmp.email, password: temp, name: `${newEmp.firstName} ${newEmp.lastName}` };

            // navigate to list and pass preview via location.state so the list page can show the modal
            navigate('/employees/list', { state: { emailPreview: preview } });
        } else {
            // edit mode
            const next = employees.map(e => e.id === id ? { ...e, ...form } : e);
            saveEmployees(next);
            setEmployees(next);
            navigate('/employees/list');
        }
    };


    const handleAddProject = () => {
        setForm(f => ({ ...f, projects: [...f.projects, { id: `P${Date.now()}`, name: '', role: '', description: '' }] }));
    };
    const handleProjectChange = (idx, key, val) => {
        setForm(f => {
            const p = [...f.projects];
            p[idx] = { ...p[idx], [key]: val };
            return { ...f, projects: p };
        });
    };
    const handleRemoveProject = (idx) => {
        setForm(f => ({ ...f, projects: f.projects.filter((_, i) => i !== idx) }));
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{mode === 'add' ? 'Add Employee' : 'Edit Employee'}</h1>
                    <p className="text-gray-500">Capture profile and project assignments.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">First name</label>
                        <input value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last name</label>
                        <input value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} className="w-full p-2 border rounded-lg">
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Profile image</label>
                        <div className="flex items-center gap-3">
                            <label className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer">
                                {form.avatar ? <img alt="avatar" src={form.avatar} className="w-full h-full object-cover" /> : <span className="text-sm text-gray-500">Upload</span>}
                                <input onChange={(e) => e.target.files && handleFile(e.target.files[0])} type="file" accept="image/*" className="hidden" />
                            </label>
                            <div className="text-sm text-gray-500">Recommended 400x400px, JPG/PNG.</div>
                        </div>
                    </div>
                </div>

                <div>
                    {/* <h3 className="font-semibold mb-2">Projects</h3> */}
                    {/* <div className="space-y-3">
                        {form.projects.map((p, idx) => (
                            <div key={p.id} className="p-3 border rounded-lg">
                                <div className="flex gap-2">
                                    <input placeholder="Project name" value={p.name} onChange={(e) => handleProjectChange(idx, 'name', e.target.value)} className="flex-1 p-2 border rounded-lg" />
                                    <input placeholder="Role" value={p.role} onChange={(e) => handleProjectChange(idx, 'role', e.target.value)} className="w-48 p-2 border rounded-lg" />
                                </div>
                                <textarea placeholder="Description" value={p.description} onChange={(e) => handleProjectChange(idx, 'description', e.target.value)} className="w-full p-2 border rounded-lg mt-2"></textarea>
                                <div className="mt-2 flex justify-end">
                                    <button type="button" onClick={() => handleRemoveProject(idx)} className="text-sm text-red-600">Remove</button>
                                </div>
                            </div>
                        ))}
                        <div>
                            <button type="button" onClick={handleAddProject} className="px-3 py-2 border rounded-lg">Add project</button>
                        </div>
                    </div> */}
                </div>

                <div className="flex items-center gap-3 justify-end">
                    <button type="button" onClick={() => navigate('/employees')} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{mode === 'add' ? 'Create & Invite' : 'Save'}</button>
                </div>
            </form>

            {emailPreview && (
                <EmailPreviewModal to={emailPreview.email} name={emailPreview.name} password={emailPreview.password} onClose={() => setEmailPreview(null)} />
            )}
        </div>
    );
};

export default EmployeeForm;
