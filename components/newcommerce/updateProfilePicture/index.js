import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import PulseLoader from "react-spinners/PulseLoader";
import getCroppedImg from "../../../utils/getCropedImg";
import { IoMdClose } from "react-icons/io";
import styles from "./styles.module.scss";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { uploadImages } from "../../../requests/upload";
import { updateprofilePicture } from "../../../requests/user";
import { signIn, useSession } from "next-auth/react";

export default function UpdateProfilePicture({
  setImage,
  image,
  user,
  setProfilePicture,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setcroppedAreaPixels] = useState(null);
  const slider = useRef(null);
  const [loading, setLoading] = useState(false);
  const coverRef = useRef(null);
  const [width, setWidth] = useState();
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const [newImage, setNewImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setcroppedAreaPixels(croppedAreaPixels);
  }, []);

  const zoomIn = () => {
    slider.current.stepUp();
    setZoom(slider.current.value);
  };

  const zoomOut = () => {
    slider.current.stepDown();
    setZoom(slider.current.value);
  };

  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImage(img);
        } else {
          return img;
        }
      } catch (error) {
        console.error(error);
      }
    },
    [croppedAreaPixels]
  );

  const updateProfilePicture = async () => {
    try {
      setLoading(true);
      let img = await getCroppedImage();
      let blob = await fetch(img).then((b) => b.blob());
      const path = `${user.name}/profile_pictures`;
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);
      const res = await uploadImages(formData);
      const updated_picture = await updateprofilePicture(res[0].url);
      setNewImage(updated_picture);
      if (updated_picture) {
        await update({ image: res[0].url });
        setImage("");
        setProfilePicture(res[0].url);
        setShow(false);
        setLoading(false);
      } else {
        setLoading(false);
        setError(updated_picture);
      }
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    setWidth(coverRef.current.clientWidth);
  }, [window.innerWidth]);

  return (
    <div className={styles.blurr}>
      <div className={styles.picture}>
        <div className={styles.picture__header}>
          <div></div>
          <span>Logo de la Empresa</span>
          <div
            className={styles.picture__header_close}
            onClick={() => {
              setImage("");
            }}
          >
            <IoMdClose />
          </div>
        </div>
        <div className={styles.picture__update} ref={coverRef}>
          <div className={styles.picture__update_crooper}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={false}
            />
          </div>
          <div className={styles.picture__update_slider}>
            <div
              className={styles.picture__update_slider_circle}
              onClick={() => {
                zoomOut();
              }}
            >
              <FaMinus />
            </div>
            <input
              type="range"
              min={1}
              ref={slider}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
            <div
              className={styles.picture__update_slider_circle}
              onClick={() => {
                zoomIn();
              }}
            >
              <FaPlus />
            </div>
          </div>
        </div>
        <div className={styles.picture__submit}>
          <div
            className={styles.picture__submit_cancel}
            onClick={() => {
              setImage("");
            }}
          >
            Cancelar
          </div>

          <button
            className={styles.picture__submit_save}
            disabled={loading}
            onClick={() => {
              {
                updateProfilePicture();
              }
            }}
          >
            {loading ? <PulseLoader color="white" size={5} /> : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
