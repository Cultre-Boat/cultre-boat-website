"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollbarContext = createContext();

export const useScrollbar = () => {
  const context = useContext(ScrollbarContext);
  if (!context) {
    throw new Error('useScrollbar must be used within a ScrollbarProvider');
  }
  return context;
};

export const ScrollbarProvider = ({ children }) => {
  const [hideScrollbar, setHideScrollbar] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide scrollbar only on the main page (root path)
    const isMainPage = pathname === '/';
    setHideScrollbar(isMainPage);

    // Apply the class to body
    if (isMainPage) {
      document.body.classList.add('hide-scrollbar');
    } else {
      document.body.classList.remove('hide-scrollbar');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('hide-scrollbar');
    };
  }, [pathname]);

  const value = {
    hideScrollbar,
    setHideScrollbar
  };

  return (
    <ScrollbarContext.Provider value={value}>
      {children}
    </ScrollbarContext.Provider>
  );
};
