import { Link } from 'react-router-dom';
import { Wallet, Image as ImageIcon, Box, Anchor } from 'lucide-react';
import { useSubstrate } from '../context/SubstrateContext';

export default function Navbar() {
  const { account, connectWallet } = useSubstrate();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="glass-nav">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ImageIcon size={28} color="var(--primary-color)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            <span className="text-gradient">ImageFX</span>.pqr.info
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Box size={16} /> Gallery
          </Link>
          <Link to="/mint" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)' }}>
            <Anchor size={16} /> Mint Anchor
          </Link>
          
          <button 
            className={`btn ${account ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={connectWallet}
          >
            <Wallet size={18} />
            {account ? truncateAddress(account.address) : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
}
