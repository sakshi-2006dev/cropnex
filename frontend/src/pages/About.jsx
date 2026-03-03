import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Award } from 'lucide-react';

function About() {
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="font-sans bg-surface pb-24">
            {/* Dynamic Header */}
            <div className="relative pt-32 pb-20 bg-[#0A1A10] overflow-hidden text-center z-0">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1595841696677-6489ff3f8b1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A10] via-black/40 to-black/80 z-0"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto px-4"
                >
                    <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 text-white tracking-tight">
                        Our <span className="text-secondary">Lineage</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Cultivating a sustainable future through pioneering organic innovation and a profound respect for the earth.
                    </p>
                </motion.div>
            </div>

            {/* Main Narrative */}
            <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-14 mb-16 border border-gray-100"
                >
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">The Beginning</h2>
                            <h3 className="text-3xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">Rooted in Science.<br />Driven by Nature.</h3>
                            <div className="w-16 h-1 bg-secondary mb-8 rounded-full"></div>
                            <div className="prose prose-lg text-gray-600 space-y-5 leading-relaxed">
                                <p>
                                    <b>Cropnex Fourson Organic OPC Pvt. Ltd.</b> was established in 2015 out of a profound necessity. We witnessed firsthand the devastating impact of conventional chemical agriculture on land degradation, declining yields over time, and deteriorating farmer health.
                                </p>
                                <p>
                                    Our founders, a dedicated team of passionate agricultural scientists and experienced farmers, rejected the notion that toxic chemicals were necessary for high yields.
                                </p>
                                <p>
                                    Through relentless research and development, we have created pure biological alternatives that don't just protect crops—they actively regenerate soil microbiomes, restoring the earth to its natural, fertile state.
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl transform translate-x-4 translate-y-4 rounded-3xl z-0"></div>
                            <img
                                src="/images/about_us_agriculture.png"
                                alt="Organic Agriculture Field"
                                className="relative z-10 rounded-2xl shadow-xl w-full h-[400px] object-cover"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Core Values Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 gap-8"
                >
                    <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-50 to-emerald-50/20 rounded-3xl p-10 border border-green-100/50 hover:shadow-soft transition-shadow">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-primary flex items-center justify-center mb-6">
                            <Target size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-extrabold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To empower farmers with innovative biological and organic solutions that increase agricultural yield, improve crop quality, and fundamentally restore the natural balance of the farming ecosystem.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="bg-gradient-to-br from-yellow-50 to-orange-50/20 rounded-3xl p-10 border border-yellow-100/50 hover:shadow-soft transition-shadow">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-secondary-dark flex items-center justify-center mb-6">
                            <Lightbulb size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-extrabold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To be the most trusted and leading partner for progressive farmers across India, creating a future where completely organic agriculture is the standard, ensuring food security and ecological harmony.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default About;
