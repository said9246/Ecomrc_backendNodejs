const Productts = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//demo prduct-----------------------------1
exports.getthisdemo = (req, res) => {
  res.status(200).json({ message: "this is the demo route" })
}

//create prduct----------admin-----------------2
exports.createProduct = catchAsyncErrors(
  async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Productts.create(req.body);

    res.status(201).json({
      success: true,
      product
    })
  }

)
//get allprduct from db -----------------------3

exports.getAllproduct = catchAsyncErrors(async (req, res) => {

  const resultPerPage = 5;
  const ProductCount = await Productts.countDocuments();
  const ApiFeature=new ApiFeatures(Productts.find(),req.query)
  .search() //work perfect    //feature like serch filter
  .filter()   //use  to search value between two value
  .pagination(resultPerPage)
  // const product = await Productts.find(); before apifeaatures
  const product = await ApiFeature.query;

  res.status(200).json({
    success: true,
    product,
    ProductCount
  })
})

//Update  prduct-------only Admin update----------------4

exports.updateProduct = catchAsyncErrors(
  async (req, res, next) => {
    let product = await Productts.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found", 404))
    }
    product = await Productts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
    res.status(200).json({
      success: true,
      product
    })

  }
)


//Delete  prduct-----only by--Admin-----------------5     

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Productts.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found"));
    }

    await Productts.deleteOne({ _id: req.params.id }); // Use deleteOne on the Model

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
}
);


//select one / get only one product by user  prduct------------------------6

exports.selectOneProduct = catchAsyncErrors(
  async (req, res, next) => {

    const product = await Productts.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found", 404))
    }


    res.status(200).json({
      success: true,
      product,
      // ProductCount
    });
  }
)


//create and Update review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Productts.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Productts.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Productts.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Productts.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});


