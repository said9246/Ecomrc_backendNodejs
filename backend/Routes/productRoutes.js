const  express =require("express");

const { getthisdemo,
        createProduct,
        getAllproduct,
        updateProduct,
        deleteProduct,
        selectOneProduct,
        createProductReview,
        deleteReview,
        getProductReviews
} 
=require("../controller/productControler.js") ;
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth.js"); //if logout then user not  access and authorizeRoles is used for cheack role is admin or user if user it not access

const router=express.Router();



router.route("/product").get(getthisdemo);          //get this product--1
router.route("/getAllproduct/").get(getAllproduct);  //getAllproduct--2
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),  createProduct);   //create product--3
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);     //update product--4
router.route("/admin/product/delete/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);     //Delete product--5
router.route("/select/:id").get(selectOneProduct);     //select one product--6

//for reviews 
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/getreview").get(getProductReviews)
router.route("/deletereview").delete(isAuthenticatedUser,deleteReview)


module.exports = router