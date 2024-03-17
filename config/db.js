const mongoose = require("mongoose");
//mongoDb connection
const connectDatabase = () => {
    try{
        console.log("MONGODB_URI:", process.env.MONGODB_URI);
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Conected to Database SuccessFully")
    }catch(error){
        console.log('Error: ', error.message);
    }
};

module.exports = connectDatabase;