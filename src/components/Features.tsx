
import { ShieldCheck, Zap, ScanLine, FileSearch, Smartphone, Cpu, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ff1101]/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
                        The Ultimate Truth Engine
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        In an era of AI-generated misinformation, UnFaked provides the tools you need to verify reality.
                        Powered by <strong>TensorFlow</strong> and <strong>Google FactCheck</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

                    {/* Card 1: Image Analysis (Visual Intelligence) */}
                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-[#ff1101]/30 hover:shadow-[0_0_50px_-15px_rgba(255,17,1,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff1101]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="size-12 rounded-xl bg-[#ff1101]/10 flex items-center justify-center text-[#ff1101] mb-6">
                                <ScanLine className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3 text-foreground">Visual Forensics</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                    Our specialized visual engine uses <strong>Client-side TensorFlow.js</strong> models to scan images for compression artifacts, metadata anomalies, and AI generation signatures without your data ever leaving your device.
                                </p>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-500">EXIF Analysis</div>
                                    <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-500">Error Level Analysis</div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Effect */}
                        <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#ff1101]/20 rounded-full blur-3xl group-hover:bg-[#ff1101]/30 transition-colors" />
                    </div>

                    {/* Card 2: Fact Checking (Database) */}
                    <div className="md:col-span-1 group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-blue-500/30 hover:shadow-[0_0_50px_-15px_rgba(59,130,246,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                                <FileSearch className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Global Fact Database</h3>
                                <p className="text-muted-foreground mb-4">
                                    Instantly cross-reference rumors and news headers against the <strong>Google Fact Check Tools API</strong>.
                                </p>
                                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-500 font-mono inline-block">
                                    Trusted Sources Only
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Mobile App (React Native) */}
                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-purple-500/30 hover:shadow-[0_0_50px_-15px_rgba(168,85,247,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                            <div className="flex-1">
                                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                                    <Smartphone className="size-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">UnFaked Mobile</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Truth doesn't wait. Take our advanced detection algorithms with you anywhere. Built with <strong>React Native</strong> for seamless performance on iOS and Android.
                                </p>
                                <Link href="https://expo.dev/accounts/tsanta22kyle/projects/unfaked-mobile/builds/823f130b-1c68-4f68-8a0a-44bdc89395cc?fbclid=IwY2xjawOiBupleHRuA2FlbQIxMABicmlkETFhdndnNnh1T2hETDlMQnhZc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjwMEA3lARA3UaBHcZMX_Ba8cmYKghoiI86briZH7ktL3jEdU9bTh7U2psZv_aem_uG4sobAonFQnHcSWi9R6HA" target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20 rounded-full">
                                        Download on Expo Go
                                    </Button>
                                </Link>
                            </div>
                            {/* Phone Mockup Representation */}
                            <div className="relative w-32 h-64 border-4 border-neutral-800 rounded-[2rem] bg-neutral-900 shadow-xl flex items-center justify-center overflow-hidden">
                                <div className="absolute top-0 w-20 h-4 bg-neutral-800 rounded-b-xl z-20" />
                                <div className="w-full h-full bg-gradient-to-b from-[#ff1101]/20 to-neutral-900 flex items-center justify-center">
                                    <ShieldCheck className="size-12 text-[#ff1101]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Tech Stack (Technologies) */}
                    <div className="md:col-span-1 group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-green-500/30 hover:shadow-[0_0_50px_-15px_rgba(34,197,94,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                                <Cpu className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Core Technologies</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="size-1.5 rounded-full bg-orange-500" />
                                        <span>TensorFlow for AI</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="size-1.5 rounded-full bg-blue-500" />
                                        <span>Google FactCheck API</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="size-1.5 rounded-full bg-purple-500" />
                                        <span>React Native (Mobile)</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="size-1.5 rounded-full bg-white" />
                                        <span>Next.js 14 (Web)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
