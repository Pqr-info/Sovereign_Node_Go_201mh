import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, Check, Activity, Search } from 'lucide-react';

export function GeminiFsTab({ onInjectIntoContext }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [injectStatus, setInjectStatus] = useState('');

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:4052/api/geminifs/list');
      const data = await res.json();
      if (data.status === 'OK') {
        // Sort files descending (newest first) since they are timestamped
        const sorted = (data.files || []).sort((a, b) => b.path.localeCompare(a.path));
        setFiles(sorted);
      } else {
        setError(data.message || 'Failed to list GeminiFS volume');
      }
    } catch (err) {
      setError('Could not connect to GeminiFS router. Make sure zeta_l7_service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileClick = async (filePath) => {
    setSelectedFile(filePath);
    setContentLoading(true);
    setFileContent('');
    try {
      const res = await fetch(`http://localhost:4052/api/geminifs/read?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.status === 'OK') {
        setFileContent(data.content);
      } else {
        setFileContent(`Error loading file: ${data.message}`);
      }
    } catch (err) {
      setFileContent('Network error while reading file.');
    } finally {
      setContentLoading(false);
    }
  };

  const handleInject = () => {
    if (selectedFile && fileContent) {
      onInjectIntoContext({ path: selectedFile, content: fileContent });
      setInjectStatus('Injected!');
      setTimeout(() => setInjectStatus(''), 2000);
    }
  };

  const filteredFiles = files.filter(f => f.path.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-blue)' }}>
            <Folder size={20} />
            GeminiFS (Phase-24 Organ)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Live view of Sovereign-27 chat history turns.
          </div>
        </div>
        <button 
          onClick={fetchFiles}
          style={{ 
            background: 'rgba(59,130,246,0.1)', 
            border: '1px solid var(--color-blue)', 
            color: 'var(--color-blue)', 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Activity size={16} /> Refresh Mount
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
        
        {/* File Explorer Pane */}
        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {loading && <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Scanning GeminiFS...</div>}
            {error && <div style={{ padding: '1rem', color: 'var(--color-yellow)', textAlign: 'center' }}>{error}</div>}
            
            {!loading && !error && filteredFiles.length === 0 && (
              <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No turns found.</div>
            )}

            {!loading && !error && filteredFiles.map((file, idx) => {
              const filename = file.path.split('\\').pop().split('/').pop();
              const isSelected = selectedFile === file.path;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleFileClick(file.path)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: isSelected ? 'rgba(59,130,246,0.15)' : 'transparent',
                    border: isSelected ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                    color: isSelected ? 'var(--color-blue)' : 'var(--text-secondary)',
                    transition: 'all 0.1s'
                  }}
                >
                  <File size={16} />
                  <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={filename}>
                    {filename}
                  </span>
                  {isSelected && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* File Preview Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
          {selectedFile ? (
            <>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {selectedFile}
                </div>
                <button
                  onClick={handleInject}
                  disabled={contentLoading || !fileContent}
                  style={{
                    background: 'var(--color-blue)',
                    border: 'none',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: contentLoading || !fileContent ? 'not-allowed' : 'pointer',
                    opacity: contentLoading || !fileContent ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  {injectStatus ? <><Check size={14} /> {injectStatus}</> : 'Inject into Context'}
                </button>
              </div>
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                {contentLoading ? (
                  <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Loading content...</div>
                ) : (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {fileContent}
                  </pre>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Select a chat turn to preview
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
