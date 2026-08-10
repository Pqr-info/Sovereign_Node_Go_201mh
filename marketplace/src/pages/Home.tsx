import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import AnchorCard from '../components/AnchorCard';
import { useSubstrate } from '../context/SubstrateContext';
import { mockProducts, AiArtItem, BiologicalAnchorItem } from '../data/mockData';
import { web3FromAddress } from '@polkadot/extension-dapp';

export default function Home() {
  const { api, isApiReady, account } = useSubstrate();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'structural'>('visual');

  useEffect(() => {
    const fetchListings = async () => {
      if (!isApiReady || !api) return;
      try {
        const entries = await api.query.marketplace.listings.entries();
        const activeListings = entries
          .map(([key, value]) => {
            const listingId = (key.args[0] as any).toNumber();
            const listing = (value.toJSON() as any);
            return {
              id: listingId,
              vendor: listing.vendor,
              price: listing.price / 1e12,
              category: Object.keys(listing.category)[0], 
              metadata_url: listing.metadataUrl,
              active: listing.active,
              title: `On-chain Item #${listingId}`,
              description: `A decentralized item listed by ${listing.vendor.slice(0, 6)}...`,
              image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
            };
          })
          .filter(l => l.active);
        
        setListings(activeListings);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [api, isApiReady]);

  const handlePurchase = async (product: any) => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!api) return;

    try {
      const injector = await web3FromAddress(account.address);
      api.setSigner(injector.signer);

      const listingId = product.id;
      console.log(`Initiating purchase for listing ${listingId}...`);
      
      const unsub = await api.tx.marketplace
        .purchase(listingId)
        .signAndSend(account.address, (result) => {
          if (result.status.isInBlock) {
            alert(`Purchase initiated! Included in block.`);
          } else if (result.status.isFinalized) {
            unsub();
          }
        });
    } catch (e) {
      console.error(e);
      alert("Transaction failed or cancelled.");
    }
  };

  const displayProducts = listings.length > 0 ? listings : (!isLoading ? mockProducts : []);

  const visualItems = displayProducts.filter(p => p.category === 'ai-art') as AiArtItem[];
  const structuralItems = displayProducts.filter(p => p.category === 'biological-anchor' || p.category === '5d-address') as BiologicalAnchorItem[];

  return (
    <div className="animate-fade-in">
      <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '2rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
          The <span className="text-gradient">ImageFX</span> Art & Anchor Marketplace
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Discover and trade AI-generated art and deterministic 5D-ASP Biological Anchors. 
          Powered by Sovereign-27.
        </p>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'visual' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('visual')}
          >
            Gallery (Visual)
          </button>
          <button 
            className={`btn ${activeTab === 'structural' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('structural')}
          >
            Anchors (Structural)
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading live listings from Sovereign-27 mesh...
          </div>
        ) : (
          <div>
            {activeTab === 'visual' && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '2rem' 
              }}>
                {visualItems.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onPurchase={handlePurchase} 
                  />
                ))}
                {visualItems.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No visual items found.</p>}
              </div>
            )}
            
            {activeTab === 'structural' && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                gap: '2rem' 
              }}>
                {structuralItems.map((anchor) => (
                  <AnchorCard 
                    key={anchor.id} 
                    anchor={anchor} 
                    onPurchase={handlePurchase} 
                  />
                ))}
                {structuralItems.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No structural anchors found.</p>}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
