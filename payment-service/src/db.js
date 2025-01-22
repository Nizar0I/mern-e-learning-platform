// src/db.js
import mongoose from 'mongoose';

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/paymentdb';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Payment Service: Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

export default connectDB;