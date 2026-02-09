import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';

export const AuthHeader = ({ title, subtitle, icon: Icon, colorClass = "bg-[#6C5DD3]" }) => (
    <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-4">
            {Icon && (
                <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center shadow-lg shadow-purple-100/50`}>
                    <Icon className="text-white w-6 h-6" />
                </div>
            )}
            <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-[1.1]">{title}</h1>
                {subtitle && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    </div>
);

export const AuthSection = ({ title }) => (
    <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-4 mt-8 first:mt-0">
        {title}
    </h3>
);

export const AuthInput = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required = true }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Icon className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5DD3] transition-colors" />
                </div>
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-11 py-3 bg-white border border-[#D0D5DD] rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:border-[#6C5DD3] focus:ring-4 focus:ring-purple-50 transition-all shadow-sm placeholder:text-slate-400"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export const AuthSelect = ({ label, icon: Icon, value, onChange, options, required = true }) => (
    <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5DD3] transition-colors" />
            </div>
            <select
                required={required}
                value={value}
                onChange={onChange}
                className="w-full pl-11 pr-11 py-3 bg-white border border-[#D0D5DD] rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:border-[#6C5DD3] focus:ring-4 focus:ring-purple-50 transition-all shadow-sm appearance-none cursor-pointer"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-400"></div>
            </div>
        </div>
    </div>
);

export const AuthAlert = ({ message }) => (
    <div className="mb-6 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
        <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11px] font-bold leading-tight uppercase tracking-wider">{message}</p>
    </div>
);

export const AuthButton = ({ children, loading, type = "submit", securityText }) => (
    <div className="space-y-4 pt-2">
        <button
            type={type}
            disabled={loading}
            className="w-full py-3 bg-[#6C5DD3] text-white font-black text-xs uppercase rounded-lg hover:bg-[#5B4DB3] shadow-xl shadow-purple-200/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Processing...' : children}
        </button>
        {securityText && (
            <div className="flex items-center justify-center gap-1.5 text-slate-400">
                <Lock size={10} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{securityText}</span>
            </div>
        )}
    </div>
);
