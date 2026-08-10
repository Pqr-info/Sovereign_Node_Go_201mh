import { BiologicalAnchorItem } from '../data/mockData';
import { Shield } from 'lucide-react';

interface AnchorCardProps {
  anchor: BiologicalAnchorItem;
  onPurchase: (anchor: BiologicalAnchorItem) => void;
}

export default function AnchorCard({ anchor, onPurchase }: AnchorCardProps) {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-color)', fontWeight: 600 }}>
              Biological Anchor
            </span>
            <h3 style={{ marginTop: '0.25rem', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>{anchor.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>By {anchor.vendor}</p>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
            {anchor.price} S27
          </div>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base-27 Address</div>
          <div style={{ fontFamily: 'monospace', color: 'var(--primary-color)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
            {anchor.base27Address}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tuple X</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{anchor.tupleX}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tuple Y</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{anchor.tupleY}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tuple Z</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{anchor.tupleZ}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Phase / Lineage</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{anchor.tuplePhase} / {anchor.tupleLineage}</div>
          </div>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', borderColor: 'var(--accent-color)' }}
            onClick={() => onPurchase(anchor)}
          >
            <Shield size={18} />
            Transfer Anchor NFT
          </button>
        </div>
      </div>
    </div>
  );
}
