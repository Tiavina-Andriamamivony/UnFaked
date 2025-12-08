"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ScanLine, FileSearch, Video, FileText, Lock, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export default function ToolsPage() {
  const router = useRouter();

  const tools = [
    {
      title: "Scanner Module",
      description: "Analyze images for manipulation, deepfakes, and metadata anomalies using local AI.",
      icon: ScanLine,
      href: "/image-analysis",
      active: true,
      color: "text-[#ff1101]",
      bgColor: "bg-[#ff1101]/10",
      borderColor: "hover:border-[#ff1101]/50",
      cta: "Analyze Image"
    },
    {
      title: "Fact-Checking Engine",
      description: "Cross-reference claims and rumors against a global database of trusted sources.",
      icon: FileSearch,
      href: "/fact-checking",
      active: true,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/50",
      cta: "Verify Claim"
    },
    {
      title: "Video Forensics",
      description: "Frame-by-frame analysis to detect face swaps and generative video content.",
      icon: Video,
      href: "#",
      active: false,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "border-border/50",
      cta: "Coming Soon"
    },
    {
      title: "Text Analysis",
      description: "Detect LLM-generated text patterns and stylistic inconsistencies.",
      icon: FileText,
      href: "#",
      active: false,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "border-border/50",
      cta: "Coming Soon"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">
            UnFaked <span className="text-[#ff1101]">Toolbox</span>
          </h1>
          <p className="text-xl text-gray-600">
            Access our suite of forensic tools. Select a module below to start detecting misinformation.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              onClick={() => tool.active && router.push(tool.href)}
              className={cn(
                "relative group overflow-hidden rounded-3xl border-2 transition-all duration-300",
                tool.active
                  ? `bg-white border-transparent shadow-xl hover:shadow-2xl cursor-pointer ${tool.borderColor}`
                  : "bg-gray-100 border-gray-200 opacity-80 cursor-not-allowed"
              )}
            >
              <div className="p-8 h-full flex flex-col justify-between relative z-10">

                <div className="space-y-6">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between">
                    <div className={cn("size-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", tool.bgColor)}>
                      <tool.icon className={cn("size-7", tool.color)} />
                    </div>
                    {!tool.active && (
                      <Badge variant="secondary" className="bg-gray-200 text-gray-500 font-mono">Development</Badge>
                    )}
                    {tool.active && (
                      <Badge variant="outline" className={cn("font-mono border opacity-0 group-hover:opacity-100 transition-opacity", tool.color, tool.borderColor)}>Live v1.0</Badge>
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:translate-x-1 transition-transform">{tool.title}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className={cn("font-bold text-sm tracking-wide uppercase", tool.active ? "text-gray-900" : "text-gray-400")}>
                    {tool.cta}
                  </span>
                  {tool.active && (
                    <div className={cn("size-10 rounded-full flex items-center justify-center text-white transition-all transform group-hover:translate-x-2", tool.title.includes("Fact") ? "bg-blue-600" : "bg-[#ff1101]")}>
                      <ArrowRight className="size-5" />
                    </div>
                  )}
                  {!tool.active && (
                    <Lock className="size-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Decorative Gradient Background for active cards */}
              {tool.active && (
                <div className={cn("absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none", tool.title.includes("Fact") ? "bg-blue-500" : "bg-[#ff1101]")} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile App Banner */}
        <div className="mt-16 bg-neutral-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#ff1101]/20 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-xl flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#ff1101] font-mono text-sm uppercase tracking-wider font-bold">
                <Smartphone className="size-4" />
                Available Now
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Download the UnFaked Mobile App</h2>
              <p className="text-neutral-400 text-lg">
                Take our detection engine with you. Authenticate media on the go directly from your smartphone.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#ff1101] hover:bg-[#ff1101]/90 text-white font-bold rounded-full px-8 py-6 shadow-[0_0_30px_-5px_#ff1101]"
              onClick={() => window.open('https://expo.dev/accounts/tsanta22kyle/projects/unfaked-mobile/builds/2c2e837f-0f13-4bf1-b561-c4017d97b32a', '_blank')}
            >
              Get it on Expo
            </Button>
          </div>

          <div className="relative z-10 hidden md:block rotate-6 hover:rotate-0 transition-transform duration-500 origin-bottom-right">
            <div className="relative border-[6px] border-neutral-800 rounded-[2.5rem] bg-neutral-900 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-800 rounded-b-xl z-20" />
              <Image
                src="/phone.jpg"
                alt="UnFaked App Screenshot"
                width={240}
                height={480}
                className="h-[400px] w-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
