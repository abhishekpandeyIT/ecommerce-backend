const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const adminController = require("../controllers/adminController");

// Dashboard stats
router.get("/dashboard", adminAuth, adminController.getDashboardStats);

// User management
router.get("/users", adminAuth, adminController.getAllUsers);
router.get("/users/:id", adminAuth, adminController.getUser);
router.put("/users/:id", adminAuth, adminController.updateUser);
router.delete("/users/:id", adminAuth, adminController.deleteUser);

// Product management
router.get("/products", adminAuth, adminController.getAllProducts);
router.post("/products", adminAuth, adminController.createProduct);
router.put("/products/:id", adminAuth, adminController.updateProduct);
router.delete("/products/:id", adminAuth, adminController.deleteProduct);

// Order management
router.get("/orders", adminAuth, adminController.getAllOrders);
router.patch(
  "/orders/:id/status",
  adminAuth,
  adminController.updateOrderStatus
);

// Reports
router.get("/sales-report", adminAuth, adminController.getSalesReport);

module.exports = router;
