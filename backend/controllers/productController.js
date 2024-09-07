import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log(req.fields);
    const { name, description, price, category, quantity, brand, branch } =
      req.fields;

    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "brand is required" });
      case !description:
        return res.json({ error: "description is required" });
      case !price:
        return res.json({ error: "price is required" });
      case !category:
        return res.json({ error: "category is required" });
      case !quantity:
        return res.json({ error: "quantity is required" });
      case !branch:
        return res.json({ error: "branch is required" });
    }
    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(400).json(error.message);
  }
});
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      branch: user.branch,
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const pageSize = 6;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({
      ...keyword,
      branch: user.branch,
    });
    const products = await Product.find({
      ...keyword,
      branch: user.branch,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findOne({
      _id: req.params.id,
      branch: user.branch,
    });
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const products = await Product.find({ branch: user.branch })
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id, {
      branch: user.branch,
    });
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const products = await Product.find({
      branch: user.branch,
    })
      .sort({ rating: -1 })
      .limit(4);
    res.json(products);
  } catch (error) {
    res.status(404);
    throw new Error("Product not found");
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const products = await Product.find({
      branch: user.branch,
    })
      .sort({ _id: -1 })
      .limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args).find({ branch: user.branch });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const ownerProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
const searchProducts = asyncHandler(async (req, res) => {
  try {
    let query = req.query.query;
    console.log("Received query:", query);

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    query = decodeURIComponent(query);
    console.log("Sanitized query:", query);

    const products = await Product.find({
      name: { $regex: new RegExp(query.split(" ").join(".*")), $options: "i" },
    });
    console.log("Search results count:", products.length);

    res.json(products);
  } catch (error) {
    console.error("Error during product search:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
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
};