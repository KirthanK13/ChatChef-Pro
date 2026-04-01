import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChefHat, Heart } from 'lucide-react';

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    <ChefHat color="var(--color-primary)" size={32} />
                    <span style={styles.logoText}>Chat Chef Pro</span>
                </Link>
                <div style={styles.links}>
                    <NavLink to="/" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>
                        Home
                    </NavLink>
                    <NavLink to="/favorites" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>
                        <Heart size={18} /> Favorites
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '1.25rem 0',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--color-border)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--color-text-main)',
        letterSpacing: '-0.02em'
    },
    links: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        transition: 'var(--transition)'
    },
    activeLink: {
        color: 'var(--color-primary)'
    }
};

export default Navbar;
