import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const ext = path.extname(file.originalname).toLowerCase().substring(1); // remove the dot
  const mimetype = file.mimetype;

  if (filetypes.test(ext) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  console.log("🔁 Upload endpoint hit");
  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.error("❌ Multer upload error:", err.message);
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      console.log("✅ Image uploaded:", req.file.path);
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      console.warn("⚠️ No image file provided");
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
