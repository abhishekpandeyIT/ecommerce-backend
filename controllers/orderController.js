const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Verify products and calculate total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
      
      total += product.price * item.quantity;
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price
      });
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    const order = new Order({
      user: req.userId,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};