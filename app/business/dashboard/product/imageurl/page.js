"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Layout from "../../../../../components/business/layout";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import styles from "../../../../../styles/imageurl.module.scss";
import { ClipLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { uploadImages } from "../../../../../requests/upload";
import Modal from "react-modal"; // Import React Modal
import zIndex from "@mui/material/styles/zIndex";

function PhotoGroup({
  group,
  updateGroupFiles,
  removeFile,
  handleNameChange,
  handleSetGroupImagesUrls,
  toggleOpenPhotos,
}) {
  const maxFileSize = 300 * 1024 * 1024;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const imageSizeValidator = (file) => {
    if (file.size > maxFileSize) {
      return {
        code: "name-too-large",
        message: `Image size exceeds the maximum allowed size of 300MB.`,
      };
    }
    return null;
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setLoading(true);
      const uploadedUrls = await uploadImagesToServer(acceptedFiles);
      updateGroupFiles(group.id, uploadedUrls, acceptedFiles);
      setLoading(false);
    },
    [group.id, updateGroupFiles]
  );

  const uploadImagesToServer = async (images) => {
    const formData = new FormData();
    const path = "product_images";
    formData.append("path", path);
    images.forEach((image) => formData.append("file", image));
    const uploaded_images = await uploadImages(formData);
    return uploaded_images;
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: "image/*",
      multiple: true,
      validator: imageSizeValidator,
    });

  return (
    <div key={group.id} className={styles.group_container}>
      <div className={styles.group_header}>
        <div onClick={() => toggleOpenPhotos(group.id)}>
          {group.openPhotos ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        <span
          style={{
            height: "50px",
            width: "50px",
            backgroundColor: "lightgray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {group.files.length}
        </span>

        {isEditing ? (
          <input
            type="text"
            value={group.name}
            onChange={(e) => handleNameChange(e, group.id)}
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <span onClick={() => setIsEditing(true)}>{group.name}</span>
        )}

        <FaRegEdit onClick={() => setIsEditing((prev) => !prev)} />
        <button
          onClick={() =>
            group.files.length >= 1 ? handleSetGroupImagesUrls(group) : null
          }
          style={
            group.files.length >= 1
              ? { background: "blue", color: "white" }
              : null
          }
        >
          Copiar URLs del grupo
        </button>
        <MdOutlineDeleteForever
          onClick={() => removeFile(null, group.id, true)}
          style={{ cursor: "pointer", color: "red", fontSize: "24px" }}
        />
      </div>

      {group.openPhotos && (
        <div className={styles.dropzone_container}>
          {group.files.length < 1 && !loading ? (
            <div {...getRootProps()} className={styles.dropzone}>
              <input {...getInputProps()} />
              <p>
                Arrastra y suelta las imágenes aquí o haz clic para seleccionar
                archivos.
              </p>
              <FaPlus size={24} />
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <ClipLoader loading={loading} color="green" size={50} />
            </div>
          )}

          {group.files.length >= 1 && (
            <div className={styles.preview_container}>
              {group.files.length >= 1 ? (
                <div className={styles.dropzone_mini}>
                  <div {...getRootProps({ className: styles.mini_dropzone })}>
                    <input {...getInputProps()} />
                    <FaPlus size={24} />
                    <span>Añadir</span>
                  </div>
                </div>
              ) : null}
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={0}
                slidesPerView={4}
                className={styles.swiper_container}
              >
                {group.files.map((file) => (
                  <SwiperSlide key={file.name}>
                    <div className={styles.preview_item}>
                      <img src={file.preview.url} alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco" />
                      <div className={styles.preview_info}>
                        <button onClick={() => removeFile(file.name, group.id)}>
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImageURL() {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const addGroup = () => {
    setIsModalOpen(true);
  };

  const handleCreateGroup = () => {
    setGroups((prevGroups) => [
      ...prevGroups,
      {
        id: Date.now(),
        files: [],
        name: newGroupName || "Nuevo Grupo",
        openPhotos: true,
      },
    ]);
    setIsModalOpen(false);
    setNewGroupName("");
  };

  const updateGroupFiles = (groupId, uploadedUrls, acceptedFiles) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              files: [
                ...group.files,
                ...uploadedUrls.map((url, index) => ({
                  name: acceptedFiles[index].name,
                  preview: url,
                })),
              ],
            }
          : group
      )
    );
  };

  const handleNameChange = (e, groupId) => {
    const newName = e.target.value;
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, name: newName } : group
      )
    );
  };

  const handleSetGroupImagesUrls = (group) => {
    const urlsString = group.files.map((file) => file.preview.url).join(",");
    navigator.clipboard
      .writeText(urlsString)
      .then(() => {
        alert("URLs copiadas, ahora pégalas en el archivo excel!");
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  const removeFile = (fileName, groupId, removeAll = false) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          if (removeAll) {
            return { ...group, files: [] };
          } else {
            return {
              ...group,
              files: group.files.filter((file) => file.name !== fileName),
            };
          }
        } else {
          return group;
        }
      })
    );
  };

  const toggleOpenPhotos = (groupId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, openPhotos: !group.openPhotos }
          : group
      )
    );
  };

  return (
    <Layout>
      <div className={styles.table_container}>
        <div className={styles.title}>
          <h1>Gestión de imágenes de producto</h1>
          <p>
            Sube las imágenes de tus productos para convertirlas a URLs y
            adjuntarlas a tu archivo Excel.
          </p>
        </div>

        <button onClick={() => addGroup()} className={styles.createbutton}>
          <FaPlus /> Crear grupo de fotos
        </button>

        {groups.map((group) => (
          <PhotoGroup
            key={group.id}
            group={group}
            updateGroupFiles={updateGroupFiles}
            removeFile={removeFile}
            handleNameChange={handleNameChange}
            handleSetGroupImagesUrls={handleSetGroupImagesUrls}
            toggleOpenPhotos={toggleOpenPhotos}
          />
        ))}
        {/* Modal for creating a new group */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Crear nuevo grupo de fotos"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h2>Crear nuevo grupo de fotos</h2>
          <span>Ingresa el nombre del producto</span>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Nombre producto"
          />
          <div className={styles.modal_buttons}>
            <button onClick={handleCreateGroup}>Crear</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
