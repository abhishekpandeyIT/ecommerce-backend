const mongoose = require('mongoose');

const uri = "mongodb+srv://abhishekpandeyite:gjBDj8wURKbCNTqS@ecommerce-application.o7tfpks.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce-application";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || uri , {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000 // 45 seconds socket timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Call this before starting your Express server
connectDB();
