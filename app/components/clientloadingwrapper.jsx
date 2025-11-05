'use client';

import { useEffect, useState } from 'react';
import Loading from './loading';

export default function ClientLoadingWrapper({ children }) {
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    // Always show loading on mount, then hide after delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show loader for 2 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className={loading ? 'hidden' : 'block'}>
        {children}
      </div>
    </>
  );
}
