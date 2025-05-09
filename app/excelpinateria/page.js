"use client";
import { useState } from "react";

export default function UploadExcel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select an Excel file.");
      return;
    }
    // Prepare form data
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/updatepinateriaprices", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error uploading file.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload Excel File to Update Prices</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          Upload and Update
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}
