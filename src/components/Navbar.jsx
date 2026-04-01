import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { store } from '../utils/store';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const profile = store.get('profile');

  const links = [
    { to: '/', label: 'Home' },
    { to: '/match', label: 'Match' },
    { to: '/workspace', label: 'Workspace' },
    { to: '/milestones', label: 'Milestones' },
    { to: '/pitch', label: 'Pitch Deck' },
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <div className="logo-icon">⚒</div>
        <span className="text-gradient">CrossForge</span>
      </div>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-profile">
        {profile && (
          <div
            className="navbar-avatar"
            style={{ background: 'var(--gradient-primary)' }}
            onClick={() => navigate('/profile')}
            title={profile.name}
          >
            {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        )}
        <button className="navbar-hamburger" onClick={() => setOpen(!open)}>
          <span style={open ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
          <span style={open ? { opacity: 0 } : {}} />
          <span style={open ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
        </button>
      </div>
    </motion.nav>
  );
}
