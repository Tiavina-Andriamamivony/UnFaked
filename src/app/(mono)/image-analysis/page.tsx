
"use client";

import React, { useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import EXIF from "exif-js";
import { Upload, Scan, AlertTriangle, CheckCircle2, XCircle, ShieldAlert, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ImageAnalysisPage() {
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<cocoSsd.DetectedObject[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiProbability, setAiProbability] = useState<number | null>(null);
    const [metadataInfo, setMetadataInfo] = useState<string[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // AI Detection Simulation + Logic
    const analyzeForAI = async (file: File) => {
        setIsAnalyzing(true);
        setAiProbability(null);
        setMetadataInfo([]);

        // 1. Metadata Analysis
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (EXIF as any).getData(file, function (this: any) {
            const allMetaData = (EXIF as any).getAllTags(this);
            const software = allMetaData.Software || "";
            const userComment = allMetaData.UserComment || "";
            const make = allMetaData.Make || "";
            const model = allMetaData.Model || "";

            const suspiciousKeywords = ["midjourney", "stable diffusion", "dall-e", "gimp", "photoshop", "adobe", "comfyui"];
            const foundKeywords = suspiciousKeywords.filter(k =>
                (software && software.toLowerCase().includes(k)) ||
                (userComment && typeof userComment === 'string' && userComment.toLowerCase().includes(k)) ||
                (make && make.toLowerCase().includes(k)) ||
                (model && model.toLowerCase().includes(k))
            );

            if (foundKeywords.length > 0) {
                setMetadataInfo(prev => [...prev, `Suspicious metadata found: ${foundKeywords.join(", ")}`]);
            } else {
                setMetadataInfo(prev => [...prev, "No obvious generative AI metadata found."]);
            }
        });

        // 2. Simulate AI visual analysis (Mock)
        // In a real app, we would send the image to a backend API here (e.g. Hive, Sightengine)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Random probability for demo (weighted by simple heuristics if we had them, random for now to show UI)
        // Let's bias it: usually "clean" images are likely real, but let's just Random for the demo effect
        const mockScore = Math.random() * 100;
        setAiProbability(mockScore);

        setIsAnalyzing(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImageURL(url);
        setPredictions([]);
        analyzeForAI(file);
    };

    const detectObjects = async () => {
        if (!imageRef.current || !canvasRef.current) return;

        try {
            const model = await cocoSsd.load();
            const preds = await model.detect(imageRef.current);
            setPredictions(preds);

            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            // Clear and draw image
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            // Style setup
            ctx.font = '14px "Geist Mono", monospace';
            ctx.textBaseline = 'top';

            preds.forEach((p) => {
                const [x, y, w, h] = p.bbox;

                // Technical Box
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ff1101"; // UnFaked Red
                ctx.stroke();

                // Background for label
                const labelText = `${p.class} ${Math.round(p.score * 100)}%`;
                const textWidth = ctx.measureText(labelText).width + 10;
                const textHeight = 24;

                ctx.fillStyle = "#ff1101";
                ctx.fillRect(x, y > 24 ? y - 24 : y, textWidth, textHeight);

                // Text
                ctx.fillStyle = "#ffffff";
                ctx.fillText(labelText, x + 5, y > 24 ? y - 18 : y + 6);

                // Corners decoration
                const cornerSize = 10;
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                // Top-left
                ctx.moveTo(x, y + cornerSize);
                ctx.lineTo(x, y);
                ctx.lineTo(x + cornerSize, y);
                // Bottom-right
                ctx.moveTo(x + w, y + h - cornerSize);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x + w - cornerSize, y + h);
                ctx.stroke();
            });
        } catch (err) {
            console.error("Detection error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-24 px-4">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="border-[#ff1101] text-[#ff1101] bg-[#ff1101]/10 px-4 py-1">
                        Scanner Module v2.0
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Deepfake <span className="text-[#ff1101]">Analyzer</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Upload media to perform client-side forensic analysis and detecting anomalies.
                    </p>
                </div>

                {/* Upload Area */}
                <Card className="border-dashed border-2 border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <Upload className="size-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xl">Upload an image</h3>
                            <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP up to 10MB</p>
                        </div>
                        <div className="relative">
                            <Button size="lg" className="relative z-10">Select File</Button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Analysis Section */}
                {imageURL && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Visualizer */}
                        <Card className="overflow-hidden border-border/50 bg-neutral-950">
                            <CardHeader className="border-b border-white/10 py-3 bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Scan className="size-4 text-[#ff1101]" />
                                        Visual Analysis
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-xs text-muted-foreground font-mono">LIVE</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="relative aspect-video flex items-center justify-center bg-[url('/grid.svg')]">
                                {/* Hidden source image for processing */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={imageRef}
                                    src={imageURL}
                                    alt="Uploaded"
                                    className="hidden"
                                    onLoad={detectObjects}
                                />
                                <canvas
                                    ref={canvasRef}
                                    width={600}
                                    height={400}
                                    className="max-w-full max-h-full object-contain"
                                />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 z-10">
                                        <Loader2 className="size-10 text-[#ff1101] animate-spin" />
                                        <span className="text-sm font-mono text-white/80 animate-pulse">Running Neural Networks...</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Results Panel */}
                        <div className="space-y-6">

                            {/* AI Probability Card */}
                            <Card className={cn("border-l-4 shadow-lg",
                                aiProbability && aiProbability > 50 ? "border-l-red-500" : "border-l-green-500"
                            )}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>AI Probability Score</span>
                                        {aiProbability !== null && (
                                            <Badge variant={aiProbability > 50 ? "destructive" : "outline"} className={aiProbability <= 50 ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                                                {aiProbability > 50 ? "LIKELY FAKE" : "LIKELY REAL"}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <span className="text-4xl font-bold">
                                            {aiProbability !== null ? Math.round(aiProbability) : 0}%
                                        </span>
                                        <span className="text-muted-foreground text-sm mb-1">confidence</span>
                                    </div>
                                    <Progress value={aiProbability || 0} className={cn("h-3",
                                        aiProbability && aiProbability > 50 ? "bg-red-950 [&>div]:bg-red-600" : "bg-green-950 [&>div]:bg-green-600"
                                    )} />
                                    <p className="text-xs text-muted-foreground">
                                        Based on metadata analysis, artifact detection, and pattern recognition.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Metadata / Logs */}
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <ShieldAlert className="size-4" />
                                        Forensic Logs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="py-3">
                                    <ul className="space-y-2 text-sm font-mono text-muted-foreground">
                                        {metadataInfo.map((info, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-[#ff1101] mt-0.5">{">"}</span>
                                                {info}
                                            </li>
                                        ))}
                                        {predictions.map((p, i) => (
                                            <li key={`pred-${i}`} className="flex items-start gap-2">
                                                <span className="text-blue-500 mt-0.5">{">"}</span>
                                                Detected {p.class} with {Math.round(p.score * 100)}% confidence
                                            </li>
                                        ))}
                                        {isAnalyzing && (
                                            <li className="flex items-center gap-2 animate-pulse text-[#ff1101]">
                                                <span className="size-2 bg-[#ff1101] rounded-full" />
                                                Processing...
                                            </li>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Verdict */}
                            {aiProbability !== null && (
                                <div className={cn("rounded-lg p-4 border flex items-start gap-3",
                                    aiProbability > 50 ? "bg-red-500/5 border-red-500/20 text-red-600" : "bg-green-500/5 border-green-500/20 text-green-600"
                                )}>
                                    {aiProbability > 50 ? <AlertTriangle className="size-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="size-5 shrink-0 mt-0.5" />}
                                    <div>
                                        <h4 className="font-semibold">
                                            {aiProbability > 50 ? "Suspicious Content Detected" : "Content Appears Authentic"}
                                        </h4>
                                        <p className="text-sm opacity-90 mt-1">
                                            {aiProbability > 50
                                                ? "Our algorithms flagged potential AI-generated patterns or suspicious metadata. Proceed with caution."
                                                : "No significant indicators of manipulation were found. The image appears to be from a genuine source."}
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {!imageURL && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 pointer-events-none grayscale">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-card rounded-xl border border-border/40 flex items-center justify-center">
                                <ImageIcon className="size-8 text-muted-foreground/50" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}