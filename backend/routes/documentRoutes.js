const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

router.get("/documents", async (req, res) => {
  try {
    const docs = await Document.find().sort({ created_at: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

module.exports = router;
