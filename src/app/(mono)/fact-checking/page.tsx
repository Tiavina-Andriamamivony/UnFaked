
'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, BadgeCheck, XCircle, AlertTriangle, ExternalLink, ShieldQuestion } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClaimReview {
    publisher: {
        name: string;
        site: string;
    };
    url: string;
    title: string;
    reviewDate: string;
    textualRating: string;
    languageCode: string;
}

interface Claim {
    text: string;
    claimant: string;
    claimDate: string;
    claimReview: ClaimReview[];
}

export default function FactCheckPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);

        try {
            const response = await fetch(
                `/api/fact-check?query=${encodeURIComponent(query)}&languageCode=fr`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            setResults(data.claims || []);

            if (!data.claims || data.claims.length === 0) {
                setError('Aucun résultat trouvé pour cette recherche.');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la recherche.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRatingColor = (rating: string) => {
        const r = rating.toLowerCase();
        if (r.includes("faux") || r.includes("false") || r.includes("fake") || r.includes("intox")) return "text-red-500 bg-red-500/10 border-red-500/20";
        if (r.includes("vrai") || r.includes("true") || r.includes("correct")) return "text-green-500 bg-green-500/10 border-green-500/20";
        if (r.includes("trompeur") || r.includes("misleading")) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    };

    const getRatingIcon = (rating: string) => {
        const r = rating.toLowerCase();
        if (r.includes("faux") || r.includes("false") || r.includes("fake")) return <XCircle className="size-4" />;
        if (r.includes("vrai") || r.includes("true")) return <BadgeCheck className="size-4" />;
        if (r.includes("trompeur")) return <AlertTriangle className="size-4" />;
        return <ShieldQuestion className="size-4" />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-24 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="border-[#ff1101] text-[#ff1101] bg-[#ff1101]/10 px-4 py-1">
                        Fact-Checking Engine
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Verify <span className="text-[#ff1101]">Claims</span> Instantly
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Cross-reference rumors and news against a global database of trusted fact-checkers.
                    </p>
                </div>

                {/* Search Box */}
                <Card className="border-2 border-border/50 bg-card shadow-lg">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                                <Input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for a claim, rumor, or news headline..."
                                    className="pl-10 h-12 text-lg border-muted focus-visible:ring-[#ff1101] focus-visible:border-[#ff1101]"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || !query}
                                className="h-12 px-8 bg-[#ff1101] hover:bg-[#ff1101]/90 text-white font-semibold text-lg shadow-[0_0_20px_-5px_#ff1101] transition-all"
                            >
                                {loading ? 'Searching...' : 'Check Fact'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-6">
                    {error && (
                        <div className="p-4 bg-orange-500/10 text-orange-600 rounded-lg flex items-center gap-2 border border-orange-500/20">
                            <AlertTriangle className="size-5" />
                            {error}
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                            <ShieldAlert className="size-4" />
                            Found {results.length} relevant fact-checks
                        </div>
                    )}

                    {results.map((claim, index) => (
                        <Card key={index} className="overflow-hidden border-border/50 hover:border-[#ff1101]/30 transition-all hover:shadow-lg group">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="mb-2">Claim</Badge>
                                        <h2 className="text-xl font-bold leading-tight">"{claim.text}"</h2>
                                    </div>
                                    {claim.claimant && (
                                        <div className="text-right shrink-0">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Claimed by</div>
                                            <div className="font-medium text-foreground">{claim.claimant}</div>
                                        </div>
                                    )}
                                </div>
                                {claim.claimDate && (
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {new Date(claim.claimDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="pt-6 grid gap-4">
                                {claim.claimReview.map((review, reviewIndex) => (
                                    <div key={reviewIndex} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-background border border-border/50 hover:bg-muted/50 transition-colors">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-base">{review.publisher.name}</span>
                                                <span className="text-muted-foreground text-sm">•</span>
                                                <span className="text-muted-foreground text-sm">{new Date(review.reviewDate).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="font-medium text-sm text-muted-foreground line-clamp-2">{review.title}</h3>
                                            <a
                                                href={review.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-[#ff1101] hover:underline mt-1"
                                            >
                                                Read full report <ExternalLink className="size-3" />
                                            </a>
                                        </div>

                                        <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold hidden sm:block">Verdict</div>
                                            <Badge variant="outline" className={cn("px-3 py-1 text-sm flex items-center gap-2 capitalize h-9", getRatingColor(review.textualRating))}>
                                                {getRatingIcon(review.textualRating)}
                                                {review.textualRating}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    {!loading && results.length === 0 && !error && (
                        <div className="text-center py-20 text-muted-foreground opacity-50">
                            Search for any topic to see verification results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}