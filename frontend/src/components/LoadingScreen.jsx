import React from 'react';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
       <motion.div
         animate={{ y: [0, -25, 0], rotate: [0, 15, -15, 0] }}
         transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
         style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '50%', boxShadow: 'var(--shadow-md)' }}
       >
         <ChefHat size={64} color="var(--color-primary)" />
       </motion.div>
       <motion.h3
         animate={{ opacity: [0.4, 1, 0.4] }}
         transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
         style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}
       >
         Cooking something delicious...
       </motion.h3>
       <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Analyzing ingredients & generating a recipe just for you.</p>
    </div>
  )
}
export default LoadingScreen;
