import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth0 } from "@/lib/auth0";
import styles from "./dashboard.module.css";
import Button from "@/components/Button/Button";
import EmailListDownloadButton from "./email-download-service";

// Prevent caching of sensitive content
export const dynamic = "force-dynamic";

// We create a temporary list of emails that are allowed access to the emails button
const EMAIL_LIST = [
    "halldor@svanir.is",
    "signy.kristin8@gmail.com"
];

async function getBaseUrl() {
    const env = process.env.APP_BASE_URL;
    if (env) return env.replace(/\/$/, "");
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host");
    return `${proto}://${host}`;
}

export default async function DashboardPage() {
    const session = await auth0.getSession();

    if (!session?.user) {
        const base = await getBaseUrl();
        const returnTo = encodeURIComponent(`${base}/dashboard`);
        redirect(`/auth/login?returnTo=${returnTo}`);
    }

    const user = session.user as {
        name?: string;
        email?: string;
        picture?: string;
        sub?: string;
        // "https://slodi.is/roles"?: string[];
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Stjórnborð</h1>

            <section className={styles.section} aria-label="Yfirlit aðgangs">
                {/* Account card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Aðgangurinn þinn</h2>

                    <div className={styles.accountRow}>
                        <Avatar src={user.picture} alt={user.name ?? "Notandi"} />
                        <div>
                            <p className={styles.accountName}>{user.name ?? "—"}</p>
                            <p className={styles.accountEmail}>{user.email ?? "—"}</p>
                        </div>
                    </div>

                    <dl className={styles.dl}>
                        {/* Reserved for future fields like sub or roles */}
                    </dl>
                </div>

                {/* Quick actions */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Aðgerðir</h2>

                    <div className={styles.actions}>

                        {/* A button only visible to certain users (client component handles the click) */}
                        {EMAIL_LIST.includes(user.email ?? "") && (
                            <EmailListDownloadButton allowed={true} />
                        )}

                        <Button href="/" variant="secondary">
                            Fara á forsíðu
                        </Button>

                        <Button as="a" href="/auth/logout" variant="danger">
                            Skrá út
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Avatar({ src, alt }: { src?: string; alt: string }) {
    const size = 56;

    if (!src) {
        return (
            <div
                className={styles.avatarFallback}
                style={{ width: size, height: size }}
                aria-label="Engin mynd"
            />
        );
    }

    return (
        <div className={styles.avatar} aria-label="Notendamynd">
            <Image
                src={src}
                alt={alt}
                width={size}
                height={size}
                className={styles.avatarImg}
                referrerPolicy="no-referrer"
            />
        </div>
    );
}
