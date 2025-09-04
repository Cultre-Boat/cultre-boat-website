'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WaterEffect } from '@react-three/postprocessing';

const ImageGrid = ({ images }) => {
    // Animation variants for staggered animation of images
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20,
            },
        },
    };

    // Split images into two arrays for left and right columns on desktop
    const leftColumnImages = images.filter((_, index) => index % 2 === 0);
    const rightColumnImages = images.filter((_, index) => index % 2 !== 0);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Mobile: Single-column grid, Desktop: Two-column flex */}
            <motion.div
                className="grid grid-cols-1 md:flex md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Column (odd-indexed images) */}
                <div className="md:w-1/2 space-y-6 md:space-y-8">
                    {leftColumnImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className="relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt || 'Gallery image'}
                                width={0}
                                height={0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="w-full h-auto max-w-full"
                                style={{ objectFit: 'contain' }}
                                priority={index < 2}
                                unoptimized={true}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Right Column (even-indexed images) */}
                <div className="md:w-1/2 space-y-6 md:space-y-8">
                    {rightColumnImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className="relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt || 'Gallery image'}
                                width={0}
                                height={0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="w-full h-auto max-w-full"
                                style={{ objectFit: 'contain' }}
                                priority={index < 2}
                                unoptimized={true}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default ImageGrid;