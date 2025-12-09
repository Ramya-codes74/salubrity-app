import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">404 — Page not found</h1>
    <p className="mt-2">Go back to <Link to="/dashboard" className="text-blue-600">Dashboard</Link>.</p>
  </div>
);

export default NotFound;
