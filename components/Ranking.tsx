'use client'

import React, { useEffect, useState } from 'react';

interface CoinData {
  usd: number;
  usd_market_cap: number;
}

interface Coins {
  [key: string]: CoinData;
}

const Ranking: React.FC = () => {
  const [coins, setCoins] = useState<Coins | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/coins')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setLoading(false);
        setError(true);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || coins === undefined) {
    return (
      <div>
        There was an error loading the data. Please try again.
      </div>
    );
  }

  // convert coins object to array and sort by usd_market_cap
  const sortedCoins = Object.entries(coins).sort(
    (a, b) => b[1].usd_market_cap - a[1].usd_market_cap
  );

  const highestMarketCap = sortedCoins[0]?.[1].usd_market_cap || 0;

  return (
    <div className="flex flex-col items-center space-y-4">
      {sortedCoins.map(([name, { usd, usd_market_cap }], index) => {
        // calculate the size of the pedestal based on market cap
        const sizeRatio = (usd_market_cap / highestMarketCap) * 100;
        const pedestalHeight = Math.max(20, sizeRatio); // ensure a minimum height for visibility

        return (
          <div key={name} className="flex flex-col items-center">
            <div className={`bg-blue-500 text-white p-2 rounded-md flex items-center justify-center`} style={{width: `${Math.floor(pedestalHeight)}%`, height: `${Math.floor(pedestalHeight)}px`}}>
              {name.toUpperCase()}
            </div>
            <div className="text-sm">Market Cap: ${usd_market_cap.toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Ranking;