import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';

const StockDetails = () => {
  const { symbol: paramSymbol } = useParams(); // Destructure symbol from params
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1d'); // '1d', '30d', '365d'

  // Update symbol state from route params
  useEffect(() => {
    if (paramSymbol) {
      setSymbol(paramSymbol);
    }
  }, [paramSymbol]);

  // Fetch data when symbol is set
  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch stock quote
        const quoteResponse = await fetch(`http://127.0.0.1:5000/api/stock-quote/${symbol}`);
        if (!quoteResponse.ok) {
          throw new Error(`Failed to fetch stock data: ${quoteResponse.statusText}`);
        }
        const quoteData = await quoteResponse.json();

        // Fetch graph data
        const graphResponse = await fetch(`http://127.0.0.1:5000/api/graph-data/${symbol}`);
        if (!graphResponse.ok) {
          throw new Error(`Failed to fetch graph data: ${graphResponse.statusText}`);
        }
        const graphData = await graphResponse.json();

        setStockData(quoteData);
        setGraphData(graphData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);


  console.log(graphData)
  const formatGraphData = (data) => {
    if (!data || data.length === 0) return [];
    
    return data.map(point => ({
      timestamp: point[0],
      price: point[1],
      date: new Date(point[0]).toLocaleTimeString()
    }));
  };

  const getTimeframeData = () => {
    if (!graphData || graphData.length === 0) return [];
    
    const formattedData = formatGraphData(graphData);
    
    // Filter based on timeframe
    if (timeframe === '1d') {
      return formattedData.slice(0, 100); // Today's data
    } else if (timeframe === '30d') {
      return formattedData; // All data (would normally filter for 30 days)
    } else {
      return formattedData; // All data (would normally filter for 365 days)
    }
  };
  
  const watchlist = JSON.parse(localStorage.getItem('WatchlistId')) || [];

const handleAddToWatchlist = async () => {
  try {
    const response = await axios.post('https://growup-ffp3.onrender.com/stocks/addwatchlist', {
      WatchlistId: watchlist,
      stockName: symbol
    });

    // Optional: handle response, maybe show success message
    console.log('Added to watchlist:', response.data);

  } catch (err) {
    console.error('Failed to add to watchlist:', err);
  }
};


  if (loading) return <div className="p-4 text-center">Loading stock data...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  // if (!stockData || !stockData.priceInfo) return <div className="p-4 text-center">No data available</div>;

  const priceInfo = stockData;
  const chartData = getTimeframeData();
  console.log(graphData)
  // Use the correct data structure from the API
  const lastPrice = stockData.lastPrice || 0;
  const previousClose = stockData.previousClose || 0;
  const priceChange = stockData.change || 0;
  const priceChangePercent = stockData.pChange || 0;
  const isPriceUp = priceChange >= 0;
  const open = stockData.open || 0;
  const high = stockData.intraDayHighLow?.max || 0;
  const low = stockData.intraDayHighLow?.min || 0;
  const yearLow = stockData.weekHighLow?.min || 0;
  const yearHigh = stockData.weekHighLow?.max || 0;
  const yearLowDate = stockData.weekHighLow?.minDate || "";
  const yearHighDate = stockData.weekHighLow?.maxDate || "";

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Header with current price and change */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline">
          <h1 className="text-2xl font-bold">{symbol}</h1>
          <p className="text-gray-500 text-sm">{stockData.indexSymbol || stockData.symbol}</p>
        </div>
        
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold mr-3">₹{lastPrice.toFixed(2)}</span>
          <span className={`text-lg ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
            {isPriceUp ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      {/* Chart section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Price Chart</h2>
          <div className="flex space-x-2">
          <button 
              className={`px-3 py-1 rounded ${timeframe === '1d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => handleAddToWatchlist()}
            >
              Add To Watchlist
            </button>
            {/* <button 
              className={`px-3 py-1 rounded ${timeframe === '1d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeframe('1d')}
            >
              1D
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeframe === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeframe('30d')}
            >
              30D
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeframe === '365d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeframe('365d')}
            >
              1Y
            </button> */}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={Math.floor(chartData.length / 5)}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false} 
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Stock details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">Today's Trading</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500 text-sm">Open</p>
              <p className="font-medium">₹{open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Previous Close</p>
              <p className="font-medium">₹{previousClose.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">High</p>
              <p className="font-medium">₹{high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Low</p>
              <p className="font-medium">₹{low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">VWAP</p>
              <p className="font-medium">₹{(priceInfo.vwap || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Close</p>
              <p className="font-medium">₹{(priceInfo.close || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">52 Week Range</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-gray-500 text-sm">52W Low</p>
              <p className="font-medium">₹{yearLow.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{yearLowDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">52W High</p>
              <p className="font-medium">₹{yearHigh.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{yearHighDate}</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>₹{yearLow.toFixed(2)}</span>
              <span>₹{yearHigh.toFixed(2)}</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
              <div 
                className="absolute h-full bg-blue-600"
                style={{ 
                  width: `${((lastPrice - yearLow) / (yearHigh - yearLow)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">Price Bands</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500 text-sm">Lower Circuit</p>
              <p className="font-medium">₹{(parseFloat(priceInfo.lowerCP) || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Upper Circuit</p>
              <p className="font-medium">₹{(parseFloat(priceInfo.upperCP) || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price Band</p>
              <p className="font-medium">{priceInfo.pPriceBand || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Base Price</p>
              <p className="font-medium">₹{(priceInfo.basePrice || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">Today's Range</h2>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>₹{low.toFixed(2)}</span>
              <span>₹{high.toFixed(2)}</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
              <div 
                className="absolute h-full bg-blue-600"
                style={{ 
                  width: `${((lastPrice - low) / (high - low)) * 100}%`
                }}
              ></div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">Current: ₹{lastPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                {((lastPrice - low) / (high - low) * 100).toFixed(1)}% of today's range
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-3">Technical Info</h2>
          <div className="grid grid-cols-2 gap-2">
            {priceInfo.ieq && (
              <div>
                <p className="text-gray-500 text-sm">iEQ Value</p>
                <p className="font-medium">{priceInfo.ieq}</p>
              </div>
            )}
            {priceInfo.iNavValue !== null && (
              <div>
                <p className="text-gray-500 text-sm">iNAV Value</p>
                <p className="font-medium">₹{priceInfo.iNavValue}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-sm">Tick Size</p>
              <p className="font-medium">₹{priceInfo.tickSize}</p>
            </div>
            {priceInfo.stockIndClosePrice !== 0 && (
              <div>
                <p className="text-gray-500 text-sm">Stock Index Close</p>
                <p className="font-medium">₹{priceInfo.stockIndClosePrice}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-sm">Check iNAV</p>
              <p className="font-medium">{priceInfo.checkINAV ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
        
        {stockData.marketStatus && (
          <div className="bg-gray-50 p-4 rounded md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Market Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stockData.advances !== undefined && (
                <>
                  <div>
                    <p className="text-gray-500 text-sm">Advances</p>
                    <p className="font-medium text-green-600">{stockData.advances}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Declines</p>
                    <p className="font-medium text-red-600">{stockData.declines}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Unchanged</p>
                    <p className="font-medium text-gray-600">{stockData.unchanged}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-gray-500 text-sm">Market Status</p>
                <p className={`font-medium ${stockData.marketStatus === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                  {stockData.marketStatus}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetails;