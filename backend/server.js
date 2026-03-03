const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Product = require("./models/Product");
const Contact = require("./models/Contact");
const Admin = require("./models/Admin");
const Order = require("./models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get All Products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching products" });
    }
});

// Submit Contact Form
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Basic validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error submitting contact form" });
    }
});

// ==========================================
// BULK ORDERS & PAYMENTS (Razorpay Local Trial)
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

// Create Order (Initialize Razorpay Payment)
app.post("/api/orders/create", async (req, res) => {
    try {
        const { items, user } = req.body;

        let totalAmount = 0;
        const orderItems = [];

        // Validate items and calculate total from DB prices
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        if (totalAmount === 0) return res.status(400).json({ message: "Order total is 0" });

        // Initialize Razorpay Order
        const options = {
            amount: totalAmount * 100, // Razorpay takes amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save pending order to database
        const newOrder = new Order({
            user,
            items: orderItems,
            totalAmount,
            paymentDetails: {
                razorpayOrderId: razorpayOrder.id,
                status: "pending"
            }
        });
        await newOrder.save();

        res.status(200).json({
            success: true,
            order: newOrder,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount, // in paise
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy"
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
});

// Verify Razorpay Payment (Webhook/Callback)
app.post("/api/orders/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update the order in DB
            await Order.findByIdAndUpdate(orderId, {
                "paymentDetails.razorpayPaymentId": razorpay_payment_id,
                "paymentDetails.razorpaySignature": razorpay_signature,
                "paymentDetails.status": "paid"
            });

            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            await Order.findByIdAndUpdate(orderId, { "paymentDetails.status": "failed" });
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

app.post("/api/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (admin && (await admin.matchPassword(password))) {
            const token = jwt.sign(
                { username, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "12h" }
            );
            res.json({ token, message: "Logged in successfully" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// Admin Middleware Shield
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
    return next();
};

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

// Get All Messages (Admin only)
app.get("/api/admin/messages", verifyAdmin, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching messages" });
    }
});

// Get All Orders (Admin only)
app.get("/api/admin/orders", verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching orders" });
    }
});

// Create Product
app.post("/api/admin/products", verifyAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
});

// Update Product
app.put("/api/admin/products/:id", verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: "Error updating product" });
    }
});

// Delete Product
app.delete("/api/admin/products/:id", verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
