module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/safe-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Web Storage that cannot crash the page.
 *
 * `localStorage` is not always reachable, and the failure is not the gentle
 * "returns null" people expect — *touching the property throws*:
 *
 * - Safari with "Block All Cookies" blocks Web Storage too, and every access
 *   raises a SecurityError. This is the case that took slodi.is down for an
 *   iPhone user: she blocked cookies to get past a 400 from the reverse proxy,
 *   which then put her into a storage-blocked browser, and the first unguarded
 *   `localStorage.getItem` in a root-layout provider threw during mount — which
 *   React surfaces as "Application error: a client-side exception has occurred".
 * - Safari private browsing has historically thrown QuotaExceededError on write.
 * - Any browser throws QuotaExceededError once the origin's quota is full.
 * - Server-side rendering has no `window` at all.
 *
 * Because a provider in the root layout runs on *every* page, one unguarded
 * access takes down the whole site rather than one feature. These helpers
 * degrade to "no storage available" instead: reads give null, writes are
 * dropped. Anything persisted is a convenience — theme, favourites, a game
 * save — so losing it is always better than losing the page.
 */ __turbopack_context__.s([
    "safeLocalStorage",
    ()=>safeLocalStorage,
    "safeSessionStorage",
    ()=>safeSessionStorage,
    "storageAvailable",
    ()=>storageAvailable
]);
function storage() {
    try {
        // Access alone can throw, so it has to be inside the try.
        return ("TURBOPACK compile-time truthy", 1) ? null : "TURBOPACK unreachable";
    } catch  {
        return null;
    }
}
function sessionStorageOrNull() {
    try {
        return ("TURBOPACK compile-time truthy", 1) ? null : "TURBOPACK unreachable";
    } catch  {
        return null;
    }
}
function storageAvailable() {
    return storage() !== null;
}
const safeLocalStorage = {
    getItem (key) {
        try {
            return storage()?.getItem(key) ?? null;
        } catch  {
            return null;
        }
    },
    setItem (key, value) {
        try {
            storage()?.setItem(key, value);
        } catch  {
        /* storage blocked or full — the value is a convenience, not a record */ }
    },
    removeItem (key) {
        try {
            storage()?.removeItem(key);
        } catch  {
        /* nothing to do — see setItem */ }
    }
};
const safeSessionStorage = {
    getItem (key) {
        try {
            return sessionStorageOrNull()?.getItem(key) ?? null;
        } catch  {
            return null;
        }
    },
    setItem (key, value) {
        try {
            sessionStorageOrNull()?.setItem(key, value);
        } catch  {
        /* see safeLocalStorage.setItem */ }
    },
    removeItem (key) {
        try {
            sessionStorageOrNull()?.removeItem(key);
        } catch  {
        /* see safeLocalStorage.setItem */ }
    }
};
}),
"[project]/components/ThemeProvider/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/safe-storage.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useTheme() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
function ThemeProvider({ children, defaultTheme = "light", storageKey = "slodi-theme" }) {
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultTheme);
    const [patrolColor, setPatrolColorState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load saved theme on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedTheme = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].getItem(storageKey);
        const savedPatrol = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].getItem("slodi-patrol");
        if (savedTheme) {
            setThemeState(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setThemeState(prefersDark ? "dark" : "light");
        }
        if (savedPatrol) {
            setPatrolColorState(savedPatrol);
        }
        setMounted(true);
    }, [
        storageKey
    ]);
    // Apply theme to document
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        const root = document.documentElement;
        // Remove all theme classes/attributes
        root.classList.remove("dark");
        root.removeAttribute("data-theme");
        // Apply new theme
        if (theme === "dark") {
            root.classList.add("dark");
        } else if (theme !== "light") {
            root.setAttribute("data-theme", theme);
        }
        // Save to localStorage
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].setItem(storageKey, theme);
    }, [
        theme,
        mounted,
        storageKey
    ]);
    // Apply patrol color as primary accent
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        const root = document.documentElement;
        if (patrolColor) {
            // Override primary color with patrol color
            root.style.setProperty("--sl-color-primary", `var(--sl-color-patrol-${patrolColor})`);
            root.style.setProperty("--sl-color-primary-hover", `var(--sl-color-patrol-${patrolColor}-hover)`);
            root.style.setProperty("--sl-color-primary-subtle", `var(--sl-color-patrol-${patrolColor}-subtle)`);
            root.style.setProperty("--sl-color-primary-muted", `var(--sl-color-patrol-${patrolColor}-muted)`);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].setItem("slodi-patrol", patrolColor);
        } else {
            // Reset to default primary (moss green)
            root.style.removeProperty("--sl-color-primary");
            root.style.removeProperty("--sl-color-primary-hover");
            root.style.removeProperty("--sl-color-primary-subtle");
            root.style.removeProperty("--sl-color-primary-muted");
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].removeItem("slodi-patrol");
        }
    }, [
        patrolColor,
        mounted
    ]);
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
    };
    const setPatrolColor = (color)=>{
        setPatrolColorState(color);
    };
    const toggleTheme = ()=>{
        setThemeState((prev)=>prev === "light" ? "dark" : "light");
    };
    // Always render the provider to avoid context errors
    // The mounted flag just controls when we apply theme changes to the DOM
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            setTheme,
            patrolColor,
            setPatrolColor,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ThemeProvider/index.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ThemeKeyboardShortcuts.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeKeyboardShortcuts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemeProvider/index.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function ThemeKeyboardShortcuts() {
    const { toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (event)=>{
            if (event.key === "F8") {
                event.preventDefault();
                toggleTheme();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return ()=>document.removeEventListener("keydown", handleKeyDown);
    }, [
        toggleTheme
    ]);
    return null; // This component doesn't render anything
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/components/Header/header.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "brandLink": "header-module__gD0orW__brandLink",
  "drawerNav": "header-module__gD0orW__drawerNav",
  "drawerNavLink": "header-module__gD0orW__drawerNavLink",
  "drawerOverlay": "header-module__gD0orW__drawerOverlay",
  "drawerPanel": "header-module__gD0orW__drawerPanel",
  "drawerPanelOpen": "header-module__gD0orW__drawerPanelOpen",
  "headerContent": "header-module__gD0orW__headerContent",
  "headerRoot": "header-module__gD0orW__headerRoot",
  "menuToggleButton": "header-module__gD0orW__menuToggleButton",
  "primaryNav": "header-module__gD0orW__primaryNav",
  "primaryNavDesktop": "header-module__gD0orW__primaryNavDesktop",
  "primaryNavLink": "header-module__gD0orW__primaryNavLink",
});
}),
"[project]/components/Header/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Header/header.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const GITHUB_URL = "https://github.com/halldorvalberg/slodi";
function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const openDrawer = ()=>setIsDrawerOpen(true);
    const closeDrawer = ()=>setIsDrawerOpen(false);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerRoot,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerContent,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brandLink,
                    children: "Slóði"
                }, void 0, false, {
                    fileName: "[project]/components/Header/index.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNav} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavDesktop}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavLink,
                            children: "Heim"
                        }, void 0, false, {
                            fileName: "[project]/components/Header/index.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/about",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavLink,
                            children: "Um Slóða"
                        }, void 0, false, {
                            fileName: "[project]/components/Header/index.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/leikir",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavLink,
                            children: "Leikir"
                        }, void 0, false, {
                            fileName: "[project]/components/Header/index.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: GITHUB_URL,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavLink,
                            children: "Github"
                        }, void 0, false, {
                            fileName: "[project]/components/Header/index.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavLink,
                            children: "Stjórnborð"
                        }, void 0, false, {
                            fileName: "[project]/components/Header/index.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/auth/login",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primaryNavLink,
                            prefetch: false,
                            children: "Innskráning"
                        }, void 0, false, {
                            fileName: "[project]/components/Header/index.tsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Header/index.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].menuToggleButton,
                    onClick: openDrawer,
                    "aria-label": "Opna valmynd",
                    "aria-haspopup": "true",
                    "aria-expanded": isDrawerOpen,
                    "aria-controls": "main-menu-drawer",
                    children: "☰"
                }, void 0, false, {
                    fileName: "[project]/components/Header/index.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                isDrawerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerOverlay,
                    onClick: closeDrawer,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/components/Header/index.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    id: "main-menu-drawer",
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerPanel} ${isDrawerOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerPanelOpen : ""}`,
                    "aria-hidden": !isDrawerOpen,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNav,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNavLink,
                                onClick: closeDrawer,
                                children: "Heim"
                            }, void 0, false, {
                                fileName: "[project]/components/Header/index.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/about",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNavLink,
                                onClick: closeDrawer,
                                children: "Um Slóða"
                            }, void 0, false, {
                                fileName: "[project]/components/Header/index.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/leikir",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNavLink,
                                onClick: closeDrawer,
                                children: "Leikir"
                            }, void 0, false, {
                                fileName: "[project]/components/Header/index.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: GITHUB_URL,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNavLink,
                                onClick: closeDrawer,
                                children: "Github"
                            }, void 0, false, {
                                fileName: "[project]/components/Header/index.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNavLink,
                                onClick: closeDrawer,
                                children: "Stjórnborð"
                            }, void 0, false, {
                                fileName: "[project]/components/Header/index.tsx",
                                lineNumber: 100,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/auth/login",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$header$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].drawerNavLink,
                                onClick: closeDrawer,
                                children: "Innskráning"
                            }, void 0, false, {
                                fileName: "[project]/components/Header/index.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header/index.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Header/index.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Header/index.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Header/index.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Footer/Footer.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footerContent": "Footer-module__rnk_JG__footerContent",
  "footerRoot": "Footer-module__rnk_JG__footerRoot",
  "footerText": "Footer-module__rnk_JG__footerText",
});
}),
"[project]/components/Footer/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Footer/Footer.module.css [app-ssr] (css module)");
;
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].footerRoot,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].footerContent,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].footerText,
                children: "© 2025 Slóði. Öll réttindi áskilin."
            }, void 0, false, {
                fileName: "[project]/components/Footer/index.tsx",
                lineNumber: 7,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/Footer/index.tsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Footer/index.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/DashboardSidebar/DashboardSidebar.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "collapseButton": "DashboardSidebar-module__nx3vcq__collapseButton",
  "collapseButtonCompact": "DashboardSidebar-module__nx3vcq__collapseButtonCompact",
  "collapseButtonWrapper": "DashboardSidebar-module__nx3vcq__collapseButtonWrapper",
  "collapseIcon": "DashboardSidebar-module__nx3vcq__collapseIcon",
  "collapseLabel": "DashboardSidebar-module__nx3vcq__collapseLabel",
  "nav": "DashboardSidebar-module__nx3vcq__nav",
  "navBadge": "DashboardSidebar-module__nx3vcq__navBadge",
  "navIcon": "DashboardSidebar-module__nx3vcq__navIcon",
  "navItem": "DashboardSidebar-module__nx3vcq__navItem",
  "navItemActive": "DashboardSidebar-module__nx3vcq__navItemActive",
  "navItemDisabled": "DashboardSidebar-module__nx3vcq__navItemDisabled",
  "navLabel": "DashboardSidebar-module__nx3vcq__navLabel",
  "navList": "DashboardSidebar-module__nx3vcq__navList",
  "navSeparator": "DashboardSidebar-module__nx3vcq__navSeparator",
  "personalList": "DashboardSidebar-module__nx3vcq__personalList",
  "sidebar": "DashboardSidebar-module__nx3vcq__sidebar",
  "sidebarCollapsed": "DashboardSidebar-module__nx3vcq__sidebarCollapsed",
  "skipLink": "DashboardSidebar-module__nx3vcq__skipLink",
  "userAvatar": "DashboardSidebar-module__nx3vcq__userAvatar",
  "userAvatarPlaceholder": "DashboardSidebar-module__nx3vcq__userAvatarPlaceholder",
  "userLink": "DashboardSidebar-module__nx3vcq__userLink",
  "userLinkActive": "DashboardSidebar-module__nx3vcq__userLinkActive",
  "userName": "DashboardSidebar-module__nx3vcq__userName",
  "userSection": "DashboardSidebar-module__nx3vcq__userSection",
});
}),
"[project]/components/DashboardSidebar/DashboardSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * DashboardSidebar Component
 *
 * A collapsible navigation sidebar for the dashboard with role-based access control.
 * Features:
 * - Three-tier navigation structure (primary, secondary, personal)
 * - Collapsible state with smooth transitions
 * - Role-based menu item visibility (leader, editor, admin)
 * - Active route highlighting
 * - Badge notifications for items
 * - Accessible keyboard navigation and ARIA labels
 * - Responsive mobile drawer support (via parent component)
 */ __turbopack_context__.s([
    "default",
    ()=>DashboardSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DashboardSidebar/DashboardSidebar.module.css [app-ssr] (css module)");
// Icons from lucide-react for navigation items and controls
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hammer.js [app-ssr] (ecmascript) <export default as Hammer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tags$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tags$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tags.js [app-ssr] (ecmascript) <export default as Tags>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-ssr] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.js [app-ssr] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.js [app-ssr] (ecmascript) <export default as PanelLeftOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
/**
 * Navigation items configuration
 * Organized into groups:
 * - Home: Back to main site
 * - Dashboard: Dashboard overview
 * - Primary: Main application features (Programs, Builder, Social)
 * - Secondary: Analytics and administration
 * - Personal: User profile, settings, and badges
 *
 * Access control:
 * - Items without roleRequired are visible to all users
 * - roleRequired "editor": visible to editors and admins
 * - roleRequired "admin": visible only to admins
 *
 * Disabled items are shown but not clickable (for features in development)
 */ const NAV_ITEMS = [
    // Home navigation
    {
        label: "Slóði",
        path: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        group: "home"
    },
    // Dashboard navigation
    {
        label: "Stjórnborð",
        path: "/dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
        group: "dashboard"
    },
    // Primary navigation - core features accessible to most users
    {
        label: "Dagskrárbankinn",
        path: "/programs",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
        group: "primary"
    },
    {
        label: "Vinnubekkurinn",
        path: "/builder",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__["Hammer"],
        group: "primary",
        roleRequired: "editor",
        disabled: true
    },
    {
        label: "Veggurinn",
        path: "/social",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        group: "primary",
        disabled: true
    },
    // Secondary navigation - advanced features
    {
        label: "Greining",
        path: "/analytics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        group: "secondary",
        disabled: true
    },
    {
        label: "Flokkar",
        path: "/tags",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tags$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tags$3e$__["Tags"],
        group: "secondary",
        roleRequired: "editor"
    },
    {
        label: "Stjórnun",
        path: "/admin",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        group: "secondary",
        roleRequired: "admin",
        disabled: true
    },
    // Personal navigation - user-specific items
    {
        label: "Prófíll",
        path: "/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
        group: "personal",
        disabled: true
    },
    {
        label: "Stillingar",
        path: "/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        group: "personal"
    },
    {
        label: "Merkin mín",
        path: "/badges",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"],
        group: "personal",
        disabled: true
    }
];
function DashboardSidebar({ userRole = "leader", userName = "Notandi", userAvatar, badgeCount = 0, collapsed = false, onCollapsedChange, showUserSection = false, ...props // Accept additional props like data-open
 }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isCollapsed, setIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(collapsed);
    /**
   * Check if user has permission to see a navigation item
   * Implements hierarchical role system: admin > editor > leader
   */ const hasPermission = (item)=>{
        if (!item.roleRequired) return true;
        if (item.roleRequired === "admin") return userRole === "admin";
        if (item.roleRequired === "editor") return userRole === "editor" || userRole === "admin";
        return true;
    };
    /**
   * Toggle sidebar collapsed state
   * Notifies parent component via callback for responsive handling
   */ const toggleCollapsed = ()=>{
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapsedChange?.(newState);
    };
    /**
   * Determine if a navigation path is currently active
   * Uses exact match for root and prefix match for sub-routes
   */ const isActive = (path)=>{
        // Exact match for root paths
        if (path === "/dashboard") return pathname === "/dashboard";
        // Starts with match for sub-routes
        return pathname.startsWith(path);
    };
    // Group navigation items by their designated section
    const homeItems = NAV_ITEMS.filter((item)=>item.group === "home");
    const dashboardItems = NAV_ITEMS.filter((item)=>item.group === "dashboard");
    const primaryItems = NAV_ITEMS.filter((item)=>item.group === "primary");
    const secondaryItems = NAV_ITEMS.filter((item)=>item.group === "secondary");
    const personalItems = NAV_ITEMS.filter((item)=>item.group === "personal");
    /**
   * Render a single navigation item
   * Handles permission checking, active state, badges, disabled state, and accessibility
   */ const renderNavItem = (item)=>{
        // Hide items the user doesn't have permission for
        if (!hasPermission(item)) return null;
        const Icon = item.icon;
        const active = isActive(item.path);
        const isDisabled = item.disabled || false;
        // Apply badge count to "Merkin mín" item
        const badge = item.path === "/badges" ? badgeCount : item.badge;
        const showBadge = badge && badge > 0;
        const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navIcon,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this),
                !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navLabel,
                    children: item.label
                }, void 0, false, {
                    fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                    lineNumber: 236,
                    columnNumber: 26
                }, this),
                showBadge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navBadge,
                    "aria-label": `${badge} ólesnar`,
                    children: badge
                }, void 0, false, {
                    fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                    lineNumber: 238,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            children: isDisabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navItemDisabled}`,
                "aria-disabled": "true",
                title: "Ennþá í vinnslu...",
                children: content
            }, void 0, false, {
                fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                lineNumber: 248,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: item.path,
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navItem} ${active ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navItemActive : ""}`,
                "aria-current": active ? "page" : undefined,
                "aria-label": item.label,
                title: isCollapsed ? item.label : undefined,
                children: content
            }, void 0, false, {
                fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                lineNumber: 256,
                columnNumber: 11
            }, this)
        }, item.path, false, {
            fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
            lineNumber: 246,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sidebar} ${isCollapsed ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sidebarCollapsed : ""}`,
        "aria-label": "Aðalvalmynd",
        "data-collapsed": isCollapsed,
        "data-open": props["data-open"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].nav,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navList,
                        role: "list",
                        children: homeItems.map((item)=>renderNavItem(item))
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navSeparator,
                        role: "separator",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navList,
                        role: "list",
                        children: dashboardItems.map((item)=>renderNavItem(item))
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navList,
                        role: "list",
                        children: primaryItems.map((item)=>renderNavItem(item))
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navSeparator,
                        role: "separator",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navList,
                        role: "list",
                        children: secondaryItems.map((item)=>renderNavItem(item))
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    showUserSection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/profile",
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userLink} ${isActive("/profile") ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userLinkActive : ""}`,
                            "aria-label": `Prófíll: ${userName}`,
                            title: isCollapsed ? userName : undefined,
                            children: [
                                userAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: userAvatar,
                                    alt: "",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userAvatar,
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                                    lineNumber: 317,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userAvatarPlaceholder,
                                    "aria-hidden": "true",
                                    children: userName.charAt(0).toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                                    lineNumber: 319,
                                    columnNumber: 17
                                }, this),
                                !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userName,
                                    children: userName
                                }, void 0, false, {
                                    fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                                    lineNumber: 323,
                                    columnNumber: 32
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navList} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].personalList}`,
                        role: "list",
                        children: personalItems.map((item)=>renderNavItem(item))
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navSeparator,
                        role: "separator",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].collapseButtonWrapper,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].collapseButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].collapseButtonCompact}`,
                            onClick: toggleCollapsed,
                            "aria-label": isCollapsed ? "Opna valmynd" : "Loka valmynd",
                            "aria-expanded": !isCollapsed,
                            title: isCollapsed ? "Opna valmynd" : "Loka valmynd",
                            children: isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__["PanelLeftOpen"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].collapseIcon
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                                lineNumber: 349,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].collapseIcon
                                    }, void 0, false, {
                                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                                        lineNumber: 352,
                                        columnNumber: 17
                                    }, this),
                                    !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].collapseLabel,
                                        children: "Fela valmynd"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                                        lineNumber: 353,
                                        columnNumber: 34
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                            lineNumber: 341,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "#main-content",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].skipLink,
                children: "Sleppa í efni"
            }, void 0, false, {
                fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
                lineNumber: 361,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DashboardSidebar/DashboardSidebar.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/MobileMenuButton/MobileMenuButton.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "MobileMenuButton-module__hC1Nzq__button",
});
}),
"[project]/components/MobileMenuButton/MobileMenuButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileMenuButton",
    ()=>MobileMenuButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileMenuButton$2f$MobileMenuButton$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/MobileMenuButton/MobileMenuButton.module.css [app-ssr] (css module)");
;
;
;
function MobileMenuButton({ isOpen, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileMenuButton$2f$MobileMenuButton$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].button,
        onClick: onClick,
        "aria-label": isOpen ? "Loka valmynd" : "Opna valmynd",
        "aria-expanded": isOpen,
        children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            size: 24
        }, void 0, false, {
            fileName: "[project]/components/MobileMenuButton/MobileMenuButton.tsx",
            lineNumber: 18,
            columnNumber: 17
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
            size: 24
        }, void 0, false, {
            fileName: "[project]/components/MobileMenuButton/MobileMenuButton.tsx",
            lineNumber: 18,
            columnNumber: 35
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MobileMenuButton/MobileMenuButton.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/hooks/useSidebarState.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSidebarState",
    ()=>useSidebarState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useSidebarState() {
    // State for sidebar collapsed/expanded
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // State for mobile menu open/closed
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // State for current window width (used for breakpoints)
    const [windowWidth, setWindowWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1200);
    // Update window width on resize
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);
    // Auto-close mobile menu when switching to desktop/tablet
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (windowWidth >= 768 && mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [
        windowWidth,
        mobileMenuOpen
    ]);
    // Prevent body scroll when mobile menu is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        // Cleanup: always reset body overflow on unmount
        return ()=>{
            document.body.style.overflow = "";
        };
    }, [
        mobileMenuOpen
    ]);
    // Responsive breakpoints
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1200;
    const isDesktop = windowWidth >= 1200;
    // Return state and toggles for sidebar and mobile menu
    return {
        sidebarCollapsed,
        mobileMenuOpen,
        isMobile,
        isTablet,
        isDesktop,
        toggleSidebar: ()=>setSidebarCollapsed(!sidebarCollapsed),
        toggleMobileMenu: ()=>setMobileMenuOpen(!mobileMenuOpen),
        closeMobileMenu: ()=>setMobileMenuOpen(false)
    };
}
}),
"[project]/components/DashboardLayout/DashboardLayout.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "layout": "DashboardLayout-module__x0G8uG__layout",
  "main": "DashboardLayout-module__x0G8uG__main",
  "overlay": "DashboardLayout-module__x0G8uG__overlay",
  "sidebarWrapper": "DashboardLayout-module__x0G8uG__sidebarWrapper",
});
}),
"[project]/components/DashboardLayout/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardSidebar/DashboardSidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileMenuButton$2f$MobileMenuButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MobileMenuButton/MobileMenuButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSidebarState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSidebarState.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$DashboardLayout$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout/DashboardLayout.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
function DashboardLayout({ children, userRole = "admin", userName = "Notandi", userAvatar, badgeCount = 0 }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const { sidebarCollapsed, mobileMenuOpen, toggleSidebar, toggleMobileMenu, closeMobileMenu } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSidebarState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSidebarState"])();
    // Resolve user data with Auth0 fallbacks
    const resolvedUserName = user?.name || userName;
    const resolvedUserAvatar = user?.picture || userAvatar;
    const resolvedUserRole = userRole;
    const resolvedBadgeCount = badgeCount;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$DashboardLayout$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].layout,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileMenuButton$2f$MobileMenuButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileMenuButton"], {
                isOpen: mobileMenuOpen,
                onClick: toggleMobileMenu
            }, void 0, false, {
                fileName: "[project]/components/DashboardLayout/index.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$DashboardLayout$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sidebarWrapper,
                "data-open": mobileMenuOpen,
                "data-collapsed": sidebarCollapsed,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardSidebar$2f$DashboardSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    userRole: resolvedUserRole,
                    userName: resolvedUserName,
                    userAvatar: resolvedUserAvatar,
                    badgeCount: resolvedBadgeCount,
                    collapsed: sidebarCollapsed,
                    onCollapsedChange: toggleSidebar,
                    showUserSection: false,
                    "data-open": mobileMenuOpen.toString()
                }, void 0, false, {
                    fileName: "[project]/components/DashboardLayout/index.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DashboardLayout/index.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$DashboardLayout$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
                onClick: closeMobileMenu,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/DashboardLayout/index.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                id: "main-content",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$DashboardLayout$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].main} ${sidebarCollapsed ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$DashboardLayout$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mainCollapsed : ""}`,
                children: children
            }, void 0, false, {
                fileName: "[project]/components/DashboardLayout/index.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DashboardLayout/index.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ConditionalLayout/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConditionalLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Footer/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout/index.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
/**
 * ConditionalLayout Component
 *
 * Routes between two layout types based on the current path:
 *
 * 1. Marketing Layout (Header + Content + Footer)
 *    - Home page: /
 *    - About page: /about
 *    - Palette showcase: /palette
 *    - Dev logs: /dev
 *    - Any other public/marketing pages
 *
 * 2. Dashboard Layout (Sidebar + Content, no Header/Footer)
 *    - Dashboard: /dashboard
 *    - Programs: /programs
 *    - Builder: /builder
 *    - Social: /social
 *    - Analytics: /analytics
 *    - Admin: /admin
 *    - Profile: /profile
 *    - Settings: /settings
 *    - Badges: /badges
 *    - Any other authenticated pages
 */ // Public routes that should show header and footer
const PUBLIC_ROUTES = [
    "/",
    "/about",
    "/palette",
    "/dev",
    "/login",
    "/signup",
    "/onboard",
    "/forgot-password",
    "/reset-password",
    "/verify-email"
];
// Dashboard/app routes that should use sidebar-only layout
const DASHBOARD_ROUTES = [
    "/dashboard",
    "/programs",
    "/builder",
    "/social",
    "/analytics",
    "/tags",
    "/admin",
    "/profile",
    "/settings",
    "/badges"
];
function ConditionalLayout({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    /**
   * Determine if current route is a public/marketing page
   * Returns true for exact matches or if no dashboard route matches
   */ const isPublicRoute = ()=>{
        // Exact match in public routes
        if (PUBLIC_ROUTES.includes(pathname)) {
            return true;
        }
        // Check if starts with any dashboard route
        const isDashboardRoute = DASHBOARD_ROUTES.some((route)=>pathname.startsWith(route));
        // If it's a dashboard route, it's not public
        if (isDashboardRoute) {
            return false;
        }
        // Default: treat as public (for any other pages like /terms, /privacy, etc.)
        return true;
    };
    const showPublicLayout = isPublicRoute();
    // Marketing/Public Layout: Header + Content + Footer
    if (showPublicLayout) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/components/ConditionalLayout/index.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "sl-main flex-1",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ConditionalLayout/index.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/components/ConditionalLayout/index.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    // Dashboard/App Layout: Sidebar + Content (no header/footer)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ConditionalLayout/index.tsx",
        lineNumber: 104,
        columnNumber: 10
    }, this);
}
}),
"[project]/lib/api-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API utility functions for handling fetch responses and errors
 */ // Get the API base URL - must be absolute URL for client-side requests
__turbopack_context__.s([
    "API_BASE",
    ()=>API_BASE,
    "buildApiUrl",
    ()=>buildApiUrl,
    "checkResponse",
    ()=>checkResponse,
    "checkResponseIs",
    ()=>checkResponseIs,
    "createFormData",
    ()=>createFormData,
    "fetchAndCheck",
    ()=>fetchAndCheck,
    "fetchAndCheckIs",
    ()=>fetchAndCheckIs,
    "handleApiError",
    ()=>handleApiError,
    "handleApiErrorIs",
    ()=>handleApiErrorIs
]);
const getApiBase = ()=>{
    // Check if we're on the client side
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // On server side, prefer internal Docker URL for SSR, then public URL
    return process.env.INTERNAL_API_URL || ("TURBOPACK compile-time value", "http://localhost:8000") || "http://backend:8000";
};
const API_BASE = getApiBase();
async function checkResponse(response) {
    if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                // FastAPI typically returns errors in a "detail" field
                if (errorData.detail) {
                    errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            }
        } catch (parseError) {
            // If we can't parse the error, use the default message
            console.error("Failed to parse error response:", parseError);
        }
        console.error("API Error Details:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            message: errorMessage
        });
        throw new Error(errorMessage);
    }
}
async function checkResponseIs(response) {
    if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `Villa kom upp: ${response.status} ${response.statusText}`;
        try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                // FastAPI typically returns errors in a "detail" field
                if (errorData.detail) {
                    errorMessage = typeof errorData.detail === "string" ? `Villa: ${errorData.detail}` : `Villa: ${JSON.stringify(errorData.detail)}`;
                } else if (errorData.message) {
                    errorMessage = `Villa: ${errorData.message}`;
                }
            }
        } catch (parseError) {
            console.error("Gat ekki lesið villuskilaboð:", parseError);
        }
        console.error("API Villa:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            message: errorMessage
        });
        throw new Error(errorMessage);
    }
}
async function fetchAndCheck(url, options) {
    const response = await fetch(url, options);
    await checkResponse(response);
    // Handle 204 No Content
    if (response.status === 204) {
        return undefined;
    }
    // Check if response has JSON content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    // Return empty object for non-JSON responses
    return {};
}
async function fetchAndCheckIs(url, options) {
    const response = await fetch(url, options);
    await checkResponseIs(response);
    // Handle 204 No Content
    if (response.status === 204) {
        return undefined;
    }
    // Check if response has JSON content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    // Return empty object for non-JSON responses
    return {};
}
function buildApiUrl(endpoint, baseUrl = API_BASE) {
    // Ensure we have a valid base URL
    if (!baseUrl || baseUrl === "/api") {
        baseUrl = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : ("TURBOPACK compile-time value", "http://localhost:8000") || "http://backend:8000";
    }
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    try {
        const url = new URL(cleanEndpoint, baseUrl);
        return url.toString();
    } catch (error) {
        console.error("Failed to build API URL:", {
            endpoint,
            baseUrl,
            cleanEndpoint,
            window: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "N/A",
            env: ("TURBOPACK compile-time value", "http://localhost:8000"),
            error: error instanceof Error ? error.message : "Unknown error"
        });
        throw error;
    }
}
function handleApiError(error, defaultMessage = "An unknown error occurred") {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return defaultMessage;
}
function handleApiErrorIs(error, defaultMessage = "Óþekkt villa kom upp") {
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
}
function createFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value])=>{
        if (value !== null && value !== undefined && value !== "") {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value) || typeof value === "object") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        }
    });
    return formData;
}
;
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API client utilities
__turbopack_context__.s([
    "api",
    ()=>api,
    "apiClient",
    ()=>apiClient,
    "fetchWithAuth",
    ()=>fetchWithAuth
]);
const API_BASE_URL = process.env.API_BASE_URL;
async function apiClient(endpoint, options = {}) {
    const { params, ...fetchOptions } = options;
    // Build URL with query params
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value])=>{
            searchParams.append(key, String(value));
        });
        url += `?${searchParams.toString()}`;
    }
    // Default headers
    const headers = {
        "Content-Type": "application/json",
        ...fetchOptions.headers
    };
    const response = await fetch(url, {
        ...fetchOptions,
        headers
    });
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
const api = {
    get: (endpoint, params)=>apiClient(endpoint, {
            method: "GET",
            params
        }),
    post: (endpoint, body)=>apiClient(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        }),
    patch: (endpoint, body)=>apiClient(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body)
        }),
    delete: (endpoint)=>apiClient(endpoint, {
            method: "DELETE"
        })
};
async function fetchWithAuth(url, options = {}, getToken) {
    const token = await getToken();
    if (!token) {
        throw new Error("No authentication token available");
    }
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        },
        credentials: "include"
    });
    if (!response.ok) {
        if (response.status === 401) {
            const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/auth/login?returnTo=${returnTo}`;
            throw new Error("Authentication required");
        }
        // Try to get error details from response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json().catch(()=>({}));
            // Pydantic 422 returns detail as an array of {loc, msg, type} objects
            if (Array.isArray(errorData.detail)) {
                const messages = errorData.detail.map((e)=>e.loc ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg).join("; ");
                console.error(`[API ${response.status}]`, errorData.detail);
                throw new Error(messages || `API error: ${response.status}`);
            }
            const msg = errorData.detail || errorData.message || `API error: ${response.statusText}`;
            console.error(`[API ${response.status}]`, msg);
            throw new Error(msg);
        }
        throw new Error(`API error: ${response.statusText}`);
    }
    // Handle 204 No Content (common for DELETE requests)
    if (response.status === 204) {
        return undefined;
    }
    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        // Check if there's actually content to parse
        const text = await response.text();
        if (!text || text.trim() === "") {
            return undefined;
        }
        return JSON.parse(text);
    }
    // Return undefined for non-JSON responses
    return undefined;
}
}),
"[project]/services/programs.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canEditProgram",
    ()=>canEditProgram,
    "createProgram",
    ()=>createProgram,
    "deleteProgram",
    ()=>deleteProgram,
    "extractTags",
    ()=>extractTags,
    "fetchProgramById",
    ()=>fetchProgramById,
    "fetchPrograms",
    ()=>fetchPrograms,
    "filterProgramsByQuery",
    ()=>filterProgramsByQuery,
    "filterProgramsByTags",
    ()=>filterProgramsByTags,
    "likeProgram",
    ()=>likeProgram,
    "sortPrograms",
    ()=>sortPrograms,
    "unlikeProgram",
    ()=>unlikeProgram,
    "updateProgram",
    ()=>updateProgram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
;
;
function canEditProgram(user, program) {
    if (!user || !program) return false;
    return user.id === program.author_id;
}
async function fetchPrograms(workspaceId, getToken) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/workspaces/${workspaceId}/programs?limit=200`);
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "GET"
    }, getToken);
    return Array.isArray(data) ? data : data.programs || [];
}
async function fetchProgramById(id, getToken) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/programs/${id}`);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "GET"
    }, getToken);
}
async function createProgram(input, getToken) {
    const payload = {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        image: input.image?.trim() || null,
        instructions: input.instructions?.trim() || null,
        equipment: input.equipment && input.equipment.length > 0 ? input.equipment : null,
        duration_min: input.duration_min ?? null,
        duration_max: input.duration_max ?? null,
        prep_time_min: input.prep_time_min ?? null,
        prep_time_max: input.prep_time_max ?? null,
        age: input.age && input.age.length > 0 ? input.age : null,
        location: input.location?.trim() || null,
        count_min: input.count_min ?? null,
        count_max: input.count_max ?? null,
        price: input.price ?? null,
        tag_names: input.tagNames && input.tagNames.length > 0 ? input.tagNames : null,
        content_type: "program"
    };
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/workspaces/${input.workspaceId}/programs`);
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }, getToken);
    return Array.isArray(data) ? data[0] : data;
}
async function updateProgram(id, input, getToken) {
    const { tagNames, ...rest } = input;
    const body = tagNames !== undefined ? {
        ...rest,
        tag_names: tagNames
    } : rest;
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/programs/${id}`);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }, getToken);
}
async function deleteProgram(id, getToken) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/programs/${id}`);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "DELETE"
    }, getToken);
}
async function likeProgram(programId, getToken) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/content/${programId}/likes`);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "POST"
    }, getToken);
}
async function unlikeProgram(programId, getToken) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/content/${programId}/likes`);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWithAuth"])(url, {
        method: "DELETE"
    }, getToken);
}
function extractTags(programs) {
    const tagNames = programs.flatMap((p)=>(p.tags || []).map((t)=>t.name));
    return Array.from(new Set(tagNames));
}
function filterProgramsByQuery(programs, query) {
    if (!query.trim()) return programs;
    const q = query.trim().toLowerCase();
    return programs.filter((p)=>p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
}
function filterProgramsByTags(programs, selectedTags) {
    if (selectedTags.length === 0) return programs;
    return programs.filter((p)=>{
        const programTagNames = (p.tags || []).map((t)=>t.name);
        return selectedTags.some((selectedTag)=>programTagNames.includes(selectedTag));
    });
}
function sortPrograms(programs, sortBy) {
    const sorted = [
        ...programs
    ];
    switch(sortBy){
        case "newest":
            return sorted.sort((a, b)=>new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        case "oldest":
            return sorted.sort((a, b)=>new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
        case "most-liked":
            return sorted.sort((a, b)=>(b.like_count || 0) - (a.like_count || 0));
        case "alphabetical":
            return sorted.sort((a, b)=>a.name.localeCompare(b.name, "is"));
        default:
            return sorted;
    }
}
}),
"[project]/services/users.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminDeleteUser",
    ()=>adminDeleteUser,
    "adminUpdateUser",
    ()=>adminUpdateUser,
    "getCurrentUser",
    ()=>getCurrentUser,
    "listUsers",
    ()=>listUsers,
    "updateCurrentUser",
    ()=>updateCurrentUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-utils.ts [app-ssr] (ecmascript)");
;
async function getCurrentUser(token) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])("/users/me");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        credentials: "include"
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to get user: ${response.status} - ${errorBody}`);
    }
    return response.json();
}
async function updateCurrentUser(token, updates) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])("/users/me");
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updates),
        credentials: "include"
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update user: ${response.status} - ${errorBody}`);
    }
    return response.json();
}
async function listUsers(token, params = {}) {
    const { q, limit = 50, offset = 0 } = params;
    const searchParams = new URLSearchParams();
    searchParams.set("limit", String(limit));
    searchParams.set("offset", String(offset));
    if (q && q.length >= 2) searchParams.set("q", q);
    const url = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])("/users/admin/list")}?${searchParams.toString()}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        credentials: "include"
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to list users: ${response.status} - ${errorBody}`);
    }
    const items = await response.json();
    const totalHeader = response.headers.get("X-Total-Count");
    const total = totalHeader ? parseInt(totalHeader, 10) : items.length;
    return {
        items,
        total
    };
}
async function adminUpdateUser(token, userId, updates) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/users/${userId}`);
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updates),
        credentials: "include"
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update user: ${response.status} - ${errorBody}`);
    }
    return response.json();
}
async function adminDeleteUser(token, userId) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildApiUrl"])(`/users/${userId}`);
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
        credentials: "include"
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to delete user: ${response.status} - ${errorBody}`);
    }
}
}),
"[project]/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$users$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/users.service.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const { user: auth0User, isLoading: auth0IsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tokenCache, setTokenCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    /**
   * Get fresh access token for API calls
   * Caches token for 5 minutes to avoid excessive API calls
   */ const getToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Return cached token if still valid
        if (tokenCache && tokenCache.expiresAt > Date.now()) {
            return tokenCache.token;
        }
        try {
            const response = await fetch("/api/auth/token");
            if (response.status === 401) {
                setUser(null);
                setTokenCache(null);
                // Redirect to login (not logout) so the user can re-authenticate and
                // return to exactly where they were. Their localStorage draft survives.
                const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `/auth/login?returnTo=${returnTo}`;
                return null;
            }
            if (!response.ok) {
                console.error("Failed to get access token from session");
                return null;
            }
            const data = await response.json();
            const token = data.accessToken;
            if (token) {
                // Cache token for 5 minutes
                setTokenCache({
                    token,
                    expiresAt: Date.now() + 5 * 60 * 1000
                });
            }
            return token || null;
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    }, [
        tokenCache
    ]);
    /**
   * Fetch user from backend when Auth0 authentication completes
   * Backend will auto-create user if first login
   */ const fetchBackendUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!auth0User) {
            setUser(null);
            setIsLoading(false);
            setError(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) {
                console.warn("No access token available - user may not be fully authenticated yet");
                setUser(null);
                return;
            }
            // Backend will auto-create user if first login
            const backendUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$users$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUser"])(token);
            setUser(backendUser);
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Failed to fetch user");
            console.error("Failed to fetch backend user:", error);
            setError(error);
            setUser(null);
        } finally{
            setIsLoading(false);
        }
    }, [
        auth0User,
        getToken
    ]);
    // Fetch backend user when Auth0 auth state changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!auth0IsLoading) {
            if (auth0User) {
                fetchBackendUser();
            } else {
                setUser(null);
                setIsLoading(false);
                setError(null);
                setTokenCache(null);
            }
        }
    }, [
        auth0User,
        auth0IsLoading,
        fetchBackendUser
    ]);
    const isAuthenticated = !!user;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated,
            isLoading: isLoading || auth0IsLoading,
            error,
            getToken,
            refetch: fetchBackendUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AuthContext.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
}),
"[project]/hooks/useAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
;
function useAuth() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
}
}),
"[project]/contexts/LikesContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LikesProvider",
    ()=>LikesProvider,
    "useLikes",
    ()=>useLikes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$programs$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/programs.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const LikesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function LikesProvider({ children }) {
    const { getToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [likes, setLikes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const likesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(likes);
    likesRef.current = likes;
    const initLike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, liked, count)=>{
        setLikes((prev)=>{
            if (prev.has(id)) return prev;
            const next = new Map(prev);
            next.set(id, {
                liked,
                count
            });
            return next;
        });
    }, []);
    const isLiked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>likes.get(id)?.liked ?? false, [
        likes
    ]);
    const getLikeCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>likes.get(id)?.count, [
        likes
    ]);
    const toggleLike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id)=>{
        const entry = likesRef.current.get(id);
        const wasLiked = entry?.liked ?? false;
        const prevCount = entry?.count ?? 0;
        setLikes((prev)=>{
            const next = new Map(prev);
            next.set(id, {
                liked: !wasLiked,
                count: wasLiked ? prevCount - 1 : prevCount + 1
            });
            return next;
        });
        try {
            if (wasLiked) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$programs$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unlikeProgram"])(id, getToken);
            else await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$programs$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["likeProgram"])(id, getToken);
        } catch  {
            setLikes((prev)=>{
                const next = new Map(prev);
                next.set(id, {
                    liked: wasLiked,
                    count: prevCount
                });
                return next;
            });
        }
    }, [
        getToken
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LikesContext.Provider, {
        value: {
            initLike,
            isLiked,
            getLikeCount,
            toggleLike
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/LikesContext.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
function useLikes(programId, initialCount, initialLiked = false) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LikesContext);
    if (!context) throw new Error("useLikes must be used within LikesProvider");
    const { initLike, isLiked: contextIsLiked, getLikeCount, toggleLike: contextToggleLike } = context;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        initLike(programId, initialLiked, initialCount);
    }, [
        programId,
        initialLiked,
        initialCount,
        initLike
    ]);
    const currentCount = getLikeCount(programId) ?? initialCount;
    return {
        likeCount: currentCount,
        isLiked: contextIsLiked(programId),
        toggleLike: ()=>contextToggleLike(programId)
    };
}
}),
"[project]/contexts/FavoritesContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FavoritesProvider",
    ()=>FavoritesProvider,
    "useFavorite",
    ()=>useFavorite,
    "useFavorites",
    ()=>useFavorites
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/safe-storage.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const FavoritesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load favorites from backend/localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadFavorites();
    }, []);
    const loadFavorites = async ()=>{
        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await fetch('/api/users/me/favorites');
            // const data = await response.json();
            // setFavorites(new Set(data.programIds));
            // For now, load from localStorage as fallback
            const stored = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].getItem("favorite-programs");
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(new Set(parsed));
            }
        } catch (error) {
            console.error("Failed to load favorites:", error);
        } finally{
            setIsLoading(false);
        }
    };
    const isFavorite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((programId)=>{
        return favorites.has(programId);
    }, [
        favorites
    ]);
    const toggleFavorite = async (programId)=>{
        const wasFavorite = favorites.has(programId);
        // Optimistic update
        setFavorites((prev)=>{
            const next = new Set(prev);
            if (wasFavorite) {
                next.delete(programId);
            } else {
                next.add(programId);
            }
            return next;
        });
        // Persist to localStorage immediately
        const updatedSet = new Set(favorites);
        if (wasFavorite) {
            updatedSet.delete(programId);
        } else {
            updatedSet.add(programId);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].setItem("favorite-programs", JSON.stringify(Array.from(updatedSet)));
        try {
            // TODO: Replace with actual API call when backend is ready
            if (wasFavorite) {
                const response = await fetch(`/api/users/me/favorites/${programId}`, {
                    method: "DELETE"
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkResponse"])(response);
            } else {
                const response = await fetch("/api/users/me/favorites", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        programId
                    })
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkResponse"])(response);
            }
        } catch (error) {
            // Revert optimistic update on error
            setFavorites((prev)=>{
                const next = new Set(prev);
                if (wasFavorite) {
                    next.add(programId);
                } else {
                    next.delete(programId);
                }
                return next;
            });
            // Revert localStorage
            if (wasFavorite) {
                favorites.add(programId);
            } else {
                favorites.delete(programId);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$safe$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeLocalStorage"].setItem("favorite-programs", JSON.stringify(Array.from(favorites)));
            console.error("Failed to update favorite:", error);
        // You could show a toast notification here
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FavoritesContext.Provider, {
        value: {
            favorites,
            isLoading,
            toggleFavorite,
            isFavorite
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/FavoritesContext.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
function useFavorite(programId) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(FavoritesContext);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!context) {
        throw new Error("useFavorite must be used within FavoritesProvider");
    }
    const { isFavorite: contextIsFavorite, toggleFavorite: contextToggleFavorite } = context;
    // Only check favorite state after hydration to avoid mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    return {
        isFavorite: mounted ? contextIsFavorite(programId) : false,
        toggleFavorite: ()=>contextToggleFavorite(programId)
    };
}
function useFavorites() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__789623b4._.js.map