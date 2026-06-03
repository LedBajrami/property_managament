import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, MapPin, Shield } from "lucide-react";
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
        <div className="min-h-screen bg-background font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
                <span className="text-xl font-bold tracking-tight text-foreground">Havenly</span>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                        Sign in
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/my-applications")}>
                        My applications
                    </Button>
                    <Button size="sm" onClick={() => navigate("/register-applicant")}>
                        Get started
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-b from-muted/30 to-background">
                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Properties available now
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
                        Find your next
                        <span className="text-primary"> home</span>
                    </h1>

                    <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                        Browse verified properties, explore available units, and apply — all in one place.
                    </p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                className="pl-9 h-12 text-base border-border focus-visible:ring-primary"
                                placeholder="Search by city, address, or property name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
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
                        <div key={title} className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-muted/30">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-primary px-12 py-16 grid sm:grid-cols-2 gap-10 items-center">
                        {/* Decorative blobs */}
                        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-24 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                        {/* Text side */}
                        <div className="relative z-10">
                            <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-semibold mb-3">
                                Start today
                            </p>
                            <h2 className="text-4xl font-bold text-primary-foreground leading-tight mb-4">
                                Ready to find<br />your next home?
                            </h2>
                            <p className="text-primary-foreground/70 text-base leading-relaxed max-w-xs">
                                Browse all available properties and apply with ease.
                            </p>
                        </div>

                        {/* Action side */}
                        <div className="relative z-10 flex flex-col sm:items-end gap-4">
                            <Button
                                size="lg"
                                className="bg-background text-primary hover:bg-background/90 font-semibold text-base px-8 shadow-lg"
                                onClick={() => navigate("/browse")}
                            >
                                Browse properties
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Havenly. All rights reserved.
            </footer>
        </div>
    );
};
