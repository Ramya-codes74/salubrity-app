import React from 'react';
import { useParams } from 'react-router-dom';
import customers from '../../data/mockCustomers';

const CustomerDetail = () => {
  const { id } = useParams();
  const customer = customers.find(c => c.id === id);

  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">{customer.cname} ({customer.id})</h2>
      <div classname="mt-2">
        <label className="font-semibold">Cname:</label>
        <input type="text" value={customer.cname}
        readOnly
        className="border p-2 rounded"/>
        </div>
      <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <p><strong>Age:</strong> {customer.age}</p>
        <p><strong>Gender:</strong> {customer.gender}</p>
        <p><strong>Acquired On:</strong> {customer.acquiredOn}</p>
        <p><strong>Tests:</strong> {customer.tests}</p>
        <p><strong>Status:</strong> {customer.status}</p>
      </div>
    </div>
  );
};

export default CustomerDetail;
