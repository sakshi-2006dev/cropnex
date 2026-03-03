import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PackageSearch, AlertCircle, Loader2, CheckCircle, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>;

    return (
        <div className="w-full">
            <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <PackageSearch className="text-primary" size={32} />
                Bulk Orders Management
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PackageSearch size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">No Orders Yet</h3>
                    <p className="text-gray-500">When customers place bulk orders, they will appear here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Order Header */}
                            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-400 tracking-wider">ORDER ID: {order._id}</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{order.user.name}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 
                                        ${order.paymentDetails.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            order.paymentDetails.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                                    >
                                        {order.paymentDetails.status === 'paid' ? <CheckCircle size={16} /> :
                                            order.paymentDetails.status === 'failed' ? <AlertCircle size={16} /> : <Clock size={16} />}
                                        PAYMENT: {order.paymentDetails.status.toUpperCase()}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                                        <p className="text-xl font-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Body */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-2">Delivery Information</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-semibold text-gray-800">Email:</span> {order.user.email}</p>
                                        <p><span className="font-semibold text-gray-800">Phone:</span> {order.user.phone}</p>
                                        <p><span className="font-semibold text-gray-800">Address:</span> {order.user.address}</p>
                                    </div>

                                    {order.paymentDetails.status === 'paid' && (
                                        <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Razorpay IDs</p>
                                            <p className="text-xs text-blue-600 mt-1">Order: {order.paymentDetails.razorpayOrderId}</p>
                                            <p className="text-xs text-blue-600">Payment: {order.paymentDetails.razorpayPaymentId}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Items List */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-2">Ordered Items</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <p className="font-bold text-gray-900">₹{(item.quantity * item.price).toLocaleString('en-IN')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
