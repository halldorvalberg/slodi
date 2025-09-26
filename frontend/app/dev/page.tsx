// app/dev/page.tsx
import DevlogClient from "./DevlogClient";
import { paginateDevlogs } from "@/lib/devlogs";

export const dynamic = "force-static"; // list from filesystem; rebuild on deploy

export default async function DevPage() {
    const PAGE_SIZE = 10;
    const { total, items } = paginateDevlogs(0, PAGE_SIZE);

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-semibold">Verkbók</h1>
            <DevlogClient initialItems={items} total={total} pageSize={PAGE_SIZE} />
        </main>
    );
}
