import React, { useState } from 'react';

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── Inline Edit Modal ──────────────────────────── */
function EditModal({ habit, onSave, onClose }) {
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave(habit._id, { title: title.trim(), description: description.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">✏️ Edit Habit</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-field">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              type="text"
              maxLength={100}
              required
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-input"
              maxLength={500}
              value={description}
              style={{ minHeight: 80 }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Confirm Delete Modal ───────────────────────── */
function ConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">🗑️ Delete Habit?</div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          This habit will be soft-deleted. You won&apos;t see it again, but your
          historical completions linked to it are preserved.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #f06878, #e05568)' }}
            onClick={onConfirm}
          >
            Yes, delete it
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export function HabitColumn({ habits, onCreate, onUpdate, onDelete, onComplete }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ title: form.title.trim(), description: form.description.trim() });
      setForm({ title: '', description: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await onDelete(deletingId);
    setDeletingId(null);
  };

  return (
    <>
      <div className="habits-layout">
        {/* ── Add habit form ─────────────────── */}
        <div className="card-panel">
          <div className="card-panel-title">➕ Add a New Habit</div>
          <div className="card-panel-subtitle">Define a habit you want to stick to.</div>

          <form id="habit-form" className="add-habit-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="habit-title">Title *</label>
              <input
                id="habit-title"
                className="form-input"
                type="text"
                maxLength={100}
                placeholder="e.g. Morning run"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="habit-description">Description</label>
              <textarea
                id="habit-description"
                className="form-input"
                maxLength={500}
                placeholder="Why does this habit matter to you?"
                value={form.description}
                style={{ minHeight: 80 }}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Adding…' : 'Add habit →'}
            </button>
          </form>
        </div>

        {/* ── Habit list ─────────────────────── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Your Habits</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>
                {habits.length} habit{habits.length !== 1 ? 's' : ''} — complete once per day
              </div>
            </div>
            {habits.length > 0 && (
              <span className="badge badge-indigo">
                {habits.filter((h) => h.completedToday).length}/{habits.length} done today
              </span>
            )}
          </div>

          <div id="habit-list" className="habit-list">
            {habits.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🌱</div>
                <div className="empty-state-title">No habits yet</div>
                <p className="empty-state-desc">
                  Start small — add 1 glass of water, a 5-minute walk, or reading 1 page.
                </p>
              </div>
            ) : (
              habits.map((habit) => {
                const done = habit.completedToday;
                return (
                  <article
                    key={habit._id}
                    className={`habit-card${done ? ' completed' : ''}`}
                  >
                    {/* Check button */}
                    <button
                      className={`habit-check-btn${done ? ' checked' : ''}`}
                      type="button"
                      onClick={() => !done && onComplete(habit._id)}
                      title={done ? 'Completed today' : 'Mark as done'}
                      disabled={done}
                    >
                      {done ? '✓' : ''}
                    </button>

                    {/* Content */}
                    <div className="habit-body">
                      <div className="habit-header-row">
                        <div className="habit-title">{habit.title}</div>
                        <span className={`badge ${done ? 'badge-emerald' : 'badge-muted'}`}>
                          {done ? 'Done today' : 'Pending'}
                        </span>
                      </div>

                      {habit.description && (
                        <div className="habit-desc">{habit.description}</div>
                      )}

                      <div className="habit-footer-row">
                        <div className="habit-meta">
                          Created {formatDate(habit.createdAt) || 'recently'}
                          &nbsp;·&nbsp;
                          <span data-habit-id={habit._id} style={{ color: 'var(--text-muted)' }}>
                            #{habit._id.slice(-6)}
                          </span>
                        </div>
                        <div className="habit-actions">
                          {!done && (
                            <button
                              className="btn-sm done"
                              type="button"
                              onClick={() => onComplete(habit._id)}
                            >
                              ✓ Done
                            </button>
                          )}
                          <button
                            className="btn-sm edit-btn"
                            type="button"
                            onClick={() => setEditingHabit(habit)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-sm del"
                            type="button"
                            onClick={() => setDeletingId(habit._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────── */}
      {editingHabit && (
        <EditModal
          habit={editingHabit}
          onSave={onUpdate}
          onClose={() => setEditingHabit(null)}
        />
      )}
      {deletingId && (
        <ConfirmModal
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingId(null)}
        />
      )}
    </>
  );
}
