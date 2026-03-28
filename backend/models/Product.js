const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['fertilizers', 'fungicides', 'insecticides']
    },
    company: { type: String, default: '' },
    description: { type: String, required: true },
    usagePerAcre: { type: String, default: '' },
    dosage: { type: String, required: true },
    benefits: { type: [String], default: [] },
    contactName: { type: String, default: '' },
    phone: { type: String, default: '' },
    image: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
