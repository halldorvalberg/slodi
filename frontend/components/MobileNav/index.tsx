"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type User = { name: string; picture: string | null; email: string | null } | null;

// External SVG for the small external-link icon
const EXTERNAL_ICON = "https://unpkg.com/@heroicons/svg@2.1.5/20/solid/arrow-top-right-on-square.svg";

export default function MobileNav({ user }: { user: User }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        if (open) {
            document.addEventListener("keydown", onKey);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="p-2 rounded border"
                aria-label={open ? "Loka valmynd" : "Opna valmynd"}
                aria-expanded={open}
                aria-haspopup="dialog"
            >
                {open ? "✕" : "☰"}
            </button>

            {open && (
                <button
                    aria-hidden
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 right-0 z-50 w-[80%] max-w-xs bg-background text-foreground",
                    "shadow-2xl md:hidden",
                    "transition-transform duration-300",
                    open ? "translate-x-0" : "translate-x-full",
                    "flex flex-col"
                ].join(" ")}
                role="dialog"
                aria-label="Leiðsögn"
                aria-hidden={!open}
            >
                {/* Account section only when logged in */}
                {user && (
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                            {user.picture ? (
                                <Image
                                    src={user.picture}
                                    alt={user.name}
                                    width={44}
                                    height={44}
                                    className="rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="rounded-full bg-muted" style={{ width: 44, height: 44 }} />
                            )}
                            <div className="min-w-0">
                                <div className="text-sm font-semibold truncate">{user.name}</div>
                                {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main nav */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <NavItem href="/" label="Heim" onClick={() => setOpen(false)} />
                    <NavItem href="/about" label="Um Slóða" onClick={() => setOpen(false)} />
                    <NavItem href="/dashboard" label="Stjórnborð" onClick={() => setOpen(false)} />
                    <NavItem
                        href="https://github.com/halldorvalberg/slodi"
                        label="Github"
                        onClick={() => setOpen(false)}
                        external
                    />
                </nav>

                {/* Bottom auth action in Icelandic, centered text */}
                <div className="p-4 border-t">
                    {user ? (
                        <a
                            href="/auth/logout"
                            className="w-full inline-flex items-center justify-center rounded px-3 py-2 text-base font-medium border text-red-600 hover:bg-red-50"
                            onClick={() => setOpen(false)}
                        >
                            Skrá út
                        </a>
                    ) : (
                        <a
                            href="/auth/login"
                            className="w-full inline-flex items-center justify-center rounded px-3 py-2 text-base font-medium border hover:bg-muted"
                            onClick={() => setOpen(false)}
                            >
                            Skrá inn
                        </a>
                    )}
                </div>
            </aside>
        </>
    );
}

function NavItem({
    href,
    label,
    onClick,
    external
}: {
    href: string;
    label: string;
    onClick: () => void;
    external?: boolean;
}) {
    const classes = "flex items-center justify-between rounded px-3 py-2 text-lg hover:bg-accent";
    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes}>
                <span className="underline">{label}</span>
                <ExternalIcon />
            </a>
        );
    }
    return (
        <Link href={href} onClick={onClick} className={classes}>
            <span className="text-lg">{label}</span>
        </Link>
    );
}

/* External icon fetched from CDN and colorized via CSS mask so it follows currentColor */
function ExternalIcon() {
    const style: React.CSSProperties = {
        WebkitMaskImage: `url("${EXTERNAL_ICON}")`,
        maskImage: `url("${EXTERNAL_ICON}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        backgroundColor: "currentColor",
        width: 18,
        height: 18,
        display: "inline-block"
    };
    return <span aria-hidden="true" style={style} />;
}