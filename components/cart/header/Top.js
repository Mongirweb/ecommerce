"use client";
import styles from "./styles.module.scss";
import { MdSecurity } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { RiAccountPinCircleLine, RiArrowDropDownFill } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import UserMenu from "../../header/UserMenu";

export default function Top({ country }) {
  const [visible, setVisible] = useState(false);
  const { data: session } = useSession();

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
          {/* Whishlist */}
          {/* <li className={styles.li}>
            <FaRegHeart />
            <Link href="/myprofile/wishlist?tab=2&q=me-gusta" prefetch={true}>
              <span>Me gusta</span>
            </Link>
          </li> */}
          <li
            className={styles.li}
            onMouseOver={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
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
