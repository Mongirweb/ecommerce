import Image from "next/image";
import styles from "./main.module.scss";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsHeart } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import { userSwiperArray } from "../../../data/home";
import imageLogo from "../../../png/empresy.png";
import { LuShieldCheck } from "react-icons/lu";
import { LuPackageCheck } from "react-icons/lu";
import { IoCardOutline } from "react-icons/io5";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards, Navigation } from "swiper/modules";

export default function User() {
  const { data: session } = useSession();

  return (
    <div className={styles.user}>
      <div className={styles.user__container}>
        <div className={styles.user__infos}>
          <LuShieldCheck />
          <span>Tu compra es segura ¿No te gusta? Puedes devolverlo.</span>
        </div>
        <div className={styles.user__infos}>
          <IoCardOutline />
          <span>Paga como mas te gusta!, con tarjeta o en efectivo.</span>
        </div>
        <div className={styles.user__infos}>
          <LuPackageCheck />
          <span>¡Envío por solo $6.000 en compras desde $89.900!</span>
        </div>
        <div className={styles.buttons}>
          <button className={styles.button1}>Registrarme</button>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className={styles.user}>
      <img
        src="../../../images/userHeader.jpg"
        alt=""
        className={styles.user__header}
      />
      <div className={styles.user__container}>
        {session ? (
          <div className={styles.user__infos}>
            <img src={session.user?.image} alt="" />
            <h4>{session.user.name}</h4>
          </div>
        ) : (
          <div className={styles.user__infos}>
            <img
              src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png"
              alt=""
            />
            <div className={styles.user__infos_btns}>
              <button>Register</button>
              <button>Login</button>
            </div>
          </div>
        )}
        <ul className={styles.user__links}>
          <li>
            <Link legacyBehavior href="/profile">
              <a>
                <IoSettingsOutline />
              </a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="">
              <a>
                <HiOutlineClipboardList />
              </a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="">
              <a>
                <AiOutlineMessage />
              </a>
            </Link>
          </li>
          <li>
            <Link legacyBehavior href="">
              <a>
                <BsHeart />
              </a>
            </Link>
          </li>
        </ul>
        <div className={styles.user__swiper}>
          <img
            src="https://assets.stickpng.com/images/5a5a6d2414d8c4188e0b088d.png"
            alt=""
            className={styles.new}
          />
          <Swiper
            effect={"cards"}
            grabCursor={true}
            navigation={true}
            modules={[EffectCards, Navigation]}
            className="user__swiper"
            style={{
              maxWidth: "180px",
              height: "240px",
              marginTop: "1rem",
            }}
          >
            {userSwiperArray?.map((item, i) => (
              <SwiperSlide key={i}>
                <Link href="">
                  <img src={item.image} alt="" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <img
        src="../../../images/userHeader.jpg"
        alt=""
        className={styles.user__footer}
      />
    </div> */
}
