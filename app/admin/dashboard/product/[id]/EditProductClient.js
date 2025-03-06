"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import AdminInput from "../../../../../components/inputs/adminInput";
import styles from "../../../../../styles/products.module.scss";
import { toast } from "react-toastify";
import UpdateSizes from "../../../../../components/business/editProduct/UpdateSizes";
import Details from "../../../../../components/business/createproduct/clickToAdd/Details";
import Image from "next/image";
import { useSession } from "next-auth/react";
import TextInput from "../../../../../components/inputs/textInput";
import Colors from "../../../../../components/business/createproduct/colors";
import UpdateProductColors from "../../../../../components/business/createproduct/updateProductColor";
import { validateEditProduct } from "../../../../../utils/validationEditProduct";
import { useDispatch } from "react-redux";
import { showCreateProductDialog } from "../../../../../store/createProductDialogSlice";
import Layout from "../../../../../components/admin/layout";
import Images from "../../../../../components/business/editProduct/images";
import dataURItoBlob from "../../../../../utils/dataURItoBlob";
import { uploadImages } from "../../../../../requests/upload";
import SingularSelect from "../../../../../components/selects/SingularSelect";

const EditProductClient = ({ product, categories, index }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [colorImage, setColorImage] = useState("");
  const [subs, setSubs] = useState([]);
  const [subs2, setSubs2] = useState([]);
  const [subs3, setSubs3] = useState([]);
  const [shippingCost, setShippingCost] = useState("");
  const [sobreflete, setSobreflete] = useState(500);
  const [sobrefleteFlash, setSobrefleteFlash] = useState(500);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (editedProduct.subProducts[index]?.images?.length > 0) {
      setImages(editedProduct.subProducts[index].images);
    }
  }, [editedProduct.subProducts[index]?.images]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Split the name by '.' to handle nested fields
    const nameParts = name.split(".");

    if (nameParts.length === 2) {
      // Nested property (e.g., 'measures.high')
      const [parentKey, childKey] = nameParts;

      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        [parentKey]: {
          ...prevProduct[parentKey],
          [childKey]: value,
        },
      }));
    } else if (name === "category") {
      setEditedProduct({
        ...editedProduct,
        subCategories: "",
        subCategorie2: "",
        subCategorie3: "",
        [name]: value,
      });
    } else if (name === "subCategories") {
      setEditedProduct({
        ...editedProduct,
        subCategorie2: "",
        subCategorie3: "",
        [name]: value,
      });
    } else if (name === "subCategorie2") {
      setEditedProduct({
        ...editedProduct,
        subCategorie3: "",
        [name]: value,
      });
    } else {
      // Regular fields update
      setEditedProduct({ ...editedProduct, [name]: value });
    }
  };

  const handleSubProductChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setEditedProduct((prevProduct) => {
      const newSubProducts = [...prevProduct.subProducts];
      let selectedSubProduct = { ...newSubProducts[index] };

      if (name.includes(".")) {
        // e.g., name = "measures.high"
        const [parentKey, childKey] = name.split(".");
        selectedSubProduct = {
          ...selectedSubProduct,
          [parentKey]: {
            // keep everything else in measures
            ...selectedSubProduct[parentKey],
            [childKey]: value,
          },
        };
      } else {
        // normal top-level subProduct field
        selectedSubProduct = {
          ...selectedSubProduct,
          [name]: value === "" ? "" : value,
        };
      }

      // Reset flashDiscount if flashOffer is set to "No"
      if (name === "flashOffer" && value === "No") {
        selectedSubProduct.flashDiscount = "";
        // Optionally reset related state variables
        setSobrefleteFlash(500); // or another default value if needed
      }

      newSubProducts[index] = selectedSubProduct;

      return {
        ...prevProduct,
        subProducts: newSubProducts,
      };
    });
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Por favor añade un nombre")
      .min(3, "Nombre del producto debe contener entre 3 y 300 caracteres")
      .max(200, "Nombre del producto debe contener entre 3 y 300 caracteres."),
    // discount: Yup.number()
    //   .required("Agrega descuento del producto")
    //   .min(1, "El descuento debe ser al menos 1%")
    //   .max(100, "El descuento no puede ser mayor a 100%"),
    variant: Yup.string()
      .required("Por favor añade nombre de la variante")
      .min(4, "Nombre del producto debe contener entre 4 y 50 caracteres"),
    description: Yup.string()
      .required("Por favor añade una descripción")
      .min(20, "Descripción debe contener entre 20 y 300 caracteres")
      .max(2000, "Descripción debe contener entre 20 y 300 caracteres."),
    // measures: Yup.object().shape({
    //   high: Yup.number()
    //     .required("Por favor ingresa el alto")
    //     .positive("El alto debe ser un número positivo"),
    //   width: Yup.number()
    //     .required("Por favor ingresa el ancho")
    //     .positive("El ancho debe ser un número positivo"),
    //   long: Yup.number()
    //     .required("Por favor ingresa el largo")
    //     .positive("El largo debe ser un número positivo"),
    // }),
    // weight: Yup.number()
    //   .required("Agrega peso del producto")
    //   .min(0, "El peso debe ser un número positivo o cero")
    //   .test(
    //     "is-decimal",
    //     "El peso debe ser un número entero o tener un decimal (e.g., 0, 0.5)",
    //     (value) => {
    //       if (value === undefined || value === null) return false;
    //       return /^(\d+(\.\d)?|\.\d)$/.test(value.toString());
    //     }
    //   ),
    // discount: Yup.number()
    //   .required("Agrega descuento del producto")
    //   .min(1, "El descuento debe ser al menos 1%")
    //   .max(100, "El descuento no puede ser mayor a 100%"),
    gender: Yup.string().required("Por favor selecciona un género"),
  });

  const updateProductHandler = async () => {
    let test = validateEditProduct(editedProduct, shippingCost, sobreflete);

    if (test === "valid") {
      setLoading(true); // now this makes sense

      let uploaded_images = [];
      let style_img = "";

      const existingImages = images.filter(
        (img) => typeof img === "object" && img.url
      );
      const newBase64Images = images.filter(
        (img) => typeof img === "string" && img.startsWith("data:image")
      );

      if (newBase64Images.length > 0) {
        const formData = new FormData();
        formData.append("path", "product images"); // or another path if you prefer
        newBase64Images.forEach((base64) => {
          const blob = dataURItoBlob(base64);
          formData.append("file", blob);
        });

        // Use your uploadImages function to send to Cloudinary
        uploaded_images = await uploadImages(formData);
      }

      // 1) Merge existing + newly uploaded images
      const finalImages = [...existingImages, ...uploaded_images];

      // 5) Handle style image if you have one and it might be base64
      let styleImage = editedProduct.subProducts[index]?.color?.image;
      if (
        styleImage &&
        typeof styleImage === "string" &&
        styleImage.startsWith("data:image")
      ) {
        const styleFormData = new FormData();
        styleFormData.append("path", "product style images");
        styleFormData.append("file", dataURItoBlob(styleImage));

        let styleUploadResult = await uploadImages(styleFormData);
        styleImage = styleUploadResult[0]?.url; // Grab the Cloudinary URL
      }

      // 2) Assign `finalImages` to the correct subProduct index
      const newSubProducts = [...editedProduct.subProducts];
      newSubProducts[index] = {
        ...newSubProducts[index],
        images: finalImages,
        color: {
          ...newSubProducts[index].color,
          image: styleImage || newSubProducts[index].color?.image,
        },
      };

      // 3) Update your main product object
      const finalEditedProduct = {
        ...editedProduct,
        subProducts: newSubProducts,
      };

      try {
        const { data } = await axios.put("/api/admin/product/updateProduct", {
          ...finalEditedProduct,
        });
        toast.success("Producto actualizado con éxito");
        router.push("/admin/dashboard/product/all");
      } catch (error) {
        toast.error("Error al actualizar el producto.");
      } finally {
        setLoading(false);
      }
    } else {
      // 'test' is an array with error messages. For example:
      test.forEach((item) => {
        if (item.type === "error") {
          toast.error(item.msg);
        }
      });
    }
  };

  const handleBack = () => {
    // Safely check if there is a previous history
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Fallback if no history entry
      router.push("/business/dashboard/product/all");
    }
  };

  useEffect(() => {
    const test = [
      {
        msg: "Este Producto ha sido vendido, por consiguiente solo se puede editar el stock, precio al por mayor y precio al detal.",
        type: "error",
      },
    ];
    editedProduct.subProducts[index]?.sold
      ? dispatch(
          showCreateProductDialog({
            header: "Advertencia Edición Producto Vendido",
            msgs: test,
          })
        )
      : null;
  }, []);

  useEffect(() => {
    const getSubs = async () => {
      if (editedProduct?.category) {
        const { data } = await axios.get("/api/admin/subCategory", {
          params: { category: editedProduct?.category },
        });
        setSubs(data);
      }
    };
    getSubs();
  }, [editedProduct?.category]);

  useEffect(() => {
    const getSubs2 = async () => {
      if (editedProduct?.subCategories) {
        const { data } = await axios.get("/api/admin/subCategory2", {
          params: {
            category: Array.isArray(editedProduct?.subCategories)
              ? editedProduct?.subCategories[0]
              : editedProduct?.subCategories,
          },
        });
        setSubs2(data);
      }
    };
    getSubs2();
  }, [editedProduct?.subCategories]);

  useEffect(() => {
    const getSubs3 = async () => {
      if (editedProduct?.subCategorie2) {
        const { data } = await axios.get("/api/admin/subCategory3", {
          params: {
            category: Array.isArray(editedProduct?.subCategorie2)
              ? editedProduct?.subCategorie2[0]
              : editedProduct?.subCategorie2,
          },
        });
        setSubs3(data);
      }
    };
    getSubs3();
  }, [editedProduct?.subCategorie2]);

  return (
    <Layout>
      <div className={styles.header}>
        Editar Producto{" "}
        <p style={{ fontSize: "14px" }}>
          ID: #{editedProduct?.subProducts[index]?._id}
        </p>
      </div>
      {/* <div
        className={styles.productImage}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h3>Imagenes de producto</h3>
        <div
          style={{
            display: "flex",
            gap: "5px",
            flexDirection: "row",
          }}
        >
          {product.subProducts[index]?.images.map((image, index) => (
            <Image
              width={200}
              height={200}
              src={image.url}
              alt="Product Image"
              key={index}
              loading="lazy"
            />
          ))}
        </div>
      </div> */}
      <Formik
        enableReinitialize
        initialValues={{
          name: editedProduct.name || "",
          description: editedProduct.description || "",
          discount: editedProduct?.subProducts[index]?.discount || "",
          sku: editedProduct.subProducts[index]?.sku || "",
          measures: {
            high: editedProduct.subProducts[index]?.measures?.high || "",
            width: editedProduct.subProducts[index]?.measures?.width || "",
            long: editedProduct.subProducts[index]?.measures?.long || "",
          },
          category: editedProduct?.category || "",
          subCategories:
            editedProduct?.subCategories?.length > 0 &&
            typeof editedProduct.subCategories[0] === "object" &&
            Array.isArray(editedProduct.subCategories[0])
              ? editedProduct.subCategories[0]
              : editedProduct?.subCategories || "",
          subCategorie2:
            editedProduct?.subCategorie2?.length > 0 &&
            typeof editedProduct.subCategorie2[0] === "object" &&
            Array.isArray(editedProduct.subCategorie2[0])
              ? editedProduct.subCategorie2[0]
              : editedProduct?.subCategorie2 || "",
          subCategorie3:
            editedProduct?.subCategorie3?.length > 0 &&
            typeof editedProduct.subCategorie3[0] === "object" &&
            Array.isArray(editedProduct.subCategorie3[0])
              ? editedProduct.subCategorie3[0]
              : editedProduct?.subCategorie3 || "",
          gender: editedProduct.subProducts[index]?.gender || "",
          warranty: editedProduct.subProducts[index]?.warranty || "",
          weight: editedProduct.subProducts[index]?.weight || "",
          flashOffer: editedProduct.subProducts[index]?.flashOffer || "",
          flashDiscount: editedProduct.subProducts[index]?.flashDiscount || "",
          brand: editedProduct.brand,
          variant: editedProduct?.subProducts[index]?.variant,
          sku: editedProduct.subProducts[index]?.sizes[index]?.sku,
          // Add other initial values as needed
        }}
        validationSchema={validationSchema}
        onSubmit={updateProductHandler}
      >
        {() => (
          <Form>
            <Images
              name="imageInputFile"
              header="*Imágenes del producto"
              text="Agregar Imágenes"
              images={images}
              setImages={setImages}
              setColorImage={setColorImage}
              product={product}
              setProduct={setEditedProduct}
              loading="lazy"
              index={index}
            />
            <div className={styles.flex}>
              {editedProduct.subProducts[index]?.color?.image && (
                <Image
                  width={300}
                  height={300}
                  src={editedProduct.subProducts[index]?.color?.image}
                  className={styles.image_span}
                  alt=""
                  loading="lazy"
                />
              )}
              {editedProduct.subProducts[index]?.color?.color && (
                <span
                  className={styles.color_span}
                  style={{
                    background: `${editedProduct.subProducts[index]?.color?.color}`,
                  }}
                ></span>
              )}
            </div>
            <UpdateProductColors
              index={index} // pass the index of the subproduct you’re editing
              name={`subProducts.${index}.color.color`}
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <SingularSelect
              name="category"
              placeholder="*Categoría producto"
              data={categories}
              header="*Selecciona una categoría"
              handleChange={handleChange}
            />
            {editedProduct?.category && (
              <SingularSelect
                name="subCategories"
                placeholder="*SubCategoría del producto"
                data={subs}
                header="*Selecciona subcategoría"
                handleChange={handleChange}
              />
            )}
            {editedProduct?.subCategories && subs2.length > 0 && (
              <SingularSelect
                name="subCategorie2"
                placeholder="*SubCategoría 2 del producto"
                data={subs2}
                header="*Selecciona subcategoría #2"
                handleChange={handleChange}
              />
            )}
            {editedProduct.subCategorie2 && subs3.length > 0 && (
              <SingularSelect
                name="subCategorie3"
                placeholder="*SubCategoría 3 del producto"
                data={subs3}
                header="*Selecciona subcategoría #3"
                handleChange={handleChange}
              />
            )}
            <div className={styles.header}>*Información Producto</div>
            <TextInput
              type="text"
              label="*Nombre"
              name="name"
              placeholder="Nombre del producto"
              onChange={handleChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <TextInput
              type="text"
              label="*Descripción"
              name="description"
              placeholder="Descripción producto"
              onChange={handleChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <AdminInput
              type="text"
              label="*Variante"
              name="variant"
              placeholder="Ej: (Fragancia: Sándalo), (Sabor: Frambuesa), o (Cantidad: Paquete de 2 unidades)"
              onChange={handleSubProductChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <AdminInput
              type="text"
              label="Marca"
              name="brand"
              placeholder="Marca del producto"
              onChange={handleChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <AdminInput
              type="number"
              label="Descuento"
              name="discount"
              placeholder="Descuento del producto"
              onChange={handleSubProductChange}
              max="100"
              disabled={editedProduct.subProducts[index]?.sold}
            />

            <div className={styles.header}>*Participar en Oferta Relampago</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <label
                htmlFor="flashOfferYes"
                style={
                  editedProduct.subProducts[index]?.flashOffer === "Si"
                    ? { color: "blue" }
                    : null
                }
              >
                Sí
              </label>
              <input
                type="radio"
                name="flashOffer"
                value="Si"
                id="flashOfferYes"
                onChange={handleSubProductChange}
                checked={editedProduct.subProducts[index]?.flashOffer === "Si"}
                disabled={editedProduct.subProducts[index]?.sold}
              />
              <label
                htmlFor="flashOfferNo"
                style={
                  editedProduct.subProducts[index]?.flashOffer === "No"
                    ? { color: "blue" }
                    : null
                }
              >
                No
              </label>
              <input
                type="radio"
                name="flashOffer"
                value="No"
                id="flashOfferNo"
                onChange={handleSubProductChange}
                checked={editedProduct.subProducts[index]?.flashOffer === "No"}
                disabled={editedProduct.subProducts[index]?.sold}
              />
            </div>
            <AdminInput
              type="number"
              label="% Flash"
              name="flashDiscount"
              placeholder="Descuento en oferta relampago"
              onChange={handleSubProductChange}
              disabled={
                editedProduct.subProducts[index]?.sold ||
                editedProduct.subProducts[index]?.flashOffer === "No"
              }
            />

            <div className={styles.header}>*Medidas Producto Empacado</div>

            <AdminInput
              type="number"
              label="*Alto"
              name="measures.high"
              placeholder="Ingresa el alto en cm"
              onChange={handleSubProductChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <AdminInput
              type="number"
              label="*Ancho"
              name="measures.width"
              placeholder="Ingresa ancho en cm"
              onChange={handleSubProductChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <AdminInput
              type="number"
              label="*Largo"
              name="measures.long"
              placeholder="Ingresa largo en cm"
              onChange={handleSubProductChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <AdminInput
              type="number"
              label="*Peso en Kg"
              name="weight"
              placeholder="Ingresa peso en kg"
              onChange={handleSubProductChange}
              disabled={editedProduct.subProducts[index]?.sold}
            />
            <div className={styles.header}>
              * Genero Producto / Seleccionar si tiene
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <label
                htmlFor="genderMale"
                style={
                  editedProduct?.subProducts[index]?.gender === "Masculino"
                    ? { color: "blue" }
                    : null
                }
              >
                Masculino
              </label>
              <input
                type="radio"
                name="gender"
                value="Masculino"
                id="genderMale"
                onChange={handleSubProductChange}
                checked={
                  editedProduct?.subProducts[index]?.gender === "Masculino"
                }
                disabled={editedProduct.subProducts[index]?.sold}
              />
              <label
                htmlFor="genderFemale"
                style={
                  editedProduct?.subProducts[index]?.gender === "Femenino"
                    ? { color: "blue" }
                    : null
                }
              >
                Femenino
              </label>
              <input
                type="radio"
                name="gender"
                value="Femenino"
                id="genderFemale"
                onChange={handleSubProductChange}
                checked={
                  editedProduct?.subProducts[index]?.gender === "Femenino"
                }
                disabled={editedProduct.subProducts[index]?.sold}
              />
              <label
                htmlFor="genderUnisex"
                style={
                  editedProduct?.subProducts[index]?.gender === "Sin género"
                    ? { color: "blue" }
                    : null
                }
              >
                Sin género
              </label>
              <input
                type="radio"
                name="gender"
                value="Sin género"
                id="genderUnisex"
                onChange={handleChange}
                checked={
                  editedProduct?.subProducts[index]?.gender === "Sin género"
                }
                disabled={editedProduct.subProducts[index]?.sold}
              />
            </div>

            <UpdateSizes
              sizes={editedProduct?.subProducts[index]?.sizes}
              product={editedProduct}
              setProduct={setEditedProduct}
              index={index}
              shippingCost={shippingCost}
              setShippingCost={setShippingCost}
              sobreflete={sobreflete}
              setSobreflete={setSobreflete}
              sobrefleteFlash={sobrefleteFlash}
              setSobrefleteFlash={setSobrefleteFlash}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                className={styles.submit_btn}
                disabled={loading}
              >
                Actualizar Producto
              </button>
              <button
                type="button"
                className={styles.cancel_btn}
                onClick={handleBack}
              >
                Volver
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditProductClient;
