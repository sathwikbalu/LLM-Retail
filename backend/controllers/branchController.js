import Branch from "../models/branchModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createBranch = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingBranch = await Branch.findOne({ name });

    if (existingBranch) {
      return res.json({ error: "Already exists" });
    }

    const branch = await new Branch({ name }).save();
    res.json(branch);
    
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const updateBranch = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { branchId } = req.params;

    const branch = await Branch.findOne({ _id: branchId });

    if (!branch) {
      return res.status(404).json({ error: "branch not found" });
    }

    branch.name = name;

    const updatedBranch = await branch.save();
    res.json(updatedBranch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeBranch = asyncHandler(async (req, res) => {
  try {
    const { Id } = req.params;
    const removed = await Branch.findByIdAndDelete(Id);
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listBranch = asyncHandler(async (req, res) => {
  try {
    const all = await Branch.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const readBranch = asyncHandler(async (req, res) => {
  try {
    const branch = await Branch.findOne({ _id: req.params.id });
    res.json(branch);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export { createBranch, updateBranch, removeBranch, listBranch,readBranch};
