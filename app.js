const dotenv = require("dotenv")
dotenv.config({path:"./config/config.env"})
const express = require("express")
const cors = require("cors")
const connectDatabase = require("./config/db")
const bodyParser = require("body-parser");
const { fetchProducts } = require("./utils/fetchProducts")

const app=express()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
require('./models')

connectDatabase();

const User = require("./routes/user_routes")
const Product = require("./routes/product_route")

app.use("/api/user", User)
app.use("/api/product", Product)

const PORT=process.env.PORT || 5000


app.listen(PORT, async() => {
    
    console.log(`Server is running successfully on http://localhost:${PORT}`)
    fetchProducts()
});