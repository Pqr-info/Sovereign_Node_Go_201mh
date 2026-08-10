import React, { useEffect, useState } from "react";
import { Clock, Download, Play } from 'lucide-react';

export function CopilotFsTab({ onInjectIntoContext, onTimeMachineRestore }) {
  const [files, setFiles] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);
  const [restoringSnapshot, setRestoringSnapshot] = useState(false);

  useEffect(() => {
    fetchFiles();
    fetchSnapshots();
  }, []);

  async function fetchFiles() {
    try {
      const res = await fetch("http://localhost:4052/api/copilotfs/list");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.warn("Failed to fetch CopilotFS list");
    }
  }

  async function fetchSnapshots() {
    try {
      const res = await fetch("http://localhost:4052/api/copilotfs/snapshots");
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch (e) {
      console.warn("Failed to fetch snapshots");
    }
  }

  async function handleSelectFile(path) {
    setSelectedFile(path);
    const res = await fetch(`http://localhost:4052/api/copilotfs/read?path=${encodeURIComponent(path)}`);
    const data = await res.json();
    setFileContent(data.content || "");
  }

  function handleInject() {
    if (!selectedFile || !fileContent) return;
    onInjectIntoContext({
      path: selectedFile,
      content: fileContent
    });
  }

  async function handleCreateSnapshot() {
    const label = prompt("Enter a label for this snapshot:");
    if (!label) return;
    
    setCreatingSnapshot(true);
    try {
      await fetch("http://localhost:4052/api/copilotfs/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label })
      });
      await fetchSnapshots();
    } finally {
      setCreatingSnapshot(false);
    }
  }

  async function handleRestoreSnapshot(snapshotId) {
    if (!confirm(`Are you sure you want to restore ${snapshotId}? This will overwrite the live CopilotFS volume.`)) return;
    
    setRestoringSnapshot(true);
    try {
      await fetch("http://localhost:4052/api/copilotfs/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot_id: snapshotId })
      });
      await fetchFiles();
      if (onTimeMachineRestore) onTimeMachineRestore(snapshotId);
    } finally {
      setRestoringSnapshot(false);
    }
  }

  return (
    <div className="copilotfs-tab" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      
      {/* Time Machine Panel */}
      <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--color-purple)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--color-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> CopilotFS Time Machine
          </h3>
          <button 
            onClick={handleCreateSnapshot}
            disabled={creatingSnapshot}
            style={{ padding: '0.5rem 1rem', background: 'var(--color-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={14} /> {creatingSnapshot ? "Creating..." : "Create Snapshot"}
          </button>
        </div>
        
        {snapshots.length > 0 ? (
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>ID</th>
                  <th style={{ padding: '0.5rem' }}>Label</th>
                  <th style={{ padding: '0.5rem' }}>Created At</th>
                  <th style={{ padding: '0.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{s.id}</td>
                    <td style={{ padding: '0.5rem' }}>{s.label}</td>
                    <td style={{ padding: '0.5rem' }}>{new Date(s.created_at).toLocaleString()}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button 
                        onClick={() => handleRestoreSnapshot(s.id)}
                        disabled={restoringSnapshot}
                        style={{ padding: '0.25rem 0.5rem', background: 'transparent', border: '1px solid var(--color-purple)', color: 'var(--color-purple)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Play size={12} /> Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No snapshots available.</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flex: 1, overflow: 'hidden' }}>
        <div className="copilotfs-sidebar" style={{ width: '30%', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '1rem', overflowY: 'auto' }}>
          <h3 style={{ color: 'var(--color-blue)', marginBottom: '1rem' }}>CopilotFS Files</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {files.map((f) => (
              <li key={f.path} style={{ marginBottom: '0.5rem' }}>
                <button 
                  onClick={() => handleSelectFile(f.path)}
                  style={{
                      width: '100%',
                      textAlign: 'left',
                      background: selectedFile === f.path ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      border: '1px solid',
                      borderColor: selectedFile === f.path ? 'var(--color-blue)' : 'rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                  }}
                >
                  {f.path.split('\\').pop()}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="copilotfs-content" style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'var(--color-blue)', marginBottom: '1rem' }}>Preview</h3>
          {selectedFile ? (
            <>
              <div className="copilotfs-path" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {selectedFile}
              </div>
              <pre className="copilotfs-code" style={{ flex: 1, background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '4px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {fileContent}
              </pre>
              <button 
                  onClick={handleInject}
                  style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: 'var(--color-blue)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                  }}
              >
                Inject into Context as Architect Message
              </button>
            </>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>Select a file to preview.</div>
          )}
        </div>
      </div>
    </div>
  );
}
