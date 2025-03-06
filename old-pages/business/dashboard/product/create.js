import styles from "../../../../styles/products.module.scss";
import Layout from "../../../../components/business/layout";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import SingularSelect from "../../../../components/selects/SingularSelect";
import MultipleSelect from "../../../../components/selects/MultipleSelect";
import AdminInput from "../../../../components/inputs/adminInput";
import DialogModal from "../../../../components/dialogModal";
import { useDispatch } from "react-redux";
import { showDialog } from "../../../../store/DialogSlice";
import Images from "../../../../components/business/createproduct/images";
import Colors from "../../../../components/business/createproduct/colors";
import Sizes from "../../../../components/business/createproduct/clickToAdd/Sizes";
import Details from "../../../../components/business/createproduct/clickToAdd/Details";
import { validateCreateProduct } from "../../../../utils/validation";
import dataURItoBlob from "../../../../utils/dataURItoBlob";
import { uploadImages } from "../../../../requests/upload";
import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Style from "../../../../components/business/createproduct/style";

const initialState = {
  company: "",
  name: "",
  description: "",
  brand: "",
  sku: "",
  discount: "",
  images: [],
  description_images: [],
  parent: "",
  category: "",
  subCategories: [],
  color: {
    color: "",
    image: "",
  },
  sizes: [
    {
      size: "",
      qty: "",
      price: "",
      totalCharge: "",
      charge: "",
      extraCharge: "",
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
export default function Create({ parents, categories, user }) {
  const [product, setProduct] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [colorImage, setColorImage] = useState("");
  const [images, setImages] = useState([]);
  const [description_images, setDescription_images] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.user?.id) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        company: user.user.id,
      }));
    }
  }, [user]);

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
      } else {
        return null;
      }
    };
    getParentData();
  }, [product.parent, product]);

  useEffect(() => {
    async function getSubs() {
      const { data } = await axios.get("/api/business/subCategory", {
        params: {
          category: product.category,
        },
      });
      setSubs(data);
    }
    getSubs();
  }, [product?.category]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const validate = Yup.object({
    name: Yup.string()
      .required("Porfavor añade un nombre")
      .min(10, "Nombre del producto debe contener entre 10 y 300 caracteres")
      .max(300, "Nombre del producto debe contener entre 10 y 300 caracteres."),
    brand: Yup.string().required("Porfavor agrega una marca."),
    category: Yup.string().required("Porfavor agrega una categoria."),
    subCategories: Yup.string().required("Porfavor agrega una sub categoria."),
    color: Yup.string().required("Porfavor añade un color"),
    description: Yup.string()
      .required("Porfavor añade una descripción")
      .min(20, "descripción debe contener entre 20 y 300 caracteres")
      .max(300, "descripción debe contener entre 20 y 300 caracteres."),
  });

  const createProduct = async () => {
    let test = validateCreateProduct(product, images);
    if (test === "valid") {
      createProductHandler();
    } else {
      dispatch(
        showDialog({
          header: "Please follow our instructions.",
          msgs: test,
        })
      );
    }
  };
  let uploaded_images = [];
  let style_img = "";
  const createProductHandler = async () => {
    setLoading(true);
    if (images) {
      let temp = images.map((img) => {
        return dataURItoBlob(img);
      });
      const path = "product images";
      let formData = new FormData();
      formData.append("path", path);
      temp.forEach((image) => {
        formData.append("file", image);
      });
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
      const { data } = await axios.post("/api/business/product", {
        ...product,
        images: uploaded_images,
        color: {
          image: style_img,
          color: product.color.color,
        },
      });
      setLoading(false);
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <Layout>
      <Head>
        <title>SaldoManía - Crear Producto</title>
      </Head>
      <div className={styles.header}>Crear Producto</div>

      <Formik
        enableReinitialize
        initialValues={{
          name: product.name,
          brand: product.brand,
          description: product.description,
          category: product.category,
          subCategories: product.subCategories,
          parent: product.parent,
          sku: product.sku,
          discount: product.discount,
          color: product.color.color,
          imageInputFile: "",
          styleInout: "",
        }}
        validationSchema={validate}
        onSubmit={() => {
          createProduct();
        }}
      >
        {(formik) => (
          <Form>
            <Images
              name="imageInputFile"
              header="Imagenes del producto"
              text="Agregar Imagenes"
              images={images}
              setImages={setImages}
              setColorImage={setColorImage}
            />
            <div className={styles.flex}>
              {product.color.image && (
                <Image
                  width={300}
                  height={300}
                  src={product.color.image}
                  className={styles.image_span}
                  alt=""
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
              placeholder="Producto existente"
              data={parents}
              header="Añadir a un producto existente"
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
                header="Selecciona subcategoria"
                handleChange={handleChange}
                disabled={product.parent}
              />
            )}
            <div className={styles.header}>Información Producto</div>
            <AdminInput
              type="text"
              label="Nombre"
              name="name"
              placholder="Nombre del producto"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Descripción"
              name="description"
              placholder="Descripción producto"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Marca"
              name="brand"
              placholder="Marca del producto"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Sku"
              name="sku"
              placholder="Product sku/ number"
              onChange={handleChange}
            />
            <AdminInput
              type="text"
              label="Descuento %"
              name="discount"
              placholder="Descuento del producto"
              onChange={handleChange}
            />
            <Sizes
              sizes={product.sizes}
              product={product}
              setProduct={setProduct}
            />
            <Details
              details={product.details}
              product={product}
              setProduct={setProduct}
            />
            {/* <Questions
              questions={product.questions}
              product={product}
              setProduct={setProduct}
            /> */}
            {/*
            <Images
              name="imageDescInputFile"
              header="Product Description Images"
              text="Add images"
              images={description_images}
              setImages={setDescriptionImages}
              setColorImage={setColorImage}
            />
           
       
          
            */}
            <button
              className={`${styles.btn} ${styles.btn__primary} ${styles.submit_btn}`}
              type="submit"
            >
              Crear Producto
            </button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { req } = ctx;
  db.connectDb();

  const session = await getSession({ req });
  const results = await Product.find().select("name subProducts").lean();
  const categories = await Category.find().lean();
  db.disconnectDb();
  return {
    props: {
      user: {
        user: session?.user,
      },
      parents: JSON.parse(JSON.stringify(results)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
