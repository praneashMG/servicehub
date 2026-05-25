const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }
    
    // If it's Cloudinary, path is a URL. If local, we construct the URL.
    let imageUrl = req.file.path;
    if (!imageUrl.startsWith('http')) {
      // Local storage fallback
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
