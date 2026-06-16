"use client";

import WaterEffect from '../components/WaterEffect';

const Resume = () => {
  return (
    <div className="min-h-screen relative">
      <div className='absolute inset-0 pointer-events-none'>
      <WaterEffect />
      </div>
    </div>
  );
};

export default Resume;