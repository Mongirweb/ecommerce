"use client";
import React, { useRef } from "react";
import { useModal } from "../../context/ModalContext";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../../data/categorie";
import { IoIosArrowForward } from "react-icons/io";

export default function Modal({
  title = "Select a Token",
  sm = false,
  login = false,
  zIndex,
  center,
  webApp,
  customClass,
  customSubClass,
  modalContentClass,
  blur,
  imageHeader,
  image,
}) {
  const { isModalOpen, closeModal, modalData } = useModal();
  const wrapperRef = useRef(null);

  const handleCloseModal = () => {
    closeModal();
  };

  return !isModalOpen ? null : (
    <div
      className={`${customClass} ${styles.modal} ${
        isModalOpen ? styles.open_modal : styles.close_modal
      }`}
      style={{
        ...(blur ? { backdropFilter: "blur(20px)" } : {}),
        ...(zIndex ? { zIndex } : {}),
        ...(center ? { display: "flex", padding: "0px" } : {}),
      }}
    >
      <div
        className={`${
          modalContentClass ? modalContentClass : styles.modalContent
        } ${customSubClass} ${login ? styles.modal_login : ""}`}
        ref={wrapperRef}
        style={{
          ...(webApp
            ? { width: "100%", height: "100%", paddingTop: "25vh" }
            : {}),
        }}
      >
        {!sm && (
          <div
            className={
              imageHeader ? styles.modalImageHeader : styles.modalHeader
            }
            style={imageHeader ? { backgroundImage: `url(${image})` } : {}}
          >
            <h1>{modalData?.title}</h1>
            <span hidden={webApp} className={styles.close} onClick={closeModal}>
              &times;
            </span>
          </div>
        )}
        {/* Render dynamic content */}
        <div className={styles.modalBody}>
          {" "}
          <div className={styles.modal_modal}>
            <ul className={styles.subMenu}>
              {categories?.map((cat, j) => (
                <li key={j}>
                  <Link
                    href={{
                      pathname: `${cat?.link}`,
                      query: { category: cat?.id },
                    }}
                    prefetch={true}
                    onClick={() => handleCloseModal()}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={cat.image}
                      alt="Mongir Logo"
                      loading="lazy"
                    />
                    {cat.name} <IoIosArrowForward />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
