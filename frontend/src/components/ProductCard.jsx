import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

function ProductCard({ product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const imageUrl = product.image || "https://images.unsplash.com/photo-1629158524458-7c85ffb15264?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft border border-gray-100/50 flex flex-col h-full group relative"
            >
                {/* Dynamic Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Image Container */}
                <div className="relative overflow-hidden h-60 bg-gray-100">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-4"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            {product.category || "Organic"}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col relative z-20">
                    <h2 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h2>

                    <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-grow leading-relaxed">
                        {product.description}
                    </p>

                    {/* Benefits Preview - Teaser */}
                    {product.benefits && product.benefits.length > 0 && (
                        <div className="mb-6">
                            <ul className="space-y-1">
                                {product.benefits.slice(0, 1).map((benefit, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">•</span>
                                        <span className="line-clamp-2">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            {product.benefits.length > 1 && (
                                <span className="inline-block mt-2 text-primary text-xs font-bold">
                                    + {product.benefits.length - 1} more benefits
                                </span>
                            )}
                        </div>
                    )}

                    {/* Footer info & CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex-1 flex flex-col bg-gray-50/80 rounded-xl p-3 border border-gray-100 group-hover:bg-primary/5 transition-colors">
                            <span className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">Recommended Dosage</span>
                            <span className="text-sm font-bold text-gray-900 line-clamp-1">{product.dosage}</span>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-12 w-12 flex-shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-105"
                        >
                            <ArrowRight size={20} className="stroke-[2.5px]" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Product Details Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-colors shadow-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="h-64 sm:h-80 relative flex-shrink-0 bg-gray-100">
                                <img src={imageUrl} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-contain p-4" />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-bold px-4 py-2 rounded-full shadow-sm capitalize border border-gray-200/50">
                                        {product.category || "Organic"}
                                    </span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32 pb-6 px-6 sm:px-8">
                                    <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2 drop-shadow-md">
                                        {product.name}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 overflow-y-auto">
                                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 mb-8 whitespace-pre-wrap leading-relaxed font-medium">
                                    {product.description}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                🌱
                                            </div>
                                            Key Benefits
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {product.benefits && product.benefits.length > 0 ? (
                                                product.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-gray-700 text-sm leading-relaxed">
                                                            {benefit}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic text-sm">No specific benefits listed.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center pl-0.5">
                                                🌿
                                            </div>
                                            Usage Instructions
                                        </h3>
                                        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                                            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1 block">Recommended Dosage</span>
                                            <div className="text-gray-900 font-bold text-base">
                                                {product.dosage}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ProductCard;
