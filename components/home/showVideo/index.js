"use client";
import React, { useEffect } from "react";

export default function SocialVideoEmbed({ platform, embedUrl, videoId }) {
  useEffect(() => {
    // Load the proper embed script based on the platform.
    if (platform === "tiktok") {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (platform === "instagram") {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      // If Instagram's embed library is already loaded, process the embeds.
      if (
        window.instgrm &&
        window.instgrm.Embeds &&
        typeof window.instgrm.Embeds.process === "function"
      ) {
        window.instgrm.Embeds.process();
      }
    }
  }, [platform, embedUrl, videoId]);

  // Render the appropriate embed code.
  if (platform === "tiktok") {
    // For TikTok, provide a blockquote with necessary attributes.
    // The `videoId` prop should be your TikTok video ID.
    return (
      <blockquote
        className="tiktok-embed"
        cite={embedUrl}
        data-video-id={videoId}
        style={{ maxWidth: "605px", minWidth: "325px" }}
        autoplay={"0"}
      >
        <section></section>
      </blockquote>
    );
  } else if (platform === "instagram") {
    // For Instagram, provide a blockquote with the embed URL.
    return (
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={embedUrl}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          margin: 0,
          padding: 0,
          width: "100%",
        }}
      ></blockquote>
    );
  } else {
    return <div>Unsupported platform</div>;
  }
}
