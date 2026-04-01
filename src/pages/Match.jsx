import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from '../utils/store';
import { sampleProfiles } from '../data/sampleProfiles';
import { findMatches } from '../utils/matchingAlgorithm';

const deptTag = { Engineering: 'tag-engineering', Design: 'tag-design', Business: 'tag-business', Sciences: 'tag-sciences', Arts: 'tag-arts' };

const barColors = ['var(--gradient-primary)', 'var(--gradient-secondary)', 'var(--gradient-accent)', 'var(--gradient-warm)'];

export default function Match() {
  const navigate = useNavigate();
  const profile = store.get('profile');
  const [matches, setMatches] = useState([]);
  const [team, setTeam] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (profile) {
      const result = findMatches(profile, sampleProfiles);
      setMatches(result);
    }
    const savedTeam = store.get('team');
    if (savedTeam) setTeam(savedTeam);
  }, []);

  const addToTeam = (match) => {
    const newTeam = [...team, match];
    setTeam(newTeam);
    store.set('team', newTeam);
    setDismissed(d => [...d, match.profile.id]);
  };

  const dismiss = (id) => setDismissed(d => [...d, id]);

  const removeFromTeam = (id) => {
    const newTeam = team.filter(m => m.profile.id !== id);
    setTeam(newTeam);
    store.set('team', newTeam);
  };

  if (!profile) {
    return (
      <div className="page-container">
        <div className="match-container">
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <h3>Create Your Profile First</h3>
            <p>We need to know your skills and interests to find the best matches for you.</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>Create Profile</button>
          </div>
        </div>
      </div>
    );
  }

  const visibleMatches = matches.filter(m => !dismissed.includes(m.profile.id) && !team.find(t => t.profile.id === m.profile.id));

  return (
    <div className="page-container">
      <div className="match-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-header" style={{ marginBottom: 32 }}>
            <h2><span className="text-gradient">Your Matches</span></h2>
            <p>AI-powered recommendations based on complementary skills and shared interests.</p>
          </div>

          {/* Team Section */}
          {team.length > 0 && (
            <div className="team-section" style={{ marginTop: 0, marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ Your Team <span className="badge badge-success">{team.length} members</span>
              </h2>
              <div className="team-grid">
                {team.map(m => (
                  <motion.div key={m.profile.id} className="glass-card team-member-card" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <div className="match-avatar" style={{ background: m.profile.avatarBg, width: 48, height: 48, fontSize: '1rem' }}>{m.profile.avatar}</div>
                    <h4 style={{ fontSize: '0.9375rem', marginBottom: 4 }}>{m.profile.name}</h4>
                    <span className={`tag ${deptTag[m.profile.department] || 'tag-default'}`} style={{ fontSize: '0.75rem' }}>{m.profile.department}</span>
                    <button className="btn btn-danger btn-sm" style={{ marginTop: 12, width: '100%', fontSize: '0.75rem' }} onClick={() => removeFromTeam(m.profile.id)}>Remove</button>
                  </motion.div>
                ))}
              </div>
              {team.length >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16, textAlign: 'center' }}>
                  <button className="btn btn-success" onClick={() => navigate('/workspace')}>Go to Workspace →</button>
                </motion.div>
              )}
            </div>
          )}

          {/* Match Cards */}
          <AnimatePresence>
            {visibleMatches.slice(0, 8).map((match, i) => (
              <motion.div
                key={match.profile.id}
                className="glass-card match-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="match-header">
                  <div className="match-avatar" style={{ background: match.profile.avatarBg }}>{match.profile.avatar}</div>
                  <div className="match-info">
                    <h3>{match.profile.name}</h3>
                    <p>{match.profile.department} · {match.profile.year} · {match.profile.availability}h/week</p>
                    {match.profile.bio && <p style={{ marginTop: 4, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{match.profile.bio}</p>}
                  </div>
                  <div className="match-score">
                    <div className="match-score-value" style={{ color: match.compatibility.total > 70 ? 'var(--color-success)' : match.compatibility.total > 50 ? 'var(--color-warning)' : 'var(--text-secondary)' }}>
                      {match.compatibility.total}%
                    </div>
                    <div className="match-score-label">compatibility</div>
                  </div>
                </div>

                <div className="match-skills">
                  <span className={`tag ${deptTag[match.profile.department] || 'tag-default'}`} style={{ fontSize: '0.75rem' }}>{match.profile.department}</span>
                  {match.profile.skills.slice(0, 4).map(s => <span key={s} className="tag tag-default" style={{ fontSize: '0.75rem' }}>{s}</span>)}
                </div>

                <div className="compatibility-bars">
                  {Object.entries(match.compatibility.breakdown).map(([key, val], bi) => (
                    <div key={key} className="compat-bar-item">
                      <div className="compat-bar-label">
                        <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>{val}%</span>
                      </div>
                      <div className="compat-bar">
                        <div className="compat-bar-fill" style={{ width: `${val}%`, background: barColors[bi] }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="match-actions">
                  <motion.button className="btn btn-primary btn-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToTeam(match)}>
                    ✓ Add to Team
                  </motion.button>
                  <button className="btn btn-secondary btn-sm" onClick={() => dismiss(match.profile.id)}>Skip</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleMatches.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <h3>No more matches to show</h3>
              <p>You've reviewed all available candidates. Check your team above!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
