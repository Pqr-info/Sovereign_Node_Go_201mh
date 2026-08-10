import { AiArtItem } from '../data/mockData';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: AiArtItem;
  onPurchase: (product: AiArtItem) => void;
}

export default function ProductCard({ product, onPurchase }: ProductCardProps) {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: product.aspectRatio === '16:9' ? '16/9' : '1/1', overflow: 'hidden' }}>
        <img 
          src={product.image} 
          alt={product.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="hover:scale-105"
        />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
          {product.aspectRatio}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-color)', fontWeight: 600 }}>
              AI Generated Art
            </span>
            <h3 style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>{product.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>By {product.vendor}</p>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
            {product.price} S27
          </div>
        </div>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
          {product.description}
        </p>
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => onPurchase(product)}
        >
          <ShoppingCart size={18} />
          Purchase Art
        </button>
      </div>
    </div>
  );
}
