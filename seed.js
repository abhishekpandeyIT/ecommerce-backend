// seed.js
const mongoose = require('mongoose');
const Product = require('../ecommerce-backend/models/Product');
const Category = require('../ecommerce-backend/models/Category'); // Now this should work
const User = require('../ecommerce-backend/models/User'); // Now this should work

// Use your actual Atlas connection string
const DB_URI = 'mongodb+srv://abhishekpandeyite:gjBDj8wURKbCNTqS@ecommerce-application.o7tfpks.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce-application';
console.log(process.env.MONGO_URI);

// Remove deprecated options
mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error:', err));

  const seedDatabase = async () => {
    try {
      // await connectDB();
      
      // Clear existing data
      await mongoose.connection.dropDatabase();
      console.log('🧹 Cleared existing data');
  
      // Create admin user
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      });
      console.log(`👨‍💻 Created admin user: ${admin.email}`);
  
      // Create categories
      const categories = await Category.insertMany([
        { 
          name: 'Electronics',
          description: 'Latest gadgets and devices',
          image: 'https://i.pinimg.com/736x/51/d3/88/51d38806d50482762c700eca5717a32f.jpg',
          slug: 'electronics'
        },
        {
          name: 'Clothing',
          description: 'Fashion for all seasons',
          image: 'https://hulaglobal.com/wp-content/uploads/2022/08/Hula-global-fashion-summer-guide.jpg',
          slug: 'clothing'
        },
        {
          name: 'Home & Kitchen',
          description: 'Everything for your home',
          image: 'https://sonigaracorp.com/images/blog/Home-Kitchen/5_Home_Kitchen_Designs_for_a_Home_Chef.jpg',
          slug: 'home-kitchen'
        }
      ]);
      console.log(`📚 Created ${categories.length} categories`);
  
      // Create products
      const products = await Product.insertMany([
        {
          name: 'Smartphone X Pro',
          description: '6.7" AMOLED display, 128GB storage',
          price: 799.99,
          category: categories[0]._id,
          images: ['https://5.imimg.com/data5/SELLER/Default/2022/5/FZ/AR/OQ/138319557/redmi-note-7-4gb-64gb-mobile-phone.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX3KPIHrsuM-2uNH9qDaz0eDkekCSlfkT7Dw&s'],
          brand: 'TechMaster',
          stock: 50,
          ratings: [
            { user: admin._id, rating: 5, comment: 'Excellent phone' }
          ],
          colors: ['Black', 'Silver'],
          sizes: [],
          featured: true,
          slug: 'smartphone-x-pro'
        },
        {
          name: 'Cotton T-Shirt',
          description: '100% organic cotton unisex tee',
          price: 24.99,
          category: categories[1]._id,
          images: ['https://www.jiomart.com/images/product/500x630/rvjj0ksuo1/tee-town-cotton-polo-neck-tshirt-for-mens-polo-1-grey-product-images-rvjj0ksuo1-0-202211011321.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAG6_6rQi9pvzoV0PsDPWGf7fCEwkRwdqrpA&s'],
          brand: 'FashionHub',
          stock: 200,
          colors: ['White', 'Black'],
          sizes: ['S', 'M', 'L'],
          slug: 'cotton-t-shirt'
        }
      ]);
      console.log(`🛍️  Created ${products.length} products`);
  
      console.log('✅ Database seeded successfully!');
    } catch (err) {
      console.error('❌ Seeding error:', err);
    } finally {
      await mongoose.disconnect();
      process.exit();
    }
  };
  
  seedDatabase();