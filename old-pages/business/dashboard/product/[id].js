import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AdminInput from "../../../../components/inputs/adminInput";
import Layout from "../../../../components/business/layout";
import styles from "../../../../styles/products.module.scss";
import { uploadImages } from "../../../../requests/upload";
import { dataURItoBlob } from "../../../../utils/dataURItoBlob";
import { toast } from "react-toastify";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import Category from "../../../../models/Category";
import Head from "next/head";
import SubCategory from "../../../../models/SubCategory";
import Details from "../../../../components/business/createproduct/clickToAdd/Details";
import UpdateSizes from "../../../../components/business/editProduct/UpdateSizes";
import Image from "next/image";
import { useSession } from "next-auth/react";

const EditProduct = ({ product, index }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [subs, setSubs] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  // actualizar la funcion para que solo pueda actualizar el producto el dueño del mismo, pasando el id

  useEffect(() => {
    async function getSubs() {
      if (editedProduct.category) {
        const { data } = await axios.get("/api/business/subCategory", {
          params: {
            category: editedProduct.category,
          },
        });
        setSubs(data);
      }
    }
    getSubs();
  }, [editedProduct?.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  //   const handleSubProductChange = (e) => {
  //     const { name, value } = e.target;

  //     setEditedProduct((prevProduct) => ({
  //       ...prevProduct,
  //       subProducts: prevProduct.subProducts.map((subProduct, index) =>
  //         index === 0
  //           ? {
  //               ...subProduct,
  //               [name]: value === "" ? "" : value, // Handle empty value
  //             }
  //           : subProduct
  //       ),
  //     }));
  //   };

  const handleSubProductChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => {
      const newSubProducts = [...prevProduct.subProducts];
      let selectedSubProduct = { ...newSubProducts[index] };

      selectedSubProduct = {
        ...selectedSubProduct,
        [name]: value === "" ? "" : value,
      };

      newSubProducts[index] = selectedSubProduct;

      return {
        ...prevProduct,
        subProducts: newSubProducts,
      };
    });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please provide a product name"),
    discount: Yup.number()
      .min(0, "Discount must be at least 0")
      .max(100, "Discount cannot exceed 100%") // Limit to 100%
      .nullable(), // Allow discount to be empty
  });

  const updateProductHandler = async () => {
    try {
      const { data } = await axios.put(`/api/business/product/updateProduct`, {
        ...editedProduct,
      });
      toast.success("Producto actualizado con exito");
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>SaldoManía - Edita Producto</title>
      </Head>
      <div className={styles.header}>Editar Producto</div>
      <div
        className={styles.productImage}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h3>Imagen de producto</h3>
        <Image
          width={200}
          height={200}
          src={product.subProducts[index]?.images[0].url}
          alt=""
        />
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          ...editedProduct,
          discount: editedProduct?.subProducts[index]?.discount || "", // Add discount here
          sku: editedProduct.subProducts[index].sku || "",
        }}
        validationSchema={validationSchema}
        onSubmit={updateProductHandler}
      >
        {() => (
          <Form>
            <AdminInput
              type="number"
              label="Sku"
              name="sku"
              placholder="Product sku/ number"
              onChange={handleSubProductChange}
            />
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
              type="number"
              label="Descuento"
              name="discount"
              placholder="Descuento del producto"
              onChange={handleSubProductChange}
              max="100" // Set max to 100
            />
            <UpdateSizes
              sizes={editedProduct.subProducts[index].sizes}
              product={editedProduct}
              setProduct={setEditedProduct}
              index={index}
            />
            <Details
              details={editedProduct.details}
              product={editedProduct}
              setProduct={setEditedProduct}
            />

            <button type="submit" className={styles.submit_btn}>
              Actualizar Producto
            </button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const { index } = ctx.query;
  // Fetch the product to be edited using its ID
  await db.connectDb();
  let product = await Product.findOne({ _id: id })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    .lean();
  const categories = await Category.find().lean();
  await db.disconnectDb();
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      categories: JSON.parse(JSON.stringify(categories)),
      index: JSON.parse(JSON.stringify(index)),
    },
  };
}

export default EditProduct;
