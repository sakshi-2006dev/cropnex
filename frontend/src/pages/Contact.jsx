import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error', error);
            setStatus('error');
        }
    };

    return (
        <div className="font-sans bg-surface pb-24">
            <Helmet>
                <title>Contact Us | Cropnex</title>
                <meta name="description" content="Get in touch with Cropnex Fourson Organic OPC Pvt. Ltd. Our agricultural experts are ready to help you transition to sustainable, high-yield farming." />
            </Helmet>
            {/* Dynamic Header */}
            <div className="relative pt-32 pb-24 bg-[#0A1A10] overflow-hidden text-center z-0">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto px-4"
                >
                    <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 text-white tracking-tight">
                        Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-secondary">Connect</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Have questions about our products or need expert agricultural advice? Our team responds to all inquiries within 24 hours.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 flex flex-col lg:flex-row gap-8">

                {/* Contact Information Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:w-1/3 bg-gradient-to-br from-primary to-primary-dark text-white p-10 md:p-12 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 border-[8px] border-white/10 rounded-full z-0 pointer-events-none"></div>
                    <div className="absolute bottom-20 -left-10 w-32 h-32 border-4 border-secondary/20 rounded-full z-0 pointer-events-none"></div>

                    <div className="relative z-10 mb-12">
                        <h2 className="text-4xl font-heading font-extrabold mb-4 tracking-tight">Get in Touch</h2>
                        <p className="text-white/80 text-base font-light leading-relaxed">
                            We'd love to hear from you. Reach out to our dedicated team for any queries or agricultural support.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-10 flex-grow">
                        <motion.div whileHover={{ x: 5 }} className="flex items-start group">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-secondary mr-5 group-hover:bg-secondary group-hover:text-primary-dark transition-all duration-300 shadow-inner flex-shrink-0 border border-white/20 mt-1">
                                <Phone size={24} strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white/50 uppercase tracking-widest text-[11px] mb-3">Direct Line</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                        <span className="text-white/70 text-sm">Pradnya</span>
                                        <span className="font-semibold text-white tracking-wide">87674 36959</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                        <span className="text-white/70 text-sm">Sakshi</span>
                                        <span className="font-semibold text-white tracking-wide">95616 28406</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70 text-sm">Shruti</span>
                                        <span className="font-semibold text-white tracking-wide">86006 15320</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>


                        <motion.div whileHover={{ x: 5 }} className="flex items-start group">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-secondary mr-5 group-hover:bg-secondary group-hover:text-primary-dark transition-all duration-300 shadow-inner flex-shrink-0 border border-white/20">
                                <MapPin size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white/50 uppercase tracking-widest text-[11px] mb-2">Head Office</h4>
                                <p className="font-medium text-base text-white leading-relaxed">
                                    Cropnex Fourson Organic <br />
                                    <span className="text-white/70">Agriculture Growth Center, <br />Maharashtra, India</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="lg:w-2/3 bg-white rounded-3xl shadow-card p-8 md:p-12 border border-gray-100"
                >
                    <h3 className="text-2xl font-heading font-extrabold text-gray-900 mb-2">Drop us a line</h3>
                    <p className="text-gray-500 mb-8">Fill out the form below and we will get back to you shortly.</p>

                    {status === 'success' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center">
                            <CheckCircle2 className="w-6 h-6 mr-3 text-primary" />
                            <span className="font-medium">Message sent successfully! We'll contact you soon.</span>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
                            Oops! Something went wrong communicating with the server. Please try again or call us directly.
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-bold text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-bold text-gray-700">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl transition-all flex justify-center items-center shadow-soft hover:shadow-glow transform hover:-translate-y-0.5 ${status === 'sending' ? 'opacity-75 cursor-not-allowed scale-95 hover:transform-none' : ''}`}
                        >
                            {status === 'sending' ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Transmitting...
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <Send className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default Contact;
