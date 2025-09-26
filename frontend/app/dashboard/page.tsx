import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    // Redirect unauthenticated users to the login route
    // The SDK will handle redirecting back after login via returnTo
    redirect("/auth/login?returnTo=/dashboard");
  }

  const user = session.user;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome back, {user.name ?? user.email ?? "friend"}.</p>

      <section className="mt-8 space-y-4">
        <div className="rounded-xl border p-4">
          <h2 className="text-lg font-medium">Your profile</h2>
          <ul className="mt-2 text-sm">
            <li><strong>Name:</strong> {user.name ?? "—"}</li>
            <li><strong>Email:</strong> {user.email ?? "—"}</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
