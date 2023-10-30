const mongoose = require('mongoose');
require('dotenv').config();


const connectDatabase = async () => {
    try {
      const connection = await mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB is connected to the host: ${connection.connection.host}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };
  

module.exports = connectDatabase