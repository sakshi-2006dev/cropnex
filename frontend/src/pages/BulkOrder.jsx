import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { CheckCircle, AlertTriangle, Package, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Replace with your backend URL in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function BulkOrder() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [user, setUser] = useState({ name: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' or 'error'

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/products`);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Load Razorpay script dynamically
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleQuantityChange = (productId, quantity) => {
        setCart(prev => ({
            ...prev,
            [productId]: Math.max(0, quantity) // No negative quantities
        }));
    };

    const totalAmount = products.reduce((total, product) => {
        const quantity = cart[product._id] || 0;
        return total + (product.price * quantity);
    }, 0);

    const handleCheckout = async (e) => {
        e.preventDefault();

        // Filter out items with 0 quantity
        const selectedItems = products
            .filter(p => cart[p._id] > 0)
            .map(p => ({
                productId: p._id,
                name: p.name,
                price: p.price,
                quantity: cart[p._id]
            }));

        if (selectedItems.length === 0) {
            alert("Please select at least one product.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order on Backend
            const { data: orderData } = await axios.post(`${API_URL}/orders/create`, {
                user,
                items: selectedItems
            });

            if (!orderData.success) {
                alert("Failed to initialize payment");
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout Modal
            const options = {
                key: orderData.key, // Your Razorpay Key ID
                amount: orderData.amount, // Amount in paise
                currency: "INR",
                name: "Cropnex Fourson Organic",
                description: "Bulk Order Payment",
                image: "/favicon.ico", // Your logo URL
                order_id: orderData.razorpayOrderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment on Backend
                        const verifyRes = await axios.post(`${API_URL}/orders/verify`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.order._id
                        });

                        if (verifyRes.data.success) {
                            setStatus("success");
                            setCart({}); // clear cart
                        } else {
                            setStatus("error");
                        }
                    } catch (error) {
                        setStatus("error");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone,
                },
                theme: {
                    color: "#166534", // text-primary dark green
                },
            };

            const rzp1 = new window.Razorpay(options);

            rzp1.on('payment.failed', function (response) {
                console.error("Payment Failed", response.error);
                alert("Payment processing failed. Please try again.");
            });

            rzp1.open();

        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Something went wrong while setting up checkout.");
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center pt-24 pb-16 px-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-4">Payment Successful!</h2>
                    <p className="text-gray-600 mb-8 text-lg">Your bulk order has been successfully placed. Our team will contact you shortly regarding delivery.</p>
                    <button onClick={() => setStatus(null)} className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-glow hover:bg-primary-dark transition-colors">
                        Place Another Order
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Helmet>
                <title>Bulk Order | Cropnex</title>
                <meta name="description" content="Order 100% organic fertilizers and pesticides in bulk securely." />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-4">
                    Commercial <span className="text-primary">Bulk Orders</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Select your required products in bulk and checkout securely online.
                </p>
            </div>

            <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Side: Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                            <Package className="text-primary" /> Select Products
                        </h2>

                        {products.length === 0 ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
                        ) : (
                            <div className="space-y-4">
                                {products.map(product => (
                                    <div key={product._id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                                            <p className="font-bold text-primary mt-1">₹{product.price} / per unit</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                                            <button type="button" onClick={() => handleQuantityChange(product._id, (cart[product._id] || 0) - 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">-</button>
                                            <span className="w-8 text-center font-semibold">{cart[product._id] || 0}</span>
                                            <button type="button" onClick={() => handleQuantityChange(product._id, (cart[product._id] || 0) + 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Order Summary & User Details */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-bold font-heading mb-6">Delivery Details</h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input required type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required type="tel" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="+91 9876543210" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                <textarea required rows="3" value={user.address} onChange={e => setUser({ ...user, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="Complete address with PIN code"></textarea>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-semibold text-gray-600">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={totalAmount === 0 || loading}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-glow ${totalAmount === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary-dark'}`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Proceed to Payment securely'}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                                <AlertTriangle size={12} /> Local Trial: Using Test Payment Data
                            </p>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default BulkOrder;
