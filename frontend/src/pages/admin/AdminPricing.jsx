import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Tag, Plus, X, Trash2, Edit2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

function AdminPricing() {
    // Products & Pricing State
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [priceForm, setPriceForm] = useState({ price: '', bulkDiscount: '' });

    // Coupons State
    const [coupons, setCoupons] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState(true);
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '', expiresAt: '' });

    const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';
    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    useEffect(() => {
        fetchProducts();
        fetchCoupons();
    }, []);

    // --- PRODUCTS & PRICING ---
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/products`);
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products for pricing', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleEditPrice = (product) => {
        setEditingProduct(product._id);
        setPriceForm({
            price: product.price || 0,
            bulkDiscount: product.bulkDiscount || 0
        });
    };

    const handleSavePrice = async (productId) => {
        try {
            const res = await axios.put(`${API_URL}/admin/products/${productId}`, {
                price: Number(priceForm.price),
                bulkDiscount: Number(priceForm.bulkDiscount)
            }, getHeaders());

            setProducts(products.map(p => p._id === productId ? res.data : p));
            setEditingProduct(null);
        } catch (error) {
            alert('Failed to update pricing');
            console.error(error);
        }
    };

    // --- COUPONS ---
    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/coupons`, getHeaders());
            setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        } finally {
            setLoadingCoupons(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/admin/coupons`, {
                code: couponForm.code,
                discountPercent: Number(couponForm.discountPercent),
                isActive: true,
                expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt) : null
            }, getHeaders());

            setCoupons([res.data, ...coupons]);
            setShowCouponForm(false);
            setCouponForm({ code: '', discountPercent: '', expiresAt: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Delete this coupon permanently?')) return;
        try {
            await axios.delete(`${API_URL}/admin/coupons/${id}`, getHeaders());
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    return (
        <div className="pb-10 font-sans space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <IndianRupee className="text-primary hidden sm:block" size={32} />
                    Pricing & Offers
                </h1>
                <p className="text-gray-500 mt-1 font-medium">Manage product base prices, bulk discounts, and marketing coupons.</p>
            </div>

            {/* Section 1: Product Pricing Table */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold font-heading text-gray-900">Product Pricing & Bulk Discounts</h2>
                </div>

                {loadingProducts ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Base Price (₹)</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Bulk Discount (%)</th>
                                    <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="font-bold text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                                        </td>

                                        {/* Editable Price Column */}
                                        <td className="px-8 py-4">
                                            {editingProduct === product._id ? (
                                                <input
                                                    type="number" min="0"
                                                    className="w-24 px-3 py-1.5 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                                    value={priceForm.price}
                                                    onChange={e => setPriceForm({ ...priceForm, price: e.target.value })}
                                                />
                                            ) : (
                                                <span className="font-bold text-gray-700">₹{product.price?.toLocaleString() || 0}</span>
                                            )}
                                        </td>

                                        {/* Editable Discount Column */}
                                        <td className="px-8 py-4">
                                            {editingProduct === product._id ? (
                                                <input
                                                    type="number" min="0" max="100"
                                                    className="w-20 px-3 py-1.5 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-green-700 bg-green-50"
                                                    value={priceForm.bulkDiscount}
                                                    onChange={e => setPriceForm({ ...priceForm, bulkDiscount: e.target.value })}
                                                />
                                            ) : (
                                                <span className={`font-bold px-3 py-1 rounded-full text-xs border ${product.bulkDiscount > 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                    {product.bulkDiscount || 0}% OFF
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-8 py-4 text-right">
                                            {editingProduct === product._id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingProduct(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                                                        <X size={18} />
                                                    </button>
                                                    <button onClick={() => handleSavePrice(product._id)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-bold" title="Save changes">
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleEditPrice(product)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-end gap-2 ml-auto">
                                                    <Edit2 size={16} /> <span className="text-sm font-semibold">Edit Values</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Section 2: Coupon Management */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                        <Tag className="text-primary" size={24} /> Promotional Coupons
                    </h2>
                    {!showCouponForm && (
                        <button onClick={() => setShowCouponForm(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 shadow-sm text-sm">
                            <Plus size={16} className="stroke-[3px]" /> Create Coupon
                        </button>
                    )}
                </div>

                {/* Coupon Creation Form */}
                <AnimatePresence>
                    {showCouponForm && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-gray-100 overflow-hidden bg-primary/5">
                            <form onSubmit={handleCreateCoupon} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Coupon Code *</label>
                                        <input required type="text" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono font-bold uppercase" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Discount % *</label>
                                        <input required type="number" min="1" max="100" value={couponForm.discountPercent} onChange={e => setCouponForm({ ...couponForm, discountPercent: e.target.value })} placeholder="e.g. 15" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Expiry Date (Optional)</label>
                                        <input type="date" value={couponForm.expiresAt} onChange={e => setCouponForm({ ...couponForm, expiresAt: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowCouponForm(false)} className="px-5 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all shadow-glow">Generate Coupon</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Coupons Table */}
                {loadingCoupons ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : coupons.length === 0 ? (
                    <div className="py-12 text-center">
                        <Tag size={40} className="mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900">No active coupons</h3>
                        <p className="text-gray-500">Create a discount code to share with your customers.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {coupons.map(coupon => {
                                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                                return (
                                    <div key={coupon._id} className={`border rounded-2xl p-5 relative overflow-hidden ${isExpired ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100 shadow-sm'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`font-mono text-xl font-extrabold tracking-widest ${isExpired ? 'text-gray-400 line-through' : 'text-primary-dark'}`}>
                                                {coupon.code}
                                            </span>
                                            <button onClick={() => handleDeleteCoupon(coupon._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`px-2.5 py-1 rounded-md text-sm font-bold ${isExpired ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-800'}`}>
                                                {coupon.discountPercent}% OFF
                                            </span>
                                            {isExpired && <span className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={12} /> EXPIRED</span>}
                                        </div>

                                        <p className="text-xs text-gray-500 font-medium">
                                            {coupon.expiresAt ? `Valid until: ${new Date(coupon.expiresAt).toLocaleDateString()}` : 'Never expires'}
                                        </p>

                                        {/* Decorative ticket cutout */}
                                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100/0"></div>
                                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100/0"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default AdminPricing;
