import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Login = () => {
    const { login } = useApp();
    const [step, setStep] = useState('identifier');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // at top of component
    const [remember, setRemember] = useState(true);

    const handleIdentifierSubmit = (e) => {
        e.preventDefault();
        if (identifier.trim()) {
            setIdentifier(identifier.trim());
            setStep('password');
            setError('');
        } else {
            setError('Please enter email or username');
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // demo-only password check
        if (password === 'admin123') {
            login({ name: 'John Anderson', role: 'System Administrator', email: identifier },{ remember });
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-12 flex-col justify-between">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-4">Acme</h1>
                    <p className="text-blue-100 text-sm">Powered by Salubrity</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                            <p className="text-gray-600">Sign in to access your admin dashboard</p>
                        </div>

                        {step === 'identifier' ? (
                            <form onSubmit={handleIdentifierSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
                                    <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                                </div>
                                
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                    Remember me
                                </label>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <button type="submit" className="w-full bg-gray-600 text-white py-3 rounded-lg">Continue</button>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <button type="button" onClick={() => setStep('identifier')} className="text-sm text-gray-600">Change user</button>
                                    </div>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Enter password" autoFocus />
                                    <p className="text-xs text-gray-500 mt-2">Signing in as: {identifier}</p>
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <button type="submit" className="w-full bg-gray-600 text-white py-3 rounded-lg">Sign In</button>
                                <p className="text-xs text-gray-500 text-center">Demo password: admin123</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
