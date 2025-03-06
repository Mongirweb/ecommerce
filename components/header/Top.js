"use client";
import styles from "./header.module.scss";
import { MdSecurity } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { RiAccountPinCircleLine, RiArrowDropDownFill } from "react-icons/ri";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Top({ country }) {
  const [visible, setVisible] = useState(false);
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 570);
    };
    // Set initial state
    handleResize();
    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleVisible = () => setVisible(!visible);

  return (
    <div className={styles.top}>
      <div className={styles.top__container}>
        <div></div>
        <ul className={styles.top__list}>
          <li className={styles.li}>
            <Image
              width={300}
              height={200}
              src="https://cdn.ipregistry.co/flags/emojitwo/co.svg"
              alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
              loading="lazy"
            />
            <span>COL / COP</span>
          </li>
          {/* Buyer Protection */}
          {/* <li className={styles.li}>
            <MdSecurity />
            <span>Protección del consumidor</span>
          </li> */}
          {/* Customer Service */}
          {/* <li className={styles.li}>
            <span>Acompañamiento</span>
          </li> */}
          {/* Help */}
          {/* <li className={styles.li}>
            <span>Ayuda</span>
          </li> */}
          {/* Wishlist */}
          {/* <li className={styles.li}>
            <FaRegHeart />
            <Link href="/myprofile/wishlist?tab=2&q=me-gusta">
              <span>Me gusta</span>
            </Link>
          </li> */}
          <li
            className={styles.li}
            onMouseOver={!isMobile ? () => setVisible(true) : null}
            onMouseLeave={!isMobile ? () => setVisible(false) : null}
            onClick={isMobile ? toggleVisible : null}
          >
            {session ? (
              <div className={styles.li}>
                <div className={styles.flex}>
                  <Image
                    width={300}
                    height={200}
                    src={session?.user?.image}
                    alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                    loading="lazy"
                  />
                  <span>{session?.user?.name}</span>
                  <RiArrowDropDownFill />
                </div>
              </div>
            ) : (
              <div className={styles.li}>
                <div className={styles.flex}>
                  <RiAccountPinCircleLine />
                  <span>Mi cuenta</span>
                  <RiArrowDropDownFill />
                </div>
              </div>
            )}
            {visible && <UserMenu session={session} />}
          </li>
        </ul>
      </div>
    </div>
  );
}
