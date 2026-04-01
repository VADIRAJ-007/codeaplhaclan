import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { store } from '../utils/store';

const defaultMilestones = [
  { id: 1, title: 'Ideation', icon: '💡', desc: 'Define the problem, brainstorm solutions, and outline your vision.', status: 'active', deadline: '2026-04-15',
    checklist: [
      { id: 'a1', text: 'Define the core problem statement', done: false },
      { id: 'a2', text: 'Brainstorm 3+ solution approaches', done: false },
      { id: 'a3', text: 'Choose the best approach and write a vision doc', done: false },
      { id: 'a4', text: 'Identify target users and their pain points', done: false },
    ]},
  { id: 2, title: 'Research & Validation', icon: '🔬', desc: 'Validate assumptions with user research and competitive analysis.', status: 'pending', deadline: '2026-05-01',
    checklist: [
      { id: 'b1', text: 'Conduct 5+ user interviews', done: false },
      { id: 'b2', text: 'Analyze 3+ competitors', done: false },
      { id: 'b3', text: 'Create user personas', done: false },
      { id: 'b4', text: 'Validate problem-solution fit', done: false },
    ]},
  { id: 3, title: 'MVP Development', icon: '🛠️', desc: 'Build the minimum viable product with core functionality.', status: 'pending', deadline: '2026-05-20',
    checklist: [
      { id: 'c1', text: 'Design wireframes and UI mockups', done: false },
      { id: 'c2', text: 'Set up the tech stack', done: false },
      { id: 'c3', text: 'Implement core features', done: false },
      { id: 'c4', text: 'Internal team demo', done: false },
    ]},
  { id: 4, title: 'Testing & Feedback', icon: '🧪', desc: 'Get real user feedback and iterate on the product.', status: 'pending', deadline: '2026-06-05',
    checklist: [
      { id: 'd1', text: 'Recruit 10+ beta testers', done: false },
      { id: 'd2', text: 'Collect and analyze feedback', done: false },
      { id: 'd3', text: 'Fix critical bugs', done: false },
      { id: 'd4', text: 'Iterate on UX based on feedback', done: false },
    ]},
  { id: 5, title: 'Pitch Preparation', icon: '🎤', desc: 'Create your pitch deck and practice presentations.', status: 'pending', deadline: '2026-06-15',
    checklist: [
      { id: 'e1', text: 'Build pitch deck (use the Pitch Deck tool!)', done: false },
      { id: 'e2', text: 'Prepare financials and traction metrics', done: false },
      { id: 'e3', text: 'Practice pitch 3+ times', done: false },
      { id: 'e4', text: 'Get mentor feedback on pitch', done: false },
    ]},
  { id: 6, title: 'Launch', icon: '🚀', desc: 'Launch to the world and start acquiring users!', status: 'pending', deadline: '2026-07-01',
    checklist: [
      { id: 'f1', text: 'Finalize branding and marketing materials', done: false },
      { id: 'f2', text: 'Set up analytics and tracking', done: false },
      { id: 'f3', text: 'Launch on Product Hunt / social media', done: false },
      { id: 'f4', text: 'Celebrate! 🎉', done: false },
    ]},
];

export default function Milestones() {
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [expanded, setExpanded] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const saved = store.get('milestones');
    if (saved) setMilestones(saved);
  }, []);

  const saveMilestones = (ms) => { 
    setMilestones(ms); 
    store.set('milestones', ms); 
  };

  const toggleCheck = (mId, cId) => {
    const updated = milestones.map(m => {
      if (m.id !== mId) return m;
      const checklist = m.checklist.map(c => c.id === cId ? { ...c, done: !c.done } : c);
      
      const allDone = checklist.length > 0 && checklist.every(c => c.done);
      const anyDone = checklist.some(c => c.done);
      
      let status = m.status;
      if (allDone) status = 'completed';
      else if (anyDone) status = 'active';
      else if (!anyDone && status === 'completed') status = 'active';
      
      return { ...m, checklist, status };
    });

    // Auto-activate next milestone
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'completed' && i + 1 < updated.length && updated[i + 1].status === 'pending') {
        updated[i + 1].status = 'active';
      }
    }

    saveMilestones(updated);
  };

  const addTask = (mId) => {
    const text = prompt("Enter new task name:");
    if (!text) return;
    const updated = milestones.map(m => {
      if (m.id !== mId) return m;
      return {
        ...m,
        checklist: [...m.checklist, { id: Date.now().toString(), text, done: false }]
      };
    });
    saveMilestones(updated);
  };

  const editTask = (mId, cId) => {
    const newText = prompt("Edit task description:");
    if (!newText) return;
    const updated = milestones.map(m => {
      if (m.id !== mId) return m;
      return {
        ...m,
        checklist: m.checklist.map(c => c.id === cId ? { ...c, text: newText } : c)
      };
    });
    saveMilestones(updated);
  };

  const deleteTask = (mId, cId) => {
    if(!confirm("Are you sure you want to delete this task?")) return;
    const updated = milestones.map(m => {
      if (m.id !== mId) return m;
      return {
        ...m,
        checklist: m.checklist.filter(c => c.id !== cId)
      };
    });
    saveMilestones(updated);
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalChecked = milestones.reduce((a, m) => a + m.checklist.filter(c => c.done).length, 0);
  const totalItems = milestones.reduce((a, m) => a + m.checklist.length, 0);
  const progress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div className="page-container">
      <div className="milestones-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="section-header" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ marginBottom: 4 }}><span className="text-gradient">Milestones</span></h2>
              <p style={{ margin: 0 }}>Track your journey from ideation to launch.</p>
            </div>
            <button className={`btn btn-sm ${editMode ? 'btn-success' : 'btn-secondary'}`} onClick={() => setEditMode(!editMode)}>
              {editMode ? "✓ Done Editing" : "✏️ Customize Tasks"}
            </button>
          </div>

          {/* Overall Progress */}
          <div className="glass-card-static" style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="text-gradient">{progress}%</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Overall Progress</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-success)' }}>{completedCount}/{milestones.length}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Milestones Done</div>
              </div>
            </div>
            <div className="progress-bar" style={{ height: 12, borderRadius: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%`, borderRadius: 6 }} />
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {milestones.map((m, i) => (
              <motion.div key={m.id} className="timeline-item"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className={`timeline-dot ${m.status}`}>
                  {m.status === 'completed' ? '✓' : m.status === 'active' ? '▶' : (i + 1)}
                </div>

                <div className="glass-card timeline-content" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <h3>
                    {m.icon} {m.title}
                    <span className={`badge ${m.status === 'completed' ? 'badge-success' : m.status === 'active' ? 'badge-primary' : 'badge-warning'}`} style={{ marginLeft: 'auto' }}>
                      {m.status}
                    </span>
                  </h3>
                  <p>{m.desc}</p>
                  <div className="deadline">📅 Deadline: {new Date(m.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>

                  {/* Progress for this milestone */}
                  <div style={{ marginTop: 12 }}>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${m.checklist.length > 0 ? (m.checklist.filter(c => c.done).length / m.checklist.length) * 100 : 0}%` }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {m.checklist.filter(c => c.done).length}/{m.checklist.length} tasks completed
                    </div>
                  </div>

                  {/* Expanded Checklist */}
                  {expanded === m.id && (
                    <motion.div className="milestone-checklist" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      {m.checklist.length === 0 && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 8 }}>No tasks in this milestone.</p>
                      )}
                      {m.checklist.map(c => (
                        <div key={c.id} className="checklist-item" onClick={e => { e.stopPropagation(); if (!editMode) toggleCheck(m.id, c.id); }}>
                          <div className={`checklist-checkbox ${c.done ? 'checked' : ''}`} onClick={(e) => { 
                            if (editMode) {
                              // If edit mode is on, checking happens here explicitly to avoid double-clicking issues
                              e.stopPropagation(); 
                              toggleCheck(m.id, c.id); 
                            }
                          }}>
                            {c.done && '✓'}
                          </div>
                          <span className={`checklist-text ${c.done ? 'checked' : ''}`} style={{ flex: 1 }}>{c.text}</span>

                          {/* Edit/Delete Actions */}
                          {editMode && (
                            <div style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
                              <button className="btn btn-icon" title="Edit Task" style={{ width: 28, height: 28, fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); editTask(m.id, c.id); }}>
                                ✏️
                              </button>
                              <button className="btn btn-icon" title="Delete Task" style={{ width: 28, height: 28, fontSize: '0.75rem', color: 'var(--color-danger)' }} onClick={(e) => { e.stopPropagation(); deleteTask(m.id, c.id); }}>
                                ❌
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Task Button */}
                      {editMode && (
                        <div style={{ marginTop: 16, borderTop: '1px dashed var(--border-color)', paddingTop: 16 }}>
                          <button className="btn btn-secondary btn-sm" style={{ width: '100%', borderStyle: 'dashed' }} onClick={(e) => { e.stopPropagation(); addTask(m.id); }}>
                            ➕ Add Custom Task
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
