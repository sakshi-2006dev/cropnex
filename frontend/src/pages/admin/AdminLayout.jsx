import React from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Leaf, PackageSearch, MessageSquareQuote, Settings, LogOut, ChevronRight } from 'lucide-react';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: PackageSearch },
        { name: 'Messages', path: '/admin/messages', icon: MessageSquareQuote },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-surface flex flex-col md:flex-row overflow-hidden">

            {/* Premium Sidebar */}
            <aside className="w-full md:w-72 bg-[#0A1A10] text-white flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 blur-[50px] pointer-events-none"></div>

                <div className="p-8 pb-4 relative z-10 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-glow">
                            <Leaf size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading font-bold text-white tracking-wide">Admin Hub</h2>
                            <p className="text-xs text-primary-light font-medium tracking-wider uppercase">Cropnex Organic</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive(link.path)
                                    ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3 font-medium">
                                <link.icon size={20} className={isActive(link.path) ? "text-primary-light" : "text-gray-500 group-hover:text-gray-300 transition-colors"} />
                                <span>{link.name}</span>
                            </div>
                            {isActive(link.path) && (
                                <motion.div layoutId="activeNavIndicator" className="w-1.5 h-1.5 rounded-full bg-primary-light"></motion.div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 relative z-10 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="group w-full flex items-center justify-between px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium border border-transparent hover:border-red-500/20"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Secure Logout</span>
                        </div>
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-heading">System Version 2.0</p>
                    </div>
                </div>
            </aside>

            {/* Smooth Animated Content View */}
            <main className="flex-1 relative overflow-hidden bg-surface">
                {/* Global subtle page background pattern/gradient could go here */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <div className="h-full overflow-y-auto p-4 sm:p-8 md:p-12 relative z-10 scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="max-w-7xl mx-auto min-h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
}

export default AdminLayout;
