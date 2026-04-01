import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChefHat, ImagePlus, X, Search, UploadCloud } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import LoadingScreen from '../components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [ingredients, setIngredients] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles].slice(0, 5)); // max 5 images
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...droppedFiles].slice(0, 5));
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ingredients.trim() && files.length === 0) {
            toast.error("Please enter ingredients or upload images!", { icon: "🧅" });
            return;
        }

        setLoading(true);
        setRecipes([]);

        const formData = new FormData();
        if (ingredients.trim()) {
            formData.append('ingredients', ingredients);
        }
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/recipes/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setRecipes(response.data.recipes || []);
            toast.success("Recipes generated successfully! 🍳");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to generate recipes. Did you set API keys in backend?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
            {!loading && recipes.length === 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <ChefHat size={56} /> Chat Chef Pro
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
                            Tell us what ingredients you have, or upload a photo of your fridge, and we'll handle the rest!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.formCard}>
                        {/* Text Input */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Ingredients you have (comma separated)</label>
                            <input 
                                type="text"
                                style={styles.input}
                                placeholder="e.g. eggs, milk, flour, sugar..."
                                value={ingredients}
                                onChange={e => setIngredients(e.target.value)}
                            />
                        </div>

                        {/* Drag and Drop Zone */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Or upload photos of your ingredients</label>
                            <div 
                                style={{
                                    ...styles.dropZone,
                                    borderColor: dragActive ? 'var(--color-primary)' : 'var(--color-border)',
                                    background: dragActive ? 'var(--color-secondary)' : 'var(--color-bg)'
                                }}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none' }} 
                                    id="file-upload" 
                                />
                                <label htmlFor="file-upload" style={styles.uploadLabel}>
                                    <UploadCloud size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                                    <p>Drag and drop images here, or <strong>click to browse</strong></p>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>(Max 5 images)</span>
                                </label>
                            </div>

                            {/* Image Previews */}
                            {files.length > 0 && (
                                <div style={styles.previewContainer}>
                                    {files.map((file, i) => (
                                        <div key={i} style={styles.previewBadge}>
                                            <ImagePlus size={14} />
                                            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                            <button type="button" onClick={() => removeFile(i)} style={styles.removeBtn}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" style={styles.submitBtn}>
                            <Search size={20} /> Generate Magic Recipes
                        </button>
                    </form>
                </motion.div>
            )}

            <AnimatePresence>
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoadingScreen />
                    </motion.div>
                )}
            </AnimatePresence>

            {!loading && recipes.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-main)' }}>Your Recipes</h2>
                        <button style={styles.resetBtn} onClick={() => setRecipes([])}>Start Over</button>
                    </div>
                    {recipes.map((recipe, i) => (
                        <RecipeCard key={i} recipe={recipe} />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

const styles = {
    formCard: {
        background: 'var(--color-surface)',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)'
    },
    inputGroup: {
        marginBottom: '2rem'
    },
    label: {
        display: 'block',
        fontSize: '1.1rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        color: 'var(--color-text-main)'
    },
    input: {
        width: '100%',
        padding: '1rem 1.5rem',
        fontSize: '1.1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        transition: 'var(--transition)'
    },
    dropZone: {
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '3rem',
        textAlign: 'center',
        transition: 'var(--transition)',
        cursor: 'pointer'
    },
    uploadLabel: {
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'var(--color-text-main)'
    },
    previewContainer: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: '1rem'
    },
    previewBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.85rem'
    },
    removeBtn: {
        background: 'var(--color-error)',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    },
    submitBtn: {
        width: '100%',
        background: 'var(--color-primary)',
        color: 'white',
        padding: '1.25rem',
        fontSize: '1.25rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-sm)'
    },
    resetBtn: {
        padding: '0.75rem 1.5rem',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-full)',
        fontWeight: 600,
        color: 'var(--color-text-main)'
    }
};

export default Home;
