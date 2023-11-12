const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout); 

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

//below is all details of profils

router.route("/me").get(isAuthenticatedUser, getUserDetails); //1-get only admin  signup data 

router.route("/password/update").put(isAuthenticatedUser, updatePassword); //2-update password 

router.route("/me/update").put(isAuthenticatedUser, updateProfile); //3-update email,name etc 

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser); //4-get all user singup data  

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)   //5-get user singup data by id 
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)  //6-update email,name,role etc by id 
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser); //7-delete user email,name and role etc but not work



module.exports = router;
