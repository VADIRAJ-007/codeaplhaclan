import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}+</>;
}

const features = [
  { icon: '🎯', title: 'Smart Profiling', desc: 'Build your skill & interest profile to find the perfect cross-disciplinary team.', bg: 'var(--gradient-primary)' },
  { icon: '🤖', title: 'AI Team Matching', desc: 'Our algorithm pairs complementary skills from Engineering, Design & Business.', bg: 'var(--gradient-secondary)' },
  { icon: '📋', title: 'Project Workspace', desc: 'Kanban boards, task management, and role assignments in one unified hub.', bg: 'var(--gradient-accent)' },
  { icon: '📊', title: 'Milestone Tracking', desc: 'Track progress from ideation to launch with visual timelines & checklists.', bg: 'var(--gradient-warm)' },
  { icon: '🚀', title: 'Pitch Deck Builder', desc: 'Generate stunning pitch decks with guided templates and presentation mode.', bg: 'var(--gradient-cool)' },
  { icon: '🌐', title: 'Break Academic Silos', desc: 'Transform isolated assignments into viable, cross-functional startup prototypes.', bg: 'linear-gradient(135deg, #a855f7, #ec4899)' },
];

const steps = [
  { num: '1', title: 'Create Profile', desc: 'Add your skills, interests, and what you bring to a team.' },
  { num: '2', title: 'Find Matches', desc: 'AI pairs you with complementary talents from other departments.' },
  { num: '3', title: 'Build Together', desc: 'Use the workspace to plan, track, and build your project.' },
  { num: '4', title: 'Pitch & Launch', desc: 'Create a pitch deck and present your startup-ready prototype.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero">
        <ParticleBackground />
        <div className="hero-bg" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-gradient">Build Projects Together,</span>
          <br /><i>Not Alone.</i>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
         The ultimate platform for college students to find their perfect co-founders and turn class projects into real startups.
        </motion.p>

        <motion.div className="hero-buttons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/profile')}>Get Started</button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/match')}>Find Your Team</button>
        </motion.div>

        <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <div className="hero-stat">
            <div className="hero-stat-value"><AnimatedCounter target={520} /></div>
            <div className="hero-stat-label">Students Matched</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value"><AnimatedCounter target={128} /></div>
            <div className="hero-stat-label">Active Projects</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value"><AnimatedCounter target={15} /></div>
            <div className="hero-stat-label">Departments</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value"><AnimatedCounter target={34} /></div>
            <div className="hero-stat-label">Startups Launched</div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-header">
          <h2><span className="text-gradient">Everything You Need</span> to Build Together</h2>
          <p>From finding the perfect team to pitching your startup—all in one platform.</p>
        </div>
        <motion.div className="features-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          {features.map((f, i) => (
            <motion.div key={i} className="glass-card feature-card" variants={fadeUp} transition={{ duration: 0.4 }}>
              <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="section-header">
          <h2>How <span className="text-gradient">CrossForge</span> Works</h2>
          <p>Four simple steps to transform your academic project into a startup prototype.</p>
        </div>
        <motion.div className="how-it-works" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {steps.map((s, i) => (
            <motion.div key={i} className="how-step" variants={fadeUp}>
              <div className="how-step-number">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Ready to <span className="text-gradient-accent">Cross the Forge?</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.125rem' }}>Join hundreds of students building the future, together.</p>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/profile')}>Create Your Profile</button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2026 CrossForge — Cross-Disciplinary Project Incubator & Matchmaker</p>
      </footer>
    </div>
  );
}
