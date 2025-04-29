'use client'

import { useEffect, useState } from 'react';

interface PoolData {
    poolId: string;
    quoteToken: string;
    apy: number;
    totalVolume: number;
    lastUpdated: string;
    details: string;
}

export default function BestPoolCard() {
    const [poolData, setPoolData] = useState<PoolData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPoolData = async () => {
            try {
                const response = await fetch('/api/pools');
                if (!response.ok) {
                    throw new Error('Failed to fetch pool data');
                }
                const data = await response.json();
                setPoolData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPoolData();
        // Refresh data every 5 minutes
        const interval = setInterval(fetchPoolData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-background-primary rounded-lg p-6 w-full">
                <div className="animate-pulse">
                    <div className="h-4 bg-background-secondary rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-background-secondary rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-background-secondary rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background-primary rounded-lg p-6 w-full">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!poolData) {
        return (
            <div className="bg-background-primary rounded-lg p-6 w-full">
                <p className="text-content-secondary">No pool data available</p>
            </div>
        );
    }

    return (
        <div className="bg-background-primary rounded-lg p-6 w-full">
            <h2 className="text-xl font-bold mb-4 text-content-primary">Best Performing Pool</h2>
            <div className="space-y-3">
                <div>
                    <p className="text-sm text-content-secondary">Pool ID</p>
                    <p className="font-mono text-sm truncate text-content-primary">{poolData.poolId}</p>
                </div>
                <div>
                    <p className="text-sm text-content-secondary">Quote Token</p>
                    <p className="font-mono text-sm text-content-primary">{poolData.quoteToken}</p>
                </div>
                <div>
                    <p className="text-sm text-content-secondary">APY</p>
                    <p className="text-accent-primary font-bold">{poolData.apy.toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-sm text-content-secondary">Total Volume</p>
                    <p className="font-bold text-content-primary">${poolData.totalVolume.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-content-secondary">Last Updated</p>
                    <p className="text-sm text-content-primary">{new Date(poolData.lastUpdated).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
} 