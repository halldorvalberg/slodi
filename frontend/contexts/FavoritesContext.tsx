"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface FavoritesContextValue {
  favorites: Set<string>;
  isLoading: boolean;
  toggleFavorite: (programId: string) => Promise<void>;
  isFavorite: (programId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Load favorites from backend on mount
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // TODO: API call to get user favorites
      // const response = await fetch('/api/users/me/favorites');
      // const data = await response.json();
      // setFavorites(new Set(data.programIds));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (programId: string) => {
    const wasFavorite = favorites.has(programId);
    
    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      wasFavorite ? next.delete(programId) : next.add(programId);
      return next;
    });
    
    try {
      if (wasFavorite) {
        // await fetch(`/api/users/me/favorites/${programId}`, { method: 'DELETE' });
      } else {
        // await fetch('/api/users/me/favorites', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ programId }),
        // });
      }
    } catch (error) {
      // Revert on error
      setFavorites(prev => {
        const next = new Set(prev);
        wasFavorite ? next.add(programId) : next.delete(programId);
        return next;
      });
      console.error('Failed to update favorite:', error);
    }
  };

  const isFavorite = (programId: string) => favorites.has(programId);

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return context;
}
