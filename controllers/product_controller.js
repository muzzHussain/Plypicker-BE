const Product = require("../models/product_model");
const Review = require("../models/review_model");
const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      console.log("no products found");
      return res.status(200).json({ message: "No products found!" });
    }
    return res.status(200).json({ list: products });
  } catch (error) {
    console.log("error occured", error);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.productId });
    if (product.length === 0) {
      return res.status(200).json({ message: "No products found!" });
    }
    return res.status(200).json({ list: product });
  } catch (error) {
    console.log("error occured in get product by id", error);
  }
};

const getById = async (req, res) => {
  try {
    const product = await Product.find({ id: req.params.id });
    if (product.length === 0) {
      console.log(`no products found ${req.params.id}`);
      return res.status(200).json({ message: "No products found!" });
    }
    return res.status(200).json({ list: product });
  } catch (error) {
    console.log("error occured in get product by id", error);
  }
};

const fetchReviewById = async (req, res) => {
  try {
    const reviewsData = await Review.find({ _id: req.params.reviewId });
    if (reviewsData.length === 0) {
      return res.status(200).json({ message: "No products found!" });
    }
    return res.status(200).json({ list: reviewsData });
  } catch (error) {
    console.log("error occured in get review by id", error);
  }
};

const changeReviewStatus = async (req, res) => {
    try {
      const updatedStatus = req.body.status;
      const reviewId = req.params.reviewId;
      
      const reviewData = await Review.findById(reviewId);
      if (!reviewData) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      reviewData.status = updatedStatus;
      reviewData.adminId = req.user._id;
      await reviewData.save();

      if (updatedStatus === 'accept') {
        console.log(typeof(reviewData.productId.toString()));
        const productData = await Product.find({id: reviewData.productId.toString()});
        if (!productData) {
          return res.status(404).json({ message: "Product not found" });
        }
        const pId = productData[0]._id
        const updatedData = await Product.findByIdAndUpdate(
            {_id: pId},
            {
                $set: {
                    productName: reviewData.productName,
                    productDescription: reviewData.productDescription,
                    price: reviewData.price
                }
            }
        )
        if(updatedData)
            return res.status(200).json({ message: "Review status and product data updated successfully" });
      } else if(updatedStatus === 'reject') {
          return res.status(200).json({ message: "Review status and product data updated successfully" });
      }
      return res.status(400).json({ message: "Something happend while Review status and product data updated" });
  
    } catch (error) {
      console.log("Error occurred in get review by id", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

const reviewProduct = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const productId = req.body._id;
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        {
          $set: {
            productName: req.body.productName,
            price: req.body.price,
            productDescription: req.body.productDescription,
          },
        },
        { new: true }
      );
      if (updatedProduct) {
        return res.status(200).json(true);
      } else {
        return res.status(400).json({ error: "Failed to update product" });
      }
    } else if (req.user.role === "team member") {
      const review = new Review({
        userId: req.user._id,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        price: req.body.price,
        productId: req.body.id,
        image: req.body.image
      });
      await review.save();
      if (review) {
        return res.status(200).json(true);
      }
      return res.status(400).json({ error: "Failed to store review" });
    }
  } catch (error) {
    console.log("error occured", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchReview = async (req, res) => {
  try {
    let reviews
    if(req.user.role === 'admin') {
        reviews = await Review.find();
        if (reviews) {
          return res.status(200).json({ reviewsList: reviews });
        }
        return res.status(400).json({ error: "Something happend" });
    } else {
        reviews = await Review.find({userId: req.user._id});
        if (reviews) {
          return res.status(200).json({ reviewsList: reviews });
        }
        return res.status(400).json({ error: "Something happend" });
    }
  } catch (error) {
    console.log("error occured in fetch review", error);
  }
};

const countUserRequest = async(req, res) => {
    try {
        if(req.body.role === 'admin') {
            const adminData = await Review.find({adminId: req.params.id})
            const count = countRequest(adminData);
            return res.status(200).json({ request: count.request, countAccept: count.countAccept, countReject: count.countReject })
        } else if(req.body.role === 'team member'){
            const userData = await Review.find({userId: req.params.id})
            const count = countRequest(userData);
            return res.status(200).json({ request: count.request, countAccept: count.countAccept, countReject: count.countReject })
        }

      } catch (error) {
        console.log("error occured in fetch review", error);
      }
}

const countRequest = (datas) => {
    try {
        if(datas && datas.length > 0) {
            let accept = 0, reject = 0
            datas.forEach((data) => {
                if(data.status === 'accept')
                    accept++
                else if(data.status === 'reject')
                    reject++
            })
            return ({ request: datas.length, countAccept: accept, countReject: reject });
        }
        return res.status(200).json({ message: "No data found" });
      } catch (error) {
        console.log("error occured in fetch review", error);
      }
}

module.exports = {
  listProducts,
  getProductById,
  reviewProduct,
  fetchReview,
  getById,
  fetchReviewById,
  changeReviewStatus,
  countUserRequest
};
