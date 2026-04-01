import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from '../utils/store';

const defaultColumns = {
  todo: { title: 'To Do', icon: '📋', items: [] },
  progress: { title: 'In Progress', icon: '⚡', items: [] },
  done: { title: 'Done', icon: '✅', items: [] },
};

const priorities = ['High', 'Medium', 'Low'];
const prioClass = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' };

export default function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const profile = store.get('profile');
  const team = store.get('team') || [];
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState(defaultColumns);
  const [showModal, setShowModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [taskCol, setTaskCol] = useState('todo');
  const [taskForm, setTaskForm] = useState({ title: '', desc: '', priority: 'Medium', assignee: '' });
  const [projectForm, setProjectForm] = useState({ name: '', description: '', role: 'Lead' });
  const [dragItem, setDragItem] = useState(null);

  useEffect(() => {
    let saved = store.get('project');
    initFallback(saved);
  }, [workspaceId]);

  const initFallback = async (saved) => {
    if (workspaceId && (!saved || saved.id !== workspaceId)) {
      saved = {
        id: workspaceId,
        name: 'Shared Team Workspace',
        description: 'You joined this workspace via a shareable link.',
        createdAt: new Date().toISOString()
      };
      setProject(saved);
      store.set('project', saved);
      
      const mockCols = { ...defaultColumns, todo: { ...defaultColumns.todo, items: [{ id: 1, title: 'Say hi to the team', desc: 'Welcome to the shared workspace!', priority: 'High', assignee: '' }] } };
      setColumns(mockCols);
      store.set('columns', mockCols);
    } else {
      if (saved) setProject(saved);
      const savedCols = store.get('columns');
      if (savedCols) setColumns(savedCols);
    }
  };

  const saveColumns = async (cols) => { 
    setColumns(cols); 
    store.set('columns', cols); 
  };

  const createProject = async () => {
    const newId = Date.now().toString();
    const p = { ...projectForm, id: newId, createdAt: new Date().toISOString() };
    setProject(p);
    
    store.set('project', p);
    
    setShowProjectModal(false);
    navigate(`/workspace/${newId}`, { replace: true });
  };

  const shareWorkspace = () => {
    let currentId = project.id;
    if (!currentId) {
       currentId = Date.now().toString();
       const p = { ...project, id: currentId };
       setProject(p);
       store.set('project', p);
    }
    const shareLink = `${window.location.origin}/workspace/${currentId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
       setShowShareToast(true);
       setTimeout(() => setShowShareToast(false), 3000);
    });
  };

  const resetWorkspace = () => {
    if (window.confirm('Are you sure you want to reset this workspace? All tasks and details will be lost.')) {
      store.remove('project');
      store.remove('columns');
      setProject(null);
      setColumns(defaultColumns);
      navigate('/workspace', { replace: true });
    }
  };

  const addTask = () => {
    const task = { ...taskForm, id: Date.now() };
    const newCols = { ...columns, [taskCol]: { ...columns[taskCol], items: [...columns[taskCol].items, task] } };
    saveColumns(newCols);
    setShowModal(false);
    setTaskForm({ title: '', desc: '', priority: 'Medium', assignee: '' });
  };

  const onDragStart = (colKey, idx) => setDragItem({ colKey, idx });

  const onDrop = (targetCol) => {
    if (!dragItem || dragItem.colKey === targetCol) return;
    const item = columns[dragItem.colKey].items[dragItem.idx];
    const srcItems = columns[dragItem.colKey].items.filter((_, i) => i !== dragItem.idx);
    const dstItems = [...columns[targetCol].items, item];
    const newCols = {
      ...columns,
      [dragItem.colKey]: { ...columns[dragItem.colKey], items: srcItems },
      [targetCol]: { ...columns[targetCol], items: dstItems },
    };
    saveColumns(newCols);
    setDragItem(null);
  };

  const deleteTask = (colKey, idx) => {
    const newCols = { ...columns, [colKey]: { ...columns[colKey], items: columns[colKey].items.filter((_, i) => i !== idx) } };
    saveColumns(newCols);
  };

  const allMembers = [profile, ...team.map(t => t.profile)].filter(Boolean);

  if (!project) {
    return (
      <div className="page-container">
        <div className="project-create">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🏗️</div>
            <h2>Create Your Project</h2>
            <p>Set up a workspace for your cross-disciplinary team to collaborate.</p>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 16 }} onClick={() => setShowProjectModal(true)}>Create Project</button>
          </motion.div>

          <AnimatePresence>
            {showProjectModal && (
              <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProjectModal(false)}>
                <motion.div className="modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                  <h2>New Project</h2>
                  <div className="form-group">
                    <label className="form-label">Project Name *</label>
                    <input className="form-input" placeholder="e.g. MediTrack AI" value={projectForm.name} onChange={e => setProjectForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" placeholder="What problem does your project solve?" value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={createProject} disabled={!projectForm.name}>Create</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="workspace-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="workspace-header">
            <div>
              <h1>{project.name}</h1>
              {project.description && <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.9375rem' }}>{project.description}</p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="btn" onClick={resetWorkspace} style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                🗑️ Reset
              </button>
              <button className="btn btn-secondary" onClick={shareWorkspace} style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                🔗 Share Link
              </button>
              <div className="workspace-team">
                {allMembers.slice(0, 5).map((m, i) => (
                  <div key={i} className="workspace-team-avatar" style={{ background: m.avatarBg || 'var(--gradient-primary)', marginLeft: i > 0 ? -8 : 0 }} title={m.name}>
                    {m.avatar}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="kanban-board">
            {Object.entries(columns).map(([colKey, col]) => (
              <div
                key={colKey}
                className="kanban-column"
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(colKey)}
              >
                <div className="kanban-column-header">
                  <h3>{col.icon} {col.title} <span className="count">({col.items.length})</span></h3>
                </div>

                <AnimatePresence>
                  {col.items.map((task, idx) => (
                    <motion.div
                      key={task.id}
                      className="kanban-task"
                      draggable
                      onDragStart={() => onDragStart(colKey, idx)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <h4>{task.title}</h4>
                      {task.desc && <p>{task.desc}</p>}
                      <div className="kanban-task-meta">
                        <span className={`badge ${task.priority === 'High' ? 'badge-danger' : task.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.6875rem' }}>
                          {task.priority}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {task.assignee && (
                            <div className="kanban-task-assignee" style={{ background: 'var(--gradient-primary)' }}>
                              {task.assignee.slice(0, 2)}
                            </div>
                          )}
                          <button onClick={() => deleteTask(colKey, idx)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1rem' }} title="Delete">×</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button className="add-task-btn" onClick={() => { setTaskCol(colKey); setShowModal(true); }}>+ Add Task</button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <motion.div className="modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                <h2>New Task</h2>
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input className="form-input" placeholder="e.g. Design landing page" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" placeholder="Optional details..." value={taskForm.desc} onChange={e => setTaskForm(f => ({ ...f, desc: e.target.value }))} rows={2} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-input" value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}>
                      {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign To</label>
                    <select className="form-input" value={taskForm.assignee} onChange={e => setTaskForm(f => ({ ...f, assignee: e.target.value }))}>
                      <option value="">Unassigned</option>
                      {allMembers.map(m => <option key={m.id} value={m.avatar}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={addTask} disabled={!taskForm.title}>Add Task</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareToast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              style={{ position: 'fixed', bottom: 32, right: 32, background: 'var(--color-success)', color: '#fff', padding: '16px 24px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 1000, fontWeight: 500 }}
            >
              ✅ Shareable link copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
