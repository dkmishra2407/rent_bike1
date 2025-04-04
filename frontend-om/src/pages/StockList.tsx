// import React from 'react';
// import { Link } from 'react-router-dom';
// import { TrendingUp, TrendingDown } from 'lucide-react';

// // Temporary mock data
// const mockStocks = [
//   { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.31, changePercent: 1.32 },
//   { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: -1.25, changePercent: -0.37 },
//   { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.18, change: 0.88, changePercent: 0.63 },
//   { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.22, change: -2.45, changePercent: -1.36 },
//   { symbol: 'TSLA', name: 'Tesla Inc.', price: 202.64, change: 5.67, changePercent: 2.88 },
// ];

// const StockList = () => {
//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Stock Market</h1>
//         <p className="text-gray-600 mt-2">Live prices and market data</p>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Symbol
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Change
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   % Change
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {mockStocks.map((stock) => (
//                 <tr
//                   key={stock.symbol}
//                   className="hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <Link
//                       to={`/stocks/${stock.symbol}`}
//                       className="text-blue-600 hover:text-blue-900 font-medium"
//                     >
//                       {stock.symbol}
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-gray-900">
//                     {stock.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
//                     ${stock.price.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right">
//                     <div className="flex items-center justify-end">
//                       {stock.change >= 0 ? (
//                         <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
//                       ) : (
//                         <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
//                       )}
//                       <span
//                         className={
//                           stock.change >= 0 ? 'text-green-600' : 'text-red-600'
//                         }
//                       >
//                         ${Math.abs(stock.change).toFixed(2)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right">
//                     <span
//                       className={
//                         stock.changePercent >= 0
//                           ? 'text-green-600'
//                           : 'text-red-600'
//                       }
//                     >
//                       {stock.changePercent >= 0 ? '+' : ''}
//                       {stock.changePercent.toFixed(2)}%
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockList;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

// API Key (Replace with your API key)
const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.example.com/stocks"; // Replace with actual API

// Array of 20 stock symbols
const stockSymbols = [
  "HDFC", "IRFC", "IRCTC", "ADANIENT", "TATATECH", "SBIN", "POONAWALA", "AVL",
  "IEX", "VPRPL", "AUBANK", "INFY", "ICICIBANK", "KOTAKBANK", "BAJAJFINSV", "BHARTIARTL",
  "ITC", "WIPRO", "MARUTI", "LT"
];

const StockList = () => {
  interface Stock {
    symbol: string;
    name: string;
    basePrice: number;
    change: number;
    lastPrice: number;
  }

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch stock data from API
  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const stockDataPromises = stockSymbols.map(async (symbol) => {
          const response = await fetch(`http://127.0.0.1:5000/api/stock-quote/${symbol}`, )
          const data = await response.json();
          return {
            symbol,
            name: data.name || symbol, // Fallback if API doesn't return name
            basePrice: data.basePrice || 0, // Map price to basePrice
            change: data.change || 0,
            lastPrice:data.lastPrice || 0,
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Market</h1>
        <p className="text-gray-600 mt-2">Live prices and market data</p>
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
                
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stocks.map((stock) => (
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
                          ₹{ stock.change.toFixed(2)}
                        </span>
                      </div>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;
