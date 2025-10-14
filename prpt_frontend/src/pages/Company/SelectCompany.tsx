import { Building2, ArrowRight, LogOut } from 'lucide-react';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";

export const SelectCompany = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSelectCompany = async (companyId: string) => {
        setSelectedId(companyId);
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 300));

        localStorage.setItem('current_company_id', companyId.toString());
        navigate('/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('current_company_id');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/10 mb-4">
                        <Building2 className="w-7 h-7 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.first_name || 'User'}</h1>
                    <p className="text-slate-400">Choose a company to continue</p>
                </div>

                {/* Companies Grid */}
                <div className="space-y-3 mb-8">
                    {user.companies?.map((company: any) => (
                        <button
                            key={company.id}
                            onClick={() => handleSelectCompany(company.id)}
                            disabled={isLoading && selectedId !== company.id}
                            className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
                                selectedId === company.id
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                                    : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40'
                            } ${isLoading && selectedId !== company.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {/* Glassmorphism effect */}
                            <div className="absolute inset-0 backdrop-blur-xl"></div>

                            {/* Content */}
                            <div className="relative px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                                        selectedId === company.id
                                            ? 'bg-white/30'
                                            : 'bg-white/10 group-hover:bg-white/20'
                                    }`}>
                                        <Building2 className={`w-6 h-6 ${
                                            selectedId === company.id ? 'text-white' : 'text-slate-300'
                                        }`} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-semibold transition-colors ${
                                            selectedId === company.id ? 'text-white' : 'text-slate-100'
                                        }`}>
                                            {company.name}
                                        </p>
                                        <p className={`text-sm transition-colors ${
                                            selectedId === company.id ? 'text-blue-100' : 'text-slate-400'
                                        }`}>
                                            {company.address || 'Property'}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow indicator */}
                                <ArrowRight className={`w-5 h-5 transition-all duration-300 ${
                                    selectedId === company.id
                                        ? 'text-white translate-x-1'
                                        : 'text-slate-400 group-hover:translate-x-0.5'
                                }`} />
                            </div>

                            {/* Loading state */}
                            {isLoading && selectedId === company.id && (
                                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-6 py-3 font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>

                <p className="text-center text-xs text-slate-500 mt-6">
                    {user.companies.length} companies available
                </p>
            </div>
        </div>
    );
};