// app/api/upload/route.js

import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

// Ensure the route runs in a Node.js environment
export const runtime = "nodejs";

export async function POST(req) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();

    // Get the 'path' field from the form data
    const path = formData.get("path") || "default_folder";

    // Get all files with the name 'file'
    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    const images = [];

    for (const file of files) {
      // Convert the File object to a Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload the buffer to Cloudinary
      const result = await uploadToCloudinary(buffer, path);

      images.push(result);
    }

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function uploadToCloudinary(buffer, path) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: path },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new Error("Cloudinary upload failed."));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Write the buffer to the upload stream
    stream.end(buffer);
  });
}
