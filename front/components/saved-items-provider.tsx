'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

export type SavedItem = {
  id: string;
  type: 'movie' | 'book' | 'series';
  title: string;
  image?: string;
  [key: string]: any;
};

interface SavedItemsContextProps {
  savedItems: SavedItem[];
  isSaved: (id: string) => boolean;
  addItem: (item: SavedItem) => void;
  removeItem: (id: string) => void;
}

const SavedItemsContext = createContext<SavedItemsContextProps | undefined>(undefined);

export const useSavedItems = () => {
  const ctx = useContext(SavedItemsContext);
  if (!ctx) throw new Error('useSavedItems must be used within SavedItemsProvider');
  return ctx;
};

const STORAGE_KEY = 'saved_items';

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSavedItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  const addItem = (item: SavedItem) => {
    setSavedItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  };

  const removeItem = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isSaved = (id: string) => savedItems.some((i) => i.id === id);

  return (
    <SavedItemsContext.Provider value={{ savedItems, addItem, removeItem, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
};
