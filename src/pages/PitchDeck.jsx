import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { store } from '../utils/store';

const slideGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
];

const defaultForm = {
  title: '', tagline: '', problem: '', solution: '', market: '',
  revenue: '', competitive: '', traction: '', team: '', ask: ''
};

const fields = [
  { key: 'title', label: 'Project Name', placeholder: 'e.g. MediTrack AI', type: 'input' },
  { key: 'tagline', label: 'Tagline / One-Liner', placeholder: 'e.g. AI-powered health monitoring for rural clinics', type: 'input' },
  { key: 'problem', label: 'Problem Statement', placeholder: 'What problem are you solving? Who is affected?', type: 'textarea' },
  { key: 'solution', label: 'Your Solution', placeholder: 'How does your product solve the problem?', type: 'textarea' },
  { key: 'market', label: 'Target Market', placeholder: 'Who are your users? What is the market size?', type: 'textarea' },
  { key: 'revenue', label: 'Revenue Model', placeholder: 'How will you make money?', type: 'textarea' },
  { key: 'competitive', label: 'Competitive Advantage', placeholder: 'What makes you different from competitors?', type: 'textarea' },
  { key: 'traction', label: 'Traction / Progress', placeholder: 'Any users, revenue, partnerships, or milestones?', type: 'textarea' },
  { key: 'team', label: 'Team Members', placeholder: 'Who is on the team and their roles?', type: 'textarea' },
  { key: 'ask', label: 'The Ask', placeholder: 'What do you need? Funding, mentorship, resources?', type: 'textarea' },
];

export default function PitchDeck() {
  const [form, setForm] = useState(defaultForm);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Load from Share Link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encoded = params.get('data');

    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        setForm(decoded.form || defaultForm);
        setSlides(decoded.slides || []);
        if (decoded.slides?.length) setGenerated(true);
        // Clean URL after loading to avoid long unreadable URLs matching hash router pattern
        navigate('/pitch', { replace: true });
      } catch (e) {
        console.error('Invalid share link', e);
      }
    } else {
      // Normal local store fallback
      const saved = store.get('pitchdeck');
      if (saved) { 
        setForm(saved.form || defaultForm); 
        setSlides(saved.slides || []); 
        setGenerated(!!saved.slides?.length); 
      }
    }
  }, [location.search, navigate]);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const resetPitchDeck = () => {
    if (window.confirm('Are you sure you want to reset your pitch deck? All data will be lost.')) {
      store.remove('pitchdeck');
      setForm(defaultForm);
      setSlides([]);
      setCurrent(0);
      setGenerated(false);
    }
  };

  const generate = () => {
    const s = [];
    if (form.title) s.push({ title: form.title, subtitle: form.tagline || 'Pitch Deck', type: 'title' });
    if (form.problem) s.push({ title: '⚠️ The Problem', content: form.problem, type: 'content' });
    if (form.solution) s.push({ title: '✅ Our Solution', content: form.solution, type: 'content' });
    if (form.market) s.push({ title: '📊 Target Market', content: form.market, type: 'content' });
    if (form.revenue) s.push({ title: '💰 Revenue Model', content: form.revenue, type: 'content' });
    if (form.competitive) s.push({ title: '🏆 Competitive Edge', content: form.competitive, type: 'content' });
    if (form.traction) s.push({ title: '📈 Traction', content: form.traction, type: 'content' });
    if (form.team) s.push({ title: '👥 The Team', content: form.team, type: 'content' });
    if (form.ask) s.push({ title: '🙏 The Ask', content: form.ask, type: 'content' });
    s.push({ title: 'Thank You!', subtitle: form.title || "Let's build the future together.", type: 'title' });
    setSlides(s);
    setCurrent(0);
    setGenerated(true);
    store.set('pitchdeck', { form, slides: s });
  };

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < slides.length) setCurrent(idx);
  }, [slides.length]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goTo(current + 1);
      else if (e.key === 'ArrowLeft') goTo(current - 1);
      else if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fullscreen, current, goTo]);

  // Generate Share Link
  const handleShare = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({ form, slides })));
    const link = `${window.location.origin}${window.location.pathname}#/pitch?data=${encoded}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  };

  // Download PDF
  const downloadPitchDeck = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const slideElements = document.querySelectorAll('.export-slide');
      if (!slideElements.length) return;

      const pdf = new jsPDF('landscape', 'px', [800, 450]);

      for (let i = 0; i < slideElements.length; i++) {
        const canvas = await html2canvas(slideElements[i], { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i !== 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save('pitch-deck.pdf');
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const SlideView = ({ slide, index, isFullscreen }) => (
    <motion.div
      className="slide"
      style={{ background: slideGradients[index % slideGradients.length] }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {slide.type === 'title' ? (
        <>
          <h2 style={{ fontSize: isFullscreen ? '4rem' : '2.5rem' }}>{slide.title}</h2>
          {slide.subtitle && <p style={{ fontSize: isFullscreen ? '1.5rem' : '1.125rem', opacity: 0.85 }}>{slide.subtitle}</p>}
        </>
      ) : (
        <>
          <h3 style={{ fontSize: isFullscreen ? '2.5rem' : '1.5rem' }}>{slide.title}</h3>
          <p style={{ fontSize: isFullscreen ? '1.5rem' : '1.0625rem', maxWidth: isFullscreen ? '800px' : '600px', lineHeight: 1.7, marginTop: 16 }}>{slide.content}</p>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="page-container">
      <div className="pitch-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-header" style={{ marginBottom: 32 }}>
            <h2><span className="text-gradient">Pitch Deck</span> Generator</h2>
            <p>Create a stunning pitch deck for your startup prototype.</p>
          </div>

          {/* Form */}
          <div className="glass-card-static" style={{ marginBottom: 32 }}>
            <div className="pitch-form">
              {fields.map(f => (
                <div key={f.key} className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">{f.label}</label>
                  {f.type === 'input' ? (
                    <input className="form-input" placeholder={f.placeholder} value={form[f.key]} onChange={e => update(f.key, e.target.value)} />
                  ) : (
                    <textarea className="form-input" placeholder={f.placeholder} value={form[f.key]} onChange={e => update(f.key, e.target.value)} rows={2} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <button 
                className="btn" 
                onClick={resetPitchDeck} 
                style={{ padding: '0 24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                🗑️ Reset
              </button>
              <motion.button className="btn btn-accent btn-lg" style={{ flex: 1 }} onClick={generate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {generated ? '🔄 Regenerate Deck' : '🚀 Generate Pitch Deck'}
              </motion.button>
            </div>
          </div>

          {/* Preview */}
          {generated && slides.length > 0 && (
            <motion.div className="pitch-preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <h3>Preview</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={downloadPitchDeck} disabled={isDownloading}>
                    {isDownloading ? '⏳ Generating...' : '⬇ Download PDF'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={handleShare}>
                    🔗 Share Link
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setFullscreen(true)}>
                    ⛶ Present Fullscreen
                  </button>
                </div>
              </div>

              <div className="slide-container">
                <AnimatePresence mode="wait">
                  <SlideView key={current} slide={slides[current]} index={current} isFullscreen={false} />
                </AnimatePresence>
              </div>

              <div className="slide-nav">
                <button className="btn btn-icon" onClick={() => goTo(current - 1)} disabled={current === 0} style={{ opacity: current === 0 ? 0.3 : 1 }}>←</button>
                <div className="slide-dots">
                  {slides.map((_, i) => (
                    <div key={i} className={`slide-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
                  ))}
                </div>
                <button className="btn btn-icon" onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} style={{ opacity: current === slides.length - 1 ? 0.3 : 1 }}>→</button>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 12 }}>
                Slide {current + 1} of {slides.length} · Press ⛶ for presentation mode (use arrow keys)
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Hidden Container pre-rendering all slides for high-quality PDF Export */}
      {generated && slides.length > 0 && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="export-slide"
              style={{
                width: '800px',
                height: '450px',
                background: slideGradients[index % slideGradients.length],
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '48px',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif' // Fallback for html2canvas
              }}
            >
              {slide.type === 'title' ? (
                <>
                  <h2 style={{ fontSize: '3rem', margin: '0 0 16px', fontWeight: 700 }}>{slide.title}</h2>
                  {slide.subtitle && <p style={{ fontSize: '1.25rem', opacity: 0.85, margin: 0 }}>{slide.subtitle}</p>}
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: '2rem', margin: '0 0 12px', fontWeight: 700 }}>{slide.title}</h3>
                  <p style={{ fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.7, margin: '16px 0 0' }}>{slide.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Presentation */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div className="fullscreen-deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnimatePresence mode="wait">
              <SlideView key={current} slide={slides[current]} index={current} isFullscreen={true} />
            </AnimatePresence>
            <div className="fullscreen-exit">
              <button className="btn btn-secondary btn-sm" onClick={() => setFullscreen(false)}>✕ Exit (Esc)</button>
            </div>
            <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
              {slides.map((_, i) => (
                <div key={i} className={`slide-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
