// const User =require('../models/userModel.js')
// const asyncHandler=require('../middlewares/asyncHandler.js')
// const bcrypt=require('bcryptjs');
import User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs'
import getToken from '../utils/createToken.js'
import Branch from '../models/branchModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
const createUser=asyncHandler(async(req,res)=>{
    const {username,email,password,branch}=req.body;
    if(!username || !email || !password || !branch){
        res.send("Please fill all the input fields")
    }
    else{
        const userExist=await User.findOne({username})
        if(userExist) res.status(400).send("Username already exists");
        else{
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt)

        const newUser= new User({username,email,password: hash,branch})
        
        try {
            await newUser.save();
            const token=getToken(res, newUser._id);
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password, // Note: It's not recommended to send passwords in responses.
                branch:newUser.branch,
                isAdmin:newUser.isAdmin,
                isOwner:newUser.isOwner,
                token:token,
            });
        } catch (error) {
            if (!res.headersSent) {
                res.status(400).send("Error occured!!");
            } else {
                console.error("Headers already sent", error);
            }
        }
       }
    }
})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    const exist=await User.findOne({email})
    if(exist){
        const pwd=await bcrypt.compare(password,exist.password)
        if(pwd){
            const token=getToken(res,exist._id)
           
            res.status(201).json({
                _id: exist._id,
                username: exist.username,
                email: exist.email,
                password: exist.password,
                isAdmin:exist.isAdmin,
                isOwner:exist.isOwner,
                branch:exist.branch,
                //token:token,
            });
            
           return;

        }else{
               res.status(404).json({message:"User not found"}) 
        }
    }else{
        res.status(404).json({message:"User not found"}) 
 }
})

const logOutCurrentUser=asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expries:new Date(0),
    })
    res.status(200).json({message:"Logged Out Successfully"})
})
const getAllUsers= asyncHandler(async(req,res)=>{
    try{
    const user= await User.findById(req.user._id)
    const users=await User.find({branch:user.branch});
    res.json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({'message':error.message})
    }
});

const getCurrentUserProfile=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id)
    if(user){
        res.json({
            _id:user._id,
        username:user.username,
    email:user.email,        });
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});
const updateCurentUserProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)

    if(user){
        user.username=req.body.username || user.username
        user.email=req.body.email||user.email
        user.branch=req.body.branch || user.branch
        if(req.body.password){
            user.password=req.body.password
        }

        const updatedUser=await user.save()

        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin,
            branch:updatedUser.branch
    });
    }else{
        res.status(404);
        throw new Error("user not found")
    }
});

const deleteUserById=asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)

    if (user) {
        if(user.isAdmin){
            res.status(400)
            throw new Error('cant delete user')
        }
        await User.deleteOne({_id:user._id})
        res.json({message:"user removed"})
        
    }else{
        res.status(404)
        throw new Error("user not found")
    }

});
const getUserById=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error("user not found")
    }
});
const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });
  const getAllAdmin= asyncHandler(async(req,res)=>{
    try{
    const users=await User.find({isAdmin:true});
    res.json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({'message':error.message})
    }
});
const stats=asyncHandler(async (req, res) => {
    const branches = await Branch.find({});
    const data = await Promise.all(
      branches.map(async (branch) => {
        const usersCount = await User.countDocuments({ branch: branch.name });
        const productsCount = await Product.countDocuments({ branch: branch.name });
        const ordersCount = await Order.countDocuments({ branch: branch.name });
        return {
          branch: branch.name,
          usersCount,
          productsCount,
          ordersCount,
        };
      })
    );

    res.json(data);
  })

export {createUser,loginUser,logOutCurrentUser,getAllUsers,getCurrentUserProfile,updateCurentUserProfile,deleteUserById,getUserById,updateUserById,getAllAdmin,stats};