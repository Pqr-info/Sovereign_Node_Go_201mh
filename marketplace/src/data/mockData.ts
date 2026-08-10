export type ItemCategory = 'ai-art' | 'biological-anchor' | '5d-address';

export interface BaseItem {
  id: string;
  title: string;
  price: number;
  vendor: string;
  category: ItemCategory;
  active: boolean;
}

export interface AiArtItem extends BaseItem {
  category: 'ai-art';
  description: string;
  image: string;
  aspectRatio: string;
  prompt: string;
}

export interface BiologicalAnchorItem extends BaseItem {
  category: 'biological-anchor' | '5d-address';
  cifHash: string;
  tupleX: number;
  tupleY: number;
  tupleZ: number;
  tuplePhase: number;
  tupleLineage: number;
  packedAddressHex: string;
  base27Address: string;
  recoveryPassphrase: string;
}

export type Product = AiArtItem | BiologicalAnchorItem;

export const mockProducts: Product[] = [
  {
    id: 'art-1',
    category: 'ai-art',
    title: 'Neon Genesis - 5D Abstract',
    description: 'High dimensional abstract visualization representing temporal phasing.',
    price: 150,
    vendor: 'ImageFX AI',
    active: true,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    aspectRatio: '1:1',
    prompt: 'insane detail, 8k resolution, 5D abstract topology, neon genesis'
  },
  {
    id: 'anchor-p01308',
    category: 'biological-anchor',
    title: 'AlphaFold Structural Anchor: P01308',
    price: 1000,
    vendor: 'Sovereign Node 0x9A',
    active: true,
    cifHash: '0x3a4b9c...',
    tupleX: 83294,
    tupleY: 10933,
    tupleZ: 44921,
    tuplePhase: 0,
    tupleLineage: 4095,
    packedAddressHex: '0x1A2B3C4D5E6F...',
    base27Address: 'XRAYLIMA0ALPHA...',
    recoveryPassphrase: 'XRAY LIMA ZERO ALPHA ...'
  },
  {
    id: 'art-2',
    category: 'ai-art',
    title: 'Prescient Mesh Topography',
    description: 'A representation of the 5D-ASP node mesh network.',
    price: 220,
    vendor: 'ImageFX AI',
    active: true,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    aspectRatio: '16:9',
    prompt: 'node mesh, cryptography, 5d-asp, dark mode glassmorphism'
  },
  {
    id: 'anchor-p69905',
    category: 'biological-anchor',
    title: 'Hemoglobin Anchor: P69905',
    price: 850,
    vendor: 'BioPunk Labs',
    active: true,
    cifHash: '0x1f9e2b...',
    tupleX: 10243,
    tupleY: 55432,
    tupleZ: 1209,
    tuplePhase: 1,
    tupleLineage: 2048,
    packedAddressHex: '0x9F8E7D6C5B4A...',
    base27Address: 'BRAVOTANGOMICROMEO...',
    recoveryPassphrase: 'BRAVO TANGO MIKE ROMEO ...'
  }
];
