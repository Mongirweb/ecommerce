"use client";
import React, { useState } from "react";
// IMPORTANT: from 'xlsx' not 'sheetjs'
import * as XLSX from "xlsx";

export default function XlsxExtractForm() {
  const [file, setFile] = useState(null);

  const handleParse = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      // Read the file as a binary array
      const workbook = XLSX.read(data, { type: "array" });

      // Access the first worksheet (by default)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to JSON *with headers in the first row*
      // { header: 1 } => means we get an array of arrays (first row is headers).
      // For many use cases, though, you can do:
      // XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // The first row (index 0) is the array of column headers
      const headers = jsonData[0] || [];

      // Let's find the indexes for the columns we care about
      const codigoLargoIndex = headers.indexOf("COD_LARGO");
      const atributo1Index = headers.indexOf("ATRIBUTO1");

      // If either is missing from the sheet, handle accordingly
      if (codigoLargoIndex === -1 || atributo1Index === -1) {
        console.error("Could not find columns 'COD_LARGO' or 'ATRIBUTO1'.");
        return;
      }

      // Collect rows starting at index 1 (since index 0 is headers)
      const extractedData = jsonData.slice(1).map((row) => {
        return {
          codigoLargo: row[codigoLargoIndex],
          atributo1: row[atributo1Index],
        };
      });

      // Log the two columns for each row

      // Send the extracted data to the API
      fetch("/api/updateWithExcel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(extractedData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);
        })
        .catch((error) => {
          console.error("Error updating wholesale prices:", error);
        });
    };

    // Read the file as an ArrayBuffer so xlsx can parse it
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="button" onClick={handleParse}>
        Extract & Console.log
      </button>
    </div>
  );
}
