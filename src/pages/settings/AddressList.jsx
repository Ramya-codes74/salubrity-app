import React from "react";

export default function AddressList() {

  const handleDelete = () => {
    alert("Address deleted!");
  };

  return (
    <div style={{ padding: "15px" }}>
     <h1 style={{ fontSize: "28px", marginBottom: "15px" }}>
        Address Information
      </h1>

      {/* CARD */}
      <div className="cardBox">

        {/* TOP ROW */}
        <div className="topRow">
          <div className="row">
            <input type="radio" />
            <span style={{ marginLeft: "8px" }}>Primary Address</span>
          </div>

          {/* DELETE BUTTON */}
          <button className="deleteBtn" onClick={handleDelete}>Delete</button>
        </div><br></br>

        <input
          type="text"
          className="call"
          placeholder="Street Address"
        />

        <div className="row">
          <input type="text" className="call" placeholder="Area" />
          <input type="text" className="call" placeholder="City" />
        </div>

        <div className="row">
          <input type="text" className="call" placeholder="State" />
          <input type="text" className="call" placeholder="Country" />
        </div>

        <div className="row">
          <input type="text" className="call" placeholder="PIN Code" />
          <select className="call">
            <option>Home</option>
            <option>Work</option>
            <option>Others</option>
          </select>
        </div>

        <button className="btn">Update</button>
      </div>

      {/* CSS */}
      <style>
        {`
          .cardBox {
            width: 100%;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #0a0505b4;
          }

          .topRow {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .row {
            display: flex;
            gap: 10px;
            margin: 8px 0;
          }

          .call {
            width: 100%;
            padding: 6px;
            border: 1px solid #160808ec;
            border-radius: 8px;
            font-size: 20px;
          }

          .btn {
            margin-top: 15px;
            width: 120px;
            padding: 10px;
            border: none;
            background: #0390fc;
            color: white;
            border-radius: 6px;
            font-size: 16px;
          }

          .deleteBtn {
            background: #e01313ef;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 13px;
          }
        `}
      </style>

    </div>
  );
}