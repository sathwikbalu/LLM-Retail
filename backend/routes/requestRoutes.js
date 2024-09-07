import Request from "../models/requestModel.js";
import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST route to create a new request
router.post("/", async (req, res) => {
  try {
    const { fromId, toId, product, message } = req.body;
    const request = new Request({ from: fromId, to: toId, product, message });
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create request", error: error.message });
  }
});


router.get(
  "/:salesPersonId",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { salesPersonId } = req.params;
      const receivedRequests = await Request.find({ to: salesPersonId }).populate("from");
      const sentRequests = await Request.find({ from: salesPersonId }).populate("to");
      const requests = {
        received: receivedRequests,
        sent: sentRequests
      };

      if (receivedRequests.length > 0 || sentRequests.length > 0) {
        res.json(requests);
      } else {
        res.send();
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve requests", error: error.message });
    }
  }
);


// PUT route to update the status of a request
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      
      const { id } = req.params;
      const { status } = req.body;
      const request = await Request.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (request) {
        res.status(400).json(request);
      } else {
        res.send({ message: "Request not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update request", error: error.message });
    }
  }
);

export default router;
