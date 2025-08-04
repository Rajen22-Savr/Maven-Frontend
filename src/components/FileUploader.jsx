import React, { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://maven-backend.onrender.com/upload/", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>📤 Upload Spend or Contract File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>Submit</button>
      {response && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Top Suppliers by Potential Savings:</h4>
          <ul>
            {response.top_suppliers.map((item, idx) => (
              <li key={idx}>{item["Supplier Name"]}: ${Number(item["Potential Savings"]).toLocaleString()}</li>
            ))}
          </ul>
          <h4>Unit Price Outliers:</h4>
          <ul>
            {response.outliers.map((item, idx) => (
              <li key={idx}>{item["Supplier Name"]}, {item["Item Name"]}: ${Number(item["CY vs PY WAP USD (Fiscal)"]).toFixed(2)}</li>
            ))}
          </ul>
          <h4>Recommended Actions:</h4>
          <ul>
            {response.actions.map((item, idx) => (
              <li key={idx}><strong>{item.type}</strong>: {item.supplier || item.note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}