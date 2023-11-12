const express =require("express");
const app=express();

const errorMidlewar =require("./middleware/error")    //1---------error handling file
const cookieParser=require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//Route import
const product =require("./Routes/productRoutes.js"); //2--------product file
const user = require("./Routes/userRoute")            // 3------user file
const Order = require("./Routes/orderRoute")            // 3------order file

app.use("/api/v1",product)                      //Route product
app.use("/api/v1",user)                         //Route user
app.use("/api/v1",Order)                         //Route user



app.use(errorMidlewar)                          //midlewar for error

module.exports=app