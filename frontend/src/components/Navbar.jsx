import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Bulk Order", path: "/bulk-order" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md shadow-card py-3"
                : "bg-gradient-to-b from-black/50 to-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group z-50">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className={`p-2 rounded-full ${scrolled ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white backdrop-blur-sm'}`}
                    >
                        <Leaf size={24} />
                    </motion.div>
                    <h1
                        className={`font-heading font-extrabold text-xl md:text-2xl tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"
                            }`}
                    >
                        Cropnex
                        <span className={scrolled ? "text-primary" : "text-secondary"}>.</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-1 items-center bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path)
                                ? scrolled ? "text-white bg-primary shadow-glow" : "text-gray-900 bg-white shadow-soft"
                                : scrolled ? "text-gray-600 hover:text-primary hover:bg-primary/5" : "text-gray-200 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <Link to="/products" className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-soft ${scrolled ? 'bg-secondary text-yellow-900 hover:bg-yellow-400' : 'bg-white text-primary hover:bg-gray-100'}`}>
                        Shop Now
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden z-50">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 rounded-md transition-colors ${scrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/20"
                            }`}
                    >
                        {mobileMenuOpen ? <X size={24} className={scrolled ? "text-gray-900" : "text-white"} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden border-t border-gray-100"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive(link.path)
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <Link
                                    to="/products"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 rounded-lg text-base font-bold bg-primary text-white hover:bg-primary-dark transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;
