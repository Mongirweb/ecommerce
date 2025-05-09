"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import styles from "../../../../../styles/bulk.module.scss";
import Layout from "../../../../../components/business/layout";
import Image from "next/image";
import { SiMicrosoftexcel } from "react-icons/si";
// import { BrowserView, MobileView, isSafari } from "react-device-detect";
/// instalar esta libreria

const initialState = {
  company: "",
  name: "",
  description: "",
  brand: "",
  sku: "",
  universalCode: "",
  discount: "",
  flashOffer: "",
  flashDiscount: "",
  chargeMarket: 10,
  images: [],
  gender: "",
  warranty: {
    number: "",
  },
  measures: {
    long: "",
    width: "",
    high: "",
    volumetric_weight: "",
    weight: "",
  },
  description_images: [],
  parent: "",
  category: "",
  subCategories: "",
  subCategorie2: "",
  subCategorie3: "",
  color: {
    color: "",
    image: "",
  },
  sizes: [
    {
      size: "",
      qty: "",
      price: "",
    },
  ],
  details: [
    {
      name: "",
      value: "",
    },
  ],
  questions: [
    {
      question: "",
      answer: "",
    },
  ],
  shippingFee: "",
};

// Map Excel headers to product property paths
const columnMappings = {
  "TÍTULO DEL PRODUCTO": "name",
  "DESCRIPCIÓN PRODUCTO": "description",
  CATEGORÍA: "category",
  "SUBCATEGORÍA-1": "subCategories",
  "SUBCATEGORÍA-2": "subCategorie2",
  "SUBCATEGORÍA-3": "subCategorie3",
  "COLOR PRODUCTO": "color.color",
  "IMÁGENES DEL PRODUCTO": "images",
  SKU: "sku",
  "PRECIO PRODUCTO SALDO": "sizes[0].price",
  STOCK: "sizes[0].qty",
  "DESCUENTO %": "discount",
  GÉNERO: "gender",
  PESO: "measures.weight",
  LARGO: "measures.long",
  ANCHO: "measures.width",
  ALTO: "measures.high",
  "PARTICIPAR EN OFERTA FLASH": "flashOffer",
  "DESCUENTO EN OFERTA FLASH%": "flashDiscount",
  TALLA: "sizes[0].size",
  MARCA: "brand",
  "PRECIO PRODUCTO": "sizes[0].price",
  "TIEMPO GARANTÍA": "warranty.number",
  // Continue adding mappings as needed
};

export default function UploadBulkClient({
  user,
  productsCategories,
  productsSubcategories,
  productsSubcategories2,
  productsSubcategories3,
}) {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState({ headers: [], rows: [] });
  const [products, setProducts] = useState([]); // State to hold the product objects
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategory2, setSubcategory2] = useState("");
  const [subcategory3, setSubcategory3] = useState("");
  const [option, setOption] = useState("");
  const [sub3Option, setSub3Option] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filteredSubcategories2, setFilteredSubcategories2] = useState([]);
  const [filteredSubcategories3, setFilteredSubcategories3] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    readExcel(file);
  };

  useEffect(() => {
    if (category) {
      const filtered = productsSubcategories.filter(
        (subcat) => subcat?.parent === category.id
      );
      setFilteredSubcategories(filtered);
    }
  }, [category]);

  useEffect(() => {
    if (subcategory) {
      const filtered = productsSubcategories2.filter(
        (subcat2) => subcat2?.parent === subcategory.id
      );
      setFilteredSubcategories2(filtered);
    }
  }, [subcategory]);

  useEffect(() => {
    if (subcategory2) {
      const filtered = productsSubcategories3.filter(
        (subcat3) => subcat3?.parent === subcategory2.id
      );
      setFilteredSubcategories3(filtered);
    }
  }, [subcategory2]);

  useEffect(() => {
    if (category) {
      if (
        filteredSubcategories.length > 0 &&
        subcategory &&
        filteredSubcategories2.length === 0 &&
        filteredSubcategories3.length === 0
      ) {
        // When only category and subcategory are selected
        setAllSelected(true);
      } else if (
        filteredSubcategories.length > 0 &&
        subcategory &&
        filteredSubcategories2.length > 0 &&
        subcategory2 &&
        filteredSubcategories3.length === 0
      ) {
        // When category, subcategory, and subcategory2 are selected
        setAllSelected(true);
      } else if (
        filteredSubcategories.length > 0 &&
        subcategory &&
        filteredSubcategories2.length > 0 &&
        subcategory2 &&
        filteredSubcategories3.length > 0 &&
        subcategory3
      ) {
        // When all categories are selected (category, subcategory, subcategory2, and subcategory3)
        setAllSelected(true);
      } else {
        setAllSelected(false);
      }
    } else {
      setAllSelected(false);
    }
  }, [
    category,
    subcategory,
    subcategory2,
    subcategory3,
    filteredSubcategories,
    filteredSubcategories2,
    filteredSubcategories3,
  ]);

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = "PRODUCTOS";
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headers = jsonData[2]; // Headers are on the 3rd row (index 2)
      const allRows = jsonData.slice(5); // Start from the 6th row (index 5)

      // Define default values that indicate a cell is empty or default
      const defaultValues = ["", null, undefined, "Seleccionar", "-", 0];

      // Define the indices of the key columns
      const keyColumnIndices = [4, 5, 25, 11]; // Adjust indices as needed

      // Filter out rows where key columns contain default values
      const rows = allRows.filter((row) => {
        return keyColumnIndices.every((index) => {
          const cellValue = row[index];
          return !defaultValues.includes(cellValue);
        });
      });

      // Update the state with headers and filtered rows
      setTableData({ headers, rows });
    };
    reader.readAsArrayBuffer(file);
  };

  // Helper function to set nested properties
  function setNestedProperty(obj, path, value) {
    const keys = path.split(".");
    let current = obj;

    keys.forEach((key, index) => {
      if (key.includes("[")) {
        // Handle array notation (e.g., "sizes[0].size")
        const [arrayKey, arrayIndex] = key.match(/(\w+)\[(\d+)\]/).slice(1);
        if (!current[arrayKey]) current[arrayKey] = [];
        if (!current[arrayKey][arrayIndex]) current[arrayKey][arrayIndex] = {};
        current = current[arrayKey][arrayIndex];
      } else {
        if (index === keys.length - 1) {
          if (key === "images" && typeof value === "string") {
            // Split images into an array if it's a comma-separated string
            current[key] = value.split(",").map((url) => url.trim());
          } else {
            current[key] = value;
          }
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      }
    });
  }

  // Function to map category names to IDs
  const mapCategoryNamesToIds = (product) => {
    // Helper function to find ID by name
    const normalizeString = (str) =>
      str
        .normalize("NFD") // Normalize accents
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[\p{P}\p{S}]+/gu, "") // Remove punctuation (commas, etc.)
        .replace(/\s+/g, " ") // Convert multiple spaces to a single space
        .trim()
        .toLowerCase();
    const findIdByName = (name, dataArray) => {
      if (!name) return null;
      const normalizedName = normalizeString(name);
      const found = dataArray.find(
        (item) => normalizeString(item.name) === normalizedName
      );
      return found ? found._id : null;
    };

    // Map category
    const categoryId = findIdByName(product.category, productsCategories);
    if (categoryId) {
      product.category = categoryId;
    } else {
      console.warn(`Category '${product.category}' not found.`);
      product.category = null;
    }

    // Map subCategorie1
    const subCategoryId = findIdByName(
      product.subCategories,
      productsSubcategories
    );
    if (subCategoryId) {
      product.subCategories = subCategoryId;
    } else {
      console.warn(`Subcategory '${product.subCategorie1}' not found.`);
      product.subCategories = [];
    }

    // Map subCategorie2
    if (product.subCategorie2) {
      const subCategory2Id = findIdByName(
        product.subCategorie2,
        productsSubcategories2
      );
      if (subCategory2Id) {
        product.subCategorie2 = subCategory2Id;
      } else {
        console.warn(`Subcategory2 '${product.subCategorie2}' not found.`);
        product.subCategorie2 = [];
      }
    } else {
      console.warn(`Subcategory2 '${product.subCategorie2}' not found.`);
      product.subCategorie2 = [];
    }

    // Map subCategorie3
    if (product.subCategorie3) {
      const subCategory3Id = findIdByName(
        product.subCategorie3,
        productsSubcategories3
      );
      if (subCategory3Id) {
        product.subCategorie3 = subCategory3Id;
      } else {
        console.warn(`Subcategory3 '${product.subCategorie3}' not found.`);
        product.subCategorie3 = [];
      }
    } else {
      console.warn(`Subcategory3 '${product.subCategorie3}' not found.`);
      product.subCategorie3 = [];
    }
  };

  // Function to process the data and create products
  const handleUploadProducts = async () => {
    const productsArray = tableData.rows.map((row) => {
      const product = JSON.parse(JSON.stringify(initialState)); // Clone initialState

      let costoEnvio = 0;
      let sobreFleteSaldo = 0;

      // Map each cell in the row to the product properties
      tableData.headers.forEach((header, index) => {
        const propertyPath = columnMappings[header.trim()];
        const cellValue = row[index];

        if (
          propertyPath &&
          cellValue !== undefined &&
          cellValue !== null &&
          cellValue !== "" &&
          cellValue !== "Seleccionar" &&
          cellValue !== "-"
        ) {
          setNestedProperty(product, propertyPath, cellValue);
        }

        // Accumulate the values for "COSTO ENVÍO" and "SOBREFLETE SALDO"
        if (header.trim() === "COSTO ENVÍO" && !isNaN(cellValue)) {
          costoEnvio = parseFloat(cellValue);
        }
        if (header.trim() === "SOBREFLETE SALDO" && !isNaN(cellValue)) {
          sobreFleteSaldo = parseFloat(cellValue);
        }
      });

      // Calculate and set shippingFee
      product.shippingFee = costoEnvio + sobreFleteSaldo;
      product.company = user.id;

      // Map category names to IDs
      mapCategoryNamesToIds(product);

      return product;
    });

    // Now group products by name and color, merging sizes
    const groupedProducts = {};

    productsArray.forEach((product) => {
      const key = `${product.name}_${product.color.color}`;

      if (groupedProducts[key]) {
        // Merge sizes
        groupedProducts[key].sizes = groupedProducts[key].sizes.concat(
          product.sizes
        );

        // Merge images without duplicates
        const mergedImages = [
          ...groupedProducts[key].images,
          ...product.images,
        ];
        const uniqueImages = Array.from(new Set(mergedImages));
        groupedProducts[key].images = uniqueImages;
      } else {
        groupedProducts[key] = product;
      }
    });

    const finalProductsArray = Object.values(groupedProducts);

    setProducts(finalProductsArray);

    // Now send 'finalProductsArray' to the server
    try {
      const response = await fetch("/api/business/product/bulkUpload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authentication token if required
          // 'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(finalProductsArray),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success
        alert("Productos cargados exitosamente.");
        // You can reset the form or clear the products if needed
        setProducts([]);
        setFile(null);
        setTableData({ headers: [], rows: [] });
      } else {
        // Handle server errors
        alert(`Error al cargar productos: ${data.message}`);
      }
    } catch (error) {
      // Handle network errors
      console.error("Error al enviar productos:", error);
      alert("Error al enviar productos.");
    }
  };

  const handleDownloadTemplate = async () => {
    // Check if a category is selected
    if (!category || !category.name) {
      alert(
        "Por favor, selecciona una categoría antes de descargar la plantilla."
      );
      return;
    }

    let filename = "";

    if (
      filteredSubcategories.length > 0 &&
      filteredSubcategories2.length <= 0 &&
      filteredSubcategories3.length <= 0
    ) {
      // No subcategories, use only category name
      filename = `${category.name.toUpperCase()}-CARGAR-PRODUCTOS-SALDOMANIA.xlsx`;
    } else if (
      filteredSubcategories.length > 0 &&
      filteredSubcategories2.length > 0 &&
      filteredSubcategories3.length <= 0
    ) {
      // Subcategories exist, use category and subcategory names
      filename = `${category.name.toUpperCase()}-${subcategory.name.toUpperCase()}-CARGAR-PRODUCTOS-SALDOMANIA.xlsx`;
    } else if (
      filteredSubcategories.length > 0 &&
      filteredSubcategories2.length > 0 &&
      filteredSubcategories3.length <= 0
    ) {
      // Subcategories exist, use category and subcategory names
      filename = `${category.name.toUpperCase()}-${subcategory.name.toUpperCase()}-CARGAR-PRODUCTOS-SALDOMANIA.xlsx`;
    } else if (
      filteredSubcategories.length > 0 &&
      filteredSubcategories2.length > 0 &&
      filteredSubcategories3.length > 0
    ) {
      // Subcategories exist, use category and subcategory names
      filename = `${category.name.toUpperCase()}-${subcategory.name.toUpperCase()}-${subcategory2.name.toUpperCase()}-CARGAR-PRODUCTOS-SALDOMANIA.xlsx`;
    } else {
      // Subcategories exist but subcategory not selected
      alert(
        "Por favor, selecciona una subcategoría para descargar la plantilla."
      );
      return;
    }

    // Process the filename to replace spaces and special characters
    filename = filename
      .normalize("NFD") // Normalize accents
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^A-Z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single one
      .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens

    // Add the .xlsx extension if not already present
    if (!filename.endsWith(".xlsx")) {
      filename += ".xlsx";
    }

    // Since the file is located at the root of the public folder

    const filePath = `/excel/${filename}`;

    try {
      // Fetch the file
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("File not found");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor element and trigger the download
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("No se encontró la plantilla para la categoría seleccionada.");
    }
  };

  // Define the keys (headers) you want to exclude
  const excludedKeys = [
    "PRECIO FINAL PRODUCTO SALDO",
    "PARTICIPAR EN OFERTA FLASH",
    "DESCUENTO EN OFERTA FLASH%",
    "PRECIO FINAL PRODUCTO EN OFERTA FLASH",
    "TIPO DE ENVÍO",
    "COSTO ENVÍO",
    "ANCHO",
    "ALTO",
    "PESO VOLUMETRICO",
    "TIPO DE GARANTÍA",
    "TIEMPO GARANTÍA",
    "UNIDAD TIEMPO GARANTÍA",
    "PESO",
    "LARGO",
    "Retención de la fuente SALDO",
    "Retención de la fuente OFERTA FLASH",
    "RECIBES EN PRODUCTO SALDO",
    "RECIBES EN OFERTA FLASH",
    "TIENE TALLA (SI / NO)",
    "PRECIO PRODUCTO SALDO",
    "DESCUENTO %",
    "COMISIÓN SALDO",
    "SOBREFLETE SALDO",
    "TOTAL CARGOS SALDO",
    "COMISIÓN OFERTA FLASH",
    "SOBREFLETE OFERTA FLASH",
    "TOTAL CARGOS OFERTA FLASH",
    "CATEGORÍA",
    "SUBCATEGORÍA-1",
    "SUBCATEGORÍA-2",
    "SUBCATEGORÍA-3",
    "RESUMEN ERRORES",
    "CÓDIGO UNIVERSAL",
    // Add any other headers you want to exclude
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Cargue masivo de productos</h1>
        <span>
          Selecciona la categoría de tu producto y descarga el archivo Excel
        </span>
        <div className={styles.selector}>
          <select
            value={category?.id || ""}
            onChange={(e) => {
              const selectedCategory = productsCategories.find(
                (cat) => cat._id === e.target.value
              );
              setCategory(
                selectedCategory
                  ? { id: selectedCategory._id, name: selectedCategory.name }
                  : null
              );
            }}
          >
            <option value="">Selecciona Categoría</option>
            {productsCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {category && (
          <div className={styles.selector}>
            <select
              value={subcategory?.id || ""}
              onChange={(e) => {
                const selectedSubcategory = filteredSubcategories.find(
                  (subcat) => subcat._id === e.target.value
                );
                setSubcategory(
                  selectedSubcategory
                    ? {
                        id: selectedSubcategory._id,
                        name: selectedSubcategory.name,
                      }
                    : null
                );
              }}
            >
              <option value="">Selecciona Subcategoría</option>
              {filteredSubcategories.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {subcategory && filteredSubcategories2.length > 0 && (
          <div className={styles.selector}>
            <select
              value={subcategory2?.id || ""}
              onChange={(e) => {
                const selectedSubcategory2 = filteredSubcategories2.find(
                  (subcat) => subcat._id === e.target.value
                );
                setSubcategory2(
                  selectedSubcategory2
                    ? {
                        id: selectedSubcategory2._id,
                        name: selectedSubcategory2.name,
                      }
                    : null
                );
              }}
            >
              <option value="">Selecciona Subcategoría</option>
              {filteredSubcategories2.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {subcategory2 && filteredSubcategories3.length > 0 && (
          <div className={styles.selector}>
            <select
              value={subcategory3?.id || ""}
              onChange={(e) => {
                const selectedSubcategory3 = filteredSubcategories3.find(
                  (subcat) => subcat._id === e.target.value
                );
                setSubcategory3(
                  selectedSubcategory3
                    ? {
                        id: selectedSubcategory3._id,
                        name: selectedSubcategory3.name,
                      }
                    : null
                );
              }}
            >
              <option value="">Selecciona Subcategoría 3</option>
              {filteredSubcategories3.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {allSelected && (
          <div
            className={styles.downloadIcon}
            onClick={() => {
              handleDownloadTemplate(), setCategory("");
              setSubcategory("");
              setSubcategory2("");
              setSubcategory3("");
            }}
          >
            <SiMicrosoftexcel size={24} />
            <span>Descargar plantilla Excel</span>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.fileInputContainer}>
            <span>
              Una vez actualizado el archivo Excel sin que arroje ningun error,
              selecciona el archivo a cargar
            </span>
            <label htmlFor="fileInput" className={styles.customFileInputLabel}>
              Seleccionar archivo a cargar
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .csv"
              className={styles.hiddenFileInput}
              hidden
            />
          </div>

          {tableData.headers.length > 0 && (
            <div className={styles.productsList}>
              <h2>Revisar Cargue de Productos</h2>
              <table>
                <thead>
                  <tr>
                    {tableData.headers
                      .filter((header) => !excludedKeys.includes(header.trim()))
                      .map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableData.headers
                        .map((header, colIndex) => {
                          if (excludedKeys.includes(header.trim())) {
                            return null;
                          } else {
                            const cellValue = row[colIndex];

                            // Handle images if needed
                            if (
                              typeof cellValue === "string" &&
                              cellValue.startsWith(
                                "https://res.cloudinary.com/danfiejkv/image/"
                              )
                            ) {
                              const urls = cellValue.includes(",")
                                ? cellValue.split(",")
                                : [cellValue];
                              return (
                                <td key={colIndex}>
                                  {urls.map((url, idx) => (
                                    <Image
                                      key={idx}
                                      src={url.trim()}
                                      alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                                      width={100}
                                      height={100}
                                    />
                                  ))}
                                </td>
                              );
                            } else {
                              return <td key={colIndex}>{cellValue}</td>;
                            }
                          }
                        })
                        .filter((cell) => cell !== null)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tableData.rows.length > 0 ? (
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleUploadProducts}
            >
              Cargar Productos
            </button>
          ) : null}
        </form>
      </div>
    </Layout>
  );
}
