"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import SingularSelect from "../../../../../components/selects/SingularSelect";
import AdminInput from "../../../../../components/inputs/adminInput";
import Colors from "../../../../../components/business/createproduct/colors";
import Sizes from "../../../../../components/business/createproduct/clickToAdd/Sizes";
import Details from "../../../../../components/business/createproduct/clickToAdd/Details";
import { showDialog } from "../../../../../store/DialogSlice";
import Images from "../../../../../components/business/createproduct/images";
import { validateCreateProduct } from "../../../../../utils/validation";
import dataURItoBlob from "../../../../../utils/dataURItoBlob";
import { uploadImages } from "../../../../../requests/upload";
import Image from "next/image";
import styles from "../../../../../styles/products.module.scss";
import { useDispatch } from "react-redux";
import Style from "../../../../../components/business/createproduct/style";
import Layout from "../../../../../components/business/layout";
import Warranty from "../../../../../components/business/createproduct/clickToAdd/Warranty";
import TextInput from "../../../../../components/inputs/textInput";
import { ClipLoader } from "react-spinners";
import { showCreateProductDialog } from "../../../../../store/createProductDialogSlice";

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
  warranty: [
    {
      number: "",
    },
  ],
  measures: {
    long: "",
    width: "",
    high: "",
    volumetric_weight: "",
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

export default function CreateProductClient({ user, parents, categories }) {
  const [product, setProduct] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [subs2, setSubs2] = useState([]);
  const [subs3, setSubs3] = useState([]);
  const [colorImage, setColorImage] = useState("");
  const [styleImage, setStyleImage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        company: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (images.length > 0) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        color: { ...prevProduct.color, image: images[0] },
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        color: { ...prevProduct.color, image: "" }, // Reset to default or empty value
      }));
    }
  }, [images]);

  useEffect(() => {
    const getParentData = async () => {
      if (product?.parent) {
        try {
          const { data } = await axios.get(`/api/product/${product?.parent}`);
          if (data) {
            setProduct({
              ...product,
              name: data.name,
              description: data.description,
              brand: data.brand,
              category: data.category,
              subCategories: data.subCategories,
              questions: [],
              details: [],
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    getParentData();
  }, [product.parent]);

  useEffect(() => {
    const getSubs = async () => {
      if (product?.category) {
        const { data } = await axios.get("/api/admin/subCategory", {
          params: { category: product.category },
        });
        setSubs(data);
      }
    };
    getSubs();
  }, [product?.category]);

  useEffect(() => {
    const getSubs2 = async () => {
      if (product?.subCategories) {
        const { data } = await axios.get("/api/admin/subCategory2", {
          params: { category: product.subCategories },
        });
        setSubs2(data);
      }
    };
    getSubs2();
  }, [product?.subCategories]);

  useEffect(() => {
    const getSubs3 = async () => {
      if (product?.subCategorie2) {
        const { data } = await axios.get("/api/admin/subCategory3", {
          params: { category: product.subCategorie2 },
        });
        setSubs3(data);
      }
    };
    getSubs3();
  }, [product?.subCategorie2]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Split the name by '.' to handle nested fields
    const nameParts = name.split(".");

    if (nameParts.length === 2) {
      // Nested property (e.g., 'measures.high')
      const [parentKey, childKey] = nameParts;
      setProduct((prevProduct) => ({
        ...prevProduct,
        [parentKey]: {
          ...prevProduct[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      // Regular fields update
      setProduct({ ...product, [name]: value });
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Por favor añade un nombre")
      .min(10, "Nombre del producto debe contener entre 10 y 300 caracteres")
      .max(200, "Nombre del producto debe contener entre 10 y 300 caracteres."),
    // brand: Yup.string().required("Por favor agrega una marca."),
    category: Yup.string().required("Por favor agrega una categoría."),
    subCategories: Yup.string().required("Por favor agrega una subcategoría."),
    color: Yup.string().required("Por favor añade un color"),
    description: Yup.string()
      .required("Por favor añade una descripción")
      .min(20, "Descripción debe contener entre 20 y 300 caracteres")
      .max(2000, "Descripción debe contener entre 20 y 300 caracteres."),
    measures: Yup.object().shape({
      high: Yup.number()
        .required("Por favor ingresa el alto")
        .positive("El alto debe ser un número positivo"),
      width: Yup.number()
        .required("Por favor ingresa el ancho")
        .positive("El ancho debe ser un número positivo"),
      long: Yup.number()
        .required("Por favor ingresa el largo")
        .positive("El largo debe ser un número positivo"),
    }),
    weight: Yup.number()
      .required("Agrega peso del producto")
      .positive("El peso debe ser un número positivo"),
    discount: Yup.number()
      .required("Agrega descuento del producto")
      .min(1, "El descuento debe ser al menos 1%")
      .max(100, "El descuento no puede ser mayor a 100%"),
  });

  const createProductHandler = async () => {
    let test = validateCreateProduct(product, images, subs2, subs3);
    if (test === "valid") {
      setLoading(true);

      let uploaded_images = [];
      let style_img = "";

      if (images.length) {
        let temp = images.map((img) => dataURItoBlob(img));
        const path = "product images";
        let formData = new FormData();
        formData.append("path", path);
        temp.forEach((image) => formData.append("file", image));

        uploaded_images = await uploadImages(formData);
      }

      if (product.color.image) {
        let temp = dataURItoBlob(product.color.image);
        let path = "product style images";
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", temp);
        let cloudinary_style_img = await uploadImages(formData);
        style_img = cloudinary_style_img[0].url;
      }

      try {
        const { data } = await axios.post("/api/admin/product", {
          ...product,
          images: uploaded_images,
          color: { image: style_img, color: product.color.color },
        });

        toast.success("Producto creado con exito!");
        // Refresh the page after 5 seconds
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(
        showCreateProductDialog({
          header: "Porfavor completar información",
          msgs: test,
        })
      );
    }
  };

  return (
    <Layout>
      <div className={styles.header}>Crear Producto</div>
      <Formik
        enableReinitialize
        initialValues={{
          name: product.name,
          brand: product.brand,
          description: product.description,
          category: product.category,
          subCategories: product.subCategories,
          subCategorie2: product.subCategorie2,
          subCategorie3: product.subCategorie3,
          parent: product.parent,
          warranty: product.warranty,
          weight: product.weight,
          sku: product.sku,
          discount: product.discount,
          color: product.color.color,
          universalCode: product.universalCode,
          measures: {
            high: product.measures.high || "",
            width: product.measures.width || "",
            long: product.measures.long || "",
          },
          flashOffer: product.flashOffer,
          flashDiscount: product.flashDiscount,
        }}
        validationSchema={validationSchema}
        onSubmit={() => createProductHandler()}
      >
        {(formik) => (
          <Form>
            <Images
              name="imageInputFile"
              header="Imágenes del producto"
              text="Agregar Imágenes"
              images={images}
              setImages={setImages}
              setColorImage={setColorImage}
              product={product}
              setProduct={setProduct}
              loading="lazy"
            />
            <div className={styles.flex}>
              {product.color.image && (
                <Image
                  width={300}
                  height={300}
                  src={product.color.image}
                  className={styles.image_span}
                  alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                  loading="lazy"
                />
              )}
              {product.color.color && (
                <span
                  className={styles.color_span}
                  style={{ background: `${product.color.color}` }}
                ></span>
              )}
            </div>
            <Colors
              name="color"
              product={product}
              setProduct={setProduct}
              colorImage={colorImage}
            />
            <Style
              name="styleInput"
              product={product}
              setProduct={setProduct}
              colorImage={colorImage}
            />
            <SingularSelect
              name="parent"
              value={product.parent}
              placeholder="Producto existente o dejar vacío"
              data={parents}
              header="Añadir a un producto existente"
              subText="El producto creado se añadirá a un producto existente que selecciones, permitiendo adjuntar variantes como diferentes colores o presentaciones."
              handleChange={handleChange}
            />
            <SingularSelect
              name="category"
              value={product.category}
              placeholder="Categoría producto"
              data={categories}
              header="Selecciona una categoría"
              handleChange={handleChange}
              disabled={product.parent}
            />
            {product.category && (
              <SingularSelect
                name="subCategories"
                value={product.subCategories}
                placeholder="SubCategoría del producto"
                data={subs}
                header="Selecciona subcategoría"
                handleChange={handleChange}
                disabled={product.parent}
              />
            )}
            {product.subCategories && subs2.length > 0 && (
              <SingularSelect
                name="subCategorie2"
                value={product.subCategorie2}
                placeholder="SubCategoría 2 del producto"
                data={subs2}
                header="Selecciona subcategoría #2"
                handleChange={handleChange}
                disabled={product.parent}
              />
            )}
            {product.subCategorie2 && subs3.length > 0 && (
              <SingularSelect
                name="subCategorie3"
                value={product.subCategorie3}
                placeholder="SubCategoría 3 del producto"
                data={subs3}
                header="Selecciona subcategoría #3"
                handleChange={handleChange}
                disabled={product.parent}
              />
            )}
            <div className={styles.header}>Información Producto</div>
            <TextInput
              type="text"
              label="Nombre"
              name="name"
              placeholder="Nombre del producto"
              onChange={handleChange}
            />
            <TextInput
              type="text"
              label="Descripción"
              name="description"
              placeholder="Descripción producto"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Marca"
              name="brand"
              placeholder="Marca del producto"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Sku"
              name="sku"
              placeholder="Código sku/ number"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="cód barras"
              name="universalCode"
              placeholder="Codigo Universal o Barras"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Descuento %"
              name="discount"
              placeholder="Descuento del producto"
              onChange={handleChange}
            />

            <div className={styles.header}>Participar en Oferta Relampago</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <label
                htmlFor="flashOfferYes"
                style={product.flashOffer === "yes" ? { color: "blue" } : null}
              >
                Sí
              </label>
              <input
                type="radio"
                name="flashOffer"
                value="yes"
                id="flashOfferYes"
                onChange={handleChange}
                checked={product.flashOffer === "yes"}
              />
              <label
                htmlFor="flashOfferNo"
                style={product.flashOffer === "no" ? { color: "blue" } : null}
              >
                No
              </label>
              <input
                type="radio"
                name="flashOffer"
                value="no"
                id="flashOfferNo"
                onChange={handleChange}
                checked={product.flashOffer === "no"}
              />
            </div>
            <AdminInput
              type="number"
              label="% Flash"
              name="flashDiscount"
              placeholder="Descuento en oferta relampago"
              onChange={handleChange}
            />

            <div className={styles.header}>Medidas Producto Empacado</div>
            <AdminInput
              type="number"
              label="Alto"
              name="measures.high"
              placeholder="Ingresa el alto en cm"
              onChange={handleChange}
              value={formik.values.measures.high}
            />
            <AdminInput
              type="number"
              label="Ancho"
              name="measures.width"
              placeholder="Ingresa ancho en cm"
              onChange={handleChange}
              value={formik.values.measures.width}
            />
            <AdminInput
              type="number"
              label="Largo"
              name="measures.long"
              placeholder="Ingresa largo en cm"
              onChange={handleChange}
              value={formik.values.measures.long}
            />
            <AdminInput
              type="number"
              label="Peso en Kg"
              name="weight"
              placeholder="Ingresa peso en kg"
              onChange={handleChange}
            />
            <div className={styles.header}>
              Genero Producto / Seleccionar si tiene
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <label
                htmlFor="genderMale"
                style={product.gender === "Hombre" ? { color: "blue" } : null}
              >
                Hombre
              </label>
              <input
                type="radio"
                name="gender"
                value="Hombre"
                id="genderMale"
                onChange={handleChange}
                checked={product.gender === "Hombre"}
              />
              <label
                htmlFor="genderFemale"
                style={product.gender === "Mujer" ? { color: "blue" } : null}
              >
                Mujer
              </label>
              <input
                type="radio"
                name="gender"
                value="Mujer"
                id="genderFemale"
                onChange={handleChange}
                checked={product.gender === "Mujer"}
              />
              <label
                htmlFor="genderUnisex"
                style={
                  product.gender === "Sin género" ? { color: "blue" } : null
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
                checked={product.gender === "Sin género"}
              />
            </div>

            <Sizes
              sizes={product.sizes}
              product={product}
              setProduct={setProduct}
            />
            {/* <Details
              details={product.details}
              product={product}
              setProduct={setProduct}
            /> */}
            <Warranty
              sizes={product.warranty}
              product={product}
              setProduct={setProduct}
            />

            <button
              className={`${styles.btn} ${styles.btn__primary} ${styles.submit_btn}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader loading={loading} color="white" size={40} />
              ) : (
                "Crear Producto"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
