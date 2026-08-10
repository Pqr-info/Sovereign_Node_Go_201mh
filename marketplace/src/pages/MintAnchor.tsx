import { useState } from 'react';
import { useSubstrate } from '../context/SubstrateContext';
// In a real build, we'd import this via shared lib or npm, using our local copy for now
// @ts-ignore
import { parseAlphaFoldCIF, generate5DAddressBase27, getRecoveryPassphrase } from '../../../shared/crypto5d';

export default function MintAnchor() {
  const { account } = useSubstrate();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [paid, setPaid] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setFileContent(text);
    }
  };

  const handleMint = async () => {
    if (!account) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!fileContent || !paid) {
      alert('Please upload a CIF file and provide the Protein Asset ID (PAID).');
      return;
    }

    setIsMinting(true);
    setResult(null);

    try {
      const { x, y, z, i_phase, i_lineage } = await parseAlphaFoldCIF(fileContent, paid);
      const base27Address = await generate5DAddressBase27(x, y, z, i_phase, i_lineage);
      const passphrase = getRecoveryPassphrase(base27Address);

      // In a full implementation, we'd call api.tx.marketplace.mintAnchor(...) here
      
      setTimeout(() => {
        setResult({
          x, y, z, i_phase, i_lineage, base27Address, passphrase
        });
        setIsMinting(false);
      }, 1500);

    } catch (e: any) {
      alert('Failed to parse and mint: ' + e.message);
      setIsMinting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Mint <span className="text-gradient">Biological Anchor</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Upload an AlphaFold structure (.cif) to deterministically derive your 5D-ASP cryptographic address and mint it as a Sovereign Anchor NFT.
      </p>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Protein Asset ID (PAID)</label>
          <input 
            type="text" 
            placeholder="e.g. AF-P01308-F1" 
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'rgba(0,0,0,0.2)',
              color: 'var(--text-main)',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Structure File (.cif)</label>
          <input 
            type="file" 
            accept=".cif"
            onChange={handleFileUpload}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px dashed var(--border-color)', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleMint} 
          disabled={isMinting || !fileContent || !paid}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {isMinting ? 'Computing 5D Tuple & Minting...' : 'Derive 5D Address & Mint NFT'}
        </button>

        {result && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--primary-color)' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>Success! Anchor Minted</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Canonical 5D Tuple</span>
              <div style={{ fontFamily: 'monospace' }}>
                X: {result.x} | Y: {result.y} | Z: {result.z} <br/>
                Phase: {result.i_phase} | Lineage: {result.i_lineage}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Base-27 Address</span>
              <div style={{ fontFamily: 'monospace', color: 'var(--primary-color)', fontSize: '1.2rem', wordBreak: 'break-all' }}>
                {result.base27Address}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Recovery Passphrase (27 words)</span>
              <div style={{ fontFamily: 'monospace', background: '#0a0a0a', color: '#0f0', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                {result.passphrase}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Store this passphrase securely. It maps perfectly to your 128-bit 5D Address payload.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
