// seed.js
const mongoose = require('mongoose');
const Product = require('../ecommerce-backend/models/product');
const Category = require('../ecommerce-backend/models/Category'); // Now this should work

// Use your actual Atlas connection string
const DB_URI = 'mongodb+srv://abhishekpandeyite:gjBDj8wURKbCNTqS@ecommerce-application.o7tfpks.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce-application';
console.log(process.env.MONGO_URI);

// Remove deprecated options
mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create categories first
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Devices and gadgets'
    });

    const clothing = await Category.create({
      name: 'Clothing',
      description: 'Apparel and accessories'
    });

    // Create products with proper category references
    await Product.create([
      {
        name: 'Smartphone X',
        price: 699.99,
        description: 'Latest smartphone model',
        category: electronics._id // Use the ObjectId
      },
      {
        name: 'Laptop Pro',
        price: 1299.99,
        description: 'High performance laptop',
        category: electronics._id
      },
      {
        name: 'Cotton T-Shirt',
        price: 24.99,
        description: '100% cotton unisex t-shirt',
        category: clothing._id
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedDatabase();