import { DataAPIClient } from '@datastax/astra-db-ts';

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
    keyspace: ASTRA_DB_NAMESPACE!
});

export async function GET() {
    try {
        const collection = await db.collection(ASTRA_DB_COLLECTION!);
        
        // Get all pools sorted by APY in descending order
        const cursor = collection.find({}, {
            sort: { "metadata.apy": -1 },
            limit: 1
        });
        
        const pools = await cursor.toArray();
        
        if (pools.length === 0) {
            return new Response(JSON.stringify({ error: "No pools found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const bestPool = pools[0];
        
        // Safely handle the timestamp
        let lastUpdated = 'N/A';
        try {
            if (bestPool.metadata?.timestamp?.$date) {
                const timestamp = bestPool.metadata.timestamp.$date;
                // Handle both number and string timestamps
                const date = typeof timestamp === 'number' 
                    ? new Date(timestamp) 
                    : new Date(timestamp);
                if (!isNaN(date.getTime())) {
                    lastUpdated = date.toISOString();
                }
            }
        } catch (err) {
            console.error('Error parsing timestamp:', err);
        }
        
        // Format the response
        const response = {
            poolId: bestPool.metadata?.poolId || 'N/A',
            quoteToken: bestPool.metadata?.quoteToken || 'N/A',
            apy: bestPool.metadata?.apy || 0,
            totalVolume: bestPool.metadata?.totalVolume || 0,
            lastUpdated,
            details: bestPool.text || ''
        };

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (err) {
        console.error('Error fetching pools:', err);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 