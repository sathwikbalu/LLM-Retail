import express from "express";
import { createUser, loginUser, logOutCurrentUser , getAllUsers,getCurrentUserProfile,updateCurentUserProfile,deleteUserById,getUserById,updateUserById, getAllAdmin, stats } from "../controllers/userController.js";
import  {authenticate, authorizeAdmin, authorizeOwner} from '../middlewares/authMiddleware.js';





const router=express.Router();

router.route('/').post(createUser).get(authenticate,authorizeAdmin, getAllUsers);

router.post("/auth",loginUser)
router.post('/logout', logOutCurrentUser)


router.route('/profile').get(authenticate,getCurrentUserProfile).put(authenticate,updateCurentUserProfile);
router.route('/allAdmin').get(authenticate,authorizeOwner,getAllAdmin)
router.route("/statistics").get(authenticate,authorizeOwner,stats);
//admin route
router.route('/:id').delete(authenticate,authorizeAdmin,deleteUserById).get(authenticate,authorizeAdmin,getUserById).put(authenticate,authorizeAdmin,updateUserById)
export default router;