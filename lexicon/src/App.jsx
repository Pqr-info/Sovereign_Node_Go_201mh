import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [terms, setTerms] = useState([]);
  const [formData, setFormData] = useState({ id: null, term: '', abbreviation: '', definition: '', category: 'Sovereign-27' });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'http://localhost:4080/api/terms';

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setTerms(data);
      }
    } catch (e) {
      console.error('Error fetching terms:', e);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch(`${API_URL}/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setFormData({ id: null, term: '', abbreviation: '', definition: '', category: 'Sovereign-27' });
      setIsEditing(false);
      fetchTerms();
    } catch (e) {
      console.error('Error saving term:', e);
    }
  };

  const handleEdit = (term) => {
    setFormData(term);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this term?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTerms();
    } catch (e) {
      console.error('Error deleting term:', e);
    }
  };

  const handleCancel = () => {
    setFormData({ id: null, term: '', abbreviation: '', definition: '', category: 'Sovereign-27' });
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Sovereign Lexicon</h1>
        <p>Master Interface for Mesh-Wide Terminology & Abbreviations</p>
      </header>

      <div className="content-grid">
        <aside>
          <div className="glass-panel form-panel">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
              {isEditing ? 'Edit Term' : 'Add New Term'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Terminology</label>
                <input 
                  type="text" 
                  name="term" 
                  className="glass-input" 
                  value={formData.term} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Agent Trust Index"
                />
              </div>
              <div className="form-group">
                <label>Abbreviation</label>
                <input 
                  type="text" 
                  name="abbreviation" 
                  className="glass-input" 
                  value={formData.abbreviation} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. ATI"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  name="category" 
                  className="glass-input" 
                  value={formData.category} 
                  onChange={handleInputChange}
                >
                  <option value="Sovereign-27">Sovereign-27</option>
                  <option value="SpaceBook 5D">SpaceBook 5D</option>
                  <option value="Core Infrastructure">Core Infrastructure</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="form-group">
                <label>Definition</label>
                <textarea 
                  name="definition" 
                  className="glass-input" 
                  rows="4" 
                  value={formData.definition} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Detailed explanation of the term..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="glass-btn primary" style={{ flex: 1 }}>
                  {isEditing ? 'Update' : 'Save'}
                </button>
                {isEditing && (
                  <button type="button" className="glass-btn" onClick={handleCancel} style={{ flex: 1 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <main>
          <div className="glass-panel list-panel">
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent)' }}>Glossary Entries</h2>
            {terms.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No terms found. Add one to begin.</p>
            ) : (
              <div className="terms-grid">
                {terms.map(t => (
                  <div key={t.id} className="glass-panel term-card">
                    <div className="term-header">
                      <h3 className="term-title">{t.term}</h3>
                      <span className="term-abbr">{t.abbreviation}</span>
                    </div>
                    <p className="term-def">{t.definition}</p>
                    <div className="term-meta">
                      <span className="term-category">{t.category}</span>
                      <div className="term-actions">
                        <button onClick={() => handleEdit(t)} className="action-btn" title="Edit">
                           ✎ Edit
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="action-btn delete" title="Delete">
                           ✕ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
