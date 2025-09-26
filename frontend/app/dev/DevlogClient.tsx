// app/dev/DevlogClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { DevlogMeta } from "@/lib/devlogs";

type Props = {
    initialItems: DevlogMeta[];
    total: number;
    pageSize: number;
};

export default function DevlogClient({ initialItems, total, pageSize }: Props) {
    const [items, setItems] = useState<DevlogMeta[]>(initialItems);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(initialItems.length);
    const [done, setDone] = useState(initialItems.length >= total);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (done || loading) return;

        const el = sentinelRef.current;
        if (!el) return;

        const io = new IntersectionObserver(async (entries) => {
            const first = entries[0];
            if (!first?.isIntersecting || loading || done) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/devlogs?offset=${offset}&limit=${pageSize}`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json() as { total: number; items: DevlogMeta[] };
                setItems(prev => [...prev, ...data.items]);
                const nextOffset = offset + data.items.length;
                setOffset(nextOffset);
                if (nextOffset >= data.total || data.items.length === 0) setDone(true);
            } catch (e) {
                console.error("Error loading more devlogs:", e);
                // Fail softly; keep the manual Load more button as fallback
            } finally {
                setLoading(false);
            }
        }, { rootMargin: "200px" });

        io.observe(el);
        return () => io.disconnect();
    }, [offset, pageSize, done, loading]);

    const loadMore = async () => {
        if (loading || done) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/devlogs?offset=${offset}&limit=${pageSize}`, { cache: "no-store" });
            const data = await res.json() as { total: number; items: DevlogMeta[] };
            setItems(prev => [...prev, ...data.items]);
            const nextOffset = offset + data.items.length;
            setOffset(nextOffset);
            if (nextOffset >= data.total || data.items.length === 0) setDone(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ul className="space-y-4">
                {items.map(post => (
                    <li key={post.slug} className="rounded border p-4">
                        <div className="flex items-baseline justify-between gap-3">
                            <h2 className="text-lg font-semibold">{post.title}</h2>
                            <time className="text-sm">{formatDate(post.date)}</time>
                        </div>
                        {post.summary && <p className="mt-2 text-sm">{post.summary}</p>}
                        {/* If you later add individual pages per post, link to /dev/[slug] */}
                        <div className="mt-3">
                            <Link href={`/dev/${post.slug}`} className="text-sm underline italic">
                                Lesa nánar
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Infinite scroll sentinel */}
            {!done && (
                <div ref={sentinelRef} className="h-8" aria-hidden />
            )}

            {/* Fallback load more button */}
            {!done && (
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loading}
                        className="rounded border px-4 py-2 text-sm"
                    >
                        {loading ? "Hleð..." : "Hlaða inn meira"}
                    </button>
                </div>
            )}

            {done && items.length === 0 && (
                <p className="mt-6 text-center text-sm">Engar færslur fundust.</p>
            )}
        </>
    );
}

function formatDate(d: string) {
    // Keep it simple and deterministic
    try {
        const dt = new Date(d);
        // Icelandic order: YYYY-MM-DD is fine
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    } catch {
        return d;
    }
}
