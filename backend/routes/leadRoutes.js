import express from "express";
import Lead from "../models/lead.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// ✅ Create New Lead
router.post("/", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Get All Leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
// ✅ Update Lead Status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Add Note to Lead
router.post("/:id/notes", async (req, res) => {
  try {
    const { text } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.push({ text });
    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Delete Lead
router.delete("/:id", async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Dashboard Stats
router.get("/stats/overview", async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "New" });
    const contactedLeads = await Lead.countDocuments({ status: "Contacted" });
    const convertedLeads = await Lead.countDocuments({ status: "Converted" });

    const conversionRate =
      totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      conversionRate: `${conversionRate}%`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});