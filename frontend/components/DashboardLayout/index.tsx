"use client";

import { useState } from "react";
import Sidebar from "@/components/DashboardSidebar";
import styles from "./DashboardLayout.module.css";
import { Menu, X } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole?: "leader" | "editor" | "admin";
    userName?: string;
    userAvatar?: string;
    badgeCount?: number;
}

/**
 * DashboardLayout Component
 * 
 * Full-page layout for authenticated dashboard routes
 * Features:
 * - Left sidebar navigation (collapsible)
 * - Mobile hamburger menu
 * - No header or footer (those are for public pages only)
 * - Responsive: sidebar drawer on mobile, icon-only on tablet, full on desktop
 * 
 * This layout wraps all dashboard routes:
 * /dashboard, /programs, /builder, /social, /analytics, /admin, /profile, /settings, /badges
 */

export default function DashboardLayout({
    children,
    userRole = "admin",
    userName = "Notandi",
    userAvatar,
    badgeCount = 0,
}: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { user, error, isLoading } = useUser();

    const resolvedUserName = user?.name || userName;
    const resolvedUserAvatar = user?.picture || userAvatar || undefined;
    const resolvedBadgeCount = badgeCount || 0;     // Resolve badge count later
    const resolvedUserRole = userRole || "leader";  // Resolve user role later

    return (
        <div className={styles.layout}>
            {/* Mobile menu button - only visible on mobile */}
            <button
                className={styles.mobileMenuButton}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Loka valmynd" : "Opna valmynd"}
                aria-expanded={mobileMenuOpen}
            >
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar - wrapped for mobile drawer control */}
            <div
                className={styles.sidebarWrapper}
                data-open={mobileMenuOpen}
                data-collapsed={sidebarCollapsed}
            >
                <Sidebar
                    userRole={resolvedUserRole}
                    userName={resolvedUserName}
                    userAvatar={resolvedUserAvatar}
                    badgeCount={resolvedBadgeCount}
                    collapsed={sidebarCollapsed}
                    onCollapsedChange={setSidebarCollapsed}
                    showUserSection={false} // User section handled by personal nav items
                />
            </div>

            {/* Mobile overlay - darkens background when drawer is open */}
            {mobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main content area - adjusts margin based on sidebar state */}
            <main
                id="main-content"
                className={`${styles.main} ${sidebarCollapsed ? styles.mainCollapsed : ""
                    }`}
            >
                {children}
            </main>
        </div>
    );
}