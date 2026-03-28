import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Leaf, Sprout, ShieldCheck, Bug, Phone, User, Building, Info } from 'lucide-react';
import { motion } from 'framer-motion';

function ProductInfoPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Using the standard public product endpoint
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                const found = data.find(p => p._id === id);
                if (!found) throw new Error("Product not found");
                setProduct(found);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full shadow-lg"></motion.div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-red-50">
                <div className="text-red-500 mb-4 text-6xl">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h1>
                <p className="text-gray-600 mb-6">{error || "Product not found"}</p>
                <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">Try Again</button>
            </div>
        );
    }

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'fertilizers': return <Leaf className="text-green-600" size={28} />;
            case 'fungicides': return <ShieldCheck className="text-blue-600" size={28} />;
            case 'insecticides': return <Bug className="text-orange-600" size={28} />;
            default: return <Sprout className="text-gray-600" size={28} />;
        }
    };

    const categoryLabel = product.category ? product.category.toUpperCase().slice(0, -1) : "ORGANIC"; // Remove 's' from fertilizers etc.

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-primary selection:text-white">
            <Helmet>
                <title>{product.name} | Cropnex Organic</title>
            </Helmet>

            {/* Header / Banner */}
            <div className="bg-gradient-to-br from-[#0A1A10] to-[#1A3A20] text-white py-12 px-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-6 border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        {getCategoryIcon(product.category)}
                    </motion.div>
                    <h2 className="text-lg font-bold tracking-[0.2em] mb-2 text-primary-light">
                        🌱 ORGANIC {categoryLabel}
                    </h2>
                    <h1 className="text-4xl md:text-5xl font-heading font-black mb-1">{product.name}</h1>
                    <div className="flex items-center gap-2 text-gray-300 font-medium">
                        <Building size={16} />
                        <span>Company: {product.company || "Cropnex"}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                
                {/* Product Info Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                            <Info size={24} />
                        </div>
                        <h3 className="text-2xl font-black font-heading uppercase tracking-wide">Product Info:</h3>
                    </div>
                    <div className="h-[2px] w-full bg-gradient-to-r from-primary to-transparent mb-6 opacity-30"></div>
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                        {product.description}
                    </p>
                </section>

                {/* Usage Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary-dark shadow-sm">
                            <Sprout size={24} />
                        </div>
                        <h3 className="text-2xl font-black font-heading uppercase tracking-wide">Usage Per Acre:</h3>
                    </div>
                    <div className="h-[2px] w-full bg-gradient-to-r from-secondary to-transparent mb-6 opacity-30"></div>
                    <div className="bg-surface p-8 rounded-3xl border border-gray-100 shadow-soft">
                        <p className="text-xl text-gray-800 font-bold leading-relaxed">
                            {product.usagePerAcre || product.dosage || "Refer to label for detailed instructions."}
                        </p>
                    </div>
                </section>

                {/* Benefits Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent-dark shadow-sm">
                            <Leaf size={24} />
                        </div>
                        <h3 className="text-2xl font-black font-heading uppercase tracking-wide">Benefits:</h3>
                    </div>
                    <div className="h-[2px] w-full bg-gradient-to-r from-accent to-transparent mb-6 opacity-30"></div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.benefits && product.benefits.length > 0 ? (
                            product.benefits.map((benefit, i) => (
                                <motion.li 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-accent/30 transition-colors"
                                >
                                    <div className="mt-1 w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </motion.li>
                            ))
                        ) : (
                            <li className="text-gray-500 italic">No benefits listed yet.</li>
                        )}
                    </ul>
                </section>

                {/* Contact Footer */}
                <section className="pt-8 mt-12 border-t-4 border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4 bg-primary text-white p-6 rounded-3xl shadow-glow">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <User size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Contact:</p>
                            <p className="text-xl font-heading font-black">{product.contactName || "Agricultural Expert"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-secondary text-yellow-900 p-6 rounded-3xl shadow-glow">
                        <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Phone size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Phone:</p>
                            <a href={`tel:${product.phone}`} className="text-xl font-heading font-black hover:underline transition-all">
                                {product.phone || "Contact via Head Office"}
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* Branded Footer */}
            <div className="bg-gray-50 py-12 text-center mt-20">
                <p className="italic text-gray-400 font-medium px-4">"Scientifically Advanced Organic Farming for a Better Tomorrow"</p>
                <div className="mt-4 text-xs font-bold text-gray-300 tracking-widest uppercase">
                    &copy; 2026 Cropnex Fourson Organic OPC Pvt. Ltd.
                </div>
            </div>
        </div>
    );
}

export default ProductInfoPage;
