import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS

export default function OrganizationPage() {
  const navigate = useNavigate();  // ✅ ADD THIS

  const [tenant, setTenant] = useState({
    name: "",
    phone: "",
    email: "",
    registration: "",
    gstin: "",
    pan: "",
    businessType: "",
    logo: null
  });

  // ---------------------------
  // LOAD EXISTING TENANT (READ)
  // ---------------------------
  useEffect(() => {
    fetch("YOUR_API_URL_HERE/getTenant")
      .then(res => res.json())
      .then(data => setTenant(data))
      .catch(err => console.log("Fetch error:", err));
  }, []);

  // ---------------------------
  // HANDLE FIELD CHANGES
  // ---------------------------
  const handleChange = (e) => {
    setTenant({
      ...tenant,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (e) => {
    setTenant({
      ...tenant,
      logo: e.target.files[0]
    });
  };

  // ---------------------------
  // CREATE OR UPDATE (SAVE)
  // ---------------------------
  const handleSave = () => {
    const formData = new FormData();
    Object.entries(tenant).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fetch("YOUR_API_URL_HERE/updateTenant", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => alert("Saved Successfully"))
      .catch(err => alert("Error saving data"));
  };

  // ---------------------------
  // DELETE OPERATION
  // ---------------------------
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to deactivate?")) return;

    fetch("YOUR_API_URL_HERE/deleteTenant", {
      method: "DELETE"
    })
      .then(res => alert("Tenant Deactivated"))
      .catch(err => alert("Error deleting"));
  };

  // ---------------------------
  // BACK BUTTON FUNCTION
  // ---------------------------
  const handleBack = () => {
    navigate(-1);   // ✅ GO BACK TO PREVIOUS PAGE
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* Buttons */}
      <div style={{ marginTop: "5px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button className="btn-red" onClick={handleDelete}>Deactivate</button>

        {/* ✅ FIXED BACK BUTTON */}
        <button className="btn-gray" onClick={handleBack}>Back</button>
      </div>

      <h2 style={{ fontSize: "30px", fontWeight: "600" }}>Edit Tenant</h2>
      <p style={{ color: "#666", marginBottom: "25px" }}>
        Modify tenant details and features
      </p>

      {/* Form grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "700px",
        }}
      >
        <div>
          <label>Organization name *</label>
          <input
            type="text"
            name="name"
            value={tenant.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="input"
          />
        </div>

        <div>
          <label>Phone *</label><br />
          <input
            type="text"
            name="phone"
            value={tenant.phone}
            onChange={handleChange}
            placeholder="Enter phone"
            className="input"
          />
        </div>

        <div>
          <label>Email *</label><br />
          <input
            type="email"
            name="email"
            value={tenant.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="input"
          />
        </div>

        <div>
          <label>Logo</label><br />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFile}
            className="input"
          />
        </div>

        <div>
          <label>Registration number</label><br />
          <input
            type="text"
            name="registration"
            value={tenant.registration}
            onChange={handleChange}
            placeholder="Enter register number"
            className="input"
          />
        </div>

        <div>
          <label>GSTIN</label><br />
          <input
            type="text"
            name="gstin"
            value={tenant.gstin}
            onChange={handleChange}
            placeholder="Enter GSTIN"
            className="input"
          />
        </div>

        <div>
          <label>PAN</label><br />
          <input
            type="text"
            name="pan"
            value={tenant.pan}
            onChange={handleChange}
            placeholder="Enter PAN"
            className="input"
          />
        </div>

        <div>
          <label>Business Type</label><br />
          <input
            type="text"
            name="businessType"
            value={tenant.businessType}
            onChange={handleChange}
            placeholder="Enter business type"
            className="input"
          />
        </div>
      </div>

      <br />

      <div className="flex gap-3">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
          Save
        </button>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>

      {/* Styles */}
      <style>
        {`
        .input {
          width: 70%;
          padding: 6px;
          margin-top: 2px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }

        label {
          font-weight: 500;
        }

        .btn-red {
          background-color: #e28f8f46;
          color: red;
          padding: 6px 8px;
          border-radius: 4px;
        }

        .btn-gray {
          background-color: #e5e7eb;
          padding: 10px 20px;
          border-radius: 6px;
        }
        `}
      </style>
    </div>
  );
}