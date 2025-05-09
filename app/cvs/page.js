"use client";
import React, { useState } from "react";

export default function CsvImportForm() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // 1) Post the CSV to our API route
    const res = await fetch("/api/cvsImport", {
      method: "POST",
      body: formData,
    });

    // 2) Get the JSON response (which contains your parsed CSV data)
    const data = await res.json();
    console.log("Parsed CSV Data:", data);

    // 3) Convert `data` to a JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // 4) Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // 5) Generate a download link (Object URL)
    const url = URL.createObjectURL(blob);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Import</button>
    </form>
  );
}
