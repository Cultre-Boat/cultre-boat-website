'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function TransitionEffect({ children }) {
  const pathname = usePathname()
  const [showOverlay, setShowOverlay] = useState(false)
  const [currentChildren, setCurrentChildren] = useState(children)

  useEffect(() => {
    if (children.key !== currentChildren.key) {
      setShowOverlay(true)
      // Wait for overlay animation to complete before updating content
      const timer = setTimeout(() => {
        setCurrentChildren(children)
        setShowOverlay(false)
      }, 1000) // Matches overlay animation duration
      return () => clearTimeout(timer)
    }
  }, [children, currentChildren.key])

  return (
    <>
      <AnimatePresence>
        {/* Blur overlay that expands and disappears */}
        {showOverlay && (
            <motion.div
  key="overlay"
  initial={{ scaleX: 0, transformOrigin: 'left center' }}
  animate={{ scaleX: 1 }}
  exit={{ scaleX: 0, transformOrigin: 'right center' }}
  transition={{ duration: 0.8 }}
  className="fixed inset-0 z-50 bg-black/80"
  onAnimationComplete={() => {
    setCurrentChildren(children)
    setShowOverlay(false)
  }}
/>
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {currentChildren}
      </motion.div>
    </>
  )
}