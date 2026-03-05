import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Package, Search, Image as ImageIcon } from 'lucide-react';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: 'fertilizers', description: '', dosage: '', benefits: '', image: ''
    });

    const getHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddNew = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData({ name: '', category: 'fertilizers', description: '', dosage: '', benefits: '', image: '' });
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setFormData({
            name: product.name || '',
            category: product.category || 'fertilizers',
            description: product.description || '',
            dosage: product.dosage || '',
            benefits: product.benefits ? product.benefits.join('\n') : '',
            image: product.image || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? Action cannot be undone.')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
                    method: 'DELETE',
                    headers: getHeaders()
                });

                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/admin/login';
                    return;
                }

                if (res.ok) {
                    setProducts(products.filter(p => p._id !== id));
                } else {
                    alert("Failed to delete product");
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            benefits: formData.benefits.split('\n').map(b => b.trim()).filter(b => b)
        };

        try {
            if (isEditing) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: getHeaders(),
                    body: JSON.stringify(formattedData)
                });

                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/admin/login';
                    return;
                }

                if (res.ok) {
                    const updatedProduct = await res.json();
                    setProducts(products.map(p => p._id === currentProduct._id ? updatedProduct : p));
                }
            } else {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(formattedData)
                });

                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/admin/login';
                    return;
                }

                if (res.ok) {
                    const newProduct = await res.json();
                    setProducts([newProduct, ...products]);
                }
            }
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const getCategoryStyles = (cat) => {
        switch (cat) {
            case 'fertilizers': return 'bg-green-100 text-green-800 border-green-200';
            case 'fungicides': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'insecticides': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <Package className="text-primary hidden sm:block" size={32} />
                        Product Catalog
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your organic product inventory</p>
                </div>
                {!showForm && (
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all bg-white shadow-soft"
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded-xl transition-all flex items-center gap-2 shadow-glow hover:-translate-y-0.5"
                        >
                            <Plus size={20} className="stroke-[3px]" />
                            <span className="hidden sm:inline">Add Product</span>
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {showForm ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 mb-8 relative overflow-hidden"
                    >
                        {/* Decorative Background for Form */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none -z-0"></div>

                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 relative z-10">
                            <h2 className="text-2xl font-heading font-bold text-gray-900">
                                {isEditing ? 'Edit Existing Product' : 'Create New Product'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Product Name *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900" placeholder="e.g. Cropnex Super Bio" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category *</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 appearance-none">
                                        <option value="fertilizers">Organic Fertilizers</option>
                                        <option value="fungicides">Organic Fungicides</option>
                                        <option value="insecticides">Organic Insecticides</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Product Description *</label>
                                    <textarea required name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 leading-relaxed resize-none" placeholder="Detailed product description..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Recommended Dosage *</label>
                                    <input required type="text" name="dosage" placeholder="e.g. 5 Liters per Acre" value={formData.dosage} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Benefits (One per line)</label>
                                    <textarea name="benefits" rows="3" placeholder="Improves yield&#10;Safe for bees..." value={formData.benefits} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 resize-none"></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Image URL</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <ImageIcon size={20} />
                                        </div>
                                        <input type="text" name="image" placeholder="https://res.cloudinary.com/..." value={formData.image} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-3.5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900" />
                                    </div>
                                    {formData.image && (
                                        <div className="mt-4 p-2 border border-gray-100 rounded-xl inline-block bg-gray-50 shadow-sm">
                                            <img src={formData.image} alt="Preview" className="h-24 object-contain rounded-lg" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 mt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-glow hover:-translate-y-0.5 flex items-center gap-2">
                                    {isEditing ? <><Edit2 size={18} /> Update Product</> : <><Plus size={18} className="stroke-[3px]" /> Save New Product</>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-gray-100 border-t-primary rounded-full"></motion.div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/80 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest w-2/5">Product Details</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest w-1/5">Category</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest w-1/5">Dosage</th>
                                            <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest w-1/5">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {filteredProducts.map((product, idx) => (
                                            <motion.tr
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={product._id}
                                                className="hover:bg-gray-50/50 transition-colors group"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        {product.image ? (
                                                            <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-white p-1">
                                                                <img src={product.image} className="w-full h-full object-contain" alt="" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 flex-shrink-0">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{product.name}</div>
                                                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs font-bold border rounded-full uppercase tracking-wider ${getCategoryStyles(product.category)}`}>
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    {product.dosage}
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                            title="Edit Product"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-16 text-center">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-400 text-2xl">
                                                        <Search size={24} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                                                    <p className="text-gray-500">
                                                        {searchQuery ? `No products match "${searchQuery}"` : "Your catalog is empty. Add a product to get started."}
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminProducts;
