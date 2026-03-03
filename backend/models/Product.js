const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['fertilizers', 'fungicides', 'insecticides']
    },
    description: { type: String, required: true },
    dosage: { type: String, required: true },
    benefits: { type: [String], default: [] },
    image: { type: String, default: '' },
    price: { type: Number, default: 499 }, // Default cost in INR for trial purposes
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
