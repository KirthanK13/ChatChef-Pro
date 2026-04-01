import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { motion } from 'framer-motion';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const load = () => {
            const saved = JSON.parse(localStorage.getItem('chatChefFavorites') || '[]');
            setFavorites(saved);
        }
        load();
        // Listen to custom storage event for instant updates
        window.addEventListener('storageChange', load);
        return () => window.removeEventListener('storageChange', load);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}
        >
            <h1 style={{ fontSize: '3rem', color: 'var(--color-text-main)', marginBottom: '2rem' }}>
                Your Favorites <span style={{ color: 'var(--color-error)' }}>❤️</span>
            </h1>
            {favorites.length === 0 ? (
                <div style={{ background: 'var(--color-surface)', padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>No recipes saved yet.</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-border)' }}>Go cook something delicious!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {favorites.map((recipe, i) => (
                        <RecipeCard key={`fav-${i}`} recipe={recipe} />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Favorites;
