// import { createRouter } from "next-connect";
// import cloudinary from "cloudinary";
// import fs from "fs";
// import fileUpload from "express-fileupload";
// import { imgMiddleware } from "../../../middleware/imgMiddleware";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// const router = createRouter()
//   .use(
//     fileUpload({
//       useTempFiles: true,
//     })
//   )
//   .use(imgMiddleware);
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// router.post(async (req, res) => {
//   try {
//     const { path } = req.body;
//     let files = Object.values(req.files).flat();
//     let images = [];
//     for (const file of files) {
//       const img = await uploadToCloudinaryHandler(file, path);
//       images.push(img);
//       removeTmp(file.tempFilePath);
//     }
//     res.json(images);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// });

// router.delete(async (req, res) => {
//   let image_id = req.body.public_id;
//   cloudinary.v2.uploader.destroy(image_id, (err, res) => {
//     if (err) return res.status(400).json({ success: false, err });
//     res.json({ success: true });
//   });
// });

// const uploadToCloudinaryHandler = async (file, path) => {
//   return new Promise((resolve) => {
//     cloudinary.v2.uploader.upload(
//       file.tempFilePath,
//       {
//         folder: path,
//       },
//       (err, res) => {
//         if (err) {
//           removeTmp(file.tempFilePath);
//           console.error(err);
//           return res.status(400).json({ message: "Upload image failed." });
//         }
//         resolve({
//           url: res.secure_url,
//           public_url: res.public_id,
//         });
//       }
//     );
//   });
// };
// const removeTmp = (path) => {
//   fs.unlink(path, (err) => {
//     if (err) throw err;
//   });
// };

// export default router.handler();

import { createRouter } from "next-connect";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const router = createRouter().use(
  fileUpload({
    useTempFiles: false, // Use in-memory buffer
    limits: { fileSize: 50 * 1024 * 1024 }, // Adjust the file size limit as needed
  })
);

export const config = {
  api: {
    bodyParser: false,
  },
};

router.post(async (req, res) => {
  try {
    const { path } = req.body;

    let files = Object.values(req.files).flat();
    let images = [];
    for (const file of files) {
      const img = await uploadToCloudinaryHandler(file, path);
      images.push(img);
    }
    res.json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

const uploadToCloudinaryHandler = async (file, path) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ folder: path }, (err, res) => {
        if (err) {
          console.error(err);
          return reject(new Error("Upload image failed."));
        }
        resolve({
          url: res.secure_url,
          public_url: res.public_id,
        });
      })
      .end(file.data); // Use in-memory buffer
  });
};

export default router.handler();
