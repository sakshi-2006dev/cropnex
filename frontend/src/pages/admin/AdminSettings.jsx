import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

function AdminSettings() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }

        if (formData.newPassword.length < 6) {
            return setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Update your security credentials and dashboard preferences.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Shield className="text-primary-light" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Security & Password</h2>
                        <p className="text-sm text-gray-400">Keep your account secure with a strong password.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message.text && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-2xl flex items-center gap-3 ${
                                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-bold text-sm tracking-tight">{message.text}</span>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="h-px w-full bg-gray-100 my-2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="New password"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                                    <span>Update Password</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                        >
                            Reset Form
                        </button>
                    </div>
                </form>

                <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-start gap-3">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-700">Password Tips:</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed lowercase">Use at least 8 characters, including numbers and symbols. Avoid common words or personal info.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default AdminSettings;
