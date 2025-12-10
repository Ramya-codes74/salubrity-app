import{j as e}from"./index-CaIbOwnm.js";function d(){const s=()=>{alert("Address deleted!")};return e.jsxs("div",{style:{padding:"15px"},children:[e.jsx("h1",{style:{fontSize:"28px",marginBottom:"15px"},children:"Address Information"}),e.jsxs("div",{className:"cardBox",children:[e.jsxs("div",{className:"topRow",children:[e.jsxs("div",{className:"row",children:[e.jsx("input",{type:"radio"}),e.jsx("span",{style:{marginLeft:"8px"},children:"Primary Address"})]}),e.jsx("button",{className:"deleteBtn",onClick:s,children:"Delete"})]}),e.jsx("br",{}),e.jsx("input",{type:"text",className:"call",placeholder:"Street Address"}),e.jsxs("div",{className:"row",children:[e.jsx("input",{type:"text",className:"call",placeholder:"Area"}),e.jsx("input",{type:"text",className:"call",placeholder:"City"})]}),e.jsxs("div",{className:"row",children:[e.jsx("input",{type:"text",className:"call",placeholder:"State"}),e.jsx("input",{type:"text",className:"call",placeholder:"Country"})]}),e.jsxs("div",{className:"row",children:[e.jsx("input",{type:"text",className:"call",placeholder:"PIN Code"}),e.jsxs("select",{className:"call",children:[e.jsx("option",{children:"Home"}),e.jsx("option",{children:"Work"}),e.jsx("option",{children:"Others"})]})]}),e.jsx("button",{className:"btn",children:"Update"})]}),e.jsx("style",{children:`
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
        `})]})}export{d as default};
