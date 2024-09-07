import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { createCategory, updateCategory, removeCategory, listCategory, readCategory } from "../controllers/categoryController.js";

router.route('/')
  .post(authenticate, authorizeAdmin, createCategory);
router.route('/:Id').delete(authenticate, authorizeAdmin, removeCategory);
router.route('/:categoryId')
  .put(authenticate, authorizeAdmin, updateCategory)


router.route('/categories')
  .get(listCategory);

router.route('/:id')
  .get(readCategory);

export default router;
