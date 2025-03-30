const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

// Regular email/password login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// In backend/controllers/authController.js
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token (implementation depends on your email service)
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email (implementation depends on your email service)
  // await sendResetEmail(user.email, resetToken);

  res.json({ message: 'Password reset email sent' });
};

// Firebase social login
exports.firebaseLogin = async (req, res) => {
  const { idToken } = req.body;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({
        name,
        email,
        firebaseUid: uid
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Send password reset code via Firebase
    await sendPasswordResetEmail(auth, email);
    
    res.status(200).json({ 
      success: true, 
      message: 'Password reset code sent to your email (simulated)',
      // In development, we'll return a simulated code
      development: {
        mockCode: '123456' // Only for development/testing
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { code, email } = req.body;
    
    // In production, this would verify with Firebase
    if (process.env.NODE_ENV === 'production') {
      await verifyPasswordResetCode(auth, code);
    } else {
      // Development/testing mock verification
      if (code !== '123456') {
        throw new Error('Invalid reset code');
      }
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Code verified successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { code, newPassword, email } = req.body;
    
    // In production, use Firebase to reset password
    if (process.env.NODE_ENV === 'production') {
      await confirmPasswordReset(auth, code, newPassword);
    } else {
      // Development/testing mock reset
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};