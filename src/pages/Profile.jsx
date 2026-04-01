import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from '../utils/store';
import { SKILLS, INTERESTS, DEPARTMENTS } from '../data/sampleProfiles';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', department: '', year: '',
    skills: [], interests: [],
    availability: 12, lookingFor: 'Teammate', bio: '', avatarUrl: ''
  });

  useEffect(() => {
    const existing = store.get('profile');
    if (existing) {
      setForm(prev => ({ ...prev, ...existing }));
      setHasProfile(true);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, []);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleArray = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val]
    }));
  };

  const nextStep = () => { setDir(1); setStep(s => Math.min(s + 1, 4)); };
  const prevStep = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        update('avatarUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    const profile = {
      ...form,
      id: form.id || Date.now(),
      avatar: form.name ? form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'UI',
      avatarBg: form.avatarBg || 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    store.set('profile', profile);
    setSaved(true);
    setHasProfile(true);
    setTimeout(() => {
      setSaved(false);
      setIsEditing(false);
      setStep(0);
    }, 1500);
  };

  const resetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile? All data will be lost.')) {
      store.remove('profile');
      setForm({
        name: '', email: '', department: '', year: '',
        skills: [], interests: [],
        availability: 12, lookingFor: 'Teammate', bio: '', avatarUrl: ''
      });
      setHasProfile(false);
      setIsEditing(true);
      setStep(0);
    }
  };

  const totalSteps = 5;
  const canProceed = [
    form.name && form.department && form.year,
    form.skills.length >= 2,
    form.interests.length >= 1,
    form.availability > 0,
    true
  ];

  if (hasProfile && !isEditing) {
    return (
      <div className="page-container">
        <div className="profile-container" style={{ maxWidth: 800, margin: '40px auto' }}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 40, flexWrap: 'wrap' }}>
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Avatar" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: form.avatarBg || 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 48, fontWeight: 'bold', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                  {form.avatar || form.name[0]}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '3rem', marginBottom: 8, background: 'linear-gradient(90deg, #fff, #a5b4fc)', paddingBottom: 4, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{form.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{form.department} • {form.year}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div className="glass-card-static">
                <h3 style={{ marginBottom: 16 }}>Skills</h3>
                <div className="skills-grid">
                  {form.skills?.map(s => <span key={s} className="tag tag-selected">{s}</span>)}
                </div>
              </div>
              <div className="glass-card-static">
                <h3 style={{ marginBottom: 16 }}>Interests</h3>
                <div className="skills-grid">
                  {form.interests?.map(i => <span key={i} className="tag tag-selected">{i}</span>)}
                </div>
              </div>
              <div className="glass-card-static" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ marginBottom: 16 }}>About & Availability</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem', marginBottom: 4 }}>Looking For</span>
                    <strong style={{ fontSize: '1.1rem' }}>{form.lookingFor}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem', marginBottom: 4 }}>Time Commitment</span>
                    <strong style={{ fontSize: '1.1rem' }}>{form.availability} hours/week</strong>
                  </div>
                </div>
                {form.bio && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem', marginBottom: 8 }}>Bio</span>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8 }}>{form.bio}</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button className="btn" onClick={resetProfile} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                Reset Profile
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/match')} style={{ flex: 1, height: 50, fontSize: '1.1rem' }}>
                Find Your Team
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-header" style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2><span className="text-gradient">{hasProfile ? 'Edit Your Profile' : 'Build Your Profile'}</span></h2>
              <p>Tell us about yourself so we can find your ideal cross-disciplinary team.</p>
            </div>
            {hasProfile && (
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Cancel
              </button>
            )}
          </div>

          {/* Steps Indicator */}
          <div className="steps-indicator">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <div className={`step-dot ${i === step ? 'active' : i < step ? 'completed' : ''}`} />
                {i < totalSteps - 1 && <div className={`step-line ${i < step ? 'active' : ''}`} />}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card-static" style={{ minHeight: 300 }}>
                {step === 0 && (
                  <div>
                    <h3 style={{ marginBottom: 24 }}>Basic Information</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                      {form.avatarUrl ? (
                        <img src={form.avatarUrl} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
                          <span style={{ fontSize: 24, color: 'var(--text-muted)' }}>📸</span>
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Profile Picture (Optional)</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" style={{ padding: '10px' }} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="e.g. Arjun Mehta" value={form.name} onChange={e => update('name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">Department *</label>
                        <select className="form-input" value={form.department} onChange={e => update('department', e.target.value)}>
                          <option value="">Select...</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Year *</label>
                        <select className="form-input" value={form.year} onChange={e => update('year', e.target.value)}>
                          <option value="">Select...</option>
                          {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgrad'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 style={{ marginBottom: 8 }}>Select Your Skills</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>Pick at least 2 skills that define what you bring to a team.</p>
                    {Object.entries(SKILLS).map(([category, skills]) => (
                      <div key={category} style={{ marginBottom: 20 }}>
                        <label className="form-label">{category}</label>
                        <div className="skills-grid">
                          {skills.map(skill => (
                            <span key={skill} className={`tag ${form.skills.includes(skill) ? 'tag-selected' : 'tag-default'}`} onClick={() => toggleArray('skills', skill)}>
                              {form.skills.includes(skill) && '✓ '}{skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 style={{ marginBottom: 8 }}>Your Interests</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>What startup domains excite you?</p>
                    <div className="skills-grid" style={{ gap: 12 }}>
                      {INTERESTS.map(interest => (
                        <motion.span key={interest} className={`tag ${form.interests.includes(interest) ? 'tag-selected' : 'tag-default'}`}
                          onClick={() => toggleArray('interests', interest)}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                          {form.interests.includes(interest) && '✓ '}{interest}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 style={{ marginBottom: 24 }}>Availability & Goals</h3>
                    <div className="form-group">
                      <label className="form-label">Hours per week: <strong style={{ color: 'var(--color-primary)' }}>{form.availability}h</strong></label>
                      <input type="range" min="2" max="30" value={form.availability} onChange={e => update('availability', +e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>2h</span><span>30h</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">What are you looking for?</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['Co-founder', 'Teammate', 'Mentor'].map(opt => (
                          <span key={opt} className={`tag ${form.lookingFor === opt ? 'tag-selected' : 'tag-default'}`} onClick={() => update('lookingFor', opt)}>
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Short Bio</label>
                      <textarea className="form-input" placeholder="Tell potential teammates about yourself..." value={form.bio} onChange={e => update('bio', e.target.value)} rows={3} />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h3 style={{ marginBottom: 24 }}>Review Your Profile</h3>
                    <div style={{ display: 'grid', gap: 16 }}>
                      {form.avatarUrl && (
                        <div style={{ marginBottom: 8, textAlign: 'center' }}>
                          <img src={form.avatarUrl} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div><strong>Name:</strong> {form.name}</div>
                      <div><strong>Department:</strong> {form.department} — {form.year}</div>
                      <div><strong>Skills:</strong> <div className="skills-grid" style={{ marginTop: 8 }}>{form.skills.map(s => <span key={s} className="tag tag-selected">{s}</span>)}</div></div>
                      <div><strong>Interests:</strong> <div className="skills-grid" style={{ marginTop: 8 }}>{form.interests.map(i => <span key={i} className="tag tag-selected">{i}</span>)}</div></div>
                      <div><strong>Availability:</strong> {form.availability}h/week</div>
                      <div><strong>Looking for:</strong> {form.lookingFor}</div>
                      {form.bio && <div><strong>Bio:</strong> {form.bio}</div>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="profile-actions">
            <button className="btn btn-secondary" onClick={prevStep} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1 }}>
              ← Back
            </button>
            {step < 4 ? (
              <button className="btn btn-primary" onClick={nextStep} disabled={!canProceed[step]} style={{ opacity: canProceed[step] ? 1 : 0.5 }}>
                Next →
              </button>
            ) : (
              <motion.button className="btn btn-success" onClick={saveProfile} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {saved ? '✓ Profile Saved!' : 'Save Profile'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
