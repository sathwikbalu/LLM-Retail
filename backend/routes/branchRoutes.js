import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin ,authorizeOwner} from "../middlewares/authMiddleware.js";
import {
  createBranch,
  updateBranch,
  removeBranch,
  listBranch,
  readBranch,
} from "../controllers/branchController.js";

router.route("/").post(authenticate,authorizeOwner,createBranch);
router.route("/:Id").delete(authenticate, authorizeOwner, removeBranch);
router.route("/:branchId").put(authenticate, authorizeOwner, updateBranch);

router.route("/branchs").get(listBranch);

router.route("/:id").get(readBranch);

export default router;