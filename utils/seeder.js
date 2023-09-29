const products =require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({path:'backend/config/config.env'});
connectDatabase();

const seedProducts = async() => {
try{
    await Product.deleteMany();
    console.log('Products deleted!');

    const insertedProducts = await Product.insertMany(products);
    console.log('All products added:', insertedProducts.length);
   
}catch(error){
    console.log('Error seeding data:' , error);
   
}
process.exit();
}

seedProducts();