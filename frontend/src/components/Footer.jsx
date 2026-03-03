import React from 'react';
import { Leaf } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-[#0A1A10] text-gray-300 pt-16 pb-8 border-t border-primary/20 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-12">

                    {/* Company Info */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="flex items-center gap-2 group mb-6">
                            <div className="p-2 bg-primary/20 text-primary rounded-full">
                                <Leaf size={24} />
                            </div>
                            <h2 className="font-heading font-extrabold text-2xl text-white">
                                Cropnex<span className="text-secondary">.</span>
                            </h2>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed pr-4">
                            Pioneering sustainable agriculture. We are dedicated to providing farmers with scientifically-backed organic solutions that restore soil health and maximize yields without chemical harm.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social placeholders */}
                            {/*<a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </a>*/}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 lg:col-span-2 lg:col-start-6">
                        <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Explore</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="/" className="text-gray-400 hover:text-secondary flex items-center group transition-colors"><span className="w-2 h-px bg-secondary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span> Home</a></li>
                            <li><a href="/about" className="text-gray-400 hover:text-secondary flex items-center group transition-colors"><span className="w-2 h-px bg-secondary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span> About Us</a></li>
                            <li><a href="/products" className="text-gray-400 hover:text-secondary flex items-center group transition-colors"><span className="w-2 h-px bg-secondary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span> Products</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-secondary flex items-center group transition-colors"><span className="w-2 h-px bg-secondary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span> Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className="md:col-span-4 lg:col-span-4 lg:col-start-9">
                        <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Contact Us</h3>
                        <div className="space-y-4 text-sm text-gray-400">
                            <a href="mailto:sakshibgadakh2006@gmail.com" className="flex items-center hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                sakshibgadakh2006@gmail.com
                            </a>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div className="space-y-1">
                                    <p>Pradnya: +91 8767436959</p>
                                    <p>Sakshi: +91 9561628406</p>
                                    <p>Shruti: +91 8600615320</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p>Cropnex Fourson Organic OPC Pvt. Ltd.<br />Maharashtra, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Cropnex Fourson Organic. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
