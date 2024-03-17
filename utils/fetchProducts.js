const axios = require('axios');
const Product = require('../models/product_model')

const fetchProducts = async() => {
    try{
        const product = await Product.find();
        if(product.length === 0) {
            const response = await axios.get(process.env.PRODUCTS_API)
            Product.insertMany(response.data)
            console.log('Products added successfully')
        } else {
            console.log('products already present inside DB.')
        }
    }catch(error){
        console.log(`Something went wrong while fetching products ${error}`)
    }
}

module.exports = {fetchProducts}