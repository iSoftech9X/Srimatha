import express from "express";
import {
  addOffer,
  getAllOffers,
  getActiveOffers,
  updateOffer,
  deleteOffer
} from "../services/menuPostgres.js";

const router = express.Router();

// ✅ Create offer
router.post("/", async (req, res) => {
  try {
    const offer = await addOffer(req.body);
    res.status(201).json(offer);
  } catch (err) {
    console.error("Error creating offer:", err);
    res.status(500).json({ error: "Failed to create offer" });
  }
});

// ✅ Get all offers (active + inactive)
router.get("/", async (req, res) => {
  try {
    const offers = await getAllOffers();
    res.json(offers);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// ✅ Get active offers
router.get("/active", async (req, res) => {
  try {
    const offers = await getActiveOffers();
    res.json(offers);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// ✅ Update offer
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateOffer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating offer:", err);
    res.status(500).json({ error: "Failed to update offer" });
  }
});

// ✅ Delete offer
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteOffer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.json({ message: "Offer deleted", offer: deleted });
  } catch (err) {
    console.error("Error deleting offer:", err);
    res.status(500).json({ error: "Failed to delete offer" });
  }
});

export default router;
