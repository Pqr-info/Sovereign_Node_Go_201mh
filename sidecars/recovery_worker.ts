export interface RecoveryRequest {
    wallet_id: string;
    challenge: string;
}

export interface RecoveryResponse {
    wallet_id: string;
    seed27: string;
    taxonomy: string[];
    atlas_decoys: string[];
    substrate_commit: boolean;
}

async function getWalletMetadata(wallet_id: string): Promise<any> {
    const url = `https://substrate-node.local/wallet/${wallet_id}/metadata`;
    const res = await fetch(url);
    return await res.json();
}

function deriveSeed27(metadata: any, challenge: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(metadata) + challenge);

    return crypto.subtle.digest("SHA-256", data).then(buf => {
        const bytes = new Uint8Array(buf);
        return Array.from(bytes.slice(0, 27))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    });
}

function reconstructTaxonomy(metadata: any): string[] {
    const tags = metadata.tags || [];
    const lineage = metadata.lineage || [];
    return [...tags, ...lineage];
}

function generateAtlasDecoys(count: number): string[] {
    const out = [];
    for (let i = 0; i < count; i++) {
        out.push(crypto.getRandomValues(new Uint8Array(16))
            .reduce((acc, b) => acc + b.toString(16).padStart(2, "0"), ""));
    }
    return out;
}

async function commitToSubstrate(wallet_id: string, seed27: string): Promise<boolean> {
    const url = `https://substrate-node.local/recovery/commit`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ wallet_id, seed27 }),
        headers: { "Content-Type": "application/json" }
    });
    return res.status === 200;
}

export default {
    async fetch(request: Request): Promise<Response> {
        try {
            const body = await request.json() as RecoveryRequest;

            const metadata = await getWalletMetadata(body.wallet_id);
            const seed27 = await deriveSeed27(metadata, body.challenge);
            const taxonomy = reconstructTaxonomy(metadata);
            const atlas_decoys = generateAtlasDecoys(5);
            const substrate_commit = await commitToSubstrate(body.wallet_id, seed27);

            const response: RecoveryResponse = {
                wallet_id: body.wallet_id,
                seed27,
                taxonomy,
                atlas_decoys,
                substrate_commit
            };

            return new Response(JSON.stringify(response), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.toString() }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
};
