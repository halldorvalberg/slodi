// app/dev/[slug]/page.tsx
import path from "path";
import { notFound } from "next/navigation";
import { mdToHtmlLite } from "@/lib/markdown-lite";
import { getNeighbors } from "@/lib/devlogs";
import { promises as fs } from "fs";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-static";

// Tiny front matter parser
function parseFrontMatter(src: string): {
    meta: { title?: string; date?: string; summary?: string; author?: string };
    body: string;
} {
    const m = src.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
    if (!m) return { meta: {}, body: src };

    const raw = m[1];
    const body = m[2];
    const meta: Record<string, string> = {};

    for (const line of raw.split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf(":");
        if (i === -1) continue;
        const key = t.slice(0, i).trim();
        const val = t.slice(i + 1).trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
        meta[key] = val;
    }
    return { meta: { title: meta.title, date: meta.date, summary: meta.summary, author: meta.author }, body };
}

function formatDate(d?: string): string | undefined {
    if (!d) return undefined;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default async function DevPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const file = path.join(process.cwd(), "content", "devlogs", `${slug}.md`);
    try {
        await fs.access(file);
    } catch {
        return notFound();
    }

    const md = await fs.readFile(file, "utf8");
    const { meta, body } = parseFrontMatter(md);
    const html = mdToHtmlLite(body);
    const niceDate = formatDate(meta.date);

    const { prev, next } = getNeighbors(slug);

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            {/* Post header */}
            <header className="mb-8">
                {meta.title && <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>}

                {(niceDate || meta.author) && (
                    <p className="mt-2 text-sm">
                        {niceDate ? <>Dags: <time>{niceDate}</time></> : null}
                        {niceDate && meta.author ? " · " : null}
                        {meta.author ? <>Höfundur: {meta.author}</> : null}
                    </p>
                )}

                {meta.summary && <p className="mt-4 text-base">{meta.summary}</p>}
            </header>

            {/* Post content */}
            <article className="md-content">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </article>

            {/* Footer navigation */}
            <nav className="mt-10 flex items-center justify-between border-t pt-4">
                <Link
                    href="/dev"
                    className="rounded border px-3 py-2 text-sm hover:bg-muted"
                    aria-label="Til baka á Devlog"
                >
                    Til baka
                </Link>

                <div className="flex items-center gap-2">
                    {prev && (
                        <Link
                            href={`/dev/${prev.slug}`}
                            className="rounded border px-3 py-2 text-sm hover:bg-muted"
                            aria-label="Fyrri færsla"
                            title={prev.title}
                        >
                            Fyrri
                        </Link>
                    )}
                    {next && (
                        <Link
                            href={`/dev/${next.slug}`}
                            className="rounded border px-3 py-2 text-sm hover:bg-muted"
                            aria-label="Næsta færsla"
                            title={next.title}
                        >
                            Næsta
                        </Link>
                    )}
                </div>
            </nav>
        </main>
    );
}
