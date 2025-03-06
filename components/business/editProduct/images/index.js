import { ErrorMessage, useField } from "formik";
import { useRef } from "react";
import { FaStaylinked } from "react-icons/fa";
import { RiDeleteBin7Fill, RiShape2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { showDialog } from "../../../../store/DialogSlice";
import styles from "./styles.module.scss";
import { FaRegImages } from "react-icons/fa";
import Image from "next/image";
import { MdAddToPhotos } from "react-icons/md";
export default function Images({
  images,
  setImages,
  header,
  text,
  name,
  setColorImage,
  setProduct,
  product,
  index,
  ...props
}) {
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [meta, field] = useField(props);

  const handleImages = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img, i) => {
      if (images.length === 6) {
        dispatch(
          showDialog({
            header: "Maximo 6 imagenes por producto.",
            msgs: [
              {
                msg: `Maximo 6 imagenes por producto esta permitido.`,
                type: "error",
              },
            ],
          })
        );
        return;
      }
      if (
        img.type !== "image/jpeg" &&
        img.type !== "image/png" &&
        img.type !== "image/webp"
      ) {
        dispatch(
          showDialog({
            header: "Formato de imagen no soportado.",
            msgs: [
              {
                msg: `${img.name} el formato de imagen no es soportado ! solo JPEG,PNG,WEBP son permitidos.`,
                type: "error",
              },
            ],
          })
        );
        files = files.filter((item) => item !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 10) {
        dispatch(
          showDialog({
            header: "Tamaño de imagen no soportado.",
            msgs: [
              {
                msg: `${img.name} el tamaño de la imagen es demasiado grande, el máximo permitido es de 10mb.`,
                type: "error",
              },
            ],
          })
        );
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (e) => {
          setImages((images) => [...images, e.target.result]);
        };
      }
    });
  };

  const handleRemove = (image) => {
    setImages((images) => images.filter((item) => item !== image));
  };

  const handleSetAsCover = (event, index) => {
    event.preventDefault(); // Invocación correcta
    if (index === 0) return; // Ya es la portada
    const newImages = [...images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    setImages(newImages);
    setColorImage(selectedImage);
    // Opcional: Actualizar otros estados relacionados si es necesario
    setProduct((prevProduct) => ({
      ...prevProduct,
      color: { ...prevProduct.color, image: selectedImage },
    }));
  };

  return (
    <div className={styles.images}>
      <div
        className={`${styles.header} ${meta.error ? styles.header__error : ""}`}
      >
        <div className={styles.flex}>
          {meta.error && (
            <Image
              width={100}
              height={100}
              src="../../../images/warning.png"
              alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
              loading="lazy"
            />
          )}
          {header}
        </div>
        <span>
          {meta.touched && meta.error && (
            <div className={styles.error__msg}>
              <span></span>
              <ErrorMessage name={name} />
            </div>
          )}
        </span>
      </div>
      <input
        type="file"
        name={name}
        ref={fileInput}
        hidden
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImages}
      />
      <div className={styles.images__main}>
        <div
          className={`${styles.images__main_grid} ${
            images.length === 2
              ? styles.grid__two
              : images.length === 3
              ? styles.grid__three
              : images.length === 4
              ? styles.grid__foor
              : images.length === 5
              ? styles.grid__five
              : images.length === 6
              ? styles.grid__six
              : ""
          }`}
        >
          {!images.length ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <MdAddToPhotos />
              <span>Añade imagenes del producto</span>
            </div>
          ) : (
            images.map((img, i) => (
              <div className={styles.images__main_grid_wrap} key={i}>
                <div className={styles.blur}></div>
                <Image
                  width={200}
                  height={200}
                  src={img?.url || img}
                  alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                  loading="lazy"
                />
                <div className={styles.images__main_grid_actions}>
                  <div>
                    <button type="button" onClick={() => handleRemove(img)}>
                      <RiDeleteBin7Fill />
                    </button>
                    <span style={{ color: "orangered", fontWeight: "bold" }}>
                      Borrar
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={(event) => handleSetAsCover(event, i)}
                    >
                      <FaRegImages />
                    </button>
                    <span>Seleccionar como Portada</span>
                  </div>

                  {/* <button>
                    <RiShape2Line />
                  </button> */}
                </div>
                {i === 0 ? (
                  <div
                    style={{
                      background: "yellowgreen",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "5px",
                      marginBottom: "14px",
                      width: "fit-content",
                      padding: "3px 5px",
                      position: "absolute",
                      top: "14px",
                    }}
                  >
                    <span>Portada</span>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
      <button
        type="reset"
        disabled={images.length === 6 || product.subProducts[index]?.sold}
        style={{ opacity: `${images.length == 6 && "0.5"}` }}
        onClick={() => fileInput.current.click()}
        className={`${styles.btn} ${styles.btn__primary}`}
      >
        {text}
      </button>
    </div>
  );
}
