"use client"; // This will ensure the component only runs on the client

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  FacebookIcon,
  EmailIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";

export default function Share() {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  if (!shareUrl) {
    return null; // You can add a loading state here if needed
  }

  return (
    <div className={styles.share}>
      <span>Compartir en:</span>
      <div>
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={38} />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl}>
          <XIcon size={38} />
        </TwitterShareButton>
        <TelegramShareButton url={shareUrl}>
          <TelegramIcon size={38} />
        </TelegramShareButton>
        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon size={38} />
        </WhatsappShareButton>
        <EmailShareButton url={shareUrl}>
          <EmailIcon size={38} />
        </EmailShareButton>
      </div>
    </div>
  );
}
