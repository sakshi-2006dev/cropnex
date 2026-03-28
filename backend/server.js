const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Product = require("./models/Product");
const Contact = require("./models/Contact");
const Admin = require("./models/Admin");

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

// Change Password
app.put("/api/admin/change-password", verifyAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findOne({ username: req.user.username });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await admin.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error changing password" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
