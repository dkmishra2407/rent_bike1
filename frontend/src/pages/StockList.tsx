import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Search, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Stock {
  symbol: string;
  name: string;
  basePrice: number;
  change: number;
  lastPrice: number;
}

const StockList = () => {
  const defaultStockSymbols = [
    "IRFC", "IRCTC", "ADANIENT", "TATATECH", "SBIN", "POONAWALA", "AVL",
    "IEX", "VPRPL", "AUBANK", "INFY", "ICICIBANK", "KOTAKBANK", "BAJAJFINSV", "BHARTIARTL",
    "ITC", "WIPRO", "MARUTI", "LT"
  ];

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Fetch initial stock data
  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const stockDataPromises = defaultStockSymbols.map(async (symbol) => {
          const response = await fetch(`${import.meta.env.VITE_FLASK_BACKEND_URL}/api/stock-quote/${symbol}`);
          const data = await response.json();
          // const currentPrice = data.intraDayHighLow?.value || data.lastPrice || data.Price
          return {
            symbol,
            name: data.name || symbol,
            basePrice: data.intraDayHighLow?.value || 0,
            change: data.change || 0,
            lastPrice: data.lastPrice || 0,
          };
        });

        const stockData = await Promise.all(stockDataPromises);
        setStocks(stockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
      setLoading(false);
    };

    fetchStockData();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_FLASK_BACKEND_URL}/api/stock-quote/${searchTerm}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults([{
          symbol: searchTerm.toUpperCase(),
          name: data.name || searchTerm,
          basePrice: data.intraDayHighLow?.value|| 0,
          change: data.change || 0,
          lastPrice: data.lastPrice || 0,
        }]);
      } else {
        setSearchResults([]);
        toast.error("Stock not found");
      }
    } catch (error) {
      console.error("Error searching stock:", error);
      toast.error("Error searching stock");
    }
    setIsSearching(false);
  };

  // Add to watchlist
  const addToWatchlist = async (symbol: string) => {
    try {

      console.log("Adding to watchlist:", symbol);
      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const watchlistId = user.WatchlistId;
  
      if (!watchlistId) {
        console.log("No watchlist ID found in user data:", user);
        toast.error("No watchlist found. Please login again.");
        return;
      }
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stocks/addwatchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}` // Include if using auth
        },
        body: JSON.stringify({ 
          WatchlistId: watchlistId, // Note the capitalization if the API expects it
          stockName: symbol        // Or use symbol if that's what the API expects
          // OR if the API expects "symbol" instead of "stockName":
          // symbol: symbol
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update local state if needed
        setWatchlist([...watchlist, symbol]);
        toast.success(`${symbol} added to watchlist!`);
      } else {
        toast.error(data.message || "Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error("Error adding to watchlist");
    }
  };
  // Display stocks based on search or default
  const displayStocks = isSearching || searchTerm ? searchResults : stocks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Market</h1>
        <p className="text-gray-600 mt-2">Live prices and market data</p>
        
        {/* Search Bar */}
        <div className="mt-6 relative max-w-md">
          <div className="flex">
            <input
              type="text"
              placeholder="Search stocks (e.g., IRFC, SBIN)"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading stock data...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayStocks.length > 0 ? (
                  displayStocks.map((stock) => (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/stocks/${stock.symbol}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {stock.symbol}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {stock.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                        ₹{stock.basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end">
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span
                            className={
                              stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            ₹{stock.change.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToWatchlist(stock.symbol);
                          console.log("Add to watchlist clicked for:", stock.symbol);
                        
                        }}
                        disabled={watchlist.includes(stock.symbol)}
                        className={`p-2 rounded-full ${watchlist.includes(stock.symbol) 
                          ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'}`}
                        title={watchlist.includes(stock.symbol) ? "Already in watchlist" : "Add to watchlist"}
                        style={{ pointerEvents: 'auto' }}
                      >
                        {watchlist.includes(stock.symbol) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {isSearching ? 'Searching...' : 'No stocks found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;