import{c as h,r,j as e}from"./index-CaIbOwnm.js";function g(){const i=h(),[t,l]=r.useState({name:"",phone:"",email:"",registration:"",gstin:"",pan:"",businessType:"",logo:null});r.useEffect(()=>{fetch("YOUR_API_URL_HERE/getTenant").then(n=>n.json()).then(n=>l(n)).catch(n=>console.log("Fetch error:",n))},[]);const a=n=>{l({...t,[n.target.name]:n.target.value})},d=n=>{l({...t,logo:n.target.files[0]})},o=()=>{const n=new FormData;Object.entries(t).forEach(([s,x])=>{n.append(s,x)}),fetch("YOUR_API_URL_HERE/updateTenant",{method:"POST",body:n}).then(s=>s.json()).then(s=>alert("Saved Successfully")).catch(s=>alert("Error saving data"))},c=()=>{window.confirm("Are you sure you want to deactivate?")&&fetch("YOUR_API_URL_HERE/deleteTenant",{method:"DELETE"}).then(n=>alert("Tenant Deactivated")).catch(n=>alert("Error deleting"))},p=()=>{i(-1)};return e.jsxs("div",{style:{padding:"30px"},children:[e.jsxs("div",{style:{marginTop:"5px",display:"flex",justifyContent:"flex-end",gap:"8px"},children:[e.jsx("button",{className:"btn-red",onClick:c,children:"Deactivate"}),e.jsx("button",{className:"btn-gray",onClick:p,children:"Back"})]}),e.jsx("h2",{style:{fontSize:"30px",fontWeight:"600"},children:"Edit Tenant"}),e.jsx("p",{style:{color:"#666",marginBottom:"25px"},children:"Modify tenant details and features"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",maxWidth:"700px"},children:[e.jsxs("div",{children:[e.jsx("label",{children:"Organization name *"}),e.jsx("input",{type:"text",name:"name",value:t.name,onChange:a,placeholder:"Enter name",className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Phone *"}),e.jsx("br",{}),e.jsx("input",{type:"text",name:"phone",value:t.phone,onChange:a,placeholder:"Enter phone",className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Email *"}),e.jsx("br",{}),e.jsx("input",{type:"email",name:"email",value:t.email,onChange:a,placeholder:"Enter email",className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Logo"}),e.jsx("br",{}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:d,className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Registration number"}),e.jsx("br",{}),e.jsx("input",{type:"text",name:"registration",value:t.registration,onChange:a,placeholder:"Enter register number",className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"GSTIN"}),e.jsx("br",{}),e.jsx("input",{type:"text",name:"gstin",value:t.gstin,onChange:a,placeholder:"Enter GSTIN",className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"PAN"}),e.jsx("br",{}),e.jsx("input",{type:"text",name:"pan",value:t.pan,onChange:a,placeholder:"Enter PAN",className:"input"})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Business Type"}),e.jsx("br",{}),e.jsx("input",{type:"text",name:"businessType",value:t.businessType,onChange:a,placeholder:"Enter business type",className:"input"})]})]}),e.jsx("br",{}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{className:"bg-blue-500 text-white px-4 py-2 rounded",onClick:o,children:"Save"}),e.jsx("button",{className:"bg-blue-500 text-white px-4 py-2 rounded",children:"Cancel"})]}),e.jsx("style",{children:`
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
        `})]})}export{g as default};
