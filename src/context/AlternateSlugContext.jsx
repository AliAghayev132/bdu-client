"use client";

import { createContext, useContext, useState, useCallback } from "react";

/**
 * AlternateSlug Context
 * Dinamik səhifələrdə dil dəyişdirəndə düzgün slug istifadə etmək üçün
 * 
 * İstifadə:
 * 1. Detail səhifəsində: setAlternateSlug({ az: "az-slug", en: "en-slug" })
 * 2. Navbar-da: const slugs = alternateSlug; // { az: "...", en: "..." }
 */

const AlternateSlugContext = createContext({
    alternateSlug: null, // { az: string, en: string } | null
    setAlternateSlug: () => { },
    clearAlternateSlug: () => { },
});

export function AlternateSlugProvider({ children }) {
    const [alternateSlug, setAlternateSlugState] = useState(null);

    const setAlternateSlug = useCallback((slugs) => {
        // slugs = { az: "azerbaijani-slug", en: "english-slug" }
        setAlternateSlugState(slugs);
    }, []);

    const clearAlternateSlug = useCallback(() => {
        setAlternateSlugState(null);
    }, []);

    return (
        <AlternateSlugContext.Provider
            value={{
                alternateSlug,
                setAlternateSlug,
                clearAlternateSlug,
            }}
        >
            {children}
        </AlternateSlugContext.Provider>
    );
}

export function useAlternateSlug() {
    const context = useContext(AlternateSlugContext);
    if (!context) {
        throw new Error("useAlternateSlug must be used within AlternateSlugProvider");
    }
    return context;
}

export default AlternateSlugContext;
