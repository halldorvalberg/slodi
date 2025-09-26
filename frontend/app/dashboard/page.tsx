// app/(protected)/dashboard/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth0 } from "@/lib/auth0";

// Prevent caching of sensitive content
export const dynamic = "force-dynamic";

function getBaseUrl() {
    // Prefer env; fall back to request headers
    const env = process.env.APP_BASE_URL;
    if (env) return env.replace(/\/$/, "");
    const h = headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host");
    return `${proto}://${host}`;
}

export default async function DashboardPage() {
    const session = await auth0.getSession();

    if (!session?.user) {
        const base = getBaseUrl();
        const returnTo = encodeURIComponent(`${base}/dashboard`);
        redirect(`/auth/login?returnTo=${returnTo}`);
    }

    const user = session.user as {
        name?: string;
        email?: string;
        picture?: string;
        sub?: string;
        // If you add roles via a namespace, map it here:
        // "https://slodi.is/roles"?: string[];
    };

    const base = getBaseUrl();

    return (
        <main className="mx-auto max-w-3xl px-6 py-10">
            <h1 className="text-3xl font-semibold">Stjórnborð</h1>

            <section className="mt-8 space-y-6" aria-label="Yfirlit aðgangs">
                {/* Account card */}
                <div className="rounded-xl border p-4">
                    <h2 className="text-lg font-medium">Aðgangurinn þinn</h2>
                    <div className="mt-4 flex items-center gap-4">
                        <Avatar src={user.picture} alt={user.name ?? "Notandi"} />
                        <div>
                            <div className="text-base font-medium">{user.name ?? "—"}</div>
                            <div className="text-sm text-muted-foreground">{user.email ?? "—"}</div>
                        </div>
                    </div>

                    <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {/* <div>
                            <dt className="text-sm text-muted-foreground">Auðkenni (sub)</dt>
                            <dd className="text-sm break-all">{user.sub ?? "—"}</dd>
                        </div> */}
                        {/* Example: show roles if you add them later
                        <div>
                        <dt className="text-sm text-muted-foreground">Hlutverk</dt>
                        <dd className="text-sm">
                            {Array.isArray((user as any)["https://slodi.is/roles"]) && (user as any)["https://slodi.is/roles"].length
                            ? (user as any)["https://slodi.is/roles"].join(", ")
                            : "—"}
                        </dd>
                        </div>
                      */}
                    </dl>
                </div>

                {/* Quick actions */}
                <div className="rounded-xl border p-4">
                    <h2 className="text-lg font-medium">Aðgerðir</h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <a
                            href="/"
                            className="inline-flex items-center justify-center rounded border px-4 py-2 text-sm hover:bg-muted"
                        >
                            Fara á forsíðu
                        </a>
                        <a
                            href="/auth/logout"
                            className="inline-flex items-center justify-center rounded border px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        // If you later want a dedicated page after logout:
                        // href={`/auth/logout?returnTo=${encodeURIComponent(`${base}/blessu`)}`}
                        >
                            Skrá út
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Avatar({ src, alt }: { src?: string; alt: string }) {
    // Fixed size, rounded, graceful fallback
    const size = 56;
    if (!src) {
        return (
            <div
                className="rounded-full bg-muted"
                style={{ width: size, height: size }}
                aria-label="Engin mynd"
            />
        );
    }
    return (
        <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="rounded-full object-cover"
            referrerPolicy="no-referrer"
        />
    );
}
