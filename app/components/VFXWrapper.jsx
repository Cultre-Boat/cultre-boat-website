'use client';

import dynamic from 'next/dynamic';

const VFXCanvas = dynamic(() => import('./VFXCanvas'), {
  ssr: false
});

export default function VFXWrapper({ children }) {
  return <VFXCanvas>{children}</VFXCanvas>;
}