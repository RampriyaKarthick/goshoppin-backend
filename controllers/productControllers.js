const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const mongoose = require('mongoose');
const APIFeatures = require('../utils/apiFeatures')

//Get Products - /api/v1/products
exports.getProducts = async(req,res,next) => {
    const resPerPage = 3;
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    const products = await apiFeatures.query;
const totalProductsCount = await Product.countDocuments({})
    //await new Promise(resolve => setTimeout(resolve, 1000))
  res.status(200).json({
    success:true,
    count: totalProductsCount,
    resPerPage,
    products
})
}
//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async(req,res,next) =>{

    req.body.user= req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
    });
    
//Get Single product api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user','name email');
    //await new Promise(resolve => setTimeout(resolve, 1000))
    if(!product) {
        return next(new ErrorHandler('Product not found', 400));
    }

    res.status(201).json({
        success: true,
        product
    })
})



// Update Product api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    //uploading images
    let images = []

    //if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false' ) {
        images = product.images;
    }
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })

})

//Delete Product api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted!"
    })

})

//create review

exports.createReview = catchAsyncError(async (req, res, next) =>{
    const  { productId, rating, comment } = req.body;

    const review = {
        user : req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId);
   //finding user review exists
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //updating the  review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        })

    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    //find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })


})

//Get Reviews

exports.getReviews = catchAsyncError(async (req, res, next) =>{

const product = await Product.findById(req.query.id);

res.status(200).json({
    success:true,
    reviews:product.reviews
})

})

//Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.findById(req.query.productId);
      const reviewToDelete = product.reviews.find((review) => {
        return review._id.toString() === req.query.id.toString();
      });
  
      if (!reviewToDelete) {
        // Review not found, send a message and return
        return res.status(404).json({
          success: false,
          message: "Review not found.",
        });
      }
  
      // Filter the review to be deleted
      const reviews = product.reviews.filter((review) => {
        return review._id.toString() !== req.query.id.toString();
      });
  
      const numOfReviews = reviews.length;
      let ratings =
        reviews.reduce((acc, review) => {
          return review.rating + acc;
        }, 0) / numOfReviews;
      ratings = isNaN(ratings) ? 0 : ratings;
  
      // Update the product document
      await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings,
      });
  
      res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
      });
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).json({
        success: false,
        error: "Error updating the product.",
      });
    }
  });
  