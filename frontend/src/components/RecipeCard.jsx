import React, { useState, useEffect } from 'react';
import { Heart, ChefHat, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const RecipeCard = ({ recipe }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = () => {
            const saved = JSON.parse(localStorage.getItem('chatChefFavorites') || '[]');
            setIsFavorite(!!saved.find(r => r.name === recipe.name));
        }
        checkFavorite();
        window.addEventListener('storageChange', checkFavorite);
        return () => window.removeEventListener('storageChange', checkFavorite);
    }, [recipe.name]);

    const toggleFavorite = () => {
        let saved = JSON.parse(localStorage.getItem('chatChefFavorites') || '[]');
        if (isFavorite) {
            saved = saved.filter(r => r.name !== recipe.name);
            toast.info(`Removed ${recipe.name} from favorites`);
            setIsFavorite(false);
        } else {
            saved.push(recipe);
            toast.success(`Saved ${recipe.name} to favorites ❤️`);
            setIsFavorite(true);
        }
        localStorage.setItem('chatChefFavorites', JSON.stringify(saved));
        window.dispatchEvent(new Event('storageChange'));
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={styles.card}
        >
            <div style={styles.imageContainer}>
                <img 
                    src={recipe.image} 
                    alt={recipe.name} 
                    style={styles.image} 
                    onError={(e) => { 
                        const fallbacks = [
                            "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1484723091791-0fee59cb0c47?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                        ];
                        e.target.onError = null; 
                        e.target.src = fallbacks[recipe.name.length % fallbacks.length]; 
                    }}
                />
                <button onClick={toggleFavorite} style={styles.favBtn}>
                    <Heart size={24} fill={isFavorite ? 'var(--color-error)' : 'none'} color={isFavorite ? 'var(--color-error)' : 'white'} />
                </button>
            </div>
            
            <div style={styles.content}>
                <h2 style={styles.title}>{recipe.name}</h2>
                
                <div style={styles.columns}>
                    <div style={styles.ingredients}>
                        <h3 style={styles.h3}><ChefHat size={18}/> Ingredients</h3>
                        <ul style={styles.ul}>
                            {recipe.ingredients.map((ing, i) => (
                                <li key={i} style={styles.li}>{ing}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div style={styles.steps}>
                        <h3 style={styles.h3}><PlayCircle size={18}/> Instructions</h3>
                        <ol style={styles.ol}>
                            {recipe.steps.map((step, i) => (
                                <li key={i} style={styles.oli}>
                                    <span style={styles.stepNum}>{i + 1}</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {recipe.youtube && (
                    <div style={styles.videoContainer}>
                        <h3 style={styles.h3}>Tutorial</h3>
                        <iframe 
                            width="100%" 
                            height="300" 
                            src={recipe.youtube} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            style={styles.iframe}
                        ></iframe>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const styles = {
    card: {
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column'
    },
    imageContainer: {
        position: 'relative',
        height: '300px',
        width: '100%'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    favBtn: {
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        border: 'none',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition)'
    },
    content: {
        padding: '2rem'
    },
    title: {
        fontSize: '2.5rem',
        color: 'var(--color-primary)',
        marginBottom: '1.5rem',
        lineHeight: 1.2
    },
    columns: {
        display: 'grid',
        gridTemplateColumns: 'minmax(250px, 30%) 1fr',
        gap: '2rem',
        marginBottom: '2rem'
    },
    ingredients: {
        background: 'var(--color-bg)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)'
    },
    steps: {
        padding: '0 1rem'
    },
    h3: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--color-text-main)',
        marginBottom: '1rem',
        fontSize: '1.25rem'
    },
    ul: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    li: {
        padding: '0.5rem 0',
        borderBottom: '1px dashed var(--color-border)',
        color: 'var(--color-text-muted)'
    },
    ol: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    oli: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
        color: 'var(--color-text-muted)',
        lineHeight: 1.6
    },
    stepNum: {
        background: 'var(--color-secondary)',
        color: 'var(--color-primary)',
        fontWeight: 'bold',
        minWidth: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    videoContainer: {
        marginTop: '2rem',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '2rem'
    },
    iframe: {
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)'
    }
};

export default RecipeCard;
