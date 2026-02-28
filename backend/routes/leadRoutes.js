import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

/* ===========================
   GET ALL LEADS
=========================== */
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   CREATE NEW LEAD
=========================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, company } = req.body;

    const newLead = new Lead({
      name,
      email,
      company,
      status: "New",
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ===========================
   UPDATE LEAD STATUS
=========================== */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ===========================
   DELETE LEAD
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ===========================
   OVERVIEW STATS
=========================== */
router.get("/stats/overview", async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "New" });
    const contactedLeads = await Lead.countDocuments({ status: "Contacted" });
    const convertedLeads = await Lead.countDocuments({ status: "Converted" });

    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;