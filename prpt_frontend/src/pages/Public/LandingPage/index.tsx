import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, MapPin, Shield, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LandingPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/browse${search.trim() ? `?location=${encodeURIComponent(search.trim())}` : ""}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                <span className="text-xl font-bold tracking-tight text-zinc-900">Havenly</span>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                        Sign in
                    </Button>
                    <Button size="sm" onClick={() => navigate("/register-applicant")}>
                        Get started
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-50 opacity-60" />
                    <div className="absolute top-60 -left-20 w-[300px] h-[300px] rounded-full bg-blue-50 opacity-40" />
                </div>

                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Properties available now
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 leading-tight tracking-tight mb-6">
                        Find your next
                        <span className="text-emerald-600"> home</span>
                    </h1>

                    <p className="text-lg text-zinc-500 mb-10 max-w-xl mx-auto">
                        Browse verified properties, explore available units, and apply — all in one place.
                    </p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                className="pl-9 h-12 text-base border-zinc-200 focus-visible:ring-emerald-500"
                                placeholder="Search by city, address, or property name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                    </form>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 max-w-5xl mx-auto">
                <div className="grid sm:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Building2,
                            title: "Verified properties",
                            desc: "Every listing is managed by a registered property management company.",
                        },
                        {
                            icon: Search,
                            title: "Easy filtering",
                            desc: "Filter by location, bedrooms, rent range, and property type to find your match.",
                        },
                        {
                            icon: Shield,
                            title: "Secure applications",
                            desc: "Submit your rental application online and track its status in real time.",
                        },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex flex-col gap-3 p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-zinc-900">{title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center rounded-3xl bg-emerald-600 py-16 px-8">
                    <Star className="w-8 h-8 text-emerald-200 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to find your home?</h2>
                    <p className="text-emerald-100 mb-8">Browse all available properties and apply with ease.</p>
                    <Button
                        size="lg"
                        className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
                        onClick={() => navigate("/browse")}
                    >
                        Browse properties
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-100 py-8 px-6 text-center text-sm text-zinc-400">
                © {new Date().getFullYear()} Havenly. All rights reserved.
            </footer>
        </div>
    );
};