'use client';

import { useEffect, useState } from 'react';
import Loading from './loading';

export default function ClientLoadingWrapper({ children }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;

    // Show loading only on first load or reload
    if (navType === "navigate" || navType === "reload") {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500); // adjust based on how long you want the splash
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      {loading && <Loading />}
      <div className={loading ? 'hidden' : 'block'}>
        {children}
      </div>
    </>
  );
}
