const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { uploadImage } = require("../services/cloudinary");
const checkAuth = require("../middleware/auth");

// Config multer temporary folder
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  checkAuth(["RESTAURANT_ADMIN", "BRANCH_MANAGER"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const folder = req.body.folder || "general";

      // Upload temporary local file to Cloudinary
      const imageUrl = await uploadImage(req.file.path, folder);

      // Delete temporary local file
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting temp file:", unlinkErr);
      }

      return res.json({ success: true, url: imageUrl });
    } catch (error) {
      console.error("Upload error:", error);

      // Cleanup on error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          // Ignore
        }
      }

      return res.status(500).json({ error: error.message || "Failed to upload image" });
    }
  }
);

module.exports = router;
