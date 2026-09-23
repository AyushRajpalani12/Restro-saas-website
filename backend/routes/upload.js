const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadImage } = require("../services/cloudinary");
const checkAuth = require("../middleware/auth");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Config multer storage with file extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.post(
  "/",
  checkAuth(["RESTAURANT_ADMIN", "BRANCH_MANAGER", "SUPER_ADMIN", "KITCHEN", "STAFF"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const folder = req.body.folder || "general";
      let imageUrl;

      // Check if Cloudinary credentials are configured
      const hasCloudinary =
        process.env.CLOUDINARY_CLOUD_NAME &&
        !process.env.CLOUDINARY_CLOUD_NAME.includes("your_cloudinary");

      if (hasCloudinary) {
        try {
          imageUrl = await uploadImage(req.file.path, folder);
          // Delete temporary local file after successful Cloudinary upload
          try {
            fs.unlinkSync(req.file.path);
          } catch (e) {}
        } catch (cloudErr) {
          console.warn("Cloudinary upload error, using local storage fallback:", cloudErr.message);
        }
      }

      // Fallback to local server static URL if Cloudinary is not used or failed
      if (!imageUrl) {
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.get("host");
        imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }

      return res.json({ success: true, url: imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: error.message || "Failed to upload image" });
    }
  }
);

module.exports = router;
