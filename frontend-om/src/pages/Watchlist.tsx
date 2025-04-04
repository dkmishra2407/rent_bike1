import React, { useState, useEffect } from 'react';
import { Search, Star, Trash2, TrendingUp, ArrowUpRight } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: string;
}

function App() {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch watchlist from API
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const WatchlistId = user.watchlistId || null;
  useEffect(() => {
        const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stocks/getwatchlist/${WatchlistId}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            
        });
        if (!response.ok) {
          throw new Error('Failed to fetch watchlist');
        }
        const data = await response.json();
        setWatchlist(data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Search stocks API call
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stock-quote/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching stocks:', error);
      setSearchResults([]);
    }
  };

  // Remove stock from watchlist
  const removeFromWatchlist = async (symbol: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stock/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from watchlist');
      }

      // Update local state if API call succeeds
      setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
    } catch (error) {
      console.error('Error removing stock:', error);
      // You might want to show an error message to the user here
    }
  };

  // Open stock details
  const openStockDetails = (symbol: string) => {
    // This would navigate to a details page or open a modal
    // For now, we'll just log it
    console.log(`Opening details for ${symbol}`);
    // In a real app, you might do:
    // window.location.href = `/stock/${symbol}`;
    // or use your router's navigation method
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-indigo-900">
            <Star className="text-yellow-500" />
            Stock Watchlist
          </h1>
          
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-800 shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {searchResults.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b last:border-b-0 border-gray-100"
                    onClick={() => openStockDetails(stock.symbol)}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800">${stock.price}</div>
                      <div className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {stock.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-gray-600 font-semibold">Symbol</th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold">Company</th>
                <th className="px-6 py-4 text-right text-gray-600 font-semibold">Price</th>
                <th className="px-6 py-4 text-right text-gray-600 font-semibold">24h Change</th>
                <th className="px-6 py-4 text-right text-gray-600 font-semibold">Market Cap</th>
                <th className="px-6 py-4 text-center text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : watchlist.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Your watchlist is empty. Search for stocks to add them.
                  </td>
                </tr>
              ) : (
                watchlist.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <TrendingUp className="text-indigo-500" size={20} />
                        {stock.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{stock.name}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-800">${stock.price}</td>
                    <td className={`px-6 py-4 text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change}%
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{stock.marketCap}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openStockDetails(stock.symbol)}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ArrowUpRight size={20} className="text-indigo-500" />
                        </button>
                        <button
                          onClick={() => removeFromWatchlist(stock.symbol)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 size={20} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;