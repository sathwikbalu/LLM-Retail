import express from "express";
import formidable from "express-formidable";
//controllers

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  ownerProducts,
  searchProducts,
} from "../controllers/productController.js";
const router = express.Router();

import {
  authenticate,
  authorizeAdmin,
  authorizeOwner,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .get(authenticate, fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);
router.route("/search").get(searchProducts);

router.route("/allproducts").get(authenticate, fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", authenticate, fetchTopProducts);
router.get("/new", authenticate, fetchNewProducts);
router.route("/ownerproducts").get(authenticate, authorizeOwner, ownerProducts);

router.route("/filtered-products").post(authenticate, filterProducts);
router
  .route("/:id")
  .get(authenticate, fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);
  
export default router;