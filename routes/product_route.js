const express = require("express")
const router = express.Router();
const {authorizeRoles, isAuthenticatedUser} = require('../utils/auth')
const {listProducts, getProductById, reviewProduct, fetchReview, getById, fetchReviewById, changeReviewStatus, countUserRequest} = require('../controllers/product_controller')

router.route('/products').get(isAuthenticatedUser, listProducts)
router.route('/products/:productId').get(isAuthenticatedUser,  authorizeRoles('admin', 'team member'), getProductById)
router.route('/products/review/:id').get(isAuthenticatedUser,  authorizeRoles('admin'), getById)
router.route('/review/add').post(isAuthenticatedUser, authorizeRoles('admin', 'team member'), reviewProduct)
router.route('/reviews').get(isAuthenticatedUser, authorizeRoles('admin', 'team member'), fetchReview)
router.route('/reviews/:reviewId').get(isAuthenticatedUser, authorizeRoles('admin', 'team member'), fetchReviewById)
router.route('/reviews/status/:reviewId').put(isAuthenticatedUser, authorizeRoles('admin', 'team member'), changeReviewStatus)
router.route('/requests/user/count/:id').post(isAuthenticatedUser, authorizeRoles('admin', 'team member'), countUserRequest)


module.exports = router